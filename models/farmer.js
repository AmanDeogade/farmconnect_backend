const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                const result = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return result.test(value);
            },
            message: "Please Enter Valid Email Adress"
        }
    },
    state: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    profileImage: {
        type: String,
        default: "",
    },
    locality: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        default: "farmer",
    },
    area: {
        type: String,
        default: "",
    },
    agromethod: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return value.length >= 8;
            },
            message: "Password must be at least 8 char"
        }
    }
});

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;
