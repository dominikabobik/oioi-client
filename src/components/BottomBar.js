import { useState, useEffect } from "react";
import styles from "./BottomBar.module.css";
import { socket } from "../socket";

const BottomBar = ({ username }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((message === undefined) | (message === null) | (message === "")) return;
    socket.emit("message", {
      text: message,
      name: username,
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    });
    setMessage("");
  };

  useEffect(() => {
    const enterHandler = async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSendMessage(event);
      }
    };
    document.addEventListener("keydown", enterHandler);
    return () => {
      document.removeEventListener("keydown", enterHandler);
    };
  }, [message, handleSendMessage]);

  return (
    <div className={styles.wrapper}>
      <input
        name="message"
        placeholder="enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoComplete={"off"}
        className={styles.textInput}
      />
      <button onClick={handleSendMessage} className={styles.sendButton}>
        Send
      </button>
    </div>
  );
};

export default BottomBar;
