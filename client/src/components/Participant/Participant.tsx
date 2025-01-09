import { FC } from "react";
import Card from "../Card/Card";

const Participant: FC = ({ participant }) => {
  return (
    <div className="d-flex flex-wrap justify-content-around">
      <Card />
      {participant && <p className="m-0">{participant?.displayName}</p>}
    </div>
  );
};

export default Participant;
