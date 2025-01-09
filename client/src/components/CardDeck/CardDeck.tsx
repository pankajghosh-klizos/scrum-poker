import { useSelector } from "react-redux";
import Card from "../Card/Card";

const CardDeck = () => {
  const { room } = useSelector((state: any) => state.room);
  const cardOptions = room?.votingSystem.split(", ");
  const firstOption = cardOptions[0]?.slice(-1);
  const lastOption = cardOptions[cardOptions.length - 1]?.slice(0, 1);

  return (
    <ul className="list-unstyled d-flex flex-wrap gap-2 justify-content-center">
      <li>
        <Card value={firstOption} />
      </li>
      {cardOptions.slice(1, -1).map((option: string) => (
        <li key={option}>
          <Card value={option} />
        </li>
      ))}
      <li>
        <Card value={lastOption} />
      </li>
    </ul>
  );
};

export default CardDeck;
