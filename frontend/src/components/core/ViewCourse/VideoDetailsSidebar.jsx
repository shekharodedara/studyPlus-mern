import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { setCourseViewSidebar } from "../../../slices/sidebarSlice";
import { BsChevronDown } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { HiMenuAlt1 } from "react-icons/hi";
import AddNoteModal from "./AddNoteModal";
import {
  getNotes,
  deleteNote,
} from "../../../services/operations/courseDetailsAPI";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("details");
  const [noteModal, setNoteModal] = useState(false);
  const [activeStatus, setActiveStatus] = useState(""); // current section id
  const [videoBarActive, setVideoBarActive] = useState(""); // current subSectionId
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);
  const { courseViewSidebar } = useSelector((state) => state.sidebar);

  // Handle active subsection based on URL
  useEffect(() => {
    if (!courseSectionData.length) return;
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData?.[
      currentSectionIndx
    ]?.subSection.findIndex((data) => data._id === subSectionId);
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]
        ?._id;

    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [courseSectionData, location.pathname]);

  const fetchNotes = async () => {
    const res = await getNotes(videoBarActive, token);
    setNotes(res);
  };

  useEffect(() => {
    if (activeTab === "notes" && videoBarActive) {
      fetchNotes();
    }
  }, [activeTab, videoBarActive]);

  const refreshNotes = async () => {
    if (activeTab === "notes" && videoBarActive) {
      fetchNotes();
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirm) return;
    const success = await deleteNote(noteId, token);
    if (success) {
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-richblack-25">
          <div className="flex w-full items-center justify-between">
            <div
              className="sm:hidden text-white cursor-pointer"
              onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
            >
              {courseViewSidebar ? (
                <IoMdClose size={33} />
              ) : (
                <HiMenuAlt1 size={33} />
              )}
            </div>
            <button
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="Back"
            >
              <IoIosArrowBack size={25} />
            </button>
            <div className="flex items-center gap-2">
              <IconBtn
                text="Add Review"
                customClasses="h-[24px] w-[90px] text-xs !px-0 py-1"
                onclick={() => setReviewModal(true)}
              />
              <IconBtn
                text="Add Note"
                customClasses="h-[24px] w-[80px] text-xs !px-0 py-1"
                onclick={() => setNoteModal(true)}
              />
            </div>
          </div>
          <div>
            <p className="text-lg font-bold">{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>
        <div className="flex">
          <button
            className={`w-1/2 py-2 text-center text-sm font-medium ${
              activeTab === "details"
                ? "bg-richblack-700 text-yellow-50"
                : "bg-richblack-900 text-richblack-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Lessons
          </button>
          <button
            className={`w-1/2 py-2 text-center text-sm font-medium ${
              activeTab === "notes"
                ? "bg-richblack-700 text-yellow-50"
                : "bg-richblack-900 text-richblack-300"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" && (
            <div>
              {courseSectionData.map((section, index) => (
                <div key={index}>
                  <div
                    className="mt-2 cursor-pointer text-sm text-richblack-5"
                    onClick={() => setActiveStatus(section?._id)}
                  >
                    <div className="flex justify-between bg-richblack-700 px-5 py-4">
                      <div className="w-[70%] font-semibold">
                        {section?.sectionName}
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`${
                            activeStatus === section?._id
                              ? "rotate-0"
                              : "rotate-90"
                          } transition-all duration-500`}
                        >
                          <BsChevronDown />
                        </span>
                      </div>
                    </div>
                    {activeStatus === section?._id && (
                      <div>
                        {section.subSection.map((topic, i) => (
                          <div
                            key={i}
                            className={`flex gap-3 px-5 py-2 ${
                              videoBarActive === topic._id
                                ? "bg-yellow-200 font-semibold text-richblack-800"
                                : "hover:bg-richblack-900"
                            }`}
                            onClick={() => {
                              navigate(
                                `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                              );
                              setVideoBarActive(topic._id);
                              if (window.innerWidth <= 640)
                                dispatch(setCourseViewSidebar(false));
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={completedLectures.includes(topic._id)}
                              readOnly
                            />
                            {topic.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "notes" && (
            <div className="text-richblack-200 px-5 py-4 space-y-4">
              {Array.isArray(notes) && notes.length > 0 ? (
                notes.map((note) => (
                  <div
                    key={note._id}
                    className="relative rounded-md border border-richblack-600 bg-richblack-700 p-3"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="absolute top-2 right-2 text-richblack-300 hover:text-pink-300 transition"
                      title="Delete Note"
                    >
                      <FiTrash2 size={16} />
                    </button>

                    <p className="text-sm text-richblack-100">{note.content}</p>
                    <p className="mt-1 text-[11px] text-richblack-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm italic">
                  You don’t have any notes for this video yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {noteModal && (
        <AddNoteModal
          setNoteModal={setNoteModal}
          videoId={videoBarActive}
          onNoteAdded={refreshNotes}
        />
      )}
    </>
  );
}
