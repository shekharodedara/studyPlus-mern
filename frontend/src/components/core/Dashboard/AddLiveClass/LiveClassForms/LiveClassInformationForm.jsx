import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import IconBtn from "../../../../common/IconBtn";
import { setLiveClass, setStep } from "../../../../../slices/liveClassSlice";

export default function LiveClassInformationForm() {
  const dispatch = useDispatch();
  const { liveClass, editLiveClass } = useSelector((state) => state.liveClass);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: liveClass?.title || "",
      description: liveClass?.description || "",
      startTime: liveClass?.startTime || "",
      duration: liveClass?.duration || "",
    },
  });

  const onSubmit = (data) => {
    if (!data.title || !data.description || !data.startTime || !data.duration) {
      toast.error("Please fill all required fields");
      return;
    }
    dispatch(setLiveClass({ ...liveClass, ...data }));
    dispatch(setStep(2));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">
        <label htmlFor="title" className="text-sm text-richblack-5">
          Live Class Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="title"
          placeholder="Enter live class title"
          {...register("title", { required: true })}
          className="form-style w-full"
        />
        {errors.title && (
          <span className="text-xs text-pink-200">Title is required</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="description" className="text-sm text-richblack-5">
          Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="description"
          placeholder="Enter description"
          {...register("description", { required: true })}
          className="form-style min-h-[120px] w-full resize-none"
        />
        {errors.description && (
          <span className="text-xs text-pink-200">Description is required</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="startTime" className="text-sm text-richblack-5">
          Start Time <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="startTime"
          type="datetime-local"
          {...register("startTime", { required: true })}
          className="form-style w-full"
        />
        {errors.startTime && (
          <span className="text-xs text-pink-200">Start time is required</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="duration" className="text-sm text-richblack-5">
          Duration (in minutes) <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="duration"
          type="number"
          placeholder="e.g. 60"
          {...register("duration", { required: true, min: 1 })}
          className="form-style w-full"
        />
        {errors.duration && (
          <span className="text-xs text-pink-200">Enter a valid duration</span>
        )}
      </div>
      <div className="flex justify-end">
        <IconBtn text={editLiveClass ? "Update" : "Next"}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
