import { FC } from "react";
import Card from "../Card/Card";

const Participant: FC = ({ participant }: any) => {
  return (
    <div className="d-flex flex-column gap-2">
      <Card
        className={`pe-none border-light-subtle ${
          participant?.role === "admin" ? "bg-success" : ""
        } ${participant?.role === "participant" ? "bg-primary" : ""}`}
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
