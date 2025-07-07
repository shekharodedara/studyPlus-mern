import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserPurchasedLiveClasses } from "../../../services/operations/liveClassesApi";

export default function PurchasedLiveClasses() {
  const { token } = useSelector((state) => state.auth);
  const [liveClasses, setLiveClasses] = useState(null);
  const [error, setError] = useState(null);
  const VIEWER_REALTIME_ROOM_CODE = import.meta.env
    .VITE_APP_HMS_VIEWER_REALTIME_ROOM_CODE;

  const fetchLiveClasses = async () => {
    try {
      const res = await getUserPurchasedLiveClasses(token);
      setLiveClasses(res || []);
    } catch (err) {
      setError("Failed to fetch purchased live classes");
    }
  };
  useEffect(() => {
    if (token) {
      fetchLiveClasses();
    }
  }, [token]);

  if (error) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-red-500 text-2xl">
        {error}
      </p>
    );
  }
  if (liveClasses === null) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-200 text-2xl">
        Loading...
      </p>
    );
  }
  if (liveClasses.length === 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        You haven't purchased any live classes yet.
      </p>
    );
  }
  return (
    <div>
      <h2 className="text-4xl text-richblack-5 font-boogaloo mb-6">
        Live Classes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveClasses.map((liveClass) => {
          const now = new Date();
          const start = new Date(liveClass.startTime);
          const end = new Date(start.getTime() + liveClass.duration * 60000); // duration in ms
          const isLive = now >= start && now <= end;
          return (
            <div
              key={liveClass._id}
              className="flex flex-col bg-richblack-800 rounded-lg p-4 border border-richblack-700 hover:border-yellow-400"
            >
              <img
                src={liveClass.thumbnail}
                alt={liveClass.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg mt-3 font-semibold text-richblack-5">
                {liveClass.title}
              </h3>
              <p className="text-richblack-300 mt-1">
                Duration: {liveClass.duration} minutes
              </p>
              <p className="text-richblack-400 text-sm mt-1">
                Scheduled On:{" "}
                {new Date(
                  liveClass.startTime || liveClass.createdAt
                ).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <button
                disabled={!isLive}
                onClick={() =>
                  window.open(
                    `/dashboard/room/${
                      liveClass.roomCode || VIEWER_REALTIME_ROOM_CODE
                    }`,
                    "_blank"
                  )
                }
                className={`mt-4 px-4 py-2 rounded text-white font-semibold transition ${
                  isLive
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                {isLive ? "Join Class" : "Not Live Now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
