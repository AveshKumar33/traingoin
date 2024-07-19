import React, { useEffect, useState } from "react";
import "./roomCatalogue.css"; // Update the path if needed
import { REACT_APP_URL } from "../../../config";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ProductMagnification from "../../../components/productMagnification/ProductMagnification";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "97%",
  height: "95%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const RoomSliderCusProd = ({ productImages, type = "" }) => {
  const [selectedImage, setSelectedImage] = useState({ image: "", index: 0 });
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (productImages?.length > 0) {
      setSelectedImage({ image: productImages[0], index: 0 });
    }
  }, [productImages]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <IconButton
              aria-label="fingerprint"
              color="success"
              sx={{ float: "right", top: 0, right: 0, position: "absolute" }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
            <ProductMagnification
              images={productImages}
              activeIndex={activeIndex}
            />
          </Box>
        </Fade>
      </Modal>

      <div className="col-lg-2 SliderProductImages">
        {productImages &&
          productImages.map((image, index) => (
            <img
              key={index}
              className="SliderProductImages1"
              src={`${REACT_APP_URL}/images/product/${image}`}
              alt={image}
              onClick={() => setSelectedImage({ image, index })}
            />
          ))}
      </div>
      <div className="col-lg-10 SliderProductImages3">
        <img
          className="SliderProductImages2"
          src={`${REACT_APP_URL}/images/product/${selectedImage?.image}`}
          alt={selectedImage}
          onClick={() => {
            setActiveIndex(selectedImage?.index);
            handleOpen();
          }}
        />
      </div>
    </>
  );
};

export default RoomSliderCusProd;
