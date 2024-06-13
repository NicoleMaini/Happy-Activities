import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FcPortraitMode } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import { FcAddDatabase } from "react-icons/fc";
import { FcEmptyTrash } from "react-icons/fc";
import { FcImport } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";

function SidebarComponent() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow(s => !s);

  const name: string = "Enable body scrolling";
  const scroll: boolean = true;
  const backdrop: boolean = false;

  // Renderizza solo se scroll è true
  if (!scroll) {
    return null;
  }

  return (
    <>
      <div className="d-flex flex-column bg-light h-100">
        <Button variant="link" onClick={toggleShow} className="me-2">
          <FcOpenedFolder />
          {/* Your Projects */}
        </Button>
        <Button variant="link" onClick={toggleShow} className="me-2">
          <FcAddDatabase />
          {/* Create a new project */}
        </Button>
        <Button variant="link" onClick={toggleShow} className="me-2">
          <FcEmptyTrash />
          {/* Your Trash */}
        </Button>

        <Button variant="link" onClick={toggleShow} className="me-2">
          <FcPortraitMode />
          {/* Your Profile */}
        </Button>
        <Button variant="link" onClick={toggleShow} className="me-2">
          <FcSettings />
          {/* Settings */}
        </Button>
        <Button variant="link" onClick={toggleShow} className="me-2">
          <FcImport />
          {/* Logout */}
        </Button>
      </div>

      {/* <Offcanvas show={show} onHide={handleClose} backdrop={backdrop}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists,
          etc.
        </Offcanvas.Body>
      </Offcanvas>*/}
    </>
  );
}

export default SidebarComponent;
