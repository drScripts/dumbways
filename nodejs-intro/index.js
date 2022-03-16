const express = require("express");
const hbs = require("express-hbs");

const app = express();
const port = 3000;

app.engine("hbs", hbs.express4());
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Index",
  });
});

app.listen(port, function () {
  console.log(`Server Running on http://localhost:${port}`);
});
