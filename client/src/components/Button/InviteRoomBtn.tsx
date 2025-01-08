import { useSelector } from "react-redux";
import Button from "./Button";
import toast from "react-hot-toast";

const InviteRoomBtn = () => {
  const { room } = useSelector((state: any) => state.room);
  const baseUrl = window.location.origin;

  const handleInviteRoom = async () => {
    await navigator.clipboard
      .writeText(`${baseUrl}/join/${room.roomId}`)
      .then(() => {
        toast.success("Invite link copied.");
      });
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
