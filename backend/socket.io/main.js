const io = require("socket.io")(undefined, { cors: { origin: "*" } });
const sessionMiddleware = require("../middlewares/sessionMiddleware");
// Store the logged in online users in a map
// key: socketID, value: userID
var onlineUsers = new Map();

// Check if a user is connected with a given socketId
function isUserConnected(userID) {
  let socketID = onlineUsers.get(userID);

  if (!socketID) {
    return false;
  }
  console.log("heart");
  console.log("hear");

  if (io.sockets.sockets.has(socketID)) {
    return io.sockets.sockets.get(socketID);
  }
  // if userId is provided then delete the user from the map
  userID && onlineUsers.delete(userID);
  return false;
}

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

// only allow authenticated users
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.authenticated) {
    onlineUsers.set(`${session.passport.user}`.slice(-6), socket.id);
    console.log("ONline Users.........................");
    console.log(onlineUsers);
    next();
  } else {
    console.log("unauthorized socket connection");
    next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("connected to a client");
  // send a message to the client
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
  // receive a message from the client
  socket.on("hello from client", (...args) => {
    console.log(args);
  });
});

module.exports = {
  io: io,
  isUserConnected: isUserConnected,
};
