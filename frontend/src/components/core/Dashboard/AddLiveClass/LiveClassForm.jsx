import { useForm } from "react-hook-form";
import { useState } from "react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import Upload from "../CourseInformation/Upload";
import ChipInput from "../CourseInformation/ChipInput";
import IconBtn from "../../../../common/IconBtn";
import { toast } from "react-hot-toast";

export default function LiveClassForm({ onSubmit }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("date", data.date);
      formData.append("time", data.time);
      formData.append("duration", data.duration);
      formData.append("link", data.link);
      formData.append("price", data.price);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("thumbnail", data.thumbnail);
      await onSubmit(formData);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">
        <label htmlFor="title" className="text-sm text-richblack-5">
          Class Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="title"
          placeholder="Enter Live Class Title"
          {...register("title", { required: true })}
          className="form-style w-full"
        />
        {errors.title && (
          <span className="ml-2 text-xs text-pink-200">
            Class title is required
          </span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="description" className="text-sm text-richblack-5">
          Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="description"
          placeholder="Enter Class Description"
          {...register("description", { required: true })}
          className="form-style min-h-[130px] w-full resize-none"
        />
        {errors.description && (
          <span className="ml-2 text-xs text-pink-200">
            Description is required
          </span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="date" className="text-sm text-richblack-5">
          Date <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="date"
          type="date"
          {...register("date", { required: true })}
          className="form-style w-full"
        />
        {errors.date && (
          <span className="ml-2 text-xs text-pink-200">Date is required</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="time" className="text-sm text-richblack-5">
          Time <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="time"
          type="time"
          {...register("time", { required: true })}
          className="form-style w-full"
        />
        {errors.time && (
          <span className="ml-2 text-xs text-pink-200">Time is required</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="duration" className="text-sm text-richblack-5">
          Duration (in minutes) <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="duration"
          type="number"
          {...register("duration", { required: true, min: 1 })}
          className="form-style w-full"
        />
        {errors.duration && (
          <span className="ml-2 text-xs text-pink-200">
            Duration is required
          </span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="link" className="text-sm text-richblack-5">
          Class Link (Zoom/Meet etc.) <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="link"
          type="url"
          {...register("link", { required: true })}
          className="form-style w-full"
        />
        {errors.link && (
          <span className="ml-2 text-xs text-pink-200">Link is required</span>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="price" className="text-sm text-richblack-5">
          Price (optional)
        </label>
        <div className="relative">
          <input
            id="price"
            type="number"
            placeholder="Enter Price"
            {...register("price")}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
      </div>
      <ChipInput
        label="Tags"
        name="tags"
        placeholder="Enter tags"
        register={register}
        errors={errors}
        setValue={setValue}
      />
      <Upload
        name="thumbnail"
        label="Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={null}
      />
      <div className="flex justify-end">
        <IconBtn disabled={loading} text="Create Live Class">
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
