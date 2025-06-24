import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../../slices/cartSlice";
import Img from "./../../../common/Img";

export default function RenderCartBooks() {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((item, indx) => (
        <div
          key={item._id}
          className={`flex w-full flex-wrap items-start justify-between gap-6 ${
            indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
          } ${indx !== 0 && "mt-6"}`}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <Img
              src={item?.thumbnail}
              alt={item?.title}
              className="h-[148px] w-[220px] rounded-lg object-contain bg-white"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {item?.title}
              </p>
              {item?.authors && (
                <p className="text-sm text-richblack-300">
                  {item?.authors.join(", ")}
                </p>
              )}
              {item?.publisher && (
                <p className="text-xs text-richblack-400">
                  Published by {item?.publisher}
                </p>
              )}
              {item?.description && (
                <p className="text-xs text-richblack-400 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => dispatch(removeFromCart(item._id))}
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
      ))}
    </div>
  );
}
