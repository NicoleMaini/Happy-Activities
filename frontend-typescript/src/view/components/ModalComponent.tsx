import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ModalProps {
  question: string;
  click: () => void;
  action: () => void;
}

function ModalComponent({ question, action, click }: ModalProps) {
  const handleCloseConfirm = () => {
    action();
    setTimeout(() => {
      click();
    }, 1000);
  };

  return (
    <>
      <Modal
        show={true}
        onHide={click}
        animation={false}
        className="modal-question"
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="p-4 pt-0">
          <p className="fs-5">{question}</p>
          <div className="line"></div>
          <div className="d-flex ms-auto">
            <button className="ms-auto btn-modal press color-no" onClick={click}>
              No
            </button>
            <button className="ms-3 btn-modal press color-yes" onClick={handleCloseConfirm}>
             Yes
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalComponent;
