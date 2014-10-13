var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {

    mongoose.connect("mongodb://localhost/re_db");

    var productSchema = Schema({
        category: String,
        description: String,
        floorArea: Number,
        image: String,
        lotArea: Number,
        name: String,
        price: Number,
        id: String
    })

    mongoose.model('Products', productSchema);



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