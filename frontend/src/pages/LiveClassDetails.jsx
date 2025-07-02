import React, { useEffect, useState } from "react";
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
    thumbnail,
    duration,
    startTime,
    price,
    platform,
    accessLink,
    studentsEnrolled,
    participantLimit,
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
                  {new Date(startTime).toLocaleString()}
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
