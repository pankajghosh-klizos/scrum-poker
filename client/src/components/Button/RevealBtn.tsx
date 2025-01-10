import { useNavigate } from "react-router";
import Button from "./Button";
import { useState } from "react";
import { revealCard } from "../../api";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

const RevealBtn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRevealCards = async () => {
    setLoading(true);
    try {
      const res = await revealCard();

      if (!res?.success) {
        toast.error("Error reveal cards.");
        return;
      }

      toast.success("Cards revealed.");
    } catch (error) {
      console.error("Error reveal cards:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      className="btn-primary px-3 py-2"
      onClick={handleRevealCards}
      disabled={loading}
    >
      <span>Reveal your cards!</span>
      {loading && <Loader size="small" />}
    </Button>
  );
};

export default RevealBtn;
