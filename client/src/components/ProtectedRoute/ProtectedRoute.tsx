import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import { getRoom } from "../../api";
import { useNavigate } from "react-router";
import { setRoom } from "../../store/slices/room.slice";
import { setParticipant } from "../../store/slices/participant.slice";
import toast from "react-hot-toast";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const validateRoom = async () => {
    try {
      const response = await getRoom();
      if (!response.data.success) {
        toast.error(response.data.message || "Error while validating room.");
        navigate("/", { replace: true });
      }

      const { room, participant } = response.data.data;

      dispatch(setRoom(room));
      dispatch(setParticipant(participant));
    } catch (error) {
      console.log("Error validate room.", error);
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateRoom();
  }, []);

  return loading ? (
    <div
      className="w-100 d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Loader revert />
    </div>
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoute;
