import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmationModal from "../../common/ConfirmationModal";
import {
  deleteLiveClassAPI,
  getInstructorLiveClasses,
} from "../../../services/operations/liveClassesApi";
import { formatDate } from "../../../services/formatDate";

export default function LiveClassesTable({
  classes,
  setClasses,
  loading,
  setLoading,
}) {
  const { token } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);
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
  if (!classes?.length) {
    return <p className="text-richblack-100 text-lg">No live classes found.</p>;
  }

  return (
    <>
      <div className="space-y-6">
        {classes.map((liveClass) => (
          <div
            key={liveClass._id}
            className="border border-richblack-700 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-richblack-5">
                {liveClass.title}
              </h3>
              <p className="text-richblack-200 text-sm">
                {liveClass.description}
              </p>
              <p className="text-xs text-richblack-300 mt-1">
                {formatDate(liveClass.startTime)} | {liveClass.duration} min |{" "}
                {liveClass.platform}
              </p>
            </div>
            <div className="flex gap-3 items-center text-richblack-100">
              <button
                title="Edit"
                onClick={() =>
                  console.log(`/dashboard/edit-live-class/${liveClass._id}`)
                }
                className="hover:text-yellow-200 transition"
              >
                <FiEdit2 size={20} />
              </button>
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
        ))}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
