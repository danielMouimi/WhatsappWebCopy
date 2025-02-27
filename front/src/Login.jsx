import { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
];

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const navigate = useNavigate();
  const handleLogin = () => {
    if (name.trim() === "" || status.trim() === "") return;
    navigate('/chat',
        {
            state:{
                name,
                status,
                avatar
            }
        }
    )
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tu estado"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <div>
        {avatars.map((url) => (
          <img
            key={url}
            src={url}
            alt="avatar"
            style={{ width: 50, cursor: "pointer", border: avatar === url ? "2px solid blue" : "none" }}
            onClick={() => setAvatar(url)}
          />
        ))}
      </div>
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}
