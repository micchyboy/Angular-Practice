/*var config = {
 test: 'mongodb://localhost/re_db'
 };*/

var express = require('express');
var bcrypt = require('bcryptjs');
var Q = require('Q');
var logger = require('morgan');
var mongoose = require('mongoose');

//for authentication
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var passport = require('passport');
var passportLocal = require('passport-local');

//for file upload
var fs = require('fs');
//var busboy = require('connect-busboy');
var Busboy = require('busboy');

var app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

//app.use(busboy());
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

passport.use(new passportLocal.Strategy(function (username, password, done) {
    console.log("Passport Local Strategy commence")
    User.findOne({username: username}, function (err, data) {
        if (data.length != 0) {
            console.log("Username matches. Comparing passwords");
            console.log("Queried object password: " + data.password)
            if (bcrypt.compareSync(password, data.password)) {
                console.log("Match! Signing in...");
                done(null, data)
            }
            else {
                done(new Error("Wrong password"));
            }
        }
        else if (err) {
            done(err, null);
        }
        else {
            done(null, null);
        }
    });
}));

passport.serializeUser(function (user, done) {
    console.log("Serialize to session")
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    console.log("Deserialize from session " + username)
    //Query database or cache here!
    done(null, {username: username});
});


/*app.get('/', function(req, res){
 res.render('public/admin',{
 isAuthenticated: req.isAuthenticated(),
 user: req.user
 });
 });*/

/*app.get('/login', function (req, res) {
 console.log("BOOM PUNET!");
 res.render('login');
 });*/

app.post('/login',
    passport.authenticate('local'),
    function (req, res) {
//        console.log(req.headers)
        console.log("CMOOOOOOOOOON!!")
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        console.log("My User object: " + req.user)
        res.json({
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        })
    });

app.post('/signup', function (req, res) {
    console.log("Sign UP!!")
    var deferred = Q.defer();

//        console.log(req.headers)

    User.find({ username: req.body.username }, function (err, data) {
        if (err) {
            deferred.reject(err);
        }
        else {
            console.log("Continue");
            if (data.length != 0) {
                deferred.reject(new Error("This username is already existing!"));
            }
            else {
                try {
                    console.log("Continue 2");
                    var hash = bcrypt.hashSync(req.body.password, 8);
                    console.log("hash password" + hash);
                    var user = new User({
                        username: req.body.username,
                        password: hash,
                        email: req.body.email,
                        phone: req.body.phone
                    });


                    user.save(function (err, user) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            console.log("Now Saved!!")
                            deferred.resolve(user)
                        }
                    });
                }
                catch (err) {
                    console.log("CATCHUUUUU!")
                    deferred.reject(err);
                }


            }
        }
    })

    deferred.promise.then(function (data) {

        res.json(data);
    }, function (err) {
        console.log("THE REAAASSSOOONNN!!! " + err);
        res.status(500).send(err.message);
    });
});

app.post('/create', function (req, res) {
//        console.log(req.headers)
    console.log("Creating product..")
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log("My User object: " + req.body.user.username);
    var promise = User.findOne({ username: req.body.user.username }).exec();
    promise.then(function (user) {
            try {
                console.log("Mapping product schema..");
                var product = {
                    category: req.body.category,
                    description: req.body.description,
                    floorArea: req.body.floorArea,
                    image: req.body.images,
                    lotArea: req.body.lotArea,
                    name: req.body.name,
                    price: req.body.price,
                    city: req.body.city,
                    bath: req.body.bath,
                    beds: req.body.beds
                };
                user.products.push(product);

                console.log("Saving product..")
                user.save(function (err, data) {
                    if (err) {
                        console.log("Error2: ", err);
                        res.status(500).send(err.message);
                    }
                    else {
                        console.log("Data is now Saved")
                        res.json(data);
                    }
                })
            }
            catch(err){
                console.log(err);
                res.status(500).send(err.message);
            }

        },
        function (err) {
            console.log("Error1: ", err);
            res.status(500).send(err.message);
        });
});


app.post('/file_upload', function (req, res) {
    console.log("Received images");
    var fstream;
    console.log("Headers: " + req.headers);
    var busboy = new Busboy({ headers: req.headers });
    req.pipe(busboy);
    busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});

var schemas = require('./db/schemas.js');
var User = new schemas.getUserModel();
require('./routes/products-rest.js')(app);


app.use(express.static(__dirname + '/public'));
/*
 require('./routes/db')

 app.use(logger('combined')); //replaces your app.use(express.logger());
 app.get('/api/:name', function(req, res) {
 res.json(200, { "hello": req.params.name });
 });
 */
app.listen(5501, function () {
    console.log("ready kapitan!");
});
