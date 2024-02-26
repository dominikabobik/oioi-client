import { useCallback, useEffect, useState } from "react";
import styles from "./UsersBar.module.css";
import { socket } from "../socket";
import { useGlobalContext } from "../helpers/Context";

const UsersBar = ({ users }) => {
  const globalContext = useGlobalContext();
  const [allUsers, setAllUsers] = useState(users);

  useEffect(() => {
    let newArray = users;
    setAllUsers(newArray);
  }, [users, setAllUsers]);

  const onUsernameClick = useCallback((user) => {
    globalContext.setCurrentChat(user.username);
    globalContext.setCurrentChatId(user.socketId);
    console.log("Chat changed");
  }, []);

  return (
    <div className={styles.wrapper}>
      <h3>Current Chat: </h3>
      <div>{globalContext.currentChat}</div>
      <div>My contacts</div>
      {allUsers.map((user) => {
        return (
          <div
            key={user.socketId}
            className={styles.userBox}
            onClick={() => onUsernameClick(user)}
          >
            {user.username}
          </div>
        );
      })}
    </div>
  );
};

export default UsersBar;
