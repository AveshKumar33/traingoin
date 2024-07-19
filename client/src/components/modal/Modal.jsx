import React from "react";
import "./modal.css";

const Modal = ({
  handleClose,
  show,
  children,
  width = "50%",
  height = "auto",
  overflow,
  left = "50%",
}) => {
  const showHideClassName = show
    ? "modal-new display-block"
    : "modal-new display-none";

  return (
    <div className={showHideClassName}>
      <div
        className="modal-main"
        style={{
          width: width,
          height: height,
          overflow: overflow,
          maxHeight: "89vh",
          left: left,
        }}
      >
        <button type="button" className="close-icon" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
