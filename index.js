import * as dotenv from "dotenv";
import express from "express";
import dateFunc from "./public/js/date.js";
import mongoose from "mongoose";
import _ from "lodash";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", `ejs`);

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

//schema
const itemsSchema = {
  name: String,
};
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

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

function itemList() {
  return Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItems;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

itemList();

//routes
app.get("/", (req, res) => {
  itemList()
    .then((result) => {
      items = result;
      res.render("list", {
        listTitle: "Today",
        kindOfDay: dateFunc,
        toDo: items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {
      if (foundList) {
        // console.log("Exist!");
        res.render("list", {
          listTitle: foundList.name,
          kindOfDay: dateFunc,
          toDo: foundList.items,
        });
      } else {
        // console.log("Doesn't Exists!");
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.get("/about", (req, res) => {
//   res.render("about.ejs");
// });

app.post("/", (req, res) => {
  const task = req.body.newTask;
  const listName = req.body.list;

  const item = new Item({
    name: task,
  });

  if (listName === "Today") {
    item
      .save()
      // .then(()=> itemList())
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  } else {
    List.findOne({ name: listName })
      .then((foundList) => {
        foundList.items.push(item);
        return foundList.save();
      })
      .then(() => res.redirect("/" + listName))
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post("/delete", (req, res) => {
  const checkboxValue = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkboxValue)
      .exec()
      .then(itemList())
      .then(console.log("Deleted Item"))
      .catch((err) => console.log(err));

    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkboxValue } } }
    ).then(res.redirect("/" + listName));
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
});
