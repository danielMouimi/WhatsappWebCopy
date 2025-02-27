const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://whatsappwebcopy-1.onrender.com",  //  
        methods: ["GET", "POST"]
    }
});

let userConnected = 0;

app.use(cors());
app.use(express.json());
var connectedUsers = [];

io.on('connection', (socket) => {

  userConnected++;
  console.log('Hay ' + userConnected + ' usuarios conectados');

  socket.on("nombre", (userData) => {
    connectedUsers.push({ id: socket.id, ...userData });

    // Enviar la lista completa de usuarios a todos los clientes
    io.emit("usuariosConectados", connectedUsers);
  });
  
socket.on('disconnect', () => {

  userConnected--;
  console.log('Hay ' + userConnected + ' usuarios conectados');

  const user = connectedUsers.find((u) => u.id === socket.id);
  if (user) {
    connectedUsers = connectedUsers.filter((u) => u.id !== socket.id);
    io.emit("usuariosConectados", connectedUsers);
    io.emit("desconexion", user.name);
  }
});
socket.on("mensaje", (datos)=> {
  io.emit("texto",datos);
  console.log("recibo mensaje con datos = "+datos.mensaje);
});
socket.on("img",(img)=> {
  io.emit("img",img);
})


socket.on("nombre", (nombre)=> {
  socket.nombre = nombre;
  io.emit("nuevaConexion",nombre);
})

socket.on("escribiendo", (nombre) => {
    socket.broadcast.emit("usuarioEscribiendo", nombre);
});


socket.on("dejaEscribir", () => {
    socket.broadcast.emit("usuarioDejoDeEscribir");
});
});

server.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


// Servir archivos estáticos desde el directorio "src"
app.use(express.static(path.join(__dirname, "../")));

