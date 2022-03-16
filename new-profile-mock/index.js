const express = require("express");
const hbs = require("hbs");
const app = express();
const {
  getDuration,
  iconBuild,
  formatFullDate,
  getIconDetail,
  inputDateValueBuild,
  checkSelectedTech,
  safeString,
} = require("./helpers/hbs");

const multer = require("multer");
const os = require("os");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: os.tmpdir() });

const allProject = [
  {
    title: "Dumbways Mobile Project Apps",
    end_date: "2022-03-23",
    start_date: "2022-03-15",
    description:
      "What is Lorem Ipsum?Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    tech: ["nodejs", "nextjs", "typescript", "reactjs"],
    image_url:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  },
];

const PORT = 3000;

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));

hbs.registerPartials(__dirname + "/views/partials");

// HBS register helpers
hbs.registerHelper("iconBuild", iconBuild);
hbs.registerHelper("getDuration", getDuration);
hbs.registerHelper("getFormatedDate", formatFullDate);
hbs.registerHelper("getIconDetail", getIconDetail);
hbs.registerHelper("getInputDateValue", inputDateValueBuild);
hbs.registerHelper("checkSelectedTech", checkSelectedTech);
hbs.registerHelper("safeString", safeString);

app.get("/", async (req, res) => {
  const projects = allProject;

  res.render("index", { projects: projects });
});

app.get("/add-project", (req, res) => {
  res.render("add-project");
});

app.post("/add-project", upload.single("image"), async (req, res) => {
  const { name, start, end, description, tech } = req.body;
  const file = req.file;

  const imageUrl = `/public/upload/${file.originalname}`;
  const pathStorage = path.join(__dirname, imageUrl);

  const project = {
    title: name,
    start_date: start,
    end_date: end,
    description,
    tech,
    image_url: imageUrl,
  };

  const src = fs.createReadStream(file.path);
  const dest = fs.createWriteStream(pathStorage);
  src.pipe(dest);

  allProject.push(project);

  src.on("end", function () {
    res.redirect("/");
  });
});

app.get("/detail-project/:id", async (req, res) => {
  const { id } = req.params;

  const project = allProject[id];

  res.render("detail-project", { project });
});

app.get("/update-project/:id", async (req, res) => {
  const { id } = req.params;

  const project = allProject[id];
  res.render("edit-project", { project, id });
});

app.post("/update-project/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, start, end, description, tech } = req.body;
  const file = req.file;

  allProject[id].title = name;
  allProject[id].start_date = start;
  allProject[id].end_date = end;
  allProject[id].description = description;
  allProject[id].tech = tech;
  if (file) {
    const currentImagePath = path.join(__dirname, allProject[id].image_url);
    if (fs.existsSync(currentImagePath)) {
      fs.unlinkSync(currentImagePath);
    }

    const imageUrl = `/public/upload/${file.originalname}`;
    const pathStorage = path.join(__dirname, imageUrl);

    allProject[id].image_url = imageUrl;

    const src = fs.createReadStream(file.path);
    const dest = fs.createWriteStream(pathStorage);
    src.pipe(dest);

    src.on("end", function () {
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

app.get("/delete-project/:id", async (req, res) => {
  const { id } = req.params;

  let projectSelected = allProject[id];
  if (projectSelected) {
    const imagePath = path.join(__dirname, projectSelected.image_url);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    allProject.splice(id, 1);
  }

  res.redirect("/");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  const data = req.body;
  console.log(data);
  res.redirect("/contact");
});

app.listen(PORT, function () {
  console.log(`Server running on http://localhost:${PORT}`);
});
