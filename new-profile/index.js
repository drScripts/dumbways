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

const client = require("./db");
const Project = require("./models/Project");
const multer = require("multer");
const os = require("os");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: os.tmpdir() });

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
  const projects = await Project.getAll();

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

  const project = new Project({
    title: name,
    description,
    end_date: end,
    start_date: start,
    image_url: imageUrl,
    tech: tech,
  });

  const result = await project.save();

  if (result) {
    const src = fs.createReadStream(file.path);
    const dest = fs.createWriteStream(pathStorage);
    src.pipe(dest);

    src.on("end", function () {
      res.redirect("/");
    });
  } else {
    console.log("FAILED INSERT DATA");
    res.redirect("/add-project");
  }
});

app.get("/detail-project/:id", async (req, res) => {
  const { id } = req.params;

  const project = await Project.find(id);

  res.render("detail-project", { project });
});

app.get("/update-project/:id", async (req, res) => {
  const { id } = req.params;

  const project = await Project.find(id);
  res.render("edit-project", { project });
});

app.post("/update-project/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, start, end, description, tech } = req.body;
  const file = req.file;

  const project = new Project({
    id,
    title: name,
    start_date: start,
    end_date: end,
    description: description,
    tech: tech,
  });

  if (file) {
    const currentProject = await Project.find(id);
    const currentImagePath = path.join(__dirname, currentProject.image_url);
    if (fs.existsSync(currentImagePath)) {
      fs.unlinkSync(currentImagePath);
    }

    const imageUrl = `/public/upload/${file.originalname}`;
    const pathStorage = path.join(__dirname, imageUrl);

    project.image_url = imageUrl;
    const update = await project.update();

    if (update) {
      const src = fs.createReadStream(file.path);
      const dest = fs.createWriteStream(pathStorage);
      src.pipe(dest);

      src.on("end", function () {
        res.redirect("/");
      });
    }
  } else {
    const update = await project.update();
    if (update) {
      res.redirect("/");
    }
  }
});

app.get("/delete-project/:id", async (req, res) => {
  const { id } = req.params;

  let projectSelected = await Project.find(id);
  if (projectSelected) {
    const imagePath = path.join(__dirname, projectSelected.image_url);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    Project.delete(id);
  }

  res.redirect("/");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  const data = req.body;

  res.redirect("/contact");
});

client
  .connect()
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
