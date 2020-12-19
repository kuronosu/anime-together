import Router from "next/router";
import { useEffect } from "react";
import { NEW_ROOM, ROOM_CONNECTED } from "../constants/events";
import { ws } from "../utils/socket-context";

function Home() {
  useEffect(() => {
    ws?.on(ROOM_CONNECTED, ({ connected, room }) => {
      typeof window !== "undefined" &&
        connected &&
        Router.push(`/room/${room}`);
    });
  }, []);
  const newRoom = () => {
    ws?.emit(NEW_ROOM);
  };
  return <button onClick={newRoom}>New room</button>;
}

export default Home;
