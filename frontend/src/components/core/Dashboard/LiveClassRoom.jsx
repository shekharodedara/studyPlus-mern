import { HMSPrebuilt } from "@100mslive/roomkit-react";
import { useParams } from "react-router-dom";

export default function LiveClassRoom() {
  const { roomCode } = useParams();

  if (!roomCode) {
    return <p className="text-white">Room Code not found.</p>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <HMSPrebuilt roomCode={roomCode} />
    </div>
  );
}