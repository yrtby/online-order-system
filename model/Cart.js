const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true, versionKey: false });

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
