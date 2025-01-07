import { useSelector } from "react-redux";

const PlayGame = () => {
  const room = useSelector((state: any) => state.room);
  const participant = useSelector((state: any) => state.participant);

  console.log(participant);
  console.log(room);
  return <div>PlayGame</div>;
};

export default PlayGame;
