import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

const PlayGame = () => {
  const { socket } = useSocket();

  const CONNECTED_EVENT = "connected";
  const DISCONNECT_EVENT = "disconnect";

  const onConnect = () => {
    console.log("connected");
  };

  const onDisconnect = () => {
    console.log("disconnected");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(CONNECTED_EVENT, onConnect);
    socket.on(DISCONNECT_EVENT, onDisconnect);
  }, []);

  return <div>PlayGame</div>;
};

export default PlayGame;
