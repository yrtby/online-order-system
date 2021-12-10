const express = require("express");
const { ENV_APP_PORT } = process.env;

require("dotenv").config();
require("./config/database").connect();

const authRoute = require("./route/authRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);

const port = ENV_APP_PORT || 5000;
app.listen(port, () => {
    console.log("Server is alive!");
});
