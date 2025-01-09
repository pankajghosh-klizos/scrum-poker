import { Container, Loader, PokerTable, VoteAgainBtn } from "../../components";
import { useSelector } from "react-redux";

const PlayGame = () => {
  const { room } = useSelector((state: any) => state.room);
  const { participant } = useSelector((state: any) => state.participant);

  return (
    <Container
      className="d-flex justify-content-center align-items-center flex-column gap-5"
      style={{ minHeight: "85vh" }}
    >
      {!room && !participant ? (
        <Loader revert />
      ) : (
        <>
          <PokerTable />
          {participant.role === "admin" && <VoteAgainBtn />}
        </>
      )}
    </Container>
  );
};

export default PlayGame;
