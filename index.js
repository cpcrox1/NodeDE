const express = require('express');
const path = require('path');
const app = express();

app.use('/public/js', express.static(path.join(__dirname, '/public/scripts')));
app.use('/game', express.static(path.join(__dirname, '/Game')));

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
  console.log("admin loggin");
  res.sendFile(__dirname + '/backend.html');
});

app.get('/DE', (req, res) => {
  console.log("DE");
  res.sendFile(__dirname + '/Game/DE.html');
});



io.on('connection', (socket) => {
    console.log('a user connected');    

    socket.broadcast.emit("chat message",'A user has connected');

    socket.on("chat message", (msg, nickName) =>{
        console.log("message: " + msg);
        socket.broadcast.emit('chat message', msg, nickName);
    });

    socket.on("typing", (user) =>{
        console.log(user + ' is typing');

        socket.broadcast.emit("typing", user);
    });

    socket.on("stop typing", (user) =>{
      console.log(user + ' stopped typing');

      socket.broadcast.emit("stop typing", user);
  });

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
       
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});