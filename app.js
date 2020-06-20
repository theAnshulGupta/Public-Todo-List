/** @format */

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

let items = ["Daily Commit", "Study", "Walk outside", "Pet Dog", "Fix Bugs"];

app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;

  if (item != "") {
    items.push(item);
  }

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server listening on port 3000");
});
