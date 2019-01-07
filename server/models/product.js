const mongoose = require('mongoose');

let Product = mongoose.model('Product', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'No short titles allowed']
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: [1, 'Price has to be greater than 0']
    },
    category: {
        type: String,
        required: true
    },
    addedAt: {
        type: Number,
        default: null
    }
});

module.exports = { Product };