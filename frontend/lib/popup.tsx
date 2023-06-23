import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

module.exports = {
  async MySwal() {
    return MySwal;
  },
  async success(title: string, text: string) {
    MySwal.fire({
      position: "center",
      icon: "success",
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500,
    });
  },
  async warning(title: string, text: string) {
    MySwal.fire({
      position: "center",
      icon: "warning",
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500,
    });
  },
  async error(title: string, text: string) {
    MySwal.fire({
      position: "center",
      icon: "error",
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500,
    });
  },
  async message(title: string, text: string) {
    MySwal.fire({
      position: "center",
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500,
    });
  },
  async confirm(title: string, text: string) {
    //! resolve = true
    //! reject = false
    const confirm = new Promise((resolve, reject) => {
      MySwal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
          reject(false);
        }
      });
    });
    return confirm;
  },
};
