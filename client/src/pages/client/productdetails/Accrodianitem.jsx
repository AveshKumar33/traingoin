import React, { useState, useEffect } from "react";
import { REACT_APP_URL } from "../../../config";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

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

const Accrodianitem = ({ p, index }) => {
  const [selectedImage, setSelectedImage] = useState({ image: "", index: 0 });
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (p?.length > 0) {
      setSelectedImage({ image: p?.Picture[0], index: 0 });
    }
  }, [p]);

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
              images={p?.Picture}
              activeIndex={activeIndex}
            />
          </Box>
        </Fade>
      </Modal>

      <div className="accordion-item" style={{ marginTop: "10px" }}>
        <h3 className="accordion-header">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#faq-content-${index}`}
            aria-expanded="false"
            style={{
              textTransform: "uppercase",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            <span className="num">
              <MdOutlineKeyboardDoubleArrowRight /> &nbsp;{" "}
            </span>{" "}
            {p.Title}
          </button>
        </h3>
        <div
          id={`faq-content-${index}`}
          className="accordion-collapse collapse"
          data-bs-parent="#faqlist"
        >
          <div className="accordion-body">
            {/* <div dangerouslySetInnerHTML={{ __html: p?.Descriptions }} /> */}
            <p
              style={{
                fontSize: "18px",
                letterSpacing: "1px",
                textAlign: "justify",
              }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: p?.Descriptions,
                }}
                className="productdescription"
              ></span>
            </p>
            <div className="user-rating-photos photos-area">
              {p?.Picture &&
                p.Picture.length > 0 &&
                p.Picture.map((ele, index) => {
                  return (
                    <div
                      key={ele}
                      style={{
                        marginLeft: "20px",
                        marginBottom: "20px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={`${REACT_APP_URL}/images/product/${ele}`}
                        alt="Railingo"
                        className="user-rating-img"
                        loading="lazy"
                        style={{ height: "15vh" }}
                        onClick={() => {
                          setActiveIndex(index);
                          handleOpen();
                        }}
                      />
                    </div>
                  );
                })}
            </div>{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Accrodianitem;
