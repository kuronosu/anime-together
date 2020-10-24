import React, { Fragment, useEffect, useRef, useState } from "react";
import Controls from "./controles";
import {
  ROOM_REQUEST_CHANGE_PLAYING_STATUS,
  ROOM_CHANGE_PLAYING_STATUS,
  ROOM_REQUEST_CHANGE_CURRENT_TIME,
  ROOM_CHANGE_CURRENT_TIME,
  ROOM_SET_CURRENT_TIME,
  ROOM_CONNECTED,
} from "../constants/events";

function Video({ url, socket, roomId, initialTime }) {
  const videoEl = useRef(null);
  const videoCon = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slider, setSlider] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    socket?.on(ROOM_CHANGE_PLAYING_STATUS, (newPlayingState) => {
      console.log(newPlayingState);
      setIsPlaying(newPlayingState);
    });
    socket?.on(ROOM_CHANGE_CURRENT_TIME, (newCurrentTime) => {
      videoEl.current.currentTime = newCurrentTime;
    });
  }, [socket]);

  useEffect(() => {
    console.log((initialTime / videoEl.current.duration) * 100, initialTime);
    if (videoEl.current && initialTime) {
      videoEl.current.currentTime = initialTime;
      setSlider((initialTime / videoEl.current.duration) * 100);
    }
  }, [initialTime, videoEl.current]);

  useEffect(() => {
    if (!isPlaying) videoEl.current?.pause();
    else videoEl.current?.play();
  }, [isPlaying]);

  if (videoEl.current) {
    videoEl.current.ontimeupdate = () => {
      socket?.emit(ROOM_SET_CURRENT_TIME, {
        room: roomId,
        currentTime: videoEl.current.currentTime,
      });
      setSlider((videoEl.current.currentTime / videoEl.current.duration) * 100);
    };
  }

  console.log("isPlaying" + slider);
  return (
    <Fragment>
      <div ref={videoCon} className="VideoContainer">
        <video
          onClick={(_) => setIsHidden(!isHidden)}
          ref={videoEl}
          src={url}
        />
        <Controls
          isHidden={isHidden}
          socket={socket}
          roomId={roomId}
          video={videoEl}
          initialPlaying={false}
          initialMuted={false}
          videoCon={videoCon}
          size={false}
          isPlaying={isPlaying}
          slider={slider}
          handlePlayPause={() => {
            socket?.emit(ROOM_REQUEST_CHANGE_PLAYING_STATUS, {
              room: roomId,
              state: !isPlaying,
            });
          }}
          handleSliderChange={(e) =>
            socket.emit(ROOM_REQUEST_CHANGE_CURRENT_TIME, {
              room: roomId,
              currentTime: videoEl.current.duration * (e.target.value / 100),
            })
          }
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
