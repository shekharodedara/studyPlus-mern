import React from "react";
import { Link } from "react-router-dom";

function BooksCard({ title, authors = [], thumbnail, id, price }) {
  const displayPrice =
    price === 0
      ? "Free"
      : typeof price === "number"
      ? `€ ${price.toFixed(2)}`
      : null;

  return (
    <Link to={`/books/${id}`}>
      <div className="border border-richblack-700 rounded-md p-4 bg-richblack-800 text-white hover:shadow-md transition-all">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-contain mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-richblack-600 flex items-center justify-center mb-4">
            No Image
          </div>
        )}
        {displayPrice && (
          <p className="text-xs font-semibold text-yellow-100 mb-1">
            {displayPrice}
          </p>
        )}
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-xs text-richblack-300">
          {authors.length ? `by ${authors.join(", ")}` : "Unknown Author"}
        </p>
      </div>
    </Link>
  );
}

export default BooksCard;
