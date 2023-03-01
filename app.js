const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = new Schema({
  _id: Number,
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to the ToDo List 😩",
});
const item2 = new Item({
  name: "Click + button to add new item.",
});
const item3 = new Item({
  name: "Click - this to delete an item.",
});

const defaultItems = [item1, item2, item3];

// insertMany no longer has a callback function

// Item.insertMany(defaultItems, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Successfully saved default items to database.");
//   }
// });
// Item.insertMany(defaultItems);

const workItems = [];

app.get("/", function (req, res) {

//   Item.find({ }, function (err, foundItems) {
//     res.render("list", { listTitle: "Today", newListItems: foundItems });
// });

Item.find({})
    .then(foundItem => {
      if (foundItem.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItem;
      }
    })
    .then(savedItem => {
      res.render("list", {
        listTitle: "Today",
        newListItems: savedItem
      });
    })
    .catch(err => console.log(err));
});

app.post("/", function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
