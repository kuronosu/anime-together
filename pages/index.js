import Router from "next/router";
import { NEW_ROOM, ROOM_CONNECTED } from "../constants/events";
import styles from "../styles/Home.module.css";
import useSocket from "../utils/use-socket";

export default function Home() {
  const s = useSocket();
  s?.on(ROOM_CONNECTED, ({connected, room}) => {
    typeof window !== 'undefined' && connected && Router.push(`/room/${room}`)
  })
  const newRoom = () => {
    s?.emit(NEW_ROOM);
  }
  return <button onClick={newRoom}>New room</button>;
}
