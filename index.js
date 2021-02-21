const express = require('express');
const mongoose = require('mongoose');
const expressSession = require('express-session');

const connectionString = 'mongodb://localhost/sentri';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
const port = process.env.PORT || 2306;

// mongodb configuration
mongoose.connect(connectionString, options,(connectionError)=>{
    if(connectionError)
    console.log(`Connection Error:\n ${connectionError.message}`);
    else
    console.log(`Mongodb connected to ${connectionString}`);
});

const app = express();

// For CORS
app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.append('Access-Control-Allow-Credentials', true);
    res.append('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE']);
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// For request parser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));


app.use(expressSession({
    saveUninitialized: true,
    resave: true,
    secret: 'sentri'
  }));
  

// For Passport Auth
const passport = require('passport');
require('./server/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// For API routes
const userRoutes = require('./server/routes');

app.use('/api/user', userRoutes);

app.listen(port, ()=>{
    console.log(`Server Listening at port ${port}`);
});