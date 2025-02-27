import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import "./Chat.css"; // Importa la hoja de estilos

const socket = io("https://whatsappwebcopy-1.onrender.com");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
      return;
    }

    const { name: username, avatar, status } = location.state;
    setName(username);
    socket.emit("nombre", { name: username, avatar, status });

    socket.on("texto", (data) => {
      setMessages((prev) => [
        ...prev,
        { type: "text", content: data.mensaje, nombre: data.nombre, avatar: data.avatar, isMine: data.nombre === username }
      ]);
    });

    socket.on("img", (data) => {
      setMessages((prev) => [...prev, { type: "img", content: data }]);
    });

    socket.on("usuariosConectados", (users) => {
      setConnectedUsers(users);
    });

    socket.on("nuevaConexion", (user) => {
      setMessages((prev) => [...prev, { type: "info", content: `${user.name} se ha conectado` }]);
    });

    socket.on("desconexion", (username) => {
      setConnectedUsers((prev) => prev.filter(user => user.name !== username));
      setMessages((prev) => [...prev, { type: "info", content: `${username} se ha desconectado` }]);
    });

    socket.on("usuarioEscribiendo", (username) => {
      setTypingUser(username);
      setTimeout(() => {
        socket.emit("dejaEscribir");
      }, 3000);
    });

    socket.on("usuarioDejoDeEscribir", () => {
      setTypingUser("");
    });

    return () => {
      socket.disconnect();
    };
  }, [location, navigate]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const messageData = { nombre: name, mensaje: input, avatar: location.state.avatar };
      socket.emit("mensaje", messageData);
      setInput("");
      socket.emit("dejaEscribir");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.trim() !== "") {
      socket.emit("escribiendo", name);
    } else {
      socket.emit("dejaEscribir");
    }
  };

  return (
    <div className="chat-container">
      {/* Lista de Usuarios */}
      <div className="users-list">
        <h3>Usuarios Conectados</h3>
        {connectedUsers.map((user, index) => (
          <div key={index} className="user-item">
            <img src={user.avatar} alt="avatar" />
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-status">{user.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Principal */}
      <div className="chat-box">
        {typingUser && <p>{typingUser} está escribiendo...</p>}
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.type === "info"
                  ? "info"
                  : msg.isMine
                  ? "sent"
                  : "received"
              }`}
            >
              {msg.type === "info" ? (
                msg.content
              ) : (
                <>
                  {!msg.isMine && <img src={msg.avatar} alt="avatar" />}
                  <div>
                    {msg.type === "text" && <strong>{msg.nombre}: </strong>}
                    {msg.type === "img" ? <img src={msg.content} alt="Imagen enviada" style={{ maxWidth: "200px" }} /> : msg.content}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Input para mensajes */}
        <div className="input-box">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
