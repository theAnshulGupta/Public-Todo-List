/** @format */

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// let item = "";
//* Step 3: creating item above so it exists
//!read below why this was created
//? the problem by making it one variable is that it can only get replaced
//? to avoid this, we have to make it into an array

let items = ["Buy Food", "Cook Food", "Eat Food"];
//* Step 4: making item an array so it can contain more than 1 element
//!
//? This only adds new terms to the same li
//? So we have to loop through the array to replace it for more terms

app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options); //format date string based on ejs files
  res.render("list", { kindOfDay: day, newListItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;

  //todo: this is how to add new elements to the todo list. vid 285: passing data at last bookmark

  // res.render("list", { newListItem: item });

  //* Step 1: if this is called for the post, it wont exist when render is first called
  //? ok basically we cannot do res.render for newListItem
  //? AFTER we do it for kindOfDay because when res.render
  //? renders kindOfDay, it does not know what to assign to
  //? newListItem because no value is passed for newListItem,
  //? which throws an error. to avoid this, we have to redirect our
  //? value when it gets assigned, and also render newListItem: item
  //? with kindOfDay.

  if (item != "") {
    items.push(item);
  }
  //* Step 5: append item that gets created and add it to the array, then redirect

  res.redirect("/");
  //* Step 2: create a redirect call to do to the render as a bush, but
  //* it wont work unless you define item above due to scope
  //? When a post request occurs, it says the value of newItem to item
  //? and redirect to home route, that renders the item term in the get request.
  //? we still have a problem: "item" only exists in the post request due to scope.
  //? to fix this, we define item above with an empty string/array, and replace it here.
});

app.listen(3000, function () {
  console.log("server listening on port 3000");
});
