const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");
const day = date.getDate();

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

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const listSchema = {
  name: {
    type: String,
    required: true,
  },
  items: {
    type: [taskSchema],
    required: true,
  },
};

const List = mongoose.model("List", listSchema);
const Task = mongoose.model("Task", taskSchema);

const task1 = new Task({
  name: "Fix Bugs",
});
const task2 = new Task({
  name: "Update Code",
});
const task3 = new Task({
  name: "Web Dev",
});

const defaultTasks = [task1, task2, task3];

app.get("/", function (req, res) {
  Task.find({}, function (err, results) {
    if (results.length === 0) {
      Task.insertMany(defaultTasks, function (err) {
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

app.post("/", function (req, res) {
  const listName = req.body.list;
  if (req.body.newItem != "") {
    const task = new Task({
      name: req.body.newItem,
    });

    if (listName == day) {
      task.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName }, function (err, foundList) {
        foundList.items.push(task);
        foundList.save();
        res.redirect("/" + listName);
      });
    }
  }
});

app.post("/delete", function (req, res) {
  const checkedTask = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day) {
    Task.findByIdAndRemove(checkedTask, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedTask } } },
      function (err, foundList) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/:customListName", function (req, res) {
  const newList = _.capitalize(req.params.customListName);

  List.findOne({ name: newList }, function (err, listExist) {
    if (err) {
      console.log(err);
    } else {
      if (!listExist) {
        console.log("new list");
        const list = new List({
          name: newList,
          items: defaultTasks,
        });
        list.save();
        res.redirect("/" + newList);
      } else {
        console.log("exists");
        res.render("list", {
          listTitle: listExist.name,
          newListItems: listExist.items,
        });
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function () {});
