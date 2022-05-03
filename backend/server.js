require('dotenv').config()
const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser'); 
const app = express();
const mongoose = require('mongoose');


const cors = require('cors');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(expressSession({ resave: false ,secret: '123456' , saveUninitialized: true}));
app.use(express.static(__dirname + '/www'));

mongoose.connect('mongodb://localhost:27017/user')
  .then( () => console.log("Database successfully connected") )
  .catch( (err) => { console.log("Could not connect to database : " + err); /*process.exit(1)*/ } );
mongoose.set('debug', true);

//! use router 
const UsersRoute = require('./src/routes/index')
app.use('/', UsersRoute);

app.listen(3000, () => {
  console.log('Application is running on port 3000');
});