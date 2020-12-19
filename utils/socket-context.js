import io from "socket.io-client";

const ws = io.connect("https://kuronosu.dev")

export { ws }

