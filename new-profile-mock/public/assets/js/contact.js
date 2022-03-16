const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneNumberInput = document.getElementById("phoneNumber");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const emailReciever = "emailTest@gmail.com";

function onFormSubmit() {
  const name = nameInput.value;
  const email = emailInput.value;
  const phoneNumber = phoneNumberInput.value;
  const subject = subjectInput.value;
  const message = messageInput.value;

  // objecting data
  const data = { name, email, phoneNumber, subject, message };
  console.log(data);

  if (name && email && phoneNumber && subject && message) {
    window.open(`mailto:${emailReciever}?subject=${subject}&body=${message}.`);
  } else {
    alert("Please make sure all form are filled correctly");
  }
}
