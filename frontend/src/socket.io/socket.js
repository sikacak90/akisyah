import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3500";

export const socket = io({ autoConnect: false }).on('connect_error', (err) => {
  console.log(`Connection error: ${err.message}`);
});
