const io = require('socket.io')(undefined, { cors: { origin: '*' } });
// TODO: implement cache-manager to store online users
const onlineUsers = new Map(); // key: socketID, value: userID
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const { JWT_COOKIE_NAME, URL_ID_LENGTH } = require('../utils/constants');

function extractToken(socket) {
  if (socket.handshake.query && socket.handshake.query.token) {
    return socket.handshake.query.token;
  }

  if (socket.handshake.headers.cookie) {
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    return cookies[JWT_COOKIE_NAME];
  }

  return null;
}

function isUserConnected(userID) {
  let socketID = onlineUsers.get(userID);

  if (!socketID) {
    return false;
  }

  if (io.sockets.sockets.has(socketID)) {
    return io.sockets.sockets.get(socketID);
  }

  // if userId is provided and it's not online then delete it from map
  userID && onlineUsers.delete(userID);
  return false;
}

// only allow authenticated users
io.use((socket, next) => {
  console.log('socket connection request');
  const token = extractToken(socket);

  if (!token) {
    return next(new Error('Unauthorized Connection'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      socket.user = decoded;
      onlineUsers.set(`${decoded.userId}`.slice(URL_ID_LENGTH), socket.id);
    } else {
      return next(new Error('Unauthorized Connection'));
    }
  } catch (err) {
    return next(new Error('Unauthorized Connection'));
  }
  next();
});

io.on('connection', (socket) => {
  console.log('connected to a client');
  console.log('ONline Users.........................');
  console.log(onlineUsers);
});

module.exports = {
  io: io,
  isUserConnected: isUserConnected,
};
