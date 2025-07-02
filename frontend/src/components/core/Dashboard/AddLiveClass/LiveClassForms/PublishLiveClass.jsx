import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { MdCheckCircle } from "react-icons/md";
import IconBtn from "../../../../common/IconBtn";
import { resetLiveClassState } from "../../../../../slices/liveClassSlice";
import { publishLiveClassAPI } from "../../../../../services/operations/liveClassesApi";
import { useNavigate } from "react-router-dom";

export default function PublishLiveClass() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { liveClass } = useSelector((state) => state.liveClass);
  const { token } = useSelector((state) => state.auth);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      let finalPayload = { ...liveClass };
      if (
        liveClass.thumbnail &&
        typeof liveClass.thumbnail === "string" &&
        liveClass.thumbnail.startsWith("data:image")
      ) {
        const file = base64ToFile(liveClass.thumbnail, "thumbnail.jpg");
        finalPayload.thumbnail = file;
      }
      const result = await publishLiveClassAPI(finalPayload, token);
      setIsPublishing(false);
      if (result) {
        dispatch(resetLiveClassState());
        navigate("/dashboard/live-classes");
      } else {
        toast.error("Failed to publish live class");
      }
    } catch (error) {
      setIsPublishing(false);
      toast.error("Something went wrong while publishing");
      console.error(error);
    }
  };
  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 text-richblack-5">
      <h2 className="mb-6 text-2xl font-semibold">Confirm and Publish</h2>
      <ul className="space-y-3 text-sm">
        <li>
          <MdCheckCircle className="inline-block text-lg text-yellow-50 mr-2" />
          <strong>Title:</strong> {liveClass?.title}
        </li>
        <li>
          <MdCheckCircle className="inline-block text-lg text-yellow-50 mr-2" />
          <strong>Description:</strong> {liveClass?.description}
        </li>
        <li>
          <MdCheckCircle className="inline-block text-lg text-yellow-50 mr-2" />
          <strong>Start Time:</strong>{" "}
          {new Date(liveClass?.startTime).toLocaleString()}
        </li>
        <li>
          <MdCheckCircle className="inline-block text-lg text-yellow-50 mr-2" />
          <strong>Duration:</strong> {liveClass?.duration} minutes
        </li>
        <li>
          <MdCheckCircle className="inline-block text-lg text-yellow-50 mr-2" />
          <strong>Platform:</strong> {liveClass?.platform}
        </li>
        <li>
          <MdCheckCircle className="inline-block text-lg text-yellow-50 mr-2" />
          <strong>Meeting Link:</strong> {liveClass?.accessLink}
        </li>
      </ul>
      <div className="mt-6 flex justify-end">
        <IconBtn
          text="Publish"
          disabled={isPublishing}
          onclick={handlePublish}
        />
      </div>
    </div>
  );
}
