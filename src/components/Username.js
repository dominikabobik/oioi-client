import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Username = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const onSaveClick = () => {
    sessionStorage.setItem("username", JSON.stringify(username));
    navigate("/");
  };

  return (
    <div>
      <div>Enter your username</div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={onSaveClick}>Save</button>
    </div>
  );
};

export default Username;
