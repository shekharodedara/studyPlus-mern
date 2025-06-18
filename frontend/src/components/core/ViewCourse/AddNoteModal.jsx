import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { addNote } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";

export default function AddNoteModal({ setNoteModal, videoId }) {
  const { token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({ noteContent: "" });
  }, [reset]);

  const onSubmit = async (data) => {
    const success = await addNote(
      {
        videoId,
        content: data.noteContent,
      },
      token
    );
    if (success) {
      setNoteModal(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col items-center"
    >
      <div className="flex w-11/12 flex-col space-y-2">
        <label htmlFor="noteContent" className="text-sm text-richblack-5">
          Write your note <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="noteContent"
          placeholder="Write your note here..."
          {...register("noteContent", { required: true })}
          className="form-style resize-none min-h-[130px] w-full"
          autoFocus
        />
        {errors.noteContent && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Please enter your note
          </span>
        )}
      </div>
      <div className="mt-6 flex w-11/12 justify-end gap-x-2">
        <button
          type="button"
          onClick={() => setNoteModal(false)}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-900 hover:text-richblack-300 duration-300"
        >
          Cancel
        </button>
        <IconBtn text="Save Note" type="submit" />
      </div>
    </form>
  );
}