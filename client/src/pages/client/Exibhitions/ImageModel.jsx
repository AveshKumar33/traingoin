import { Modal } from "@mui/material";
import React from "react";
import { RxCross1 } from "react-icons/rx";

const ImageModel = ({ selectedImage = "", closeModel }) => {
  return (
    <Modal
      open={true}
      onClose={closeModel}
      aria-labelledby="image-modal"
      aria-describedby="modal-for-displaying-selected-image"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          maxWidth: "80vw",
          maxHeight: "90vh",
          overflow: "auto",
          backgroundColor: "white",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
          padding: "20px",
        }}
      >
        <RxCross1
          onClick={closeModel}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
        />
        <img
          src={selectedImage}
          alt="Preview"
          style={{
            width: "100%",
            height: "80vh",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    </Modal>
  );
};

export default ImageModel;
