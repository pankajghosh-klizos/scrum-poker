import { useSelector } from "react-redux";
import Button from "./Button";
import toast from "react-hot-toast";

const InviteRoomBtn = () => {
  const { room } = useSelector((state: any) => state.room);
  const baseUrl = window.location.origin;

  const handleInviteRoom = async () => {
    const url = `${baseUrl}/room/${room._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Button
      onClick={handleInviteRoom}
      className="btn-secondary px-3 d-flex gap-3 align-items-center justify-content-center"
    >
      <span>Invite</span>
    </Button>
  );
};

export default InviteRoomBtn;
