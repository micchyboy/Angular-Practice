var mongoose = require('mongoose');
var Schema = mongoose.Schema;



module.exports.getUserModel = function () {

    mongoose.connect("mongodb://localhost/re_db");
    console.log("Connected to mongoose");
    var productSchema = Schema({
        category: String,
        description: String,
        floorArea: Number,
        image: [String],
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
        products : [productSchema]
    });

//    mongoose.model('Products', productSchema);
    var User = mongoose.model('Users', userSchema);

    return User;
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
}