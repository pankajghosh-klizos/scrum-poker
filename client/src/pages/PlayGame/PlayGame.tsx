import { Container, Loader, PokerTable, VoteAgainBtn } from "../../components";
import useSocket from "../../hooks/useSocket";

const PlayGame = () => {
  const { error, isConnected } = useSocket();

  if (error) {
    return (
      <Container>
        <p className="m-0 text-center">{error}</p>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center flex-column gap-5"
      style={{ minHeight: "85vh" }}
    >
      {isConnected ? (
        <>
          <PokerTable />
          <VoteAgainBtn />
        </>
      ) : (
        <Loader revert />
      )}
    </Container>
  );
};

export default PlayGame;
