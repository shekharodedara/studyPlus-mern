import React, { useEffect, useState } from "react";
import Loading from "../components/common/Loading";
import Footer from "../components/common/Footer";
import { getStudentLiveClassesAPI } from "../services/operations/liveClassesApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LiveClasses() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getStudentLiveClassesAPI(token);
        setLiveClasses(Array.isArray(res) ? res : []);
      } catch {
        setLiveClasses([]);
      }
      setLoading(false);
    })();
  }, [token]);

  return (
    <div className="min-h-[100vh] bg-richblack-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {!loading && liveClasses.length > 0 && (
          <h1 className="text-3xl font-semibold mb-6 text-yellow-50">
            Upcoming Live Classes
          </h1>
        )}
        {loading ? (
          <Loading />
        ) : liveClasses.length === 0 ? (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center text-white text-3xl">
            No live classes available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveClasses.map((cls) => (
              <div
                key={cls._id}
                onClick={() => navigate(`/live-class/${cls._id}`)}
                className="bg-richblack-800 p-5 rounded-md border border-richblack-700 flex flex-col md:flex-row gap-4"
              >
                {cls.thumbnail && (
                  <img
                    src={cls.thumbnail}
                    alt={cls.title}
                    className="w-full md:w-40 h-24 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl text-yellow-25 font-medium mb-2">
                    {cls.title}
                  </h2>
                  <p className="text-richblack-200 mb-1">{cls.description}</p>
                  <p className="text-sm text-richblack-300">
                    Platform: <span className="text-white">{cls.platform}</span>
                  </p>
                  <p className="text-sm text-richblack-300">
                    Start Time:{" "}
                    <span className="text-white">
                      {new Date(cls.startTime).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                  <p className="text-sm text-richblack-300">
                    Duration:{" "}
                    <span className="text-white">{cls.duration} mins</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default LiveClasses;
