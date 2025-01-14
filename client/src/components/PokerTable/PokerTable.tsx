import { useSelector } from "react-redux";

import Participant from "../Participant/Participant";
import RevealBtn from "../Button/RevealBtn";
import "./PokerTable.css";

const PokerTable = () => {
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.participant);
  console.log(room);

  return (
    <div className="d-grid gap-3 gap-md-4">
      {/* Top Row of Participants */}
      <div className="participants d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        {[6, 2, 4, 8].map((pIndex) => (
          <Participant participant={room?.participants[pIndex]} key={pIndex} />
        ))}
      </div>

      {/* Poker Table Section */}
      <div className="d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        <Participant participant={room?.participants[0]} />

        <div className="poker-table d-flex align-items-center justify-content-center bg-primary-subtle rounded-4 p-md-5">
          {room.average == 0 && !participant.isCardSelected && (
            <p className="m-0 text-muted fs-5 text-center">Pick your cards!</p>
          )}

          {room.average > 0 && (
            <p className="m-0 fs-5 text-center">
              <span className="d-block">Average Score</span>
              <span className="fw-bold fs-3">{room.average}</span>
            </p>
          )}

          {participant.role == "admin" &&
            participant.isCardSelected &&
            !room.isCardRevealed && <RevealBtn />}
        </div>

        <Participant participant={room?.participants[1]} />
      </div>

      {/* Bottom Row of Participants */}
      <div className="participants d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        {[9, 3, 5, 7].map((pIndex) => (
          <Participant participant={room?.participants[pIndex]} key={pIndex} />
        ))}
      </div>
    </div>
  );
};

export default PokerTable;
