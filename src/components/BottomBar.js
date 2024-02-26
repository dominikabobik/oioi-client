import { useState, useEffect, useCallback } from "react";
import styles from "./BottomBar.module.css";
import { socket } from "../socket";
import { useGlobalContext } from "../helpers/Context";
import { v4 as uuidv4 } from "uuid";

const BottomBar = ({ username }) => {
  const globalContext = useGlobalContext();
  const [message, setMessage] = useState("");

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if ((message === undefined) | (message === null) | (message === ""))
        return;
      socket.emit("private-message", {
        text: message,
        fromName: username,
        messageId: `${socket.id}${uuidv4()}`,
        fromId: socket.id,
        toId: globalContext.currentChatId,
        toName: globalContext.currentChat,
      });
      setMessage("");
    },
    [message, username, globalContext]
  );

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
