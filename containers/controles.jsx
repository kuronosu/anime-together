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
  durationTime,
  timeCurrent
}) => {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setisFullscreen] = useState(size);
  const [volumeSlider, setvolumeSlider] = useState(1);

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

  const sliderVolume = (e) => {
    setvolumeSlider(e.target.value);
    setVolume(volumeSlider);
    video.current.volume = volume;
    console.log(volume)
  }

  // console.log(isPlaying);

  return (
    <Fragment>
      <div className={`controls ${isHidden? 'hidden': ''}`}>
        <input
          value={slider}
          id="timeSlider"
          onChange={handleSliderChange}
          type="range"
          min="0"
          max="100"
          step="0.001"
        />
        <div className = "botones">
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
            <input
              value={volumeSlider}
              id="volumeSlider"
              onChange={sliderVolume}
              type="range"
              min="0"
              max="1"
              step="0.05"
            />
            <div className ="timeText">
              <span>
                {video.current? (timeCurrent):("0:00")}/{video.current? (durationTime):("0:00")}
              </span>
            </div>
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
            width: 100%;
            left: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 5px 0 5px;
            -moz-box-shadow: inset 0 -1.5em 2em -1em #000;
            -webkit-box-shadow: inset 0 -1.5em 2em -1em #000;
            box-shadow: inset 0 -1.5em 2em -1em #000;
          }

          .buttonsCont {
            width: 100%;
            display: flex;
            padding-left: 10px;
          }

          #timeSlider{
            width: 98%;
          }

          .timeText{
            display: flex;
            font-size: small;
            padding-left: 5px;
            padding-top: 3px;
            color: white;
          }

          .botones{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            padding-right: 12px;
          }
        `}
      </style>
    </Fragment>
  );
};
export default Controls;
