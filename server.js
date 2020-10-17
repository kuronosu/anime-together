const { v4: uuidv4 } = require("uuid");

const server = require("http").createServer();

const io = require("socket.io")(server, {
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
});

const NEW_ROOM = "room:new";
const JOIN_ROOM = "room:join";
const ROOM_CONNECTED = "room:connected";
const ROOM_SELECT_ANIME = "room:select_anime";
const ROOM_SET_ANIME = "room:set_anime";
const ROOM_SELECT_EPISODE = "room:select_episode";
const ROOM_GETTING_EPISODE_STATUS = "room:getting_episode_status";
const ROOM_SET_EPISODE = "room:set_episode";

function gocdnServer(anime_flvid, episode_number) {
  return `https://kuronosu.dev/api/animes/${anime_flvid}/episodes/${episode_number}/gocdn`;
}

io.origins((_, c) => c(null, true));

let rooms = {};

io.on("connection", (socket) => {
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
          console.log(d);
          rooms[room].episode = { episode, url: d.active_url };
          io.to(room).emit(ROOM_SET_EPISODE, rooms[room].episode);
          io.to(room).emit(ROOM_GETTING_EPISODE_STATUS, {
            status: "success",
            code: 1,
          });
        })
        .catch((e) => {
          io.to(room).emit(ROOM_SET_EPISODE, null);
          io.to(room).emit(ROOM_GETTING_EPISODE_STATUS, {
            status: "error",
            code: -1,
          });
        });
    }
  });

  socket.on("disconnect", () => {});
});

server.listen(3001);
