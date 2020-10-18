import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import Loader from "../../componets/loader";
import {
  GENRES_END_POINT,
  SEARCH_END_POINT,
  STATES_END_POINT,
  TYPES_END_POINT,
} from "../../constants/api";
import {
  JOIN_ROOM,
  ROOM_CONNECTED,
  ROOM_SET_ANIME,
  ROOM_SELECT_ANIME,
  ROOM_SELECT_EPISODE,
  ROOM_SET_EPISODE,
} from "../../constants/events";
import EpisodeList from "../../containers/episode-list";
import Search from "../../containers/search";
import { convertListToObject } from "../../utils/generic";
import useSocket from "../../utils/use-socket";
import Video from "../../containers/video";

const Room = () => {
  const roomId = useRouter().query.id;
  const socket = useSocket([roomId]);
  const [animes, setAnimes] = useState([]);
  const [anime, setAnime] = useState(null);
  const [episodeData, setEpisode] = useState(null);
  const [succes, setSucces] = useState(false);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState(null);
  const [states, setStates] = useState(null);
  const [genres, setGenres] = useState(null);
  const [isOverlayHidden, setIsOverlayHidden] = useState(true);
  useEffect(() => {
    socket?.emit(JOIN_ROOM, roomId);
    socket?.on(ROOM_CONNECTED, (data) => {
      setLoading(false);
      setSucces(data.connected);
      setEpisode(data.episode);
      setAnime(data.anime);
    });
    socket?.on(ROOM_SET_EPISODE, (e) => setEpisode(e));
    socket?.on(ROOM_SET_ANIME, (a) => setAnime(a));
  }, [socket]);

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
  console.log(isOverlayHidden);
  if (!succes || loading) {
    return <Loader loading={loading} text="La sala no exixte" />;
  }
  console.log(episodeData)
  return (
    <Fragment>
      <Search
        onFocus={() => setIsOverlayHidden(false)}
        setResults={(l) => setAnimes(l)}
        queryUrl={SEARCH_END_POINT}
      />
      <div className="Container">
        <div className="MainContainer">
          <Video url={episodeData?.url}/>
          <EpisodeList
            roomId={roomId}
            active={episodeData?.episode?.number}
            items={anime?.episodes}
            onClick={element => {
              socket?.emit(ROOM_SELECT_EPISODE, {
                episode: element,
                room: roomId,
              });
            }}
          />
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
              <li key={a.flvid}>
                <div
                  className="AnimeElement"
                  onClick={(_) => {
                    setIsOverlayHidden(true);
                    socket?.emit(ROOM_SELECT_ANIME, { anime: a, room: roomId });
                  }}
                >
                  <p>{a.name}</p>
                  <small>{`${types[a.type].name} - ${
                    states[a.state].name
                  }`}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .CloseOverlay {
          position: absolute;
          right: 15px;
          top: 15px;
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
          border-top: 1px solid rgba(0, 0, 0, 0.2);
          z-index: 999;
        }
        .AnimeListOverlay ul {
          padding-inline-end: 40px;
        }
        .AnimeListOverlay div {
          padding-inline-end: 40px;
        }
        .AnimeElement {
          cursor: pointer;
        }
        .AnimeListOverlay li {
          list-style: none;
          padding: 10px 0 10px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        }
        .AnimeListOverlay li:first-child {
          padding-top: 0;
        }
        .AnimeListOverlay li:last-child {
          padding-bottom: 0;
          border-bottom: none;
        }
        .AnimeListOverlay li p {
          margin: 0;
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
        .MainContainer {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 5px;
        }
      `}</style>
    </Fragment>
  );
};

export default Room;
