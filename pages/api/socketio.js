import Server from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { NEW_ROOM, JOIN_ROOM, ROOM_CONNECTED } from "../../constants/events";

let rooms = {};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    io.on("connection", (socket) => {
      io.emit("name", "Kuronosu");

      socket.on(NEW_ROOM, () => {
        let room = uuidv4();
        rooms[room] = { anime: null, queue: [] };
        socket.join(room);
        socket.emit(ROOM_CONNECTED, { connected: true, room });
      });

      socket.on(JOIN_ROOM, (room) => {
        if (Object.keys(rooms).includes(room)) {
          socket.join(room);
          socket.emit(ROOM_CONNECTED, { connected: true, room });
        } else socket.emit(ROOM_CONNECTED, { connected: false, room });
      });

      // socket.on("new_video", ({ videoURL, room }) => {
      //   io.to(room).emit("play_video", videoURL);
      // });

      socket.on("disconnect", () => {});
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
