import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import {
  CardDeck,
  Container,
  Loader,
  PokerTable,
  VoteAgainBtn,
} from "../../components";
import { ParticipantData } from "../../interfaces";
import { resetRoomState, setRoomDetails } from "../../store/slices/room.slice";
import {
  resetParticipantState,
  setParticipantDetails,
} from "../../store/slices/participant.slice";
import { useNavigate } from "react-router";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});

const PlayGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.participant);

  useEffect(() => {
    // Join the room when the component mounts
    socket.emit("joinRoom", room.roomId);

    // Listen for the `roomUpdated` event
    socket.on("roomUpdated", (data) => {
      console.log("Room updated:", data);

      const { message, room } = data;

      if (room.status === "finished") {
        toast(message || "Room closed.", {
          icon: "ℹ️",
        });

        dispatch(resetRoomState());
        dispatch(resetParticipantState());
        navigate("/", { replace: true });
        return;
      }

      const updatedParticipant = room.participants.find(
        (p: ParticipantData) => p.displayName === participant.displayName
      );

      dispatch(setRoomDetails(room));
      dispatch(setParticipantDetails(updatedParticipant));
      toast.success(message || "Room updated.");
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.off("roomUpdated");
      socket.emit("leaveRoom", room.roomId);
    };
  }, [room.roomId, dispatch]);

  return (
    <Container
      className="d-flex justify-content-center align-items-center flex-column gap-5 py-5"
      style={{ minHeight: "85vh" }}
    >
      {!room && !participant ? (
        <Loader revert />
      ) : (
        <>
          <PokerTable />
          <CardDeck />
          {participant.role === "admin" && room.isCardRevealed && (
            <VoteAgainBtn />
          )}
        </>
      )}
    </Container>
  );
};

export default PlayGame;
