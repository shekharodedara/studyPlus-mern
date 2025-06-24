import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Img from "./../../common/Img";
import { addToCart } from "../../../slices/cartSlice";
import ConfirmationModal from "../../common/ConfirmationModal";
import { buyItem } from "../../../services/operations/studentFeaturesAPI";

function BookDetailsCard({ book, user, token, navigate, dispatch }) {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const { volumeInfo, saleInfo } = book || {};
  const saleability = saleInfo?.saleability;
  const price =
    saleability === "FOR_SALE"
      ? saleInfo?.listPrice?.amount
      : saleability === "FREE"
      ? 0
      : null;
  const isPurchasable = price !== null;
  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    dispatch(
      addToCart({
        id: book.id,
        title: volumeInfo?.title,
        price: price,
        thumbnail: volumeInfo?.imageLinks?.thumbnail,
        authors: volumeInfo?.authors,
        publisher: volumeInfo?.publisher,
        description: volumeInfo?.description,
        rating: volumeInfo?.averageRating || 4.5,
        ratingsCount: volumeInfo?.ratingsCount || 100,
      })
    );
  };

  const handleBuyNow = () => {
    if (token) {
      const bookInfo = {
        id: book.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors,
        thumbnail: volumeInfo.imageLinks?.thumbnail,
        price: price,
      };
      buyItem(token, { books: [bookInfo] }, user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  return (
    <div className="bg-richblack-700 text-richblack-5 p-4 rounded-xl shadow-md flex flex-col gap-4 w-full">
      <div className="rounded-xl overflow-hidden">
        <Img
          src={volumeInfo?.imageLinks?.thumbnail}
          alt={volumeInfo?.title}
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
      <div className="px-2">
        <h3 className="text-xl font-semibold">{volumeInfo?.title}</h3>
        {isPurchasable ? (
          <p className="text-2xl font-bold text-yellow-50 mt-2">
            {price === 0 ? "Free" : `€${price}`}
          </p>
        ) : (
          <p className="text-sm text-richblack-300 mt-2">
            Not available for purchase in your region
          </p>
        )}
        <div className="flex flex-col gap-3 mt-4">
          <button
            className={`yellowButton w-full ${
              !isPurchasable && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleBuyNow}
            disabled={!isPurchasable}
          >
            {price === 0 ? "Buy for Free" : "Buy Now"}
          </button>
          <button
            className={`blackButton w-full ${
              !isPurchasable && "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleAddToCart}
            disabled={!isPurchasable}
          >
            Add to Cart
          </button>
        </div>
        {volumeInfo?.previewLink && (
          <a
            href={volumeInfo?.previewLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-center mt-3 underline text-yellow-25"
          >
            Preview Book
          </a>
        )}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}

export default BookDetailsCard;
