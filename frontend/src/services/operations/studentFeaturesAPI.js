import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  // SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function buyItem(
  token,
  { coursesId = [], books = [], liveClasses = [] },
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Processing Payment...");
  try {
    const sdkRes = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!sdkRes) return toast.error("Razorpay SDK load failed");
    const payload = { coursesId, books, liveClasses };
    const orderRes = await apiConnector("POST", COURSE_PAYMENT_API, payload, {
      Authorization: `Bearer ${token}`,
    });
    if (!orderRes.data.success) throw new Error(orderRes.data.message);
    if (orderRes.data.free) {
      toast.success(
        orderRes.data.message || "Free items added to your account!"
      );
      if (orderRes.data.items.courses.length > 0) {
        navigate("/dashboard/enrolled-courses");
      } else if (orderRes.data.items.liveClasses.length > 0) {
        navigate("/dashboard/enrolled-liveClasses");
      } else if (orderRes.data.items.ebooks.length > 0) {
        navigate("/dashboard/e-books");
      }
      toast.dismiss(toastId);
      return;
    }
    const { currency, amount, id: order_id } = orderRes.data.message;
    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY,
      currency,
      amount,
      order_id,
      name: "StudyPlus",
      description: `Thank you for your purchase`,
      image: rzpLogo,
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },
      handler(response) {
        // sendPaymentSuccessEmail(response, amount, token);
        verifyPayment(
          { ...response, coursesId, books, liveClasses },
          token,
          navigate,
          dispatch
        );
      },
    };
    new window.Razorpay(options).open();
  } catch (err) {
    console.error(err);
    toast.error(
      err?.response?.status === 409 || err?.response?.status === 400
        ? err.response.data.message
        : err.response?.data?.message || err.message || "Something went wrong"
    );
  } finally {
    toast.dismiss(toastId);
  }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Payment Successful!");
    if (bodyData.coursesId.length) {
      navigate("/dashboard/enrolled-courses");
    } else if (bodyData.liveClasses.length) {
      navigate("/dashboard/enrolled-liveClasses");
    } else if (bodyData.books.length) {
      navigate("/dashboard/e-books");
    }
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    toast.error("Could not verify Payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

// async function sendPaymentSuccessEmail(response, amount, token) {
//   try {
//     await apiConnector(
//       "POST",
//       SEND_PAYMENT_SUCCESS_EMAIL_API,
//       {
//         orderId: response.razorpay_order_id,
//         paymentId: response.razorpay_payment_id,
//         amount,
//       },
//       {
//         Authorization: `Bearer ${token}`,
//       }
//     );
//   } catch (error) {
//     console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
//   }
// }