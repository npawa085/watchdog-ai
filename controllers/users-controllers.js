const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
let {PythonShell} = require('python-shell');


const currDB = [
  {
    id: '1',
    UserNames: 'A B'

  },
  {
    id: '2',
    UserNames: 'C D'
   
  },
  {
    id: '3',
    UserNames: 'E F'
  
  },
  {
    id: '4',
    UserNames: 'G H'
  
  },
  {
    id: '5',
    UserNames: 'I J'
 
  },
  {
    id: '6',
    UserNames: 'K L'
 
  }

];



// function count(data) {
  // for (var p in data) {
  //   if (typeof data[p] == 'object') {
  //     c++;
  //     count(data[p]);
  //   }
  // }
  // return c;
// }

const nextId = () => {
  szOfDBIncrement = currDB.length + 1;
  // var szOfDBIncrement = count(users) + 1;
return szOfDBIncrement;
}


const getUsers = (req, res, next) => {
  // for (var i in currDB){
  //   var key = i;
  //   var val = currDB[i];
  //   for (var j in val) {
  //     var sub_key = j;
  //     var sub_= val[j]
  //   }
  // }
  const newArr = [];
  for (var i = 0; i < currDB.length; i++){
    newArr[i] = currDB[i].UserNames;
  }

  res.json(newArr);
};

const add = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { UserNames } = req.body;

  let options = {
    args: [nextId()]
  };
  PythonShell.run('01-face-dataset.py', options, function(err, result) {
    if (err) throw err;
    console.log(result);

});

const createdUser = {
  id,
  UserNames 
};

currDB.push(createdUser);

PythonShell.run('02-face-training.py', null, function(err, result) {
  if (err) throw err;
  console.log(result);

});

let options2 = {
  args: [getusers()]
};

PythonShell.run('03-face-recognize.py', options2, function(err, result) {
  if (err) throw err;
  console.log(result);

});

res.status(201).json({user: createdUser});
};


exports.getUsers = getUsers;
exports.add = add;
