const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: null
    },
    business_name: {
        type: String,
        default: null
    },
    business_address: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["admin","seller","user"],
        default: null
    }
},{ timestamps: true, versionKey: false });

const User = mongoose.model("User",UserSchema);
module.exports = User;

