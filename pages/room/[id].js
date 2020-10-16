import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../../componets/loader";
import {
  GENRES_END_POINT,
  SEARCH_END_POINT,
  STATES_END_POINT,
  TYPES_END_POINT,
} from "../../constants/api";
import { JOIN_ROOM, ROOM_CONNECTED } from "../../constants/events";
import Search from "../../containers/search";
import { convertListToObject } from "../../utils/generic";
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
  const [anime, setAnime] = useState(null);
  const [types, setTypes] = useState(null);
  const [states, setStates] = useState(null);
  const [genres, setGenres] = useState(null);
  const [loading, succes] = useLoader((sl, ss) => {
    socket?.emit(JOIN_ROOM, roomId);
    socket?.on(ROOM_CONNECTED, (data) => {
      sl(false);
      ss(data.connected);
    });
  });

  useEffect(() => {
    fetch(TYPES_END_POINT)
      .then((r) => r.json())
      .then((d) => setTypes(convertListToObject(d)));
    fetch(STATES_END_POINT)
      .then((r) => r.json())
      .then((d) => setStates(convertListToObject(d)));
    fetch(GENRES_END_POINT)
      .then((r) => r.json())
      .then((d) => setGenres(convertListToObject(d)));
  }, []);

  if (!succes || loading) {
    return <Loader loading={loading} text="La sala no exixte" />;
  }
  return (
    <div>
      <Search setResults={(l) => setAnime(l[0])} queryUrl={SEARCH_END_POINT} />
      <div className="Container">
        <div className="VideoWrapper">
          <video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
          <div className="Controlls"/>
        </div>
        <ul className="AnimeList">
          {anime?.episodes?.map((a) => (
            <li key={a.eid}>
              <div className="ImageContainer">
                <img src={a.img}/>
                <div className="ImageOverlay"/>
              </div>
              <span>{"Episodio " + a.number}</span>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .VideoWrapper {
          width: 100%;
          background-color: #000;
          height: calc((9 / 16) * 100vw);
          max-height: calc(100vh - 169px);
          min-height: 480px;
          position: relative;
        }
        .Controlls {
          position: absolute;
          width: 100%;
          height: 30px;
          left: 0;
          bottom: 0;
          background-color: #0F0;
        }
        video {
          width: 100%;
          height: 100%;
          background-color: red;
          position: absolute;
        }
        .Container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 5px;
        }
        .AnimeList {
          padding: 0;
          overflow-x: auto;
          width: 80%;
          display: flex;
        }
        .ImageOverlay {
          background-color: #2F2F2F;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        .ImageContainer {
          position: relative;
          height: 80px;
          width: 142px;
        }
        .AnimeList li {
          list-style: none;
          margin: 0 5px 0 5px;
          height: 105px;
          min-width: 142px;
        }
        .ImageContainer img {
          max-height: 80px;
          position: absolute;
          z-index: 1;
        }
        .AnimeList li:last-child {
          margin-right: 0;
        }
        .AnimeList li:first-child {
          margin-left: 0;
        }
      `}</style>
    </div>
  );
};

export default Room;
