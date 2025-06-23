import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiReturnArrow } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loading";
import RatingStars from "../components/common/RatingStars";
import { getBookDetails } from "../services/operations/courseDetailsAPI";
import BookDetailsCard from "../components/core/BooksCard/BookDetailsCard";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      const res = await getBookDetails(id);
      setBook(res || null);
    } catch (err) {
      console.error("Book fetch failed:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !book) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Loading />
      </div>
    );
  }
  const {
    title,
    authors,
    description,
    categories,
    publishedDate,
    pageCount,
    averageRating,
    ratingsCount,
    publisher,
  } = book.volumeInfo;

  return (
    <>
      <div className="relative w-full bg-richblack-800 text-richblack-5 px-4 py-10 mb-10">
        <div className="mx-auto max-w-maxContentTab lg:max-w-maxContent flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3 space-y-6">
            <div onClick={() => navigate(-1)} className="cursor-pointer mb-4">
              <GiReturnArrow className="w-8 h-8 text-yellow-100 hover:text-yellow-50" />
            </div>
            <div className="space-y-6 mt-6">
              <h1 className="text-3xl font-bold text-yellow-25">{title}</h1>
              {authors && (
                <p className="text-richblack-200 text-lg">
                  By{" "}
                  <span className="font-semibold text-richblack-5">
                    {authors.join(", ")}
                  </span>
                </p>
              )}
              {averageRating && (
                <div className="flex items-center gap-2">
                  <span>{averageRating}</span>
                  <RatingStars Review_Count={averageRating} Star_Size={20} />
                  <span className="text-sm text-richblack-300">
                    ({ratingsCount} ratings)
                  </span>
                </div>
              )}
              <div className="border border-richblack-600 rounded-lg p-4 text-sm sm:text-base bg-richblack-700 text-richblack-200 space-y-2">
                {publishedDate && (
                  <p>
                    <span className="font-medium text-richblack-5">
                      📅 Published:
                    </span>{" "}
                    {publishedDate}
                  </p>
                )}
                {publisher && (
                  <p>
                    <span className="font-medium text-richblack-5">
                      🏢 Publisher:
                    </span>{" "}
                    {publisher}
                  </p>
                )}
                {pageCount && (
                  <p>
                    <span className="font-medium text-richblack-5">
                      📖 Pages:
                    </span>{" "}
                    {pageCount}
                  </p>
                )}
                {categories && categories.length > 0 && (
                  <div>
                    <span className="font-medium text-richblack-5">
                      🏷️ Category:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {categories.map((cat, index) => (
                        <span
                          key={index}
                          className="bg-richblack-800 text-richblack-25 text-xs px-3 py-1 rounded-full font-semibold"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {description && (
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-richblack-5">
                    Overview
                  </p>
                  <div
                    className="text-richblack-100 leading-6"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="lg:w-1/3 w-full">
            <BookDetailsCard
              book={book}
              user={user}
              token={token}
              navigate={navigate}
              dispatch={dispatch}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookDetails;
