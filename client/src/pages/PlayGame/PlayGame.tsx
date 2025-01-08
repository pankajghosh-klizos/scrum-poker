import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";

const PlayGame = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log(socket.connected); // true
    });

    socket.on("disconnect", () => {
      console.log(socket.connected); // false
    });
  }, []);

  return <div>PlayGame</div>;
};

export default PlayGame;
