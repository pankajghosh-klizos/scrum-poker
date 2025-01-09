import { useSelector } from "react-redux";
import Card from "../Card/Card";
import { useState } from "react";

const CardDeck = () => {
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.room);
  const cardOptions = room?.votingSystem.split(", ");
  const firstOption = cardOptions[0]?.slice(-1);
  const lastOption = cardOptions[cardOptions.length - 1]?.slice(0, 1);
  const [loading, setLoading] = useState(false);

  const handleVote = (value: string) => {
    console.log(value);
  };

  return (
    <ul
      className={`list-unstyled d-flex flex-wrap gap-2 justify-content-center ${
        participant?.selectedCard ? "pe-none" : ""
      }`}
    >
      <li>
        <Card value={firstOption} onClick={() => handleVote(firstOption)} />
      </li>
      {cardOptions.slice(1, -1).map((option: string) => (
        <li key={option}>
          <Card value={option} onClick={() => handleVote(option)} />
        </li>
      ))}
      <li>
        <Card value={lastOption} onClick={() => handleVote(lastOption)} />
      </li>
    </ul>
  );
};

export default CardDeck;
