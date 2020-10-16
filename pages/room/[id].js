import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import Loader from "../../componets/loader";
import {
  // GENRES_END_POINT,
  SEARCH_END_POINT,
  // STATES_END_POINT,
  // TYPES_END_POINT,
} from "../../constants/api";
import {
  JOIN_ROOM,
  ROOM_CONNECTED,
  ROOM_NEW_ANIME,
  ROOM_SET_ANIME,
} from "../../constants/events";
import Search from "../../containers/search";
// import { convertListToObject } from "../../utils/generic";
import useSocket from "../../utils/use-socket";

const Room = () => {
  const roomId = useRouter().query.id;
  const socket = useSocket([roomId]);
  const [animes, setAnimes] = useState([]);
  const [anime, setAnime] = useState(null);
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [types, setTypes] = useState(null);
  // const [states, setStates] = useState(null);
  // const [genres, setGenres] = useState(null);
  const [isOverlayHidden, setIsOverlayHidden] = useState(true);
  useEffect(() => {
    socket?.emit(JOIN_ROOM, roomId);
    socket?.on(ROOM_CONNECTED, (data) => {
      setLoading(false);
      setSucces(data.connected);
      setAnime(data.anime);
    });
    socket?.on(ROOM_NEW_ANIME, (a) => setAnime(a));
  }, [socket])

  // useEffect(() => {
  //   fetch(TYPES_END_POINT)
  //     .then((r) => r.json())
  //     .then((d) => setTypes(convertListToObject(d)));
  //   fetch(STATES_END_POINT)
  //     .then((r) => r.json())
  //     .then((d) => setStates(convertListToObject(d)));
  //   fetch(GENRES_END_POINT)
  //     .then((r) => r.json())
  //     .then((d) => setGenres(convertListToObject(d)));
  // }, []);
  console.log(isOverlayHidden)
  if (!succes || loading) {
    return <Loader loading={loading} text="La sala no exixte" />;
  }
  return (
    <Fragment>
      <Search
        onFocus={() => setIsOverlayHidden(false)}
        setResults={(l) => setAnimes(l)}
        queryUrl={SEARCH_END_POINT}
      />
      <div className="Container">
        <div className="VideoContainer">
          <div className="VideoWrapper">
            <video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
            <div className="Controlls" />
          </div>
          <ul className="EpisodeList">
            {anime?.episodes?.map((a) => (
              <li key={a.eid}>
                <div className="ImageContainer">
                  <img src={a.img} />
                  <div className="ImageOverlay" />
                </div>
                <span>{"Episodio " + a.number}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`AnimeListOverlay ${isOverlayHidden ? "hidden" : ""}`}>
          <button
            className="CloseOverlay"
            onClick={() => setIsOverlayHidden(!isOverlayHidden)}
          >
            X
          </button>
          <ul>
            {animes.map((a) => (
              <li
                key={a.flvid}
                onClick={(_) => {
                  setIsOverlayHidden(true);
                  socket?.emit(ROOM_SET_ANIME, { anime: a, room: roomId });
                }}
              >
                {a.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .CloseOverlay {
          position: absolute;
          right: 25px;
          top: 0;
        }
        .Container {
          position: relative;
        }
        .hidden {
          display: none;
        }
        .AnimeListOverlay {
          width: 100%;
          height: calc(100vh - 48px);
          position: absolute;
          top: 0;
          left: 0;
          background-color: #f5f5f5;
          z-index: 999;
        }
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
        }
        video {
          width: 100%;
          height: 100%;
          background-color: #000;
          position: absolute;
        }
        .VideoContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 5px;
        }
        .EpisodeList {
          padding: 0;
          overflow-x: auto;
          width: 80%;
          display: flex;
        }
        .ImageOverlay {
          background-color: #2f2f2f;
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
        .EpisodeList li {
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
        .EpisodeList li:last-child {
          margin-right: 0;
        }
        .EpisodeList li:first-child {
          margin-left: 0;
        }
      `}</style>
    </Fragment>
  );
};

export default Room;
