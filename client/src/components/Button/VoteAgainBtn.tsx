import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import Button from "./Button";
import { useState } from "react";
import { voteAgain } from "../../api";

const VoteAgainBtn = () => {
  const [loading, setLoading] = useState(false);

  const handleVoteAgain = async () => {
    setLoading(true);
    try {
      const res = await voteAgain();

      if (!res?.success) {
        toast.error("Error vote again.");
        return;
      }
    } catch (error) {
      console.error("Error vote again:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      onClick={handleVoteAgain}
      disabled={loading}
      className="btn-outline-primary px-3 py-2 border-2"
    >
      Vote Again
      {loading && <Loader size="small" revert />}
    </Button>
  );
};

export default VoteAgainBtn;
