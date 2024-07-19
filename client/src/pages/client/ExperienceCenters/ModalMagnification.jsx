import React from "react";
import Carousel from "../../../../../client/src/UI/Carousel";
import { REACT_APP_URL } from "../../../config";

const ModalMagnification = ({ images, activeIndex, type }) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <div
          key={index}
          className={
            index === activeIndex ? "carousel-item active" : "carousel-item"
          }
        >
          <div
            className="col-lg-12"
            style={{
              backgroundImage: `url(${REACT_APP_URL}/images/${type}/${image})`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              width: "100%",
              height: "85vh",
            }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ModalMagnification;
