import { Fragment } from "react";

export default function EpisodeList({items, onClick, active, roomId}) {
  return (
    <Fragment>
      <ul className="EpisodeList">
        {items?.map((e) => (
          <li
            className={`${
              active == e.number ? "Active" : ""
            }`}
            key={e.eid}
            onClick={() => onClick(e)}
          >
            <div className="ImageContainer">
              <img src={e.img} />
              <div className="ImageOverlay" />
            </div>
            <span>{"Episodio " + e.number}</span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .EpisodeList {
          padding: 0;
          overflow-x: auto;
          width: 80%;
          display: flex;
        }
        .ImageOverlay {
          background-color: #616161;
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
          cursor: pointer;
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
        .EpisodeList li:not(.Active) {
          opacity: 0.75;
        }
        .EpisodeList li:hover {
          opacity: 1;
        }
      `}</style>
    </Fragment>
  );
}

