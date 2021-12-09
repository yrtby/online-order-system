const mongoose = require("mongoose");

const { ENV_MONGO_CONNECTION_STRING } = process.env;

exports.connect = () => {
    mongoose
    .connect(ENV_MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Connection Successfull..");
    })
    .catch((error) => {
        console.log("Connection Error: ", error);
    })
};
