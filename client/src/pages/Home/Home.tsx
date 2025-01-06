import { useNavigate } from "react-router";
import { Button, Container } from "../../components";
import { HomeBanner } from "../../constants/images.ts";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="d-flex flex-column align-content-center justify-content-center pt-4 pt-md-5">
        <h2 className="mb-md-4 text-center display-2 lh-1">
          <span className="d-block fw-semibold">Scrum Poker</span>for teams
        </h2>

        <p className="m-0 text-black-50 fs-5 text-center mb-3 mb-md-4">
          Easy-to-use and fun story point estimations.
        </p>

        <Button
          className="btn-primary mx-auto px-md-5 py-md-2 mb-4"
          onClick={() => navigate("/new-game")}
        >
          Start a New Game
        </Button>

        <div className="border border-light-subtle px-5 py-4 rounded-4 shadow-sm">
          <img
            src={HomeBanner}
            alt="banner"
            width="346px"
            height="455px"
            className="object-fit-cover h-100 w-100"
          />
        </div>
      </div>
    </Container>
  );
};

export default Home;
