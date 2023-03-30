import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", `ejs`);

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

let tasksArray = [];

//routes
app.get("/", (req, res) => {
  const today = new Date();
  
  const options = {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  };

  const lang = "en-GB";

  const date = today.toLocaleDateString(lang, options);

  res.render("list", { kindOfDay: date, toDo: tasksArray});
});

app.post('/', (req, res) => {
  let task = req.body.newTask;
  tasksArray.push(task)
  res.redirect('/');
});


app.listen(port, () => {
  console.log(`Server started on port`);
});

