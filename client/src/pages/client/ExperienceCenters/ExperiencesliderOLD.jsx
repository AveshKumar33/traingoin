import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../roomideas/roomCatalogue.css";
import { REACT_APP_URL } from "../../../config";
import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ModalMagnification from "./ModalMagnification";

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
const Experienceslider = ({ slider, video = "", type = "" }) => {
  const [selectedImage, setSelectedImage] = useState({ image: "", index: 0 });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (slider?.length > 0) {
      setSelectedImage({ image: slider[0], index: 0 });
    }
  }, [slider]);

  const settings = {
    dots: false,
    infinite: slider.length > 1 ? true : false,
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
            <ModalMagnification
              images={slider}
              activeIndex={activeIndex}
              type={type}
            />
          </Box>
        </Fade>
      </Modal>

      <Slider {...settings}>
        {slider.map((image, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #eee",
              textAlign: "center",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              margin: "10px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={`${REACT_APP_URL}/images/${type}/${image}`}
              style={{
                height: "45vh",
                width: "100%",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
              }}
              alt="Review Image"
              onClick={() => {
                setSelectedImage({ image, index });
                handleOpen();
              }}
            />
          </div>
        ))}

        {/* Render video slide if video is provided */}
        {video && (
          <iframe
            width="270px"
            height="290px"
            src={video}
            title="YouTube video player"
            frameBorder="5"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        )}
      </Slider>
    </>
  );
};

export default Experienceslider;
