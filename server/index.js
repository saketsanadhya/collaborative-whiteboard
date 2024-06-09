const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello");
});

let rooms = [];
const Port = process.env.PORT || 4000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (data) => {
    console.log("joined room", data.roomId);
    socket.join(data.roomId);
    const elements = rooms.find((element) => element.roomId === data.roomId);
    if (elements) {
      io.to(socket.id).emit("updateCanvas", elements);
      elements.user.push(socket.id); // Using push to add new user
    } else {
      rooms.push({
        roomId: data.roomId,
        updatedElements: [],
        user: [socket.id], // Initialize user array with current socket id
        canvasColor: "#121212",
      });
    }
  });

  socket.on("updateCanvas", (data) => {
    socket.to(data.roomId).emit("updateCanvas", data);
    const elements = rooms.find((element) => element.roomId === data.roomId);
    if (elements) {
      elements.updatedElements = data.updatedElements;
      elements.canvasColor = data.canvasColor;
    }
  });

  socket.on("sendMessage", (data) => {
    socket.to(data.roomId).emit("getMessage", data);
    io.to(socket.id).emit("getMessage", data);
  });

  socket.on("pong", () => {
    setTimeout(() => {
      socket.emit("ping");
    }, 120000);
  });

  socket.on("disconnect", () => {
    rooms.forEach((element) => {
      element.user = element.user.filter((user) => user !== socket.id);
      if (element.user.length === 0) {
        rooms = rooms.filter((room) => room.roomId !== element.roomId);
      }
    });
  });
});

// Error handler for server
server.on("error", (error) => {
  console.error("Server error:", error);
});

server.listen(Port, () => {
  console.log(`listening on *:${Port}`);
});
