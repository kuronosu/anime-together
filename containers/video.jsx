import React, { Fragment, useRef } from "react";
import Controls from "./controles";

function Video({ url }) {
  const videoEl = useRef(null);
  const videoCon = useRef(null);

  return (
    <Fragment>
      <div ref={videoCon} className="VideoContainer">
        <video ref={videoEl} src={url}/>
        <Controls
          video={videoEl}
          initialState={false}
          initialState={false}
          videoCon={videoCon}
          size={false}
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
