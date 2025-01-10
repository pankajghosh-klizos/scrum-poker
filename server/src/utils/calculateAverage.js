const calculateAverage = (participants) => {
  const validVotes = participants
    .filter(
      (participant) =>
        participant.selectedCard !== null &&
        !isNaN(Number(participant.selectedCard))
    )
    .map((participant) => Number(participant.selectedCard));

  console.log(participants);
  console.log(validVotes);

  if (participants.length === 0) return 0;

  const sum = validVotes.reduce((acc, vote) => acc + vote, 0);
  return (sum / participants.length).toFixed(1);
};

export default calculateAverage;
