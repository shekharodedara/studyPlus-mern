import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import IconBtn from "../../../../common/IconBtn";
import { setLiveClass, setStep } from "../../../../../slices/liveClassSlice";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import Upload from "../../AddCourse/Upload";

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
      duration: liveClass?.duration || "",
      price: liveClass?.price || "",
      thumbnail: "",
    },
  });

  const onSubmit = async (data) => {
    if (!data.title || !data.description || !data.duration) {
      toast.error("Please fill all required fields");
      return;
    }
    let thumbnailBase64 = liveClass?.thumbnail || null;
    if (data.thumbnail && data.thumbnail instanceof File) {
      try {
        thumbnailBase64 = await fileToBase64(data.thumbnail);
      } catch (error) {
        toast.error("Failed to process thumbnail image");
        return;
      }
    }

    dispatch(
      setLiveClass({
        ...liveClass,
        ...data,
        thumbnail: thumbnailBase64,
        status: "Published",
      })
    );
    dispatch(setStep(2));
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
      <Upload
        name="thumbnail"
        label="Live Class Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editLiveClass ? liveClass?.thumbnail : null}
      />
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
      <div className="flex flex-col space-y-2">
        <label htmlFor="participantLimit" className="text-sm text-richblack-5">
          Participant Limit <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="participantLimit"
          type="number"
          placeholder="e.g. 100"
          {...register("participantLimit", { required: true, min: 1 })}
          className="form-style w-full"
        />
        {errors.participantLimit && (
          <span className="text-xs text-pink-200">Participant limit is required</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="price" className="text-sm text-richblack-5">
          Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="price"
            type="number"
            step="1"
            min="0"
            placeholder="Enter price"
            {...register("price", {
              required: "Price is required",
              min: {
                value: 0,
                message: "Price cannot be negative",
              },
            })}
            className="form-style w-full !pl-10"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-richblack-400" />
        </div>
        {errors.price && (
          <span className="text-xs text-pink-200">{errors.price.message}</span>
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
