import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//TEMPORARY 
// import checkMarcoPolo from './middleware/checkMarcoPolo.js';

//load all custom env variables 
dotenv.config();

//connect to our mongodb instance
mongoose.connect(process.env.MONGO_DB)  //should be a variable env 
        .then(() => {
        console.log('Database connected succcessfully!')
        })
        .catch(err => {
          console.log(`Error: Unable to connect. ${err.message}`)
        })


// routers
import indexRouter from './routes/index.js';
import apiRouter from './routes/api/index.js';

// instance of express 
var app = express();
app.use(cookieParser());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   credentials: true
// }
// app.use(cors())
// Use CORS middleware to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend's origin
  credentials: true               // Allow credentials (cookies or headers)
}));
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'client/dist')));
// app.use('/api', checkMarcoPolo);

//use a couple of routers 
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// Generic error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
export default app;
