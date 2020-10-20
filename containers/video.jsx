import React, { Fragment, useEffect, useRef, useState } from "react";
import Controls from "./controles";
import {
  ROOM_REQUEST_CHANGE_PLAYING_STATUS,
  ROOM_CHANGE_PLAYING_STATUS,
} from "../constants/events";

function Video({ url, socket, roomId }) {
  const videoEl = useRef(null);
  const videoCon = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    socket?.on(ROOM_CHANGE_PLAYING_STATUS, (newPlayingState) => {
      console.log(newPlayingState)
      setIsPlaying(newPlayingState);
    });
  }, [socket]);

  useEffect(() => {
    if (!isPlaying) videoEl.current?.pause();
    else videoEl.current?.play();
  }, [isPlaying]);
  
  console.log(isPlaying);
  return (
    <Fragment>
      <div ref={videoCon} className="VideoContainer">
        <video ref={videoEl} src={url} />
        <Controls
          socket={socket}
          roomId={roomId}
          video={videoEl}
          initialPlaying={false}
          initialMuted={false}
          videoCon={videoCon}
          size={false}
          isPlaying={isPlaying}
          handlePlayPause={() => {
            socket?.emit(ROOM_REQUEST_CHANGE_PLAYING_STATUS, {
              room: roomId,
              state: !isPlaying,
            });
          }}
        />
      </div>
      <style jsx>
        {`
          video {
            width: 100%;
            height: 100%;
            position: absolute;
          }

          .VideoContainer {
            width: 100%;
            height: calc((9 / 16) * 100vw);
            max-height: calc(100vh - 169px);
            min-height: 480px;
            position: relative;
            background-color: black;
          }

          video::-webkit-media-controls {
            display: none !important;
          }
        `}
      </style>
    </Fragment>
  );
}

export default Video;
