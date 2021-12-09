const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    }
},{ versionKey: false });

const Product = mongoose.model("Product",ProductSchema);
module.exports = Product;