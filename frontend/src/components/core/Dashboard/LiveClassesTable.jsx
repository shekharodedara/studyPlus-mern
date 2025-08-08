import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaVideo } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
// import { FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { formatDate } from "../../../services/formatDate";
import ConfirmationModal from "../../common/ConfirmationModal";
import {
  deleteLiveClassAPI,
  getInstructorLiveClasses,
} from "../../../services/operations/liveClassesApi";

export default function LiveClassesTable({
  classes,
  setClasses,
  loading,
  setLoading,
}) {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [intervals, setIntervals] = useState([]);

  const handleDelete = async (liveClassId) => {
    const toastId = toast.loading("Deleting...");
    setLoading(true);
    const result = await deleteLiveClassAPI(liveClassId, token);
    if (result?.success) {
      const updated = await getInstructorLiveClasses(token);
      setClasses(updated);
    }
    setLoading(false);
    setConfirmationModal(null);
    toast.dismiss(toastId);
  };

  useEffect(() => {
    intervals.forEach((interval) => clearInterval(interval));
    const newIntervals = classes.map((liveClass) => {
      const startTime = new Date(liveClass.startTime);
      const now = new Date();
      const timeDiffMs = startTime - now;
      if (timeDiffMs <= 600000 && timeDiffMs > 0) {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
        return interval;
      }
      return null;
    });
    setIntervals(newIntervals);
    return () => {
      newIntervals.forEach((interval) => clearInterval(interval));
    };
  }, [classes]);
  if (!classes?.length) {
    return <p className="text-richblack-100 text-lg">No live classes found.</p>;
  }

  const isLiveClass = (startTime, duration) => {
    const now = new Date();
    const endTime = new Date(startTime).getTime() + duration * 60000;
    const startTimeMs = new Date(startTime).getTime();
    return now >= startTimeMs && now <= endTime;
  };

  const isUpcomingClass = (startTime) => {
    const now = new Date();
    const diffMs = startTime - now;
    return diffMs <= 5 * 60 * 1000 && diffMs > 0;
  };

  const sortedClasses = [...classes].sort((a, b) => {
    const startA = new Date(a.startTime);
    const startB = new Date(b.startTime);
    const isALive = isLiveClass(a.startTime, a.duration);
    const isBLive = isLiveClass(b.startTime, b.duration);
    if (isALive && !isBLive) return -1;
    if (!isALive && isBLive) return 1;
    const isAUpcoming = isUpcomingClass(startA);
    const isBUpcoming = isUpcomingClass(startB);
    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;
    return startA - startB;
  });

  return (
    <>
      <div className="space-y-6">
        {sortedClasses.map((liveClass) => {
          const startTime = new Date(liveClass.startTime);
          const endTime = new Date(
            startTime.getTime() + liveClass.duration * 60000
          );
          const joinWindowStart = new Date(startTime.getTime() - 60000);
          const canLaunch =
            currentTime >= joinWindowStart && currentTime <= endTime;
          const formattedStartTime = startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          const isUpcoming = isUpcomingClass(startTime);
          const isLive = isLiveClass(startTime, liveClass.duration);
          return (
            <div
              key={liveClass._id}
              onClick={() => navigate(`/live-class/${liveClass._id}`)}
              className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-richblack-800 transition-all ${
                isLive
                  ? "border-2 border-green-500"
                  : isUpcoming
                  ? "border-2 border-yellow-500"
                  : "border-richblack-700"
              }`}
            >
              <div className="flex items-start gap-4">
                {liveClass.thumbnail && (
                  <img
                    src={liveClass.thumbnail}
                    alt={`${liveClass.title} thumbnail`}
                    className="w-20 h-20 object-cover rounded-md border border-richblack-600"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-richblack-5">
                    {liveClass.title}
                  </h3>
                  <p className="text-richblack-200 text-sm line-clamp-2">
                    {liveClass.description}
                  </p>
                  <p className="text-xs text-richblack-300 mt-1">
                    {formatDate(liveClass.startTime)} | {liveClass.duration} min
                    | {liveClass.platform}
                  </p>
                  <p className="text-xs text-richblack-300 mt-1">
                    Scheduled On: {formattedStartTime}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center text-richblack-100">
                {isLive && (
                  <span className="text-green-500 text-xs font-semibold">
                    Live
                  </span>
                )}
                {isUpcoming && !isLive && (
                  <span className="text-yellow-500 text-xs font-semibold">
                    Upcoming
                  </span>
                )}
                <button
                  title="Launch Live Class"
                  disabled={!canLaunch}
                  onClick={() => {
                    if (canLaunch) {
                      window.open(
                        `/dashboard/room/${
                          liveClass.roomCode ||
                          import.meta.env.VITE_APP_HMS_BROADCASTER_ROOM_CODE
                        }`,
                        "_blank"
                      );
                    }
                  }}
                  className={`transition ${
                    canLaunch
                      ? "hover:text-[#00ff99] text-white"
                      : "cursor-not-allowed text-richblack-500"
                  }`}
                >
                  <FaVideo size={20} />
                </button>
                {/* <button
                title="Edit"
                onClick={() =>
                  console.log(/dashboard/edit-live-class/${liveClass._id})
                }
                className="hover:text-yellow-200 transition"
                >
                <FiEdit2 size={20} />
                </button> */}
                <button
                  title="Delete"
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Are you sure?",
                      text2: "This live class will be permanently deleted.",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDelete(liveClass._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="hover:text-[#ff0000] transition"
                >
                  <RiDeleteBin6Line size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
