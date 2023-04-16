import express from "express";
import dateFunc from "./public/js/date.js";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", `ejs`);

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the send button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});
const defaultItems = [item1, item2, item3];

let items;

async function itemList() {
  try {
    const foundItems = await Item.find({});
    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      items = defaultItems;
    } else {
      items = foundItems;
    }
  } catch (err) {
    console.log(err);
  }
}

await itemList();

//routes
app.get("/", (req, res) => {
  res.render("list", { kindOfDay: dateFunc, toDo: items });
});

app.get("/:customListName", (req, res) => {
  console.log(req.params.customListName);
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.post("/", (req, res) => {
  const task = req.body.newTask;

  const item = new Item({
    name: task,
  });

  item.save();
  itemList();
  console.log("Added Item");

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkboxValue = req.body.checkbox;

  Item.findByIdAndRemove(checkboxValue)
    .exec()
    .then(itemList())
    .then(console.log("Deleted Item"))
    .catch((err) => console.log(err));

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
