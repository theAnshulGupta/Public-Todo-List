const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/listDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model("Task", listSchema);

const task1 = new Task({
  name: "Fix Bugs",
});
const task2 = new Task({
  name: "Update Code",
});
const task3 = new Task({
  name: "Web Dev",
});

app.get("/", function (req, res) {
  const day = date.getDate();

  Task.find({}, function (err, results) {
    if (results.length === 0) {
      Task.insertMany([task1, task2, task3], function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("added");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItems: results,
      });
    }
  });
});

//? const items = ["Daily Commit", "Study", "Walk outside", "Pet Dog", "Fix Bugs"];
//? const workItems = ["Talk with boss", "Study", "Finish project", "Interview"];

app.post("/", function (req, res) {
  if (req.body.newItem != "") {
    const task = new Task({
      name: req.body.newItem,
    });
    task.save();
    // if (req.body.list === "Work") {
    //   workItems.push(item);
    //   res.redirect("/work");
    // } else {
    //   items.push(item);
    //   res.redirect("/");
    // }

    res.redirect("/");
  }
});

app.post("/delete", function (req, res) {
  const checkedTask = req.body.checkbox;
  Task.findByIdAndRemove(checkedTask, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("deleted");
    }
  });
  res.redirect("/");
});

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems,
  });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(items);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function () {});
