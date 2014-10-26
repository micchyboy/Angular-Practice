var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.connect("mongodb://localhost/re_db");
console.log("Connected to mongoose");
var productSchema = new Schema({
    category: String,
    description: String,
    floorArea: Number,
    galleryImages: [{path: String, imageDescription: String}],
    thumbnailImages: [String],
    lotArea: Number,
    name: String,
    price: Number,
    city: String,
    bath: Number,
    beds: Number,
    primaryImage: String,
    features: [String],
    details: [String],
    createdAt: { type: Date, default : Date.now },
    updatedAt: { type: Date, default : Date.now }
});

var userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    phone: [String],
    products : [productSchema]
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

//Getting array from document in descending sort order
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
        res.status(500).send(err.message);
    }
    else {
        var productId = result[0].products._id
        console.log("Product Id: " + productId);
        res.json({"productId": productId});
    }
});*/



/*mongoose.model('Users').update(
    {
        "products.name": "test"

    },
    {
        $addToSet: {
            "products.$.images": ["teeeeest!"]
        },
        "$set": {
            "products.$.primaryImage" : "Set this shiiii"
        }
    }

    , function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    }
)

mongoose.model('Users').find({username: "jethro"}

    , function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    }
)*/
/*db.presentations.update(
    {
        'content.assets._id': ObjectId('4fc63def5b20fb722900010e')
    },
    {
        $pull: {
            'content.$.assets': {
                '_id': ObjectId('4fc63def5b20fb722900010e')
            }
        }
    }
)*/

//deleting items from nested arrays
/*mongoose.model('Users').update(
    {
        "products.galleryImages.imageDescription": "green"
    },
    {
        $pull: {
            "products.$.galleryImages": {
                "imageDescription" : "green"
            }
        }
    }
    , function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log("deleted product: " + result);
    }
)*/

mongoose.model('Users').update(
    {
        "products.galleryImages.imageDescription": "penguin"
    },
    {
        $pull: {
            "products.$.thumbnailImages": "/images/thumbnails/jethro/544c683f036eeb7415ad079e/Desert.jpg"
        }
    }
    , function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log("deleted product: " + result);
    }
)


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