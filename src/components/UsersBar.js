import { useEffect, useState } from "react";
import styles from "./UsersBar.module.css";
import { socket } from "../socket";

const UsersBar = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    async function userList() {
      socket.on("users", (users) => {
        console.log("USERS", users);
        setAllUsers(users);
      });
    }
    userList();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div>My contacts</div>
      {allUsers.map((user) => {
        return (
          <div key={user.socketId} className={styles.userBox}>
            {user.username}
          </div>
        );
      })}
    </div>
  );
};

export default UsersBar;
