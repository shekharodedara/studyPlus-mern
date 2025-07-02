import React, { useState } from "react";
import { addToCart } from "../../../slices/cartSlice";
import { toast } from "react-hot-toast";
import Img from "../../common/Img";
import ConfirmationModal from "../../common/ConfirmationModal";
import { buyItem } from "../../../services/operations/studentFeaturesAPI";

function LiveClassDetailsCard({ liveClass, token, user, navigate, dispatch }) {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const {
    title,
    price,
    thumbnail,
    duration,
    _id,
    studentsEnrolled,
    participantLimit,
  } = liveClass;

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    dispatch(
      addToCart({
        id: _id,
        type: "liveClass",
        title,
        price,
        thumbnail,
        duration,
      })
    );
  };

  const handleBuyNow = () => {
    if (token) {
      const liveClassInfo = {
        id: _id,
        type: "liveClass",
        title,
        price,
        thumbnail,
      };
      buyItem(
        token,
        { liveClasses: [liveClassInfo] },
        user,
        navigate,
        dispatch
      );
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to purchase the live class.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () =>
        navigate("/login", {
          state: { from: window.location.pathname },
        }),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <div className="bg-richblack-700 text-richblack-5 p-4 rounded-xl shadow-md flex flex-col gap-4 w-full">
      <div className="rounded-xl overflow-hidden">
        <Img
          src={thumbnail}
          alt={title}
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
      <div className="px-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-2xl font-bold text-yellow-50 mt-2">
          {price === 0 ? "Free" : `€${price}`}
        </p>
        <div className="flex flex-col gap-3 mt-4">
          {studentsEnrolled.length === participantLimit ? (
            <div className="w-full py-3 text-center text-yellow-300 bg-red-100 rounded-md font-semibold">
              Participant limit reached
            </div>
          ) : (
            <>
              <button className="yellowButton w-full" onClick={handleBuyNow}>
                {price === 0 ? "Join for Free" : "Buy Now"}
              </button>
              <button className="blackButton w-full" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

export default LiveClassDetailsCard;
