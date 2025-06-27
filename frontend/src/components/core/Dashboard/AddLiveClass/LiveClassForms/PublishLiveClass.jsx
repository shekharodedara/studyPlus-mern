import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { MdCheckCircle } from "react-icons/md";
import IconBtn from "../../../../common/IconBtn";
import { resetLiveClassState } from "../../../../../slices/liveClassSlice";
import { publishLiveClassAPI } from "../../../../../services/operations/liveClassesApi";

export default function PublishLiveClass() {
  const dispatch = useDispatch();
  const { liveClass } = useSelector((state) => state.liveClass);
  const { token } = useSelector((state) => state.auth);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    const result = await publishLiveClassAPI(liveClass, token);
    setIsPublishing(false);
    if (result) {
      toast.success("Live class published successfully!");
      dispatch(resetLiveClassState());
    } else {
      toast.error("Failed to publish live class");
    }
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
