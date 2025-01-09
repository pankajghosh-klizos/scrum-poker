import { useSelector } from "react-redux";
import Button from "./Button";
import toast from "react-hot-toast";
import ClipboardJS from "clipboard";

const InviteRoomBtn = () => {
  const { room } = useSelector((state: any) => state.room);
  const baseUrl = window.location.origin;

  const handleInviteRoom = async () => {
    const clipboard = new ClipboardJS(".btn-invite", {
      text: () => `${baseUrl}/join/${room.roomId}`,
    });

    clipboard.on("success", () => {
      toast.success("Invite link copied.");
      clipboard.destroy(); // Clean up after success
    });

    clipboard.on("error", () => {
      toast.error("Failed to copy invite link.");
      clipboard.destroy();
    });
  };

  return (
    <Button
      onClick={handleInviteRoom}
      className="btn-invite btn-secondary px-3 d-flex gap-3 align-items-center justify-content-center"
    >
      <span>Invite</span>
    </Button>
  );
};

export default InviteRoomBtn;
