const exploreLogic = require("./explore-logic");

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getAllConnectedUsers = () => Object.values(socketToUserMap);
const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

/** Send explore state to client */
const sendExploreState = () => {
  io.emit("update", exploreLogic.exploreState);
};

/** Start running explore: explore loop emits explore states to all clients at 60 frames per second */
const startRunningExplore = () => {
  let winResetTimer = 0;
  setInterval(() => {
    exploreLogic.updateExploreState();
    sendExploreState();

    // Reset explore 5 seconds after someone wins.
    if (exploreLogic.exploreState.winner != null) {
      winResetTimer += 1;
    }
    if (winResetTimer > 60 * 5) {
      winResetTimer = 0;
      exploreLogic.resetWinner();
    }
  }, 1000 / 60); // 60 frames per second
};

startRunningExplore();

const addUserToExplore = (user) => {
  exploreLogic.spawnPlayer(user._id);
};

const removeUserFromExplore = (user) => {
  exploreLogic.removePlayer(user._id);
};

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

const removeUser = (user, socket) => {
  if (user) {
    delete userToSocketMap[user._id];
    removeUserFromExplore(user); // Remove user from explore if they disconnect
  }
  delete socketToUserMap[socket.id];
  io.emit("activeUsers", { activeUsers: getAllConnectedUsers() });
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      socket.on("move", (dir) => {
        // Listen for moves from client and move player accordingly
        const user = getUserFromSocketID(socket.id);
        if (user) exploreLogic.movePlayer(user._id, dir);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getAllConnectedUsers: getAllConnectedUsers,
  addUserToExplore: addUserToExplore,
  removeUserFromExplore: removeUserFromExplore,
  getIo: () => io,
};
