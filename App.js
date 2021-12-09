const express = require("express");
const { ENV_APP_PORT } = process.env;

require("dotenv").config();
require("./config/database").connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = ENV_APP_PORT || 5000;
app.listen(port, () => {
    console.log("Server is alive!");
});
