const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected");
    });

});

server.listen(8000, () => {
    console.log("Server running on 8000");
});

app.get("/", (req, res) => {
    res.send("Hello World");
});