import { useEffect, useState } from "react";
import io from "socket.io-client";

process.env.SERVER_HOST = "kuronosu.dev";
process.env.SERVER_PORT = "default";

export default function useSocket(stop = []) {
  const [s, set] = useState(null);
  useEffect(() => {
    // fetch("/api/socketio").finally(() => set(io()));
    set(
      io(
        `ws://${process.env.SERVER_HOST || "127.0.0.1"}${
          process.env.SERVER_PORT == "default"
            ? ""
            : ":" + (process.env.SERVER_PORT || 3001)
        }`
      )
    );
  }, stop);
  return s;
}
