import express from "express";
import logger from "morgan";
import cors from "cors";

import { Server } from "socket.io";
import { createServer } from "node:http";

const port = 3000;
const app = express();
const server = createServer(app);

// CORS para cualquier origen, cualquier método y cualquier cabecera
app.use(logger('dev'));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['*'],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['*'],
    credentials: true
  },
  // si quieres permitir ambos protocolos de transporte de Engine.IO:
  transports: ['polling', 'websocket']
});

io.on("connection", (conexion) => {
  console.log(`${conexion.handshake.auth.username} se unio al servidor`)

  conexion.on("disconnect", () => {
    console.log("user disconnected");
  });
  conexion.on("evento1", (data) => {
    console.log("evento1 detectado:",
      `Nombre ${conexion.handshake.auth.username}`,
      `Mensaje: ${data}`
    );
    io.emit("evento1", {
      nombre: conexion.handshake.auth.username,
      mensaje: data
    });
  })
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
