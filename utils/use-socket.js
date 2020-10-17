import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function useSocket(stop = []) {
  const [s, set] = useState(null);
  useEffect(() => {
    // fetch("/api/socketio").finally(() => set(io()));
    set(io("ws://127.0.0.1:3001"));
  }, stop);
  return s;
}
