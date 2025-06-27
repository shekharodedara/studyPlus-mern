import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import LiveClassesTable from "./LiveClassesTable";
import { getInstructorLiveClasses } from "../../../services/operations/liveClassesApi";

export default function MyLiveClasses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const result = await getInstructorLiveClasses(token);
      setLiveClasses(result);
      setLoading(false);
    };
    fetchClasses();
  }, []);

  return (
    <div>
      <div className="mb-14 flex justify-between">
        <h1 className="text-4xl font-medium text-richblack-5 font-boogaloo">
          My Live Classes
        </h1>
        <IconBtn
          text="Add Live Class"
          onclick={() => navigate("/dashboard/add-live-class")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {liveClasses && (
        <LiveClassesTable
          classes={liveClasses}
          setClasses={setLiveClasses}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}
