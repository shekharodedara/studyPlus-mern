import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdNavigateNext } from "react-icons/md";
import IconBtn from "../../../../common/IconBtn";
import { setStep, setLiveClass } from "../../../../../slices/liveClassSlice";
import { useState, useEffect } from "react";

export default function LiveClassSettingsForm() {
  const dispatch = useDispatch();
  const { liveClass } = useSelector((state) => state.liveClass);
  const [recurrenceType, setRecurrenceType] = useState("none");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endAfter, setEndAfter] = useState(5);
  const [selectedDays, setSelectedDays] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getDayIndex = (day) =>
    daysOfWeek.indexOf(day) + 1 === 7 ? 0 : daysOfWeek.indexOf(day) + 1;

  useEffect(() => {
    if (!startDate || !startTime) {
      setSessions([]);
      return;
    }
    let generated = [];
    let current = new Date(`${startDate}T${startTime}`);
    let count = 0;
    if (recurrenceType === "none") {
      generated = [
        {
          startTime: current.toISOString(),
          lessonTitle: sessions[0]?.lessonTitle || "",
          lessonDescription: sessions[0]?.lessonDescription || "",
        },
      ];
      setSessions(generated);
      return;
    }
    if (recurrenceType === "daily") {
      while (count < endAfter && count < 100) {
        generated.push({
          startTime: current.toISOString(),
          lessonTitle: "",
          lessonDescription: "",
        });
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
        count++;
      }
    } else if (recurrenceType === "weekly" || recurrenceType === "custom") {
      if (!selectedDays.length) {
        setSessions([]);
        return;
      }
      let weekDaysIdx = selectedDays.map(getDayIndex);
      let temp = new Date(current);
      let weeks = endAfter;
      let addedWeeks = 0;
      let generatedSessions = [];
      while (addedWeeks < weeks && generatedSessions.length < 100) {
        for (let i = 0; i < 7; i++) {
          let day = (temp.getDay() + i) % 7;
          let date = new Date(temp);
          date.setDate(temp.getDate() + i);
          if (weekDaysIdx.includes(day)) {
            if (date < current) continue;
            const sessionDateTime = new Date(date);
            sessionDateTime.setHours(
              Number(startTime.split(":")[0]),
              Number(startTime.split(":")[1]),
              0,
              0
            );
            generatedSessions.push({
              startTime: sessionDateTime.toISOString(),
              lessonTitle: "",
              lessonDescription: "",
            });
          }
        }
        temp.setDate(temp.getDate() + 7);
        addedWeeks++;
      }
      generatedSessions.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
      generatedSessions = generatedSessions.slice(
        0,
        weeks * weekDaysIdx.length
      );
      setSessions(generatedSessions);
      return;
    } else if (recurrenceType === "monthly") {
      let temp = new Date(current);
      while (count < endAfter && count < 100) {
        generated.push({
          startTime: temp.toISOString(),
          lessonTitle: "",
          lessonDescription: "",
        });
        temp.setMonth(temp.getMonth() + 1);
        count++;
      }
    }
    if (recurrenceType !== "weekly" && recurrenceType !== "custom") {
      setSessions(generated);
    }
  }, [recurrenceType, startDate, startTime, endAfter, selectedDays]);

  const handleSessionChange = (idx, field, value) => {
    setSessions((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const { handleSubmit } = useForm({});
  const todayStr = new Date().toISOString().slice(0, 10);

  const onSubmit = (data) => {
    if (startDate < todayStr) {
      setError("Start date must be today or a future date.");
      return;
    }
    if (recurrenceType !== "none" && sessions.length === 0) {
      setError("No sessions generated. Please check your recurrence settings.");
      return;
    }
    for (const s of sessions) {
      if (!s.lessonTitle.trim() || !s.lessonDescription.trim()) {
        setError("All lessons must have a title and description.");
        return;
      }
    }
    setError("");
    dispatch(
      setLiveClass({
        ...liveClass,
        ...data,
        recurrenceType,
        startDate,
        endAfter,
        selectedDays,
        sessions,
        startTime: sessions.length > 0 ? sessions[0].startTime : "",
      })
    );
    dispatch(setStep(3));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="recurrence-type"
          className="text-sm text-richblack-5 font-semibold"
        >
          Repeat <sup className="text-pink-200">*</sup>
        </label>
        <select
          id="recurrence-type"
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value)}
          className="form-style w-full"
        >
          <option value="none">Once</option>
          <option value="daily">Every day</option>
          <option value="weekly">Every week</option>
          <option value="monthly">Every month</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col space-y-2 flex-1">
          <label htmlFor="start-date" className="text-sm text-richblack-5">
            Start Date <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-style w-full"
            min={todayStr}
            required
          />
        </div>
        <div className="flex flex-col space-y-2 flex-1">
          <label htmlFor="start-time" className="text-sm text-richblack-5">
            Start Time <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-style w-full"
            required
          />
        </div>
      </div>
      {recurrenceType !== "none" && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col space-y-2 flex-1">
            <label className="text-sm text-richblack-5">End</label>
            <div className="flex items-center gap-2">
              <input type="radio" id="end-after" checked={true} readOnly />
              <label htmlFor="end-after" className="text-sm">
                After
              </label>
              <input
                type="number"
                min={1}
                value={endAfter}
                onChange={(e) => setEndAfter(Number(e.target.value))}
                className="form-style w-20"
              />
              <span>occurrences</span>
            </div>
          </div>
          {(recurrenceType === "weekly" || recurrenceType === "custom") && (
            <div className="flex flex-col space-y-2 flex-1">
              <label className="text-sm text-richblack-5">Days</label>
              <div className="flex flex-wrap gap-4">
                {daysOfWeek.map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 text-richblack-5 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => {
                        setSelectedDays((prev) =>
                          prev.includes(day)
                            ? prev.filter((d) => d !== day)
                            : [...prev, day]
                        );
                      }}
                      className="accent-yellow-400 w-4 h-4"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {error && <div className="text-pink-200 text-sm">{error}</div>}
      {sessions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2 text-richblack-5">
            Session Schedule
          </h3>
          <ul className="space-y-2">
            {sessions.map((session, idx) => {
              const dateObj = new Date(session.startTime);
              const dayName = dateObj.toLocaleDateString(undefined, {
                weekday: "long",
              });
              const time12 = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              return (
                <li
                  key={idx}
                  className="border border-richblack-700 rounded-lg p-3 bg-richblack-800 shadow-sm"
                >
                  <div className="mb-2">
                    <span className="font-bold text-yellow-300 text-xs md:text-sm">
                      {dayName}, {dateObj.toLocaleDateString()}{" "}
                      <span className="text-richblack-100">at</span> {time12}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      id={`lesson-title-${idx}`}
                      type="text"
                      placeholder="Lesson Title"
                      value={session.lessonTitle}
                      onChange={(e) =>
                        handleSessionChange(idx, "lessonTitle", e.target.value)
                      }
                      className="form-style w-full text-sm px-2 py-1 h-8 text-richblack-5 placeholder:text-richblack-400 border border-richblack-600 bg-richblack-900 rounded focus:border-yellow-200 focus:ring-yellow-200"
                      required
                    />
                    <textarea
                      id={`lesson-desc-${idx}`}
                      placeholder="Lesson Description"
                      value={session.lessonDescription}
                      onChange={(e) =>
                        handleSessionChange(
                          idx,
                          "lessonDescription",
                          e.target.value
                        )
                      }
                      className="form-style w-full min-h-[28px] md:min-h-[24px] text-sm px-2 py-1 text-richblack-5 placeholder:text-richblack-400 border border-richblack-600 bg-richblack-900 rounded focus:border-yellow-200 focus:ring-yellow-200 resize-none"
                      required
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 text-richblack-900 text-xs bg-yellow-100 rounded p-2">
            <strong>Summary:</strong>{" "}
            {recurrenceType !== "none"
              ? `This class will run ${
                  recurrenceType === "daily"
                    ? "every day"
                    : recurrenceType === "weekly"
                    ? `every week on ${selectedDays.join(", ")}`
                    : recurrenceType === "monthly"
                    ? "every month"
                    : `on ${selectedDays.join(", ")}`
                }, starting ${startDate} at ${startTime}, for ${
                  sessions.length
                } session(s).`
              : "This class does not repeat."}
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <IconBtn text="Next">
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}
