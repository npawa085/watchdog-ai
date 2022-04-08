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
  //console.log(req.body);
  const newArr = [];
  for (var i = 0; i < currDB.length; i++) {
    newArr[i] = currDB[i].username;
  }

  // res.send([newArr]);
  return newArr;
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function one() {
  console.log("f1");
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
  console.log("f2");
  PythonShell.run("02_face_training.py", null, function (err, result) {
    if (err) throw err;
    console.log(result);
    console.log("hi");
  });
}
function three() {
  console.log("f3");
  let options2 = {
    args: [getUsers()],
  };
  try {
    PythonShell.run("03_face_recognition.py", options2, function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  } catch (error) {
    console.log(error);
  }
  
}
async function four() {
  one();
  await sleep(7000);
  two();
  await sleep(2000);
  three();
}

const add = (req, res, next) => {

  const { username } = req.body;
  console.log(username);

  const newArr = [];
  for (var i = 0; i < currDB.length; i++) {
    newArr[i] = currDB[i].username;
  }
  // console.log(newArr);
  
  four();

  const createdUser = {
    id: nextId(),
    username,
  };

  console.log(currDB);
  currDB.push(createdUser);
  console.log(createdUser);
  console.log(currDB);

  res.json({ user: createdUser });
};


const detect = ( req, res ) => {
  setInterval(() => detecting=0, 2000);

  if (id == "unknown" && userName == "unknown") {
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
