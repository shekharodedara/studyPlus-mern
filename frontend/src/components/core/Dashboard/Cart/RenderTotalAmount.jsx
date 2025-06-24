import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../common/IconBtn";
import { buyItem } from "../../../../services/operations/studentFeaturesAPI";
import toast from "react-hot-toast";

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleCheckout = async () => {
    const courses = [];
    const books = [];
    cart.forEach((item) => {
      if (item._id && item.courseName) {
        courses.push(item._id);
      } else if (item.id && item.title) {
        books.push(item);
      }
    });
    if (courses.length === 0 && books.length === 0) {
      return toast.error("Your cart is empty.");
    }
    await buyItem(
      token,
      { coursesId: courses, books },
      user,
      navigate,
      dispatch
    );
  };

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">€ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleCheckout}
        customClasses="w-full justify-center"
      />
    </div>
  );
}
