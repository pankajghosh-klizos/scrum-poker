import Participant from "../Participant/Participant";
import "./PokerTable.css";

const PokerTable = () => {
  return (
    <div className="d-grid gap-3 gap-md-4">
      <div className="participants d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        <Participant />
        <Participant />
        <Participant />
        <Participant />
      </div>

      <div className="d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        <Participant />

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

        <Participant />
      </div>

      <div className="participants d-flex gap-3 gap-md-5 align-items-center justify-content-center">
        <Participant />
        <Participant />
        <Participant />
        <Participant />
      </div>
    </div>
  );
};

export default PokerTable;
