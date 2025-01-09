import { useSelector } from "react-redux";
import Participant from "../Participant/Participant";
import "./PokerTable.css";

const PokerTable = () => {
  const { room } = useSelector((state) => state.room);
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
          <p className="m-0 text-muted fs-5 text-center">Pick your cards!</p>

          {/* <RevealBtn /> */}

          {/* <p className="m-0 fs-5 text-center">
            <span className="d-block">Average Score</span>
            <span className="fw-bold fs-3">0</span>
          </p> */}
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
