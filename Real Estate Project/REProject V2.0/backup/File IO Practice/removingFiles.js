var fs = require('fs-extra');

fs.remove(thumbnailPath, function(err){
    if (err){
        console.error(err);
        res.status(500).send(err.message);
    }
    else{
        console.log("Removed images from " + thumbnailPath);
    }
});