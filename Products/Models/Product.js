const { Schema, model } = require('mongoose')

const Product = new Schema({
    title: String,
    imageUrl: String,
    liked: Boolean,
    isOnSale: Boolean,
    oldPrice: Number,
    newPrice: Number,
    ratingVoid: Number,
    text: String,
    containerVolume: [
        {
            id: Number,
            value: String,
            name: String,
        },
    ],
    Section: Schema.Types.ObjectId
});

module.exports = model('Product', Product);
