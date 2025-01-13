import toast from "react-hot-toast";
import { closeRoom } from "../../api";
import Button from "./Button";
import { useNavigate } from "react-router";
import { useState } from "react";
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { resetRoomState } from "../../store/slices/room.slice";
import { resetParticipantState } from "../../store/slices/participant.slice";
import localforage from "localforage";

const CloseRoomBtn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleRoomClose = async () => {
    setLoading(true);
    try {
      const res = await closeRoom();

      if (!res?.success) {
        toast.error("Error closing room.");
        return;
      }

      localforage.clear();
      dispatch(resetRoomState());
      dispatch(resetParticipantState());
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error closing room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="btn-primary px-3 d-flex gap-3 align-items-center justify-content-center"
      onClick={handleRoomClose}
      disabled={loading}
    >
      <span>End</span>
      {loading && <Loader size="small" />}
    </Button>
  );
};

export default CloseRoomBtn;
