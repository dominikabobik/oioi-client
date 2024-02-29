import { useState, useEffect, useRef, useCallback } from "react";
import Bubble from "./Bubble";
import UsersBar from "./UsersBar";
import BottomBar from "./BottomBar";
import styles from "./Home.module.css";
import { socket } from "../socket";
import { useGlobalContext } from "../helpers/Context";

const Home = ({ users, currentMessages }) => {
  const globalContext = useGlobalContext();
  const [messages, setMessages] = useState(currentMessages);
  const [isDisabled, setIsDisabled] = useState(false);
  const [username, setUsername] = useState(globalContext.username);
  const listRef = useRef();

  useEffect(() => {
    setMessages(currentMessages);
  }, [currentMessages]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  const onConnectButtonClick = useCallback(() => {
    setIsDisabled(true);
    socket.auth = { username };
    console.log("Connect");
    socket.connect((err) => {
      if (err) {
        // an error has occurred
        console.log("Error: ", err);
      } else {
        // the connection was successfully established
        console.log("Connection OK ", socket.id);
      }
    });
    console.log("End of a connect callback");
  }, [username, globalContext, socket]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftBarWrapper}>
        <div>Enter your username:</div>
        <br />
        <input
          className={styles.usernameInput}
          value={username}
          onChange={(e) => {
            globalContext.setUsername(e.target.value);
            setUsername(e.target.value);
          }}
          disabled={isDisabled}
        />
        {!isDisabled && (
          <button onClick={onConnectButtonClick}>Connect!</button>
        )}
        <br />
        <UsersBar users={users} />
      </div>

      <div className={styles.mainChat}>
        <div ref={listRef} className={styles.bubbleWrapper}>
          {messages.map((msg) => {
            return (
              <Bubble
                username={msg.fromName}
                text={msg.text}
                self={username === msg.fromName}
                key={msg.messageId}
                id={msg.messageId}
              />
            );
          })}
        </div>
        <BottomBar username={username} />
      </div>
    </div>
  );
};

export default Home;
