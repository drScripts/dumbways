const allProject = [
  {
    projectName: "Dumbways Mobile App - 2021",
    start: "03/05/2022",
    end: "03/10/2022",
    description:
      "App that used for dumbways student, it was deployed and can downloaded on playstore Happy download",
    imageUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    techUsed: ["nodejs", "nextjs", "reactjs", "typescript"],
  },
];

function buttonChooseTrigger() {
  const fileInput = document.getElementById("project-image");

  fileInput.click();
}

function onSubmit() {
  const btnReset = document.getElementById("reset");
  const projectName = document.getElementById("project-name").value;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const description = document.getElementById("description").value;
  const nodejs = document.getElementById("nodejs");
  const nextjs = document.getElementById("nextjs");
  const reactjs = document.getElementById("reactjs");
  const typescript = document.getElementById("typescript");
  const image = document.getElementById("project-image").files[0];

  const techUsed = [];

  if (
    projectName &&
    start &&
    end &&
    description &&
    image &&
    (nodejs.checked || nextjs.checked || reactjs.checked || typescript.checked)
  ) {
    const imageUrl = URL.createObjectURL(image);

    if (nodejs.checked) {
      techUsed.push(nodejs.value);
    }

    if (nextjs.checked) {
      techUsed.push(nextjs.value);
    }

    if (reactjs.checked) {
      techUsed.push(reactjs.value);
    }

    if (typescript.checked) {
      techUsed.push(typescript.value);
    }

    const data = { projectName, start, end, description, imageUrl, techUsed };
    allProject.push(data);

    renderCard();

    btnReset.click();
  } else {
    alert(
      "Please fill all form and choose at least 1 Technologies that you use"
    );
  }
}

function getDurationString(start, end) {
  const mathMonth = 30;
  const mathYear = mathMonth * 12;

  const selisihWaktu = new Date(end) - new Date(start);
  const jumlahSelisihDalamHari = selisihWaktu / (60 * 60 * 24 * 1000);
  const durasiTahun = Math.floor(jumlahSelisihDalamHari / mathYear);
  const durasiBulan = Math.floor(
    (jumlahSelisihDalamHari % mathYear) / mathMonth
  );
  const durasiMinggu = Math.floor(
    ((jumlahSelisihDalamHari % mathYear) % mathMonth) / 7
  );
  const durasiHari = ((jumlahSelisihDalamHari % mathYear) % mathMonth) % 7;

  let stringFormat = "";

  if (durasiTahun > 0) {
    stringFormat += durasiTahun + " tahun ";
  }

  if (durasiBulan > 0) {
    stringFormat += durasiBulan + " bulan ";
  }

  if (durasiMinggu > 0) {
    stringFormat += durasiMinggu + " minggu ";
  }

  if (durasiHari > 0) {
    stringFormat += durasiHari + " hari";
  }

  return stringFormat;
}

function generateNewCardElement(data, duration, techUsed) {
  const listProjectEl = document.getElementById("project-list");

  let stringIcons = techUsed.map((value, i) => {
    return `<img
    src="./assets/img/${value}.png"
    alt="${value}"
  />`;
  });

  listProjectEl.innerHTML += template(data, duration, stringIcons);
}

function renderCard() {
  const listProjectEl = document.getElementById("project-list");
  listProjectEl.innerHTML = "";
  allProject.forEach((val, i) => {
    generateNewCardElement(
      val,
      getDurationString(val.start, val.end),
      val.techUsed
    );
  });
}

function template(data, duration, iconStrings) {
  return `
  <div class="project-card">
  <a href="./detail-project.html">
    <img
      src="${data.imageUrl}"
      alt=""
      class="card-thumbnail"
    />
    <h4 class="card-title">${data.projectName}</h4>
    <div class="card-subtitle">durasi : ${duration}</div>
    <p class="description">
      ${data.description}
    </p>
    <div class="list-icons" id="list-icons"> 
    ${iconStrings.join("")}
    </div>
    <div class="button-field">
      <a href="#" class="btn">Edit</a>
      <a href="#" class="btn">Delete</a>
    </div>
  </a>
</div>`;
}

renderCard();
