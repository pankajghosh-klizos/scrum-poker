import { useSelector } from "react-redux";
import Participant from "../Participant/Participant";
import "./PokerTable.css";
import RevealBtn from "../Button/RevealBtn";

const PokerTable = () => {
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.participant);

  return (
    <div className="d-grid gap-3 gap-md-4">
      <div className="participants d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        <Participant participant={room?.participants[6]} />
        <Participant participant={room?.participants[2]} />
        <Participant participant={room?.participants[4]} />
        <Participant participant={room?.participants[8]} />
      </div>

      <div className="d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        <Participant participant={room?.participants[0]} />

        <div
          className="poker-table d-flex align-items-center justify-content-center bg-primary-subtle rounded-4 p-5"
          style={{}}
        >
          {!participant.isCardSelected && (
            <p className="m-0 text-muted fs-5 text-center">Pick your cards!</p>
          )}
          {participant.role == "admin" &&
            participant.isCardSelected &&
            !room.isCardRevealed && <RevealBtn />}

          {room.average > 0 && (
            <p className="m-0 fs-5 text-center">
              <span className="d-block">Average Score</span>
              <span className="fw-bold fs-3">{room.average}</span>
            </p>
          )}
        </div>

        <Participant participant={room?.participants[1]} />
      </div>

      <div className="participants d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        <Participant participant={room?.participants[9]} />
        <Participant participant={room?.participants[3]} />
        <Participant participant={room?.participants[5]} />
        <Participant participant={room?.participants[7]} />
      </div>
    </div>
  );
};

export default PokerTable;
