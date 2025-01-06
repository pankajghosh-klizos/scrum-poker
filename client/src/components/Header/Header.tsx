import { Link, useLocation, useNavigate } from "react-router";
import { Button, Container } from "../../components";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-bottom border-light-subtle w-100">
      <Container>
        <nav className="d-flex gap-5 align-items-center justify-content-between py-3 py-md-4">
          <h2 className="m-0 fs-2 fw-bold">
            <Link to="/" className="text-decoration-none text-dark">
              Scrum Poker
            </Link>
          </h2>
          {location.pathname === "/" && (
            <Button
              className="btn-primary px-3"
              onClick={() => navigate("/new-game")}
            >
              Start New Game
            </Button>
          )}
        </nav>
      </Container>
    </header>
  );
};

export default Header;
