import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ModalProps {
  title: string;
  question: string;
  onclick: () => void;
}

function ModalComponent({ title, question, onclick }: ModalProps) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  //   const handleCloseConfirm = () => {
  //     onclick();
  //   };

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{question}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onclick}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalComponent;
