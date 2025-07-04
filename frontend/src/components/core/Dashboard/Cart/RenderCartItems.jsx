import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../../slices/cartSlice";
import Img from "../../../common/Img";

export default function RenderCartItems() {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((item, indx) => {
        const isCourse = !!item.courseName;
        const ratingValue = item?.rating || 4.5;
        const ratingsCount =
          item?.ratingsCount || item?.ratingAndReviews?.length || 100;
        return (
          <div
            key={item._id}
            className={`flex w-full flex-wrap items-start justify-between gap-6 ${
              indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
            } ${indx !== 0 && "mt-6"}`}
          >
            <div className="flex flex-1 flex-col gap-4 xl:flex-row">
              <Img
                src={item?.thumbnail}
                alt={item?.title || item?.courseName}
                className={`h-[148px] w-[220px] rounded-lg ${
                  isCourse ? "object-cover" : "object-contain bg-white"
                }`}
              />
              <div className="flex flex-col space-y-1">
                <p className="text-lg font-medium text-richblack-5">
                  {item?.title || item?.courseName}
                </p>
                {isCourse ? (
                  <p className="text-sm text-richblack-300">
                    {item?.category?.name}
                  </p>
                ) : (
                  item?.authors && (
                    <p className="text-sm text-richblack-300">
                      {item?.authors.join(", ")}
                    </p>
                  )
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-5">
                    {ratingValue.toFixed(1)}
                  </span>
                  <ReactStars
                    count={5}
                    value={ratingValue}
                    size={20}
                    isHalf={true}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    halfIcon={<FaStar style={{ opacity: 0.5 }} />}
                    fullIcon={<FaStar />}
                  />
                  <span className="text-sm text-richblack-300">
                    ({ratingsCount} ratings)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={() => dispatch(removeFromCart(item.cartItemId || item._id || item.id))}
                className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
              >
                <RiDeleteBin6Line />
                <span>Remove</span>
              </button>
              <p className="mb-6 text-3xl font-medium text-yellow-100">
                € {item?.price}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
