const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },
    status: {
        type: String,
        enum: ["created","accepted","cancelled","rejected","delivered"],
        default: "created"
    }
}, { timestamps: true, versionKey: false });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
