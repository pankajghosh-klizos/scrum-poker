import localforage from "localforage";
import toast from "react-hot-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import Button from "./Button";
import Loader from "../Loader/Loader";
import { leaveRoom } from "../../api";
import { resetRoomState } from "../../store/slices/room.slice";
import { resetParticipantState } from "../../store/slices/participant.slice";

const LeaveRoomBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleRoomLeave = async () => {
    setLoading(true);
    try {
      const res = await leaveRoom();

      if (!res?.success) {
        toast.error("Error leaving room.");
        return;
      }

      localforage.clear();
      dispatch(resetRoomState());
      dispatch(resetParticipantState());
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
