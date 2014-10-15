var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.connect("mongodb://localhost/re_db");
console.log("Connected to mongoose");
var productSchema = Schema({
    category: String,
    description: String,
    floorArea: Number,
    images: [String],
    lotArea: Number,
    name: String,
    price: Number,
    city: String,
    bath: Number,
    beds: Number
});

var userSchema = Schema({
    username: String,
    password: String,
    email: String,
    phone: [String],
    products: [productSchema]
});

//    mongoose.model('Products', productSchema);
var User = mongoose.model('Users', userSchema);


//sorting by array element values
/*mongoose.model('Users').aggregate([
    { $match: {
        username: "jethro"
    }},
    { $unwind: "$products" },
    { $sort: {"products._id": -1}},
    { $limit: 1 }
], function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(result[0].products._id);
});*/
var q = require('q');
var deferred = q.defer();

deferred.resolve("test1")
deferred.resolve("test2");

deferred.promise.then(function(result){
    console.log(result)
});

//setting array element values
/*mongoose.model('Users').update(
    {
        "products.city": "Dreams"

    },
    {
        $set: {
            "products.$.bath" : 788
        }
    }
    , function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    }
)*/

/*Product.find(function (err, kittens) {
 if (err) return console.error(err);
 console.log(kittens)
 })*/
//    return Product;
/*var db = mongoose.connection;
 db.on('error', console.error.bind(console, 'connection error:'));
 db.once('open', function callback() {
 console.log("YAY CONNECTED!")
 });*/