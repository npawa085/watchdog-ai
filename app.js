const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const cors=require("cors");
const corsOptions ={
   origin:'*',
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use('/', routes);

// app.use((req, res, next) => {
//   const error = new HttpError('Could not find this route.', 404);
//   throw error;
// });

// app.use((error, req, res, next) => {
//   if (res.headerSent) {
//     return next(error);
//   }
//   res.status(error.code || 500)
//   res.json({message: error.message || 'An unknown error occurred!'});
// });

app.listen(3003);