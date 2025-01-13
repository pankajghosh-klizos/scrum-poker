import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import localforage from "localforage";

import Loader from "../Loader/Loader";
import { getRoom } from "../../api";
import { setRoomDetails } from "../../store/slices/room.slice";
import { setParticipantDetails } from "../../store/slices/participant.slice";
import { ProtectedRouteProps } from "../../interfaces";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateRoom = async () => {
      try {
        const res = await getRoom();

        if (!res.success) {
          toast.error("Room not found.");
          navigate("/", { replace: true });
          localforage.clear();
          return;
        }

        dispatch(setRoomDetails(res.data.room));
        dispatch(setParticipantDetails(res.data.participant));
      } catch (error) {
        console.error("Error validating room:", error);
        toast.error("Room closed or Invalid Room.");
        navigate("/", { replace: true });
        localforage.clear();
      } finally {
        setLoading(false);
      }
    };

    validateRoom();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div
        className="w-100 d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <Loader revert />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
