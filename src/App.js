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
      console.log("setting all users");
      setUsers(value);
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
      });
    }
    socket.on("users", onUsers);

    return () => {
      socket.off("users", onUsers);
    };
  }, [globalMessageMap]);

  useEffect(() => {
    function onUserDisconnected(value) {
      console.log("removing a user");
      globalMessageMap.delete(value);
    }
    socket.on("user-disconnected", onUserDisconnected);

    return () => {
      socket.off("user-disconnected", onUserDisconnected);
    };
  }, [globalMessageMap]);

  useEffect(() => {
    function onPrivateMessage(data) {
      console.log("Got a message: ", data);
      console.log("TO: ", data.toName, data.toId);
      console.log("FROM: ", data.fromName, data.fromId);
      console.log("MAP: ", globalMessageMap.get(data.fromId));
      let messages = [];

      if (data.fromName === username) {
        if (globalMessageMap.get(currentChatId) === undefined) {
          console.log("Case1");
          let username = data.toName;
          messages = [];
          messages.push(data);
          setGlobalMessageMap(
            new Map(globalMessageMap.set(currentChatId, { username, messages }))
          );
        } else {
          console.log("Case2: ", globalMessageMap.get(currentChatId));
          let username = globalMessageMap.get(currentChatId).username;
          let messages = globalMessageMap.get(currentChatId).messages;
          console.log("Case2 msgs:", messages);
          messages.push(data);
          setGlobalMessageMap(
            new Map(globalMessageMap.set(currentChatId, { username, messages }))
          );
        }
      } else {
        if (globalMessageMap.get(data.fromId) === undefined) {
          console.log("Case3");
          let username = data.fromName;
          messages = [];
          messages.push(data);
          setGlobalMessageMap(
            new Map(globalMessageMap.set(data.fromId, { username, messages }))
          );
        } else {
          console.log("Case4");
          let username = globalMessageMap.get(data.fromId).username;
          messages = globalMessageMap.get(data.fromId).messages;
          console.log("here", username);
          messages.push(data);
          setGlobalMessageMap(
            new Map(globalMessageMap.set(data.fromId, { username, messages }))
          );
        }
      }
      if (globalMessageMap.get(currentChatId) !== undefined) {
        console.log(
          "Setting current messages to:",
          globalMessageMap.get(currentChatId).messages
        );
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
