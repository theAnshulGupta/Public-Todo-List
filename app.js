const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

let items = ["Daily Commit", "Study", "Walk outside", "Pet Dog", "Fix Bugs"];

let workItems = [];
app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);
  res.render("list", {
    listTitle: day,
    newListItems: items,
  });
  items.pop();
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  console.log(req.body);

  if (item != "") {
    items.push(item);
  }

  res.redirect("/");
});

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    //* if list title is work list, then it will directly name it Work List instead of looking for a variable
    newListItems: workItems,
  });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(items);
  res.redirect("/work");
});

app.listen(process.env.PORT || 4000, function () {
  console.log("server listening on port 3000");
});
