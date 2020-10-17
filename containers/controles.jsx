import React, {Fragment, useState} from "react";
import {
  MdPlayArrow,
  MdPause,
  MdCropFree,
  MdVolumeDown,
  MdVolumeOff,
  MdFullscreenExit
} from "react-icons/md";

const Controls = ({ video, initialState, initialMuted, videoCon, size}) => {
  const [slider, setSlider] = useState(0);
  const [isPlaying, setisPlaying] = useState(initialState);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setisFullscreen] = useState(size);
  /* Pause button*/
  const togglePlay = () => {
    if (isPlaying) video.current.pause();
    else video.current.play();
    setisPlaying(!isPlaying);
  };

  /* Pause button*/
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
    if(isFullscreen)
      exitFullscreen();
    else
      openFullscreen();
    setisFullscreen(!isFullscreen);
  };

  function openFullscreen(){
    if (videoCon.current.requestFullscreen) {
      videoCon.current.requestFullscreen();
    } else if (videoCon.current.mozRequestFullScreen) {
      /* Firefox */
      videoCon.current.mozRequestFullScreen();
    } else if (videoCon.current.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      videoCon.current.webkitRequestFullscreen();
    } else if (videoCon.current.msRequestFullscreen) {
      /* IE/Edge */
      videoCon.current.msRequestFullscreen();
    }
  }

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

  if (video.current) {
    video.current.ontimeupdate = () => {
      setSlider((video.current.currentTime / video.current.duration) * 100);
    };
  }

  /* Slider*/
  const sliderTime = (e) => {
    setSlider(e.target.value);
    var time = video.current.duration * (slider / 100);
    video.current.currentTime = time;
  };

  return (
    <Fragment>
      <div className="controls">
        <input
          value={slider}
          onChange={sliderTime}
          type="range"
          min="0"
          max="100"
          step="0.001"
        />
        <div className="buttonsCont">
          <div className="button">
            {isPlaying ? (
              <MdPause onClick={togglePlay} />
            ) : (
              <MdPlayArrow onClick={togglePlay} />
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
      <style jsx>{
        `
        .button{
          cursor:pointer;
          color: white;
          font-size: calc(8px + 2vmin);
        }
        
        .controls{
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
        
        .buttonsCont{
          width: 100%;
          display: flex;
        }
        
        .controls input[type=range]{
          width: 98%;
        }
        `
      }
      </style>
    </Fragment>
  );
};
export default Controls;
