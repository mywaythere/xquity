const express = require("express");

// import models so we can interact with the database
const Story = require("./models/story");
const Comment = require("./models/comment");
const User = require("./models/user");
const Message = require("./models/message");
const Portrait = require("./models/portrait");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

const socketManager = require("./server-socket");

router.get("/stories", (req, res) => {
  // empty selector means get all documents
  Story.find({}).then((stories) => res.send(stories));
});

router.post("/story", auth.ensureLoggedIn, (req, res) => {
  const newStory = new Story({
    creator_id: req.user._id,
    creator_name: req.user.name,
    content: req.body.content,
  });

  newStory.save().then((story) => res.send(story));
});

router.get("/comment", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

router.post("/comment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new Comment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    parent: req.body.parent,
    content: req.body.content,
  });

  newComment.save().then((comment) => res.send(comment));
});

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/chat", (req, res) => {
  let query;
  if (req.query.recipient_id === "ALL_CHAT") {
    // get any message sent by anybody to ALL_CHAT
    query = { "recipient._id": "ALL_CHAT" };
  } else {
    // get messages that are from me->you OR you->me
    query = {
      $or: [
        { "sender._id": req.user._id, "recipient._id": req.query.recipient_id },
        { "sender._id": req.query.recipient_id, "recipient._id": req.user._id },
      ],
    };
  }

  Message.find(query).then((messages) => res.send(messages));
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  console.log(`Received a chat message from ${req.user.name}: ${req.body.content}`);
  // insert this message into the database
  const message = new Message({
    recipient: req.body.recipient,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: req.body.content,
  });
  message.save();

  if (req.body.recipient._id == "ALL_CHAT") {
    socketManager.getIo().emit("message", message);
  } else {
    socketManager.getSocketFromUserID(req.user._id).emit("message", message);
    if (req.user._id !== req.body.recipient._id) {
      socketManager.getSocketFromUserID(req.body.recipient._id).emit("message", message);
    }
  }
});

router.get("/portrait", (req, res) => {
  Portrait.findById(req.user._id).then((portrait) => {
    res.send(portrait);
  });
});

router.post("/story", auth.ensureLoggedIn, (req, res) => {
  const newStory = new Story({
    creator_id: req.user._id,
    creator_name: req.user.name,
    content: req.body.content,
  });

  newStory.save().then((story) => res.send(story));
});
router.post("/age", auth.ensureLoggedIn, (req, res) => {
  Portrait.findByIdAndUpdate(req.user._id, { age: req.body.age }, { upsert: true })
    .then(() => res.send("Successful"))
    .catch((err) => {
      const portrait = new Portrait({
        name: req.user.name,
        age: req.body.content,
        occupation: "",
        gender: "",
      });
      portrait.save().then((portrait) => res.send(portrait));
    });
});
router.post("/gender", auth.ensureLoggedIn, (req, res) => {
  Portrait.findByIdAndUpdate(req.user._id, { gender: req.body.gender }, { upsert: true })
    .then(() => res.send("Successful"))
    .catch((err) => {
      const portrait = new Portrait({
        name: req.user.name,
        gender: req.body.content,
        occupation: "",
        age: 0,
      });
      portrait.save().then((portrait) => res.send(portrait));
    });
});
router.post("/occupation", (req, res) => {
   Portrait.findByIdAndUpdate(req.query.userid, { occupation: req.body.content })
    .then(() => res.send("Successful"))
    .catch((err) => {
      const portrait = new Portrait({
        name: req.user.name,
        occupation: req.body.content,
        age: 0,
        gender: "",
      });
      portrait.save().then((portrait) => res.send(portrait));
    });
});

router.post("/spawn", (req, res) => {
  if (req.user) {
    socketManager.addUserToExplore(req.user);
  }
  res.send({});
});

router.post("/despawn", (req, res) => {
  if (req.user) {
    socketManager.removeUserFromExplore(req.user);
  }
  res.send({});
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
