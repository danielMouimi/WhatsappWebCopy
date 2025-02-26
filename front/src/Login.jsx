import { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
];

export function Login({ setUser }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Disponible");
  const [avatar, setAvatar] = useState(avatars[0]);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) {
      alert("Por favor, ingresa un nombre.");
      return;
    }
    setUser({ name, status, avatar });
    navigate("/chat");
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <label>Nombre:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre"
      />

      <label>Selecciona un avatar:</label>
      <div className="avatar-list">
        {avatars.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Avatar"
            className={avatar === img ? "selected" : ""}
            onClick={() => setAvatar(img)}
          />
        ))}
      </div>

      <button onClick={handleLogin}>Entrar al chat</button>
    </div>
  );
}
