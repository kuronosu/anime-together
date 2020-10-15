import { useRouter } from "next/router";
import { useState } from "react";
import Loader from "../../componets/loader";
import { SEARCH_END_POINT } from "../../constants/api";
import { JOIN_ROOM, ROOM_CONNECTED } from "../../constants/events";
import Search from "../../containers/search";
import useSocket from "../../utils/use-socket";

function useLoader(handle) {
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(true);
  handle(setLoading, setSucces);
  return [loading, succes];
}

const Room = () => {
  const roomId = useRouter().query.id;
  const socket = useSocket(roomId);
  const [animes, setAnimes] = useState([]);
  const [loading, succes] = useLoader((sl, ss) => {
    socket?.emit(JOIN_ROOM, roomId);
    socket?.on(ROOM_CONNECTED, (data) => {
      sl(false);
      ss(data.connected);
    });
  });

  if (!succes || loading) {
    return <Loader loading={loading} text="La sala no exixte" />;
  }
  return (
    <div>
      <Search setResults={setAnimes} queryUrl={SEARCH_END_POINT} />
      <ul className="AnimeList">
        {animes.map((a) => (
          <li key={a.flvid}>
            <img src={`https://www3.animeflv.net/${a.cover}`} />
            <span>{a.name}</span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .AnimeList li {
          width: 70%;
          list-style: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          padding: 0.75rem 1.25rem;
        }
        .AnimeList li:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .AnimeList li:first-child {
          padding-top: 0;
        }
      `}</style>
    </div>
  );
};

export default Room;
