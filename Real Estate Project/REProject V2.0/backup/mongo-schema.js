db.products.update(
    {
        id : {
            $exists : true
        }
    },
    {
        $unset : {
            id : 1
        }
    },
    {
        multi: true
    }
);