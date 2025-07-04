import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserPurchasedBooks } from "../../../services/operations/profileAPI";

export default function PurchasedBooks() {
  const { token } = useSelector((state) => state.auth);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [books, setBooks] = useState(null);

  const fetchBooks = async () => {
    const res = await getUserPurchasedBooks(token);
    setBooks(res);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (books?.length === 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        You haven't purchased any books yet.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-4xl text-richblack-5 font-boogaloo mb-6">
        Purchased eBooks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!books && <p className="text-richblack-200">Loading...</p>}
        {books?.map((book, index) => (
          <div
            key={index}
            onClick={() => setSelectedBookId(book.id)}
            className="flex flex-col bg-richblack-800 rounded-lg p-4 border border-richblack-700"
          >
            <img
              src={book.thumbnail}
              alt={book.title}
              className="w-full h-48 object-contain rounded"
            />
            <h3 className="text-lg mt-3 font-semibold text-richblack-5">
              {book.title}
            </h3>
            <p className="text-richblack-300 text-sm">
              {book.authors?.join(", ")}
            </p>
            <p className="text-richblack-400 text-xs mt-1">
              Purchased on: {new Date(book.purchasedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {selectedBookId && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="relative bg-richblack-900 rounded-lg shadow-lg max-w-4xl w-full p-4">
              <button
                onClick={() => setSelectedBookId(null)}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white text-black text-xl shadow-lg z-50 hover:bg-richblack-300 hover:text-white transition"
              >
                ✕
              </button>
              <iframe
                src={`https://books.google.co.in/books?id=${selectedBookId}&printsec=frontcover&output=embed`}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen
                title="Book Preview"
                className="rounded-md"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
