import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiRefreshCw } from "react-icons/fi";

import Card from "../Card/Card";
import { selectCard } from "../../api";
import { setSelectedCard } from "../../store/slices/participant.slice";
import "./CardDeck.css";

const CardDeck = () => {
  const dispatch = useDispatch();
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.participant);

  const cardOptions = room?.votingSystem.split(", ");
  const firstOption = cardOptions[0]?.slice(-1);
  const lastOption = cardOptions[cardOptions.length - 1]?.slice(0, 1);
  const [loadingCard, setLoadingCard] = useState<string | null>(null);

  const handleVote = async (data: { card: string }) => {
    setLoadingCard(data.card); // Set the card that is being loaded
    try {
      dispatch(setSelectedCard(data.card));
      const res = await selectCard(data);

      if (!res?.success) {
        toast.error("Error selecting card");
        dispatch(setSelectedCard(""));
      }
    } catch (error) {
      console.error("Error selecting card", error);
      toast.error("Error selecting card");
      dispatch(setSelectedCard(""));
    } finally {
      setLoadingCard(null); // Reset loading state
    }
  };

  return (
    <ul
      className={`card-deck list-unstyled d-flex flex-wrap gap-2 justify-content-center ${
        participant?.isCardSelected || room?.average > 0
          ? "pe-none opacity-75"
          : ""
      }`}
    >
      <li className="d-flex position-relative align-items-center justify-content-center">
        <Card
          value={firstOption}
          onClick={() => handleVote({ card: firstOption })}
          className={`${
            participant?.selectedCard === firstOption
              ? "bg-secondary-subtle"
              : ""
          }`}
        />
        {loadingCard === firstOption && (
          <span className="position-absolute opacity-50">
            <FiRefreshCw className="spin" />
          </span>
        )}
      </li>

      {cardOptions.slice(1, -1).map((option: string) => (
        <li
          key={option}
          className="d-flex position-relative align-items-center justify-content-center"
        >
          <Card
            value={option}
            onClick={() => handleVote({ card: option })}
            className={`${
              participant?.selectedCard === option ? "bg-secondary-subtle" : ""
            }`}
            disabled={loadingCard !== null}
          />
          {loadingCard === option && (
            <span className="position-absolute opacity-50">
              <FiRefreshCw className="spin" />
            </span>
          )}
        </li>
      ))}

      <li className="d-flex position-relative align-items-center justify-content-center">
        <Card
          value={lastOption}
          onClick={() => handleVote({ card: lastOption })}
          className={`${
            participant?.selectedCard === lastOption
              ? "bg-secondary-subtle"
              : ""
          }`}
        />
        {loadingCard === lastOption && (
          <span className="position-absolute opacity-50">
            <FiRefreshCw className="spin" />
          </span>
        )}
      </li>
    </ul>
  );
};

export default CardDeck;
