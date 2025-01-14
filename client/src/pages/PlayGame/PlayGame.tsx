import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

import {
  CardDeck,
  CardPercentage,
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
        toast(message || "Room closed.", { icon: "ℹ️" });
        dispatch(resetRoomState());
        dispatch(resetParticipantState());
        navigate("/", { replace: true });
        return;
      }

      // Find the current participant
      const updatedParticipant = room.participants.find(
        (p: ParticipantData) => p.displayName === participant.displayName
      );

      // Dispatch the updated room and participant details
      dispatch(setRoomDetails(room));
      dispatch(setParticipantDetails(updatedParticipant));

      // Check if all participants selected the same card
      const allSameCard =
        room.isCardRevealed &&
        room.participants.every((p: ParticipantData) => p.selectedCard) &&
        room.participants.every(
          (p: ParticipantData) =>
            p.selectedCard === room.participants[0].selectedCard
        );

      if (allSameCard) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

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
          {participant.role === "admin" && room.isCardRevealed && (
            <CardPercentage />
          )}
        </>
      )}
    </Container>
  );
};

export default PlayGame;
