import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import LiveClassInformationForm from "./LiveClassForms/LiveClassInformationForm";
import LiveClassSettingsForm from "./LiveClassForms/LiveClassSettingsForm";
import PublishLiveClass from "./LiveClassForms/PublishLiveClass";

export default function RenderLiveClassSteps() {
  const { step } = useSelector((state) => state.liveClass);
  const steps = [
    { id: 1, title: "Live Class Info" },
    { id: 2, title: "Live Settings" },
    { id: 3, title: "Publish" },
  ];

  return (
    <>
      <div className="relative mb-2 flex w-full select-none justify-center items-center">
        {steps.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="flex flex-col items-center">
              <div
                className={`grid aspect-square w-[34px] place-items-center rounded-full border-[1px]
                  ${
                    step === item.id
                      ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                      : "border-richblack-700 bg-richblack-800 text-richblack-300"
                  }
                  ${step > item.id ? "bg-yellow-50 text-yellow-50" : ""}
                `}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`h-[2px] w-[33%] border-b-2 border-dashed 
                  ${
                    step > item.id ? "border-yellow-50" : "border-richblack-500"
                  }
                `}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div
            key={item.id}
            className="sm:min-w-[130px] flex flex-col items-center gap-y-2"
          >
            <p
              className={`text-sm ${
                step >= item.id ? "text-richblack-5" : "text-richblack-500"
              }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>
      {step === 1 && <LiveClassInformationForm />}
      {step === 2 && <LiveClassSettingsForm />}
      {step === 3 && <PublishLiveClass />}
    </>
  );
}
