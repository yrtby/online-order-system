const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    }
}, { versionKey: false });

const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
