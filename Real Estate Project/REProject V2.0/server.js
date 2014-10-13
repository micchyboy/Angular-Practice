
/*var config = {
    test: 'mongodb://localhost/re_db'
};*/

var express = require('express');

var logger = require('morgan');
var mongoose = require('mongoose');


var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username, password, done){
    console.log("Passport Local Strategy commence")
    //Pretend this is using a real database
    if(username === password){
        done(null, { id: username, name: username});
    }
    else{
        done(null, null);
    }
}));

passport.serializeUser(function(user, done){
    console.log("Serialize to session")
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    console.log("Deserializa from session")
    //Query database or cache here!
   done(null, {id: id, name: id});
});



/*app.get('/', function(req, res){
 res.render('public/admin',{
 isAuthenticated: req.isAuthenticated(),
 user: req.user
 });
 });*/

app.get('/login', function(req, res){
    console.log("BOOM PUNET!");
    res.render('login');
});

app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
//        console.log(req.headers)
        console.log("CMOOOOOOOOOON!!")
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.json({
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        })
    });

require('./db/schemas.js')();
require('./routes/products-rest.js')(app);





app.use(express.static(__dirname + '/public'));
/*
require('./routes/db')

app.use(logger('combined')); //replaces your app.use(express.logger());
app.get('/api/:name', function(req, res) {
    res.json(200, { "hello": req.params.name });
});
*/
app.listen(5501, function(){
    console.log("ready kapitan!");
});
