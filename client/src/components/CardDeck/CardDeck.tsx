import { useSelector } from "react-redux";
import Card from "../Card/Card";

const CardDeck = () => {
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.room);
  const cardOptions = room?.votingSystem.split(", ");
  const firstOption = cardOptions[0]?.slice(-1);
  const lastOption = cardOptions[cardOptions.length - 1]?.slice(0, 1);

  const handleVote = (value: string) => {
    console.log(value);
  };

  return (
    <ul
      className={`list-unstyled d-flex flex-wrap gap-2 justify-content-center ${
        participant?.selectedCard ? "pe-none opacity-50" : ""
      }`}
    >
      <li>
        <Card
          value={firstOption}
          onClick={() => handleVote(firstOption)}
          className={`${
            participant?.selectedCard == firstOption
              ? "bg-secondary-subtle"
              : ""
          }`}
        />
      </li>
      {cardOptions.slice(1, -1).map((option: string) => (
        <li key={option}>
          <Card
            value={option}
            onClick={() => handleVote(option)}
            className={`${
              participant?.selectedCard == option ? "bg-secondary-subtle" : ""
            }`}
          />
        </li>
      ))}
      <li>
        <Card
          value={lastOption}
          onClick={() => handleVote(lastOption)}
          className={`${
            participant?.selectedCard == lastOption ? "bg-secondary-subtle" : ""
          }`}
        />
      </li>
    </ul>
  );
};

export default CardDeck;
