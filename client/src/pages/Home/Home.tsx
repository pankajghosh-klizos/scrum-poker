import { useNavigate } from "react-router";
import { Button, Container } from "../../components";
import { HomeBanner } from "../../constants/images.ts";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="d-flex flex-column align-items-center justify-content-center pt-5 gap-3 gap-md-4">
        <h2 className="m-0 text-center display-2 lh-1">
          <span className="d-block fw-semibold">Scrum Poker</span>for teams
        </h2>

        <p className="m-0 text-black-50 fs-5 text-center">
          Easy-to-use and fun story point estimations.
        </p>

        <Button
          className="btn-primary px-5 py-md-2 mb-2"
          onClick={() => navigate("/new-game")}
        >
          Start a New Game
        </Button>

        <div className="border border-light-subtle px-5 py-4 rounded-4 shadow-sm mb-4">
          <img
            src={HomeBanner}
            alt="banner"
            width="400px"
            className="object-fit-cover w-100"
          />
        </div>
      </div>
    </Container>
  );
};

export default Home;
