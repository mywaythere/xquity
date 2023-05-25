import React, { useState, useEffect } from "react";
import NavBar from "./modules/NavBar.js";
import { Router } from "@reach/router";
import Feed from "./pages/Feed.js";
import NotFound from "./pages/NotFound.js";
import Profile from "./pages/Profile.js";
import Chatbook from "./pages/Chatbook.js";
import Inspect from "./pages/Inspect.js";
import Explore from "./pages/Explore.js";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import "../utilities.css";
import "./App.css";

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (res) => {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    console.log("Logged out successfully!");
    setUserId(null);
    post("/api/logout");
  };

  return (
    <>
      <NavBar handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
      <div className="App-container">
        <Router>
          <Feed path="/" userId={userId} />
          <Profile path="/profile/:userId" />
          <Chatbook path="/chat/" userId={userId} />
          <Inspect path="/inspect/" userId={userId} />
          <Explore path="/explore/" userId={userId} />
          <NotFound default />
        </Router>
      </div>
    </>
  );
};

export default App;
