import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const username = prompt("Dime tu nombre:");
    setName(username);
    socket.emit("nombre", username);

    // Recibir mensajes de texto
    socket.on("texto", (data) => {
      console.log(data)
      setMessages((prev) => [...prev, { type: "text", content: data.mensaje , nombre: data.nombre}]);
    });

    // Recibir imágenes
    socket.on("img", (data) => {
      setMessages((prev) => [...prev, { type: "img", content: data }]);
    });

    // Notificación de conexión de un nuevo usuario
    socket.on("nuevaConexion", (username) => {
      setMessages((prev) => [...prev, { type: "info", content: `${username} se ha conectado` }]);
    });

    // Notificación de desconexión de un usuario
    socket.on("desconexion", (username) => {
      setMessages((prev) => [...prev, { type: "info", content: `${username} se ha desconectado` }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Manejar envío de mensajes de texto
  const sendMessage = () => {
    if (input.trim() !== "") {
      const messageData = { nombre: name, mensaje: input };
      socket.emit("mensaje", messageData);
      setInput("");
    }
  };

  // Manejar envío de imágenes (URL de imágenes en este caso)
  const sendImage = () => {
    if (input.trim() !== "") {
      socket.emit("img", input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Chat con Socket.io</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg, index) => (
          <li
            key={index}
            style={{
              background: msg.type === "info" ? "#ddd" : msg.type === "text" ? "#efefef" : "transparent",
              padding: "8px",
              marginBottom: "5px",
              borderRadius: "5px"
            }}
          >
            {msg.type === "text" && <strong>{msg.nombre}: </strong>}
            {msg.type === "img" ? <img src={msg.content} alt="Imagen enviada" style={{ maxWidth: "200px" }} /> : msg.content}
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "5px"
          }}
        />
        <button onClick={sendMessage} style={{ marginRight: "5px" }}>Enviar</button>
        <button onClick={sendImage}>Enviar Imagen</button>
      </div>
    </div>
  );
}
