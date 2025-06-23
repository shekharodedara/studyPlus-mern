import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
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
  { coursesId = [], book = null },
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      toast.error("RazorPay SDK failed to load");
      return;
    }
    const payload = book ? { isBook: true, book } : { coursesId };
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      payload,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (orderResponse.data.free) {
      toast.success("Book added to your library successfully!");
      navigate("/dashboard/e-books");
      toast.dismiss(toastId);
      return;
    }
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }
    const RAZORPAY_KEY = import.meta.env.VITE_APP_RAZORPAY_KEY;
    const options = {
      key: RAZORPAY_KEY,
      currency: orderResponse.data.message.currency,
      amount: orderResponse.data.message.amount,
      order_id: orderResponse.data.message.id,
      name: "StudyPlus",
      description: book
        ? `Thank You for Purchasing the Book "${book.title}"`
        : "Thank You for Purchasing the Course(s)",
      image: rzpLogo,
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },
      handler: function (response) {
        const verificationPayload = book
          ? { ...response, isBook: true, book }
          : { ...response, coursesId };
        sendPaymentSuccessEmail(
          response,
          orderResponse.data.message.amount,
          token
        );
        verifyPayment(verificationPayload, token, navigate, dispatch);
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops, payment failed");
      console.log("Payment failed:", response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR:", error);
    toast.error(error.response?.data?.message || error.message);
  }
  toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
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
    if (bodyData.isBook) {
      navigate("/dashboard/e-books");
    } else {
      navigate("/dashboard/enrolled-courses");
    }
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    toast.error("Could not verify Payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
