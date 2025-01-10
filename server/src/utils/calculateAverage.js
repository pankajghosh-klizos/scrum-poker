const calculateAverage = (participants) => {
  const validVotes = participants
    .filter(
      (participant) =>
        participant.selectedCard !== null && isNaN(participant.selectedCard)
    )
    .map((participant) => Number(participant.selectedCard));

  if (validVotes.length === 0) return 0;

  const sum = validVotes.reduce((acc, vote) => acc + vote, 0);
  return (sum / validVotes.length).toFixed(1);
};

export default calculateAverage;
