import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utils/constants";

const NOTIFY_BEFORE_MINUTES = 5;
const CHECK_INTERVAL_MS = 60000;

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function LiveClassNotification({ liveClasses, user }) {
  const [notifiedClasses, setNotifiedClasses] = useState(() => {
    const saved = sessionStorage.getItem("notifiedLiveClasses");
    return saved ? JSON.parse(saved) : [];
  });
  const notifiedRef = useRef(notifiedClasses);
  useEffect(() => {
    notifiedRef.current = notifiedClasses;
  }, [notifiedClasses]);
  const checkAndNotify = () => {
    const now = new Date();
    liveClasses.forEach((liveClass) => {
      const start = new Date(liveClass.startTime);
      const notifyTime = new Date(
        start.getTime() - NOTIFY_BEFORE_MINUTES * 60000
      );
      const inWindow = now >= notifyTime && now < start;
      const notYetNotified = !notifiedRef.current.includes(liveClass._id);
      if (inWindow && notYetNotified) {
        const formatted = formatTime(liveClass.startTime);
        toast.custom(
          (t) => (
            <div className="max-w-md w-full bg-yellow-400 text-richblack-900 rounded-lg shadow-lg flex items-center justify-between p-4 space-x-4">
              <div className="flex-1 text-sm sm:text-base font-semibold">
                {user.accountType === ACCOUNT_TYPE.INSTRUCTOR
                  ? `Hey ${user.firstName || "there"}, your class`
                  : `Hey ${user.firstName || "there"}, your live class`}
                <span className="font-bold"> "{liveClass.title}" </span>
                {user.accountType === ACCOUNT_TYPE.INSTRUCTOR
                  ? " goes live at "
                  : " starts at "}
                <span className="font-bold">{formatted}</span>.
              </div>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  const updated = [...notifiedRef.current, liveClass._id];
                  setNotifiedClasses(updated);
                  sessionStorage.setItem(
                    "notifiedLiveClasses",
                    JSON.stringify(updated)
                  );
                }}
                className="ml-4 text-richblack-900 hover:text-richblack-700 font-bold"
              >
                ✕
              </button>
            </div>
          ),
          {
            duration: Infinity,
            position: "top-right",
          }
        );
      }
    });
  };

  useEffect(() => {
    if (!liveClasses?.length || !user) return;
    checkAndNotify();
    const interval = setInterval(checkAndNotify, CHECK_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      toast.dismiss();
    };
  }, [liveClasses, user]);
  return null;
}
