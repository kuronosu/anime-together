import React, { Fragment, useEffect, useRef, useState } from "react";
import Controls from "./controls";
import {
  ROOM_REQUEST_CHANGE_PLAYING_STATUS,
  ROOM_CHANGE_PLAYING_STATUS,
  ROOM_REQUEST_CHANGE_CURRENT_TIME,
  ROOM_CHANGE_CURRENT_TIME,
  ROOM_SET_CURRENT_TIME,
  ROOM_CONNECTED,
} from "../constants/events";
import { ws } from "../utils/socket-context";

function Video({ url, roomId, initialTime }) {
  const videoEl = useRef(null);
  const videoCon = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [slider, setSlider] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [timeCurrent, settimeCurrent] = useState(0 +":"+0+0);
  const [durationTime, setdurationTime] = useState(0 +":"+0+0);

  useEffect(() => {
    ws?.on(ROOM_CHANGE_PLAYING_STATUS, (newPlayingState) => {
      setIsPlaying(newPlayingState);
    });
    ws?.on(ROOM_CHANGE_CURRENT_TIME, (newCurrentTime) => {
      videoEl.current.currentTime = newCurrentTime;
    });
  }, []);

  useEffect(() => {
    if (videoEl.current && initialTime) {
      videoEl.current.currentTime = initialTime;
      setSlider((initialTime / videoEl.current.duration) * 100);
    }
  }, [initialTime, videoEl.current]);

  useEffect(() => {
    if (!isPlaying) videoEl.current?.pause();
    else videoEl.current?.play();
  }, [isPlaying]);

  const setTime = () =>{
    var curmins = Math.floor(videoEl.current.currentTime / 60);
    var cursecs = Math.floor(videoEl.current.currentTime - curmins * 60)
    var durmins = Math.floor(videoEl.current.duration / 60);
    var dursecs = Math.floor(videoEl.current.duration - durmins * 60)

    if(cursecs < 10){
      cursecs = "0"+cursecs
    }

    if(dursecs < 10){
      dursecs = "0"+dursecs
    }
    
    setdurationTime(durmins + ":" + dursecs);
    settimeCurrent(curmins + ":" + cursecs);
  }

  if (videoEl.current) {
    videoEl.current.ontimeupdate = () => {
      ws?.emit(ROOM_SET_CURRENT_TIME, {
        room: roomId,
        currentTime: videoEl.current.currentTime,
      });
      setSlider((videoEl.current.currentTime / videoEl.current.duration) * 100);
      setTime();
    };
  }

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
          roomId={roomId}
          video={videoEl}
          initialPlaying={false}
          initialMuted={false}
          videoCon={videoCon}
          size={false}
          isPlaying={isPlaying}
          slider={slider}
          durationTime={durationTime}
          timeCurrent={timeCurrent}
          handlePlayPause={() => {
            ws?.emit(ROOM_REQUEST_CHANGE_PLAYING_STATUS, {
              room: roomId,
              state: !isPlaying,
            });
          }}
          handleSliderChange={(e) =>
            ws.emit(ROOM_REQUEST_CHANGE_CURRENT_TIME, {
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
