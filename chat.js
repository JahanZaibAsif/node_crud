// index.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on("connection" , (socket) => {
   socket.on("user-message" , (message) => {
    io.emit("message",message,socket.id);
    console.log(socket.id);
   });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
