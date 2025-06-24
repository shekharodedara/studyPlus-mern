import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPurchaseHistory } from "../../../services/operations/profileAPI";

const PurchaseHistory = () => {
  const { token } = useSelector((state) => state.auth);
  const [history, setHistory] = useState({ courses: [], ebooks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await getPurchaseHistory(token);
      setHistory(res || { courses: [], ebooks: [] });
    } catch (err) {
      setError("Failed to fetch purchase history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) return <p className="text-richblack-200">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const tableHeaderClass =
    "px-4 py-2 border-b border-richblack-600 text-left text-richblack-200";
  const tableDataClass =
    "px-4 py-3 border-b border-richblack-700 text-richblack-5";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-boogaloo text-richblack-5 mb-6">
        Purchase History
      </h2>
      {history.courses.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-richblack-200 mb-3">
            Courses
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-richblack-700">
                  <th className={tableHeaderClass}></th>
                  <th className={tableHeaderClass}>Title</th>
                  <th className={tableHeaderClass}>Price</th>
                  <th className={tableHeaderClass}>Purchased On</th>
                </tr>
              </thead>
              <tbody>
                {history.courses.map((course) => (
                  <tr key={course.id}>
                    <td className={tableDataClass}>
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className={tableDataClass}>{course.title}</td>
                    <td className={tableDataClass}>₹{course.price}</td>
                    <td className={tableDataClass}>
                      {formatDate(course.purchasedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {history.ebooks.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-richblack-200 mb-3">
            eBooks
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-richblack-700">
                  <th className={tableHeaderClass}></th>
                  <th className={tableHeaderClass}>Title</th>
                  <th className={tableHeaderClass}>Authors</th>
                  <th className={tableHeaderClass}>Purchased On</th>
                </tr>
              </thead>
              <tbody>
                {history.ebooks.map((book) => (
                  <tr key={book.id}>
                    <td className={tableDataClass}>
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-16 h-20 object-contain rounded"
                      />
                    </td>
                    <td className={tableDataClass}>{book.title}</td>
                    <td className={tableDataClass}>₹{book.price || 0}</td>
                    <td className={tableDataClass}>
                      {formatDate(book.purchasedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {history.courses.length === 0 && history.ebooks.length === 0 && (
        <p className="text-center text-richblack-200 mt-10 text-lg">
          You haven't purchased any courses or books yet.
        </p>
      )}
    </div>
  );
};

export default PurchaseHistory;
