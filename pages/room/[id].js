import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Loader from "../../componets/loader";
import { JOIN_ROOM, ROOM_CONNECTED } from "../../constants/events";
import useSocket from "../../utils/use-socket";

// let socket;

function useLoader(handle) {
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(true);
  handle(setLoading, setSucces);
  return [loading, succes];
}

const Room = () => {
  const roomId = useRouter().query.id;
  const socket = useSocket(roomId);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, succes] = useLoader((sl, ss) => {
    socket?.emit(JOIN_ROOM, roomId);
    socket?.on(ROOM_CONNECTED, (data) => {
      sl(false);
      ss(data.connected);
    });
  });
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      console.log(searchTerm);
      window &&
        fetch(`https://kuronosu.dev/api/animes/search?name=${searchTerm}`)
          .then((r) => r.json())
          .then((j) => console.log(j));
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  if (!succes || loading) {
    return <Loader loading={loading} text="La sala no exixte" />;
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Room;
