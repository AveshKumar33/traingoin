import React, { useState } from "react";
import SliderImg1 from "../../../assets/Image/Slider11.jpg";
import Carousel from "../../../UI/Carousel";
import Modal from "../../../components/modal/Modal";
import { REACT_APP_URL } from "../../../config";

const ProductImageSection = ({ img }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [show, setshow] = useState(false);

  const handleClose = () => {
    setshow(false);
  };

  const images =
    img?.image !== "default.png"
      ? [img?.image]
      : img?.singleProductId?.ProductImage;

  const directory =
    img?.image !== "default.png" ? "singleProductCombination" : "product";

  return (
    <>
      {/* <Modal
        handleClose={() => {
          handleClose();
          setSelectedImage("");
        }}
        show={show}
        width="50%"
        height="500px"
        // style={{overflowY:"scroll"}}
        overflow={"scroll"}
      >
        <div
          className="col-lg-6"
          style={{
            backgroundImage: `url(${REACT_APP_URL}/images/${directory}/${selectedImage})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            height: "96%",
            margin: "10px",
            width: "96%",
          }}
        />
      </Modal>

      <Carousel>
        {images.map((image, index) => (
          <div
            key={index}
            className={index === 0 ? `carousel-item active` : `carousel-item`}
          >
            <div
              className="col-lg-12"
              style={{
                backgroundImage: `url(${REACT_APP_URL}/images/${directory}/${image})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                height: "500px",
                // margin: "10px",
                width: "100%",
              }}
              onClick={() => {
                setshow(true);
                setSelectedImage(image);
              }}
            />
          </div>
        ))}
      </Carousel> */}

      <div
        className="col-lg-2"
        style={{ float: "left", height: "80vh", overflowY: "scroll" }}
      >
        <img src={SliderImg1} style={{ width: "100%", height: "15vh" }}></img>
        <img
          src={SliderImg1}
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
        <img
          src={SliderImg1}
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
        <img
          src={SliderImg1}
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
        <img
          src={SliderImg1}
          style={{ width: "100%", height: "15vh", marginTop: "10px" }}
        ></img>
      </div>
      <div className="col-lg-10" style={{ float: "left", marginTop:"-7px" }}>
        <Carousel>
          {images.map((image, index) => (
            <div
              key={index}
              className={index === 0 ? `carousel-item active` : `carousel-item`}
            >
              <div
                className="col-lg-12"
                style={{
                  backgroundImage: `url(${REACT_APP_URL}/images/${directory}/${image})`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  height: "500px",
                  // margin: "10px",
                  width: "100%",
                }}
                onClick={() => {
                  setshow(true);
                  setSelectedImage(image);
                }}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default ProductImageSection;
