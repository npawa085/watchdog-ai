// const { validationResult } = require("express-validator");
// const HttpError = require("../models/http-error");
let { PythonShell } = require("python-shell");

const currDB = [
  {
    id: 1,
    username: "A B",
  },
  {
    id: 2,
    username: "C D",
  },
  {
    id: 3,
    username: "E F",
  },
  {
    id: 4,
    username: "G H",
  },
  {
    id: 5,
    username: "I J",
  },
  {
    id: 6,
    username: "K L",
  },
];

var id;
var userName;
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

  //res.send([newArr]);
  return newArr;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function one() {
  let options = {
    args: [nextId()],
  };
  PythonShell.run("01_face_dataset.py", options, function (err, result) {
    if (err) throw err;
    console.log(result);
    console.log("hello");
  });
}
function two() {
  PythonShell.run("02_face_training.py", null, function (err, result) {
    if (err) throw err;
    console.log(result);
    console.log("hi");
  });
}
function three() {
  let options2 = {
    args: [getUsers()],
  };
  PythonShell.run("03_face_recognition.py", options2, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
}
async function four() {
  one();
  await sleep(7000);
  two();
  await sleep(2000);
  three();
}

const add = (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   console.log(req);
  //   throw new HttpError("Invalid inputs passed, please check your data.", 422);
  // }

  const { username } = req.body;
  // let options = {
  //   args: [nextId()]
  // };
  //console.log("hi");

  // PythonShell.run("01_face_dataset.py", options, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   console.log("hello");
  // });
  const newArr = [];
  for (var i = 0; i < currDB.length; i++) {
    newArr[i] = currDB[i].username;
  }
  console.log(newArr);
  console.log(getUsers());
  four();

  const createdUser = {
    id: nextId(),
    username,
  };

  console.log(currDB);
  currDB.push(createdUser);
  console.log(createdUser);
  console.log(currDB);

  // PythonShell.run("02_face_training.py", null, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   console.log("hi");
  // });

  // let options2 = {
  //   args: [getUsers()]
  // };

  // PythonShell.run("03_face_recognition.py", options2, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  // });

  res.json({ user: createdUser });
};

function resetDetecting() {
  detecting = 0;
}
const detect = (req, res, next) => {
  setInterval(resetDetecting(), 2000);

  if (id && userName == "unknown") {
    res.send("Person Not Identified");
    detecting = 1;
    id = "unknown";
    userName = "unknown";
  } else {
    res.send("Person Identified");
    detecting = 1;
    for (var i = 0; i < currDB.length; i++) {
      if (currDB[i].username == userName) {
        return userName;
      }
    }
  }
};

const status = (req, res, next) => {
  if ((detecting = 1)) {
    return userName;
  }
};

exports.getUsers = getUsers;
exports.add = add;

exports.detect = detect;
exports.status = status;
