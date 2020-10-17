import Server from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  NEW_ROOM,
  JOIN_ROOM,
  ROOM_CONNECTED,
  ROOM_SELECT_ANIME,
  ROOM_SET_ANIME,
  ROOM_SET_EPISODE,
  ROOM_SELECT_EPISODE,
  ROOM_GETTING_EPISODE_STATUS,
} from "../../constants/events";
import { gocdnServer } from "../../utils/servers";

let rooms = {};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    io.on("connection", (socket) => {
      io.emit("name", "Kuronosu");

      socket.on(NEW_ROOM, () => {
        let room = uuidv4();
        rooms[room] = { anime: null, episode: null };
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
            episode: rooms[room].episode,
          });
        } else socket.emit(ROOM_CONNECTED, { connected: false, room });
      });

      socket.on(ROOM_SELECT_ANIME, ({ anime, room }) => {
        if (rooms.hasOwnProperty(room)) {
          rooms[room].anime = anime;
          rooms[room].episode = null;
          io.to(room).emit(ROOM_SET_EPISODE, null);
          io.to(room).emit(ROOM_SET_ANIME, anime);
        }
      });

      socket.on(ROOM_SELECT_EPISODE, ({ episode, room }) => {
        if (rooms.hasOwnProperty(room)) {
          io.to(room).emit(ROOM_GETTING_EPISODE_STATUS, {
            status: "loading",
            code: 0,
          });
          fetch(gocdnServer(rooms[room].anime.flvid, episode.number))
            .then((r) => r.json())
            .then((d) => {
              console.log(d)
              rooms[room].episode = { episode, url: d.active_url };
              io.to(room).emit(ROOM_SET_EPISODE, rooms[room].episode);
              io.to(room).emit(ROOM_GETTING_EPISODE_STATUS, {
                status: "success",
                code: 1,
              });
            })
            .catch((e) =>{
              io.to(room).emit(ROOM_SET_EPISODE, null);
              io.to(room).emit(ROOM_GETTING_EPISODE_STATUS, {
                status: "error",
                code: -1,
              })
            });
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
