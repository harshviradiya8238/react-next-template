import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function LogoutModal({ show, close }) {
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Logout</Modal.Title> */}
        </Modal.Header>

        <Modal.Body>Are you sure, you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close} class="Cancel-btn">
            Cancel
          </Button>
          <Button variant="primary" onClick={close} class="Logout-btn">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LogoutModal;
