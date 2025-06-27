import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdNavigateNext } from "react-icons/md";
import IconBtn from "../../../../common/IconBtn";
import { setStep, setLiveClass } from "../../../../../slices/liveClassSlice";

export default function LiveClassSettingsForm() {
  const dispatch = useDispatch();
  const { liveClass } = useSelector((state) => state.liveClass);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      participantLimit: liveClass?.participantLimit || "",
      accessLink: liveClass?.accessLink || "",
      platform: liveClass?.platform || "",
    },
  });
  const onSubmit = (data) => {
    dispatch(setLiveClass({ ...liveClass, ...data }));
    dispatch(setStep(3));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">
          Participant Limit <sup className="text-pink-200">*</sup>
        </label>
        <input
          type="number"
          placeholder="e.g. 100"
          {...register("participantLimit", { required: true, min: 1 })}
          className="form-style w-full"
        />
        {errors.participantLimit && (
          <span className="text-xs text-pink-200">Required field</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">
          Platform <sup className="text-pink-200">*</sup>
        </label>
        <input
          type="text"
          placeholder="e.g. Zoom, Google Meet"
          {...register("platform", { required: true })}
          className="form-style w-full"
        />
        {errors.platform && (
          <span className="text-xs text-pink-200">Required field</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5">
          Access/Meeting Link <sup className="text-pink-200">*</sup>
        </label>
        <input
          type="url"
          placeholder="https://zoom.us/meeting-link"
          {...register("accessLink", {
            required: true,
            pattern: /^https?:\/\/.+$/,
          })}
          className="form-style w-full"
        />
        {errors.accessLink && (
          <span className="text-xs text-pink-200">Enter a valid link</span>
        )}
      </div>
      <div className="flex justify-end">
        <IconBtn text="Next">
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
