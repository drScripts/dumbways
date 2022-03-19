const express = require("express");
const hbs = require("hbs");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const {
  getDuration,
  iconBuild,
  formatFullDate,
  getIconDetail,
  inputDateValueBuild,
  checkSelectedTech,
  safeString,
  alertHtml,
} = require("./helpers/hbs");

const Project = require("./models/Project");
const User = require("./models/User");

const multer = require("multer");
const os = require("os");
const fs = require("fs");
const path = require("path");
const upload = multer({ dest: os.tmpdir() });
const { compareSync } = require("bcryptjs");

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
  })
);
app.use(flash());

hbs.registerPartials(__dirname + "/views/partials");

// HBS register helpers
hbs.registerHelper("iconBuild", iconBuild);
hbs.registerHelper("getDuration", getDuration);
hbs.registerHelper("getFormatedDate", formatFullDate);
hbs.registerHelper("getIconDetail", getIconDetail);
hbs.registerHelper("getInputDateValue", inputDateValueBuild);
hbs.registerHelper("checkSelectedTech", checkSelectedTech);
hbs.registerHelper("safeString", safeString);
hbs.registerHelper("alertHtml", alertHtml);

const returnObj = { user: null };

app.use((req, res, next) => {
  returnObj.user = req.session.user;
  next();
});

app.get("/", async (req, res) => {
  const projects = await Project.getAll();
  const returnData = {
    projects: projects,
    success_message: req.flash("success_message")[0],
    ...returnObj,
  };

  res.render("index", returnData);
});

app.get("/add-project", (req, res) => {
  res.render("add-project", returnObj);
});

app.post("/add-project", upload.single("image"), async (req, res) => {
  const { name, start, end, description, tech } = req.body;
  const file = req.file;

  let fileExt = file.originalname.split(".");
  fileExt = "." + fileExt[fileExt.length - 1];
  const newFileName = file.filename + fileExt;

  const imageUrl = `/public/upload/${newFileName}`;
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
      req.flash("success_message", "Success Add Data!");
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

  res.render("detail-project", { project, ...returnObj });
});

app.get("/update-project/:id", async (req, res) => {
  const { id } = req.params;

  const project = await Project.find(id);
  res.render("edit-project", { project, ...returnObj });
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

  req.flash("success_message", `Success Update ${name} Project!`);
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
  req.flash(
    "success_message",
    `Success Delete ${projectSelected.title} Project!`
  );
  res.redirect("/");
});

app.get("/contact", (req, res) => {
  res.render("contact", returnObj);
});

app.post("/contact", (req, res) => {
  const data = req.body;
  console.log(data);
  res.redirect("/contact");
});

app.get("/logout", (req, res) => {
  req.session.user = undefined;

  req.flash("success_message", "Success Logout, Goodbye!");
  res.redirect("/");
});

app.use((req, res, next) => {
  if (req.session.user) return res.redirect("/");
  next();
});

app.get("/register", (req, res) => {
  res.render("register", { error_message: req.flash("error_message")[0] });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();

    req.flash("success_message", "Success Register! Please Login !");
    res.redirect("/login");
  } catch (err) {
    if (err.constraint === "users_email_key") {
      req.flash(
        "error_message",
        `User with email ${email} already registered!`
      );
    }

    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render("login", {
    error_message: req.flash("error_message")[0],
    success_message: req.flash("success_message")[0],
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) throw Error(`Can't find user with email ${email}`);

    const isMatch = compareSync(password, user.password);

    if (!isMatch) throw Error("Wrong password!");

    req.flash("success_message", "Success Login! Welcome back!");

    delete user.password;
    req.session.user = user;

    res.redirect("/");
  } catch (err) {
    req.flash("error_message", err.message);
    res.redirect("/login");
  }
});

const PORT = 3000;
app.listen(PORT, function () {
  console.log(`Server running on http://localhost:${PORT}`);
});
