import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function InvalidRegionPanel({ show, onHide }) {
  return (
    <Modal
      id="invalid-region-panel"
      show={show}
      onHide={onHide}
      dialogClassName="modal-50w"
    >
      <Modal.Header closeButton>
        <Modal.Title>Model Inspector Window (MIW)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You've chosen an invalid MIW window. Please close this window and drag
        the yellow box to a location with modeled data.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
