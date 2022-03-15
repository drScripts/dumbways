const hbs = require("hbs");

function iconBuild(techUsed) {
  let htmlString = techUsed
    .map((value, i) => {
      return `<img
      src="/public/assets/img/${value}.png"
      alt="${value}"
    />`;
    })
    .join(" ");

  return new hbs.handlebars.SafeString(htmlString);
}

function getDuration(end, start) {
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

function formatFullDate(startDate, endDate) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const start = new Date(startDate);
  const end = new Date(endDate);

  return `${start.getDate()} ${
    monthNames[start.getMonth()]
  } ${start.getFullYear()} - ${end.getDate()} ${
    monthNames[end.getMonth()]
  } ${end.getFullYear()}`;
}

function getIconDetail(techUsed) {
  const iconString = techUsed
    .map(
      (val, i) => `<div class="tech-items">
    <img src="/public/assets/img/${val}.png" alt="${val}" />
  <p>${getIconNamed(val)}</p>
</div>`
    )
    .join("");

  return new hbs.handlebars.SafeString(iconString);
}

function inputDateValueBuild(text) {
  const date = new Date(text);
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "-" + mm + "-" + dd;
}

function checkSelectedTech(tech, techUsed) {
  return techUsed.find((value) => value == tech);
}

function getIconNamed(tech) {
  let string = "";
  switch (tech) {
    case "nodejs":
      string = "Node JS";
      break;
    case "nextjs":
      string = "Next JS";
      break;
    case "reactjs":
      string = "React JS";
      break;
    default:
      string = "Typescript";
      break;
  }

  return string;
}

function safeString(str) {
  let newStr = new hbs.handlebars.SafeString(
    str.replaceAll(`\r\n`.toString(), "<br/>")
  ); 
  return newStr;
}

module.exports = {
  iconBuild,
  getDuration,
  formatFullDate,
  getIconDetail,
  inputDateValueBuild,
  checkSelectedTech,
  safeString,
};
