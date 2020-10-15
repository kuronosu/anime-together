const Loader = ({ loading, text }) => {
  return (
    <div className="LoaderContainer">
      {loading ? <div className="Loader" /> : <span>{text}</span>}
      <style jsx>{`
        .LoaderContainer {
          display: flex;
          height: 100vh;
          width: 100vw;
          align-items: center;
          justify-content: center;
        }
        .Loader {
          border: 8px solid #f3f3f3;
          border-radius: 50%;
          border-top: 8px solid #232323;
          width: 120px;
          height: 120px;
          -webkit-animation: spin 2s linear infinite; /* Safari */
          animation: spin 2s linear infinite;
        }
        span {
          font-size: 3.5rem;
          line-height: 1.2;
          font-weight: 300;
          font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        }
        /* Safari */
        @-webkit-keyframes spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
