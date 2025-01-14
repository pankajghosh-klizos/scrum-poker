import { useSelector } from "react-redux";
import { ParticipantData } from "../../interfaces";
import Card from "../Card/Card";
import "./CardPercentage.css";

const CardPercentage = () => {
  const { room } = useSelector((state: any) => state.room);

  // Calculate the total number of participants who selected a card
  const totalSelected = room.participants.filter(
    (p: ParticipantData) => p.isCardSelected
  ).length;

  // Create a map of card values and their selection counts
  const cardCountMap: Record<string, number> = {};
  room.participants.forEach((participant: ParticipantData) => {
    if (participant.isCardSelected && participant.selectedCard) {
      cardCountMap[participant.selectedCard] =
        (cardCountMap[participant.selectedCard] || 0) + 1;
    }
  });

  return (
    <div className="card-percentage w-100 border border-light-subtle bg-white rounded-3 shadow-sm p-3 p-md-4">
      <h2 className="fs-4 mb-3">Selected Card Percentage</h2>

      <ul className="list-unstyled d-grid gap-4 m-0 py-2 overflow-hidden overflow-y-auto">
        {Object.entries(cardCountMap).map(([card, count]) => {
          const percentage = ((count / totalSelected) * 100).toFixed(2);
          return (
            <li
              key={card}
              className="d-flex align-items-center gap-2 bg-body-secondary p-2 rounded-3"
            >
              <Card value={card} className="bg-primary text-white" />
              <span className="fs-5">{percentage}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CardPercentage;
