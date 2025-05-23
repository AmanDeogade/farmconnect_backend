const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    quantityUnit: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    farmerId: {
        type: String,
        required: true,
    },

    fullName: {
        type: String,
        required: true,
    },

    subCategory: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    popular: {
        type: Boolean,
        default: true
    },
    recommend: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('Product', productSchema); //create model
module.exports = Product;
