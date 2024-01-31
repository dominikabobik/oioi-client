import { useState, useEffect, useRef, useCallback } from "react";
import Bubble from "./Bubble";
import UsersBar from "./UsersBar";
import BottomBar from "./BottomBar";
import styles from "./Home.module.css";
import { socket } from "../socket";

const Home = () => {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [messages]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  function onConnectButtonClick() {
    setIsDisabled(true);
    socket.auth = { username };
    socket.connect((err) => {
      if (err) {
        // an error has occurred
        console.log("Error: ", err);
      } else {
        // the connection was successfully established
        console.log("Connection OK");
      }
    });
    console.log("End of a connect callback");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftBarWrapper}>
        <div>Enter your username:</div>
        <input
          className={styles.usernameInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isDisabled}
        />
        <button onClick={onConnectButtonClick}>Connect!</button>
        <UsersBar />
      </div>

      <div className={styles.mainChat}>
        <div>Hello, {username}!</div>
        <div ref={listRef} className={styles.bubbleWrapper}>
          {messages.map((msg) => (
            <Bubble
              username={msg.name}
              text={msg.text}
              self={username === msg.name}
              key={msg.id}
            />
          ))}
        </div>
        <BottomBar username={username} />
      </div>
    </div>
  );
};

export default Home;
