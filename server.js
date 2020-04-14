const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "Amber",
      password: "cookies",
      email: "amber@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Annette",
      password: "art",
      email: "annette@gmail.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "amber@gmail.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    "cookies",
    "$2a$10$q/DmvdsS9o.SRoxHUOR2KeyUIeg7V/9y.19PXezrnVqskwzrJ1q5e",
    function (err, res) {
      console.log("first guess:", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$q/DmvdsS9o.SRoxHUOR2KeyUIeg7V/9y.19PXezrnVqskwzrJ1q5e",
    function (err, res) {
      console.log("Second guess:", res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });

  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.listen(3000, () => {
  console.log("app is running smoothly");
});

/* 
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
image --> PUT --> user
*/
