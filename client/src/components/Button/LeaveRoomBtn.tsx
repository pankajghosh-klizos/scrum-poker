import localforage from "localforage";
import Loader from "../Loader/Loader";
import Button from "./Button";
import { clearRoom } from "../../store/slices/room.slice";
import toast from "react-hot-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { leaveRoom } from "../../api";
import { clearParticipant } from "../../store/slices/participant.slice";

const LeaveRoomBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleRoomLeave = async () => {
    setLoading(true);

    try {
      const response = await leaveRoom();

      if (!response?.data?.success) {
        toast.error(response?.data?.message || "Error while leaving room.");
        return;
      }

      localforage.removeItem("accessToken");
      dispatch(clearRoom());
      dispatch(clearParticipant());
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error leaving room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="btn-primary px-3 d-flex gap-3 align-items-center justify-content-center"
      onClick={handleRoomLeave}
      disabled={loading}
    >
      <span>Leave</span>
      {loading && <Loader size="small" />}
    </Button>
  );
};

export default LeaveRoomBtn;
