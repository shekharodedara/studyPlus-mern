import { useEffect } from "react";
import RenderLiveClassSteps from "./RenderLiveClassSteps";

export default function AddLiveClass() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex w-full items-start gap-x-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center lg:text-left">
          Add Live Class
        </h1>
        <div className="flex-1">
          <RenderLiveClassSteps />
        </div>
      </div>
      <div className="sticky top-10 hidden lg:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 ">
        <p className="mb-8 text-lg text-richblack-5">⚡ Live Class Tips</p>
        <ul className="ml-5 list-disc space-y-4 text-xs text-richblack-5">
          <li>Give a clear title and description.</li>
          <li>Ensure you pick a correct date and time.</li>
          <li>Thumbnail helps students identify your session.</li>
          <li>Specify tools you'll use (e.g. Zoom, Google Meet).</li>
        </ul>
      </div>
    </div>
  );
}
