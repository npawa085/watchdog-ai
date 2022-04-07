// const uuid = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
let {PythonShell} = require('python-shell');


const TEST_DB = [
  {
    id: '1',
    name: 'A B'

  },
  {
    id: '2',
    name: 'C D'
   
  },
  {
    id: '3',
    name: 'E F'
  
  },
  {
    id: '4',
    name: 'G H'
  
  },
  {
    id: '5',
    name: 'I J'
 
  },
  {
    id: '6',
    name: 'K L'
 
  }

];




function count(data) {
  //var c = 0;
  for (var p in data) {
    if (typeof data[p] == 'object') {
      c++;
      count(data[p]);
    }
  }
  return c;
}

const nextId = () => {
  var szOfDBIncrement = count(users) + 1;
return szOfDBIncrement;
}


const getUsers = (req, res, next) => {
  res.json({ users: TEST_DB });
};

const add = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { name } = req.body;

  let options = {
    args: [nextId()]
  };
  PythonShell.run('01-face-dataset.py', options, function(err, result) {
    if (err) throw err;
    console.log(result);

});

const createdUser = {
  id,
  name 
};

TEST_DB.push(createdUser);

PythonShell.run('02-face-training.py', null, function(err, result) {
  if (err) throw err;
  console.log(result);

});

let options2 = {
  args: [getusers()]
};

PythonShell.run('01-face-dataset.py', options2, function(err, result) {
  if (err) throw err;
  console.log(result);

});

res.status(201).json({user: createdUser});
};


exports.getUsers = getUsers;
exports.add = add;
