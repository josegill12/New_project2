require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const session = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
// Controllers
const userController = require("./controller/userController.js");
const { log } = require("console");

app.set("view engine", "ejs");
// Middleware
app.use(expressLayouts);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({ secret: "somestringreandomdwd", cookie: { maxAge: 3600000 } })
);
app.use(express.static("public"));
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use(userController);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
