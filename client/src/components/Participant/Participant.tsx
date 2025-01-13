import Card from "../Card/Card";
import { ParticipantProps, RoomData } from "../../interfaces";
import { useSelector } from "react-redux";

const Participant = ({ participant }: ParticipantProps) => {
  const { room } = useSelector((state: { room: RoomData }) => state.room);

  return (
    <div className="d-flex flex-column gap-2">
      <Card
        className={`pe-none border-light-subtle ${
          participant?.role === "admin" ? "bg-success text-white" : ""
        } ${
          participant?.role === "participant" ? "bg-primary text-white" : ""
        }`}
        value={participant?.selectedCard ?? ""}
        checked={participant?.isCardSelected && !room?.isCardRevealed}
      />
      {participant && (
        <p className="m-0 fs-5 text-center">
          {participant?.displayName.split(" ")[0]}
        </p>
      )}
    </div>
  );
};

export default Participant;
