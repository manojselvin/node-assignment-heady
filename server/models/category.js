const mongoose = require('mongoose');

let Category = mongoose.model('Category', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'No short titles allowed']
    },
    childCategories: {
        type: Array,
        required: false
    },
    addedAt: {
        type: Number,
        default: null
    }
});

module.exports = { Category };