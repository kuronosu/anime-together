import { Fragment } from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          background-color: #f5f5f5;
        }
      `}</style>
    </Fragment>
  );
}

export default MyApp;
