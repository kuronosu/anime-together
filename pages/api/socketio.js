import Server from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { NEW_ROOM, JOIN_ROOM, ROOM_CONNECTED, ROOM_SET_ANIME, ROOM_NEW_ANIME } from "../../constants/events";

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
          socket.emit(ROOM_CONNECTED, {
            connected: true,
            room,
            anime: rooms[room].anime,
          });
        } else socket.emit(ROOM_CONNECTED, { connected: false, room });
      });

      socket.on(ROOM_SET_ANIME, ({ anime, room }) => {
        if (rooms.hasOwnProperty(room)) {
          rooms[room].anime = anime;
          io.to(room).emit(ROOM_NEW_ANIME, anime);
        }
      });

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
