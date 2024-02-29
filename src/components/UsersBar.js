import { useCallback, useEffect, useState } from "react";
import styles from "./UsersBar.module.css";
import { useGlobalContext } from "../helpers/Context";

const UsersBar = ({ users }) => {
  const globalContext = useGlobalContext();
  const [allUsers, setAllUsers] = useState(users);

  useEffect(() => {
    let newArray = users;
    setAllUsers(newArray);
  }, [users, setAllUsers]);

  const onUsernameClick = useCallback(
    (user) => {
      globalContext.setCurrentChat(user.username);
      globalContext.setCurrentChatId(user.socketId);
      console.log("Chat changed");
      const index = globalContext.users.findIndex(
        (e) => e.socketId === user.socketId
      );
      globalContext.users[index].newMessage = false;
      globalContext.setUsers([...globalContext.users]);
    },
    [globalContext]
  );

  return (
    <div className={styles.wrapper}>
      {allUsers
        .sort((a, b) => {
          if (a.username === globalContext.username) {
            return -1;
          }
        })
        .map((user) => {
          return (
            <div
              key={user.socketId}
              className={styles.userBox}
              style={{
                backgroundColor:
                  globalContext.currentChatId === user.socketId
                    ? "#f5f5f5"
                    : "",
                fontWeight: user.newMessage === true ? "bold" : "",
              }}
              onClick={() => onUsernameClick(user)}
            >
              {user.username}
              {user.username === globalContext.username ? " (you)" : ""}
            </div>
          );
        })}
    </div>
  );
};

export default UsersBar;
