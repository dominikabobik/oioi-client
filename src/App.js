import { useEffect, useState } from "react";
import Home from "./components/Home.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { socket } from "./socket.js";
import React from "react";
import { globalContext } from "./helpers/Context";

const App = () => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [globalMessageMap, setGlobalMessageMap] = useState(new Map());
  const [currentMessages, setCurrentMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    function onUsers(value) {
      console.log("Setting all users");
      value.forEach((user) => {
        if (globalMessageMap[user.socketId] === undefined) {
          console.log("Adding new user to the map: ", user);
          setGlobalMessageMap(
            new Map(
              globalMessageMap.set(user.socketId, {
                username: user.username,
                messages: [],
              })
            )
          );
        }
        if (users.find((e) => e.socketId === user.socketId) === undefined) {
          console.log("Adding ", user.username);
          user.newMessage = false;
          setUsers((prev) => [...prev, user]);
        }
      });
      setCurrentChat(username);
      setCurrentChatId(socket.id);
    }
    socket.on("users", onUsers);

    return () => {
      socket.off("users", onUsers);
    };
  }, [
    globalMessageMap,
    users,
    setUsers,
    username,
    socket,
    setCurrentChat,
    setCurrentChatId,
  ]);

  useEffect(() => {
    function onUserDisconnected(id) {
      console.log("removing a user");
      globalMessageMap.delete(id);
      let index = users.findIndex((e) => e.socketId === id);
      users.splice(index, 1);
      setUsers([...users]);
    }
    socket.on("user-disconnected", onUserDisconnected);

    return () => {
      socket.off("user-disconnected", onUserDisconnected);
    };
  }, [globalMessageMap]);

  useEffect(() => {
    function onPrivateMessage(data) {
      console.log("Got a message: ", data);
      let messages = [];
      let incomingUsername;
      let key;

      if (data.fromName === username) {
        key = currentChatId;
        if (globalMessageMap.get(currentChatId) === undefined) {
          incomingUsername = data.toName;
          messages = [];
        } else {
          incomingUsername = globalMessageMap.get(currentChatId).username;
          messages = globalMessageMap.get(currentChatId).messages;
        }
      } else {
        key = data.fromId;
        if (globalMessageMap.get(data.fromId) === undefined) {
          incomingUsername = data.fromName;
          messages = [];
        } else {
          incomingUsername = globalMessageMap.get(data.fromId).username;
          messages = globalMessageMap.get(data.fromId).messages;
        }
        const index = users.findIndex((e) => e.socketId === key);
        console.log("index:", index, "USERS list:", users);
        if (index > 0) {
          users[index].newMessage = true;
          setUsers([...users]);
        }
      }
      console.log("Setting values with: ", messages, incomingUsername, key);
      messages.push(data);
      setGlobalMessageMap(
        new Map(globalMessageMap.set(key, { incomingUsername, messages }))
      );
      if (globalMessageMap.get(currentChatId) !== undefined) {
        setCurrentMessages(globalMessageMap.get(currentChatId).messages);
      }
    }
    socket.on("private-message", onPrivateMessage);

    return () => {
      socket.off("private-message");
    };
  }, [
    username,
    currentChatId,
    globalMessageMap,
    setCurrentChatId,
    setGlobalMessageMap,
    setCurrentMessages,
    currentMessages,
    users,
    setUsers,
  ]);

  useEffect(() => {
    if (globalMessageMap.get(currentChatId) === undefined) {
      setCurrentMessages([]);
    } else {
      setCurrentMessages(globalMessageMap.get(currentChatId).messages);
    }
  }, [currentChatId, globalMessageMap, setCurrentMessages]);

  return (
    <globalContext.Provider
      value={{
        currentChat: currentChat,
        setCurrentChat: setCurrentChat,
        currentChatId: currentChatId,
        setCurrentChatId: setCurrentChatId,
        globalMessageMap: globalMessageMap,
        setGlobalMessageMap: setGlobalMessageMap,
        username: username,
        setUsername: setUsername,
        users: users,
        setUsers: setUsers,
      }}
    >
      <div>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home users={users} currentMessages={currentMessages} />
                  {/* {sessionStorage.getItem("username") !== "" ? (
                  <Home socket={socket} />
                ) : (
                  <Username />
                )} */}
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </globalContext.Provider>
  );
};

export default App;
