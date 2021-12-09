const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
}, { timestamps: true, versionKey: false });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
