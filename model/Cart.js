const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
}, { versionKey: false });

const Cart = mongoose.model("Cart", CardSchema);
module.exports = Cart;
