function deleteConfirm(id, name) {
  event.preventDefault();

  Swal.fire({
    title: `Are you sure want to delete ${name} project?`,
    icon: "question",
    showCancelButton: true,
    showCloseButton: true,
  }).then((res) => {
    const { isConfirmed, isDenied, isDismissed } = res;
    if (isConfirmed) {
      const trigerredLink = document.querySelector(`a[data-delete="${id}"]`);
      trigerredLink.click();
    }
  });
}

function updateConfirm(id) {
  Swal.fire({
    title: `Are you sure want to update the project?`,
    icon: "question",
    showCancelButton: true,
    showCloseButton: true,
  }).then((res) => {
    const { isConfirmed, isDenied, isDismissed } = res;
    if (isConfirmed) {
      const trigerredLink = document.querySelector(`form[data-update="${id}"]`);
      trigerredLink.submit();
    }
  });
}

function insertConfirm() {
  Swal.fire({
    title: `Are you sure want to add the project?`,
    icon: "question",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: "yes",
    allowOutsideClick: false,
  }).then((res) => {
    const { isConfirmed, isDenied, isDismissed } = res;
    if (isConfirmed) {
      const form = document.getElementsByTagName("form")[0];
      form.submit();
    }
  });
}

function successAlert(message) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonText: "Continue",
  });
}
