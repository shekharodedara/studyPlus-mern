import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import BookCard from "../components/core/BooksCard/BooksCard";
import Loading from "../components/common/Loading";
import { getBooks } from "../services/operations/courseDetailsAPI";

function Books() {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const maxResults = 40;
  const defaultCategory = "bestseller";

  const fetchBooks = async (category = "", start = 0) => {
    try {
      setLoadingBooks(true);
      setError(null);
      const res = await getBooks(
        category || defaultCategory,
        "IN",
        maxResults,
        start
      );
      setBooks(res.items || []);
      setTotalItems(res.totalItems || 0);
    } catch (e) {
      setError("Failed to load books. Please try again.");
      console.error("Book fetch error:", e);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchCategory, startIndex);
  }, [startIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0);
    fetchBooks(searchCategory.trim(), 0);
  };

  return (
    <>
      <div className="box-content bg-richblack-800 px-4 py-6">
        <div className="mx-auto max-w-maxContentTab lg:max-w-maxContent flex items-center justify-between gap-4">
          <div>
            <p className="text-3xl text-richblack-5 capitalize">All Books</p>
            <p className="max-w-[600px] text-richblack-200">
              Explore books from Google Books API across all categories.
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex max-w-xs w-full gap-2">
            <input
              type="text"
              placeholder="Search by category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full rounded-md border border-richblack-500 bg-richblack-900 px-3 py-2 text-richblack-5 placeholder-richblack-400 focus:outline-yellow-400"
            />
            <button
              type="submit"
              className="yellowButton px-4"
              disabled={loadingBooks}
            >
              Search
            </button>
          </form>
        </div>
      </div>
      {loadingBooks ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <Loading />
        </div>
      ) : error ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center text-red-500 text-lg">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center text-white text-3xl">
          No books found.
        </div>
      ) : (
        <div className="mx-auto w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">Available Books</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {books.map((book) => {
              const { saleability, retailPrice } = book.saleInfo || {};
              const price =
                saleability === "FREE"
                  ? 0
                  : saleability === "FOR_SALE"
                  ? retailPrice?.amount
                  : null;
              return (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.volumeInfo.title}
                  authors={book.volumeInfo.authors}
                  thumbnail={book.volumeInfo.imageLinks?.thumbnail}
                  price={price}
                />
              );
            })}
          </div>
          {books.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                className="yellowButton px-4 disabled:opacity-50"
                onClick={() =>
                  setStartIndex((prev) => Math.max(prev - maxResults, 0))
                }
                disabled={startIndex === 0 || loadingBooks}
              >
                Previous
              </button>
              <span className="text-white">
                Page {Math.floor(startIndex / maxResults) + 1} of{" "}
                {Math.ceil(totalItems / maxResults)}
              </span>
              <button
                className="yellowButton px-4 disabled:opacity-50"
                onClick={() => setStartIndex((prev) => prev + maxResults)}
                disabled={startIndex + maxResults >= totalItems || loadingBooks}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      <Footer />
    </>
  );
}

export default Books;
