import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GiReturnArrow } from "react-icons/gi";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loading";
import { getLiveClassDetailsAPI } from "../services/operations/liveClassesApi";
import LiveClassDetailsCard from "../components/core/LiveClassCard/LiveClassDetailsCard";

function LiveClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLiveClassDetails = async () => {
      setLoading(true);
      const res = await getLiveClassDetailsAPI(id);
      setLiveClass(res);
      setLoading(false);
    };
    fetchLiveClassDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !liveClass) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Loading />
      </div>
    );
  }

  const {
    title,
    description,
    duration,
    startTime,
    platform,
    studentsEnrolled,
    participantLimit,
    sessions,
  } = liveClass;

  return (
    <>
      <div className="relative w-full bg-richblack-800 text-richblack-5 px-4 py-10 mb-10">
        <div className="mx-auto max-w-maxContentTab lg:max-w-maxContent flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3 space-y-6">
            <div onClick={() => navigate(-1)} className="cursor-pointer mb-4">
              <GiReturnArrow className="w-8 h-8 text-yellow-100 hover:text-yellow-50" />
            </div>
            <div className="space-y-4 mt-6">
              <h1 className="text-3xl font-bold text-yellow-25">{title}</h1>
              <p className="text-richblack-200 text-base">{description}</p>
              <div className="border border-richblack-600 rounded-lg p-4 bg-richblack-700 text-sm text-richblack-200 space-y-2">
                <p>
                  <span className="font-semibold text-richblack-5">
                    📅 Start Time:
                  </span>{" "}
                  {new Date(startTime).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p>
                  <span className="font-semibold text-richblack-5">
                    ⏱️ Duration:
                  </span>{" "}
                  {duration} mins
                </p>
                <p>
                  <span className="font-semibold text-richblack-5">
                    🖥️ Platform:
                  </span>{" "}
                  {platform}
                </p>
                <p>
                  <span className="font-semibold text-richblack-5">
                    👥 Enrolled:
                  </span>{" "}
                  {studentsEnrolled?.length || 0} /{" "}
                  {participantLimit || "No Limit"}
                </p>
              </div>
            </div>
            {Array.isArray(sessions) && sessions.length > 0 && (
              <div className="mt-8">
                <div className="border border-richblack-600 rounded-lg p-4 bg-richblack-700 w-full">
                  <h4 className="text-lg font-bold text-yellow-25 mb-4 flex items-center gap-2">
                    <span role="img" aria-label="calendar">
                      🗓️
                    </span>{" "}
                    Session Schedule
                  </h4>
                  <div className="flex flex-col gap-0 max-h-[400px] overflow-y-auto pr-2">
                    {sessions.map((session, idx) => {
                      const dateObj = new Date(session.startTime);
                      const dayName = dateObj.toLocaleDateString(undefined, {
                        weekday: "long",
                      });
                      const time12 = dateObj.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      });
                      return (
                        <div
                          key={idx}
                          className="w-full flex flex-col md:flex-row items-center md:items-stretch border-b border-richblack-600 last:border-b-0 px-0 py-4"
                          style={{ background: "inherit" }}
                        >
                          <div className="flex-1 flex flex-col min-w-[180px] items-center md:items-start justify-center">
                            <span className="font-semibold text-yellow-100 text-sm flex items-center gap-1">
                              <span role="img" aria-label="date">
                                📅
                              </span>{" "}
                              When:
                            </span>
                            <span className="text-yellow-300 text-base ml-6">
                              {dayName}, {dateObj.toLocaleDateString()} at{" "}
                              {time12}
                            </span>
                          </div>
                          <div className="flex-1 flex flex-col min-w-[180px] items-center md:items-start justify-center">
                            <span className="font-semibold text-yellow-100 text-sm flex items-center gap-1">
                              <span role="img" aria-label="topic">
                                📖
                              </span>{" "}
                              Topic:
                            </span>
                            <span className="text-blue-300 text-base ml-6">
                              {session.lessonTitle}
                            </span>
                          </div>
                          <div className="flex-[2] flex flex-col items-center md:items-start justify-center">
                            <span className="font-semibold text-yellow-100 text-sm flex items-center gap-1">
                              <span role="img" aria-label="desc">
                                📝
                              </span>{" "}
                              What you&apos;ll learn:
                            </span>
                            <span className="text-richblack-200 text-base ml-6">
                              {session.lessonDescription}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:w-1/3 w-full">
            <LiveClassDetailsCard
              liveClass={liveClass}
              user={user}
              token={token}
              dispatch={dispatch}
              navigate={navigate}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LiveClassDetails;
