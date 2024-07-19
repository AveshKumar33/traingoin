import React from "react";
import Carousel from "../../UI/Carousel";
import { REACT_APP_URL } from "../../config";
// import ImageMagnifier from "./ImageMagnifier";

const ProductMagnification = ({ images, activeIndex }) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <div
          key={index}
          className={
            index === activeIndex ? `carousel-item active` : `carousel-item`
          }
        >
          {/* <ImageMagnifier
            src={`${REACT_APP_URL}/images/product/${image}`}
            height="85vh"
            width="auto"
          /> */}
          <div
            className="col-lg-12"
            style={{
              backgroundImage: `url(${REACT_APP_URL}/images/product/${image})`,
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

export default ProductMagnification;
