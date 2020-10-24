import React, { Fragment, useEffect, useState } from "react";
import {
  MdPlayArrow,
  MdPause,
  MdCropFree,
  MdVolumeDown,
  MdVolumeOff,
  MdFullscreenExit,
} from "react-icons/md";

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function openFullscreen(video) {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    /* Firefox */
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    /* IE/Edge */
    video.msRequestFullscreen();
  }
}

const Controls = ({
  video,
  isPlaying,
  initialMuted,
  videoCon,
  size,
  handlePlayPause,
  slider,
  handleSliderChange,
  isHidden,
}) => {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setisFullscreen] = useState(size);

  const toggleMute = () => {
    if (isMuted) {
      video.current.volume = volume;
    } else {
      setVolume(video.current.volume);
      video.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  /* Full screen button*/
  const fullScreen = () => {
    if (isFullscreen) exitFullscreen();
    else openFullscreen(videoCon.current);
    setisFullscreen(!isFullscreen);
  };

  // console.log(isPlaying);

  return (
    <Fragment>
      <div className={`controls ${isHidden? 'hidden': ''}`}>
        <input
          value={slider}
          onChange={handleSliderChange}
          type="range"
          min="0"
          max="100"
          step="0.001"
        />
        <div className="buttonsCont">
          <div className="button">
            {isPlaying ? (
              <MdPause onClick={handlePlayPause} />
            ) : (
              <MdPlayArrow onClick={handlePlayPause} />
            )}
          </div>
          <div className="button">
            {isMuted ? (
              <MdVolumeOff onClick={toggleMute} />
            ) : (
              <MdVolumeDown onClick={toggleMute} />
            )}
          </div>
          <div className="button">
            {isFullscreen ? (
              <MdFullscreenExit onClick={fullScreen} />
            ) : (
              <MdCropFree onClick={fullScreen} />
            )}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .button {
            cursor: pointer;
            color: white;
            font-size: calc(8px + 2vmin);
          }
          .hidden {
            display: none !important;
          }

          .controls {
            position: absolute;
            width: 98%;
            left: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 0 5px 0 5px;
          }

          .buttonsCont {
            width: 100%;
            display: flex;
          }

          .controls input[type="range"] {
            width: 98%;
          }
        `}
      </style>
    </Fragment>
  );
};
export default Controls;
