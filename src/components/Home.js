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

  // useEffect(() => {
  //   socket.on("private-message", (data) => {
  //     console.log("Got a message: ", data);
  //     console.log("Current ID: ", globalContext.currentChatId);
  //     console.log("HEREEEE: ", globalContext.globalMessageMap);
  //     globalContext.setGlobalMessageMap(
  //       new Map(
  //         globalContext.globalMessageMap[
  //           globalContext.currentChatId
  //         ].messages.push(data)
  //       )
  //     );
  //     setMessages([...messages, data]);
  //   });
  // }, [messages, globalContext.currentChatId]);

  useEffect(() => {
    setMessages(currentMessages);
  }, [currentMessages]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);

  // useEffect(() => {
  //   const onConnectButtonClick = () => {
  //     setIsDisabled(true);
  //     socket.auth = { username };
  //     console.log("Connect");
  //     socket.connect((err) => {
  //       if (err) {
  //         // an error has occurred
  //         console.log("Error: ", err);
  //       } else {
  //         // the connection was successfully established
  //         console.log("Connection OK");
  //       }
  //     });
  //   };
  // }, []);
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
        console.log("Connection OK");
      }
    });
    console.log("End of a connect callback");
  }, [username]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftBarWrapper}>
        <div>Enter your username:</div>
        <input
          className={styles.usernameInput}
          value={username}
          onChange={(e) => {
            console.log("Setting username", e.target.value);
            globalContext.setUsername(e.target.value);
            setUsername(e.target.value);
          }}
          disabled={isDisabled}
        />
        <button onClick={onConnectButtonClick}>Connect!</button>
        <UsersBar users={users} />
      </div>

      <div className={styles.mainChat}>
        <div>Hello, {username}!</div>
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
