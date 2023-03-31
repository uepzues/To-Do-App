import express from "express";
import {dateFunc} from  "./public/js/date.js";

const app = express();
const port = process.env.PORT || 3000;

console.log(dateFunc[1]);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", `ejs`);

let tasksArray = [];

//routes
app.get('/about', (req, res) => {
  res.render("about.ejs")
});

app.get("/", (req, res) => {
  res.render("list", { kindOfDay: dateFunc[0], toDo: tasksArray });
});

app.post("/", (req, res) => {
  let task = req.body.newTask;
  tasksArray.push(task);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
