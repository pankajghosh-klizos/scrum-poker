import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import Card from "../Card/Card";
import { selectCard } from "../../api";
import { setSelectedCard } from "../../store/slices/participant.slice";

const CardDeck = () => {
  const dispatch = useDispatch();
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.participant);

  const cardOptions = room?.votingSystem.split(", ");
  const firstOption = cardOptions[0]?.slice(-1);
  const lastOption = cardOptions[cardOptions.length - 1]?.slice(0, 1);
  const [loading, setLoading] = useState(false);

  const handleVote = async (data: { card: string }) => {
    setLoading(true);
    try {
      dispatch(setSelectedCard(data.card));
      const res = await selectCard(data);

      if (!res?.success) {
        toast.error("Error select card");
        dispatch(setSelectedCard(""));
      }
    } catch (error) {
      console.error("Error select card", error);
      toast.error("Error select card");
      dispatch(setSelectedCard(""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ul
      className={`list-unstyled d-flex flex-wrap gap-2 justify-content-center ${
        participant?.isCardSelected || room?.average > 0
          ? "pe-none opacity-75"
          : ""
      }`}
    >
      <li>
        <Card
          value={firstOption}
          onClick={() => handleVote({ card: firstOption })}
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
            onClick={() => handleVote({ card: option })}
            className={`${
              participant?.selectedCard == option ? "bg-secondary-subtle" : ""
            }`}
            disabled={loading}
          />
        </li>
      ))}
      <li>
        <Card
          value={lastOption}
          onClick={() => handleVote({ card: lastOption })}
          className={`${
            participant?.selectedCard == lastOption ? "bg-secondary-subtle" : ""
          }`}
        />
      </li>
    </ul>
  );
};

export default CardDeck;
