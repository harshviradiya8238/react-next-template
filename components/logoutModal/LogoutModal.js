import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import Notification from "../utils/Notification";

function LogoutModal({ show, close }) {
  const router = useRouter();

  const handleLogout = async () => {
    await localStorage.clear();
    await router.push("/login");
    Notification("success", "Logout successFully");
  };
  return (
    <div
      className="modal show "
      style={{
        display: "block",
        position: "initial",
      }}
    >
      <Modal show={show} onHide={close} style={{ zIndex: "9999" }}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Logout</Modal.Title> */}
        </Modal.Header>

        <Modal.Body>Are you sure, you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close} class="Cancel-btn">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout} class="Logout-btn">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LogoutModal;
