const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
let { PythonShell } = require("python-shell");

const currDB = [
  {
    id: "1",
    username: "A B",
  },
  {
    id: "2",
    username: "C D",
  },
  {
    id: "3",
    username: "E F",
  },
  {
    id: "4",
    username: "G H",
  },
  {
    id: "5",
    username: "I J",
  },
  {
    id: "6",
    username: "K L",
  },
];

var id;
var username;
var detecting;

const nextId = () => {
  szOfDBIncrement = currDB.length + 1;
  return szOfDBIncrement;
};

const getUsers = (req, res, next) => {
  const newArr = [];
  for (var i = 0; i < currDB.length; i++) {
    newArr[i] = currDB[i].username;
  }

  res.json(newArr);
};

const add = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { username } = req.body;

  let options = {
    args: [nextId()],
  };
  PythonShell.run("01-face-dataset.py", options, function (err, result) {
    if (err) throw err;
    console.log(result);
  });

  const createdUser = {
    id: nextId(),
    username,
  };

  currDB.push(createdUser);

  PythonShell.run("02-face-training.py", null, function (err, result) {
    if (err) throw err;
    console.log(result);
  });

  let options2 = {
    args: [getUsers()],
  };

  PythonShell.run("03-face-recognize.py", options2, function (err, result) {
    if (err) throw err;
    console.log(result);
  });

  res.status(201).json({ user: createdUser });
};

function resetDetecting() {
  detecting = 0;
}
const detect = (req, res, next) => {
  setInterval(resetDetecting(), 2000);

  if (id && username == "unknown") {
    res.json("Person Not Identified");
    detecting = 1;
    id = "unknown";
    username = "unknown";
  } else {
    res.json("Person Identified");
    detecting = 1;
    for (var i = 0; i < currDB.length; i++) {
      if (currDB[i].username == username) {
        return username;
      }
    }
  }
};

const status = (req, res, next) => {
  if ((detecting = 1)) {
    return username;
  }
};

exports.getUsers = getUsers;
exports.add = add;

exports.detect = detect;
exports.status = status;
