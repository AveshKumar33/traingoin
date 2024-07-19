import React from "react";
import FrontOverlay from "../../../assets/Image/FrontOverlay.png";
import BackOverlay from "../../../assets/Image/BackOverlay.png";
import { REACT_APP_URL } from "../../../config";

const ProductImage = ({
  varientproductdetails,
  height = "70vh",
  name,
  showSticker = true,
}) => {
  return (
    <>
      <div
        className="customizedimage"
        style={{
          height: height,
          // marginTop: "7px",
          marginLeft: "-1px",
          //   marginBottom: "8px",
        }}
      >
        {varientproductdetails?.length > 0 &&
          varientproductdetails.map((img, i) => (
            <React.Fragment key={i}>
              <img
                key={img}
                src={`${REACT_APP_URL}/images/parameterPosition/${img?.pngImage}`}
                alt="Preview"
                style={{
                  position: "absolute",
                  top: `${img?.positionY}%`,
                  left: `${img?.positionX}%`,
                  width: "100%",
                  height: "100%",
                  zIndex: Number(img?.attributeId?.BurgerSque),
                }}
              />

              {showSticker && (
                <img
                  src={name === "Front Side" ? FrontOverlay : BackOverlay} // Replace with the path to your transparent image
                  alt="Transparent Overlay"
                  style={{
                    position: "absolute",
                    top: `${img?.positionY}%`,
                    left: `${img?.positionX}%`,
                    width: "100%",
                    height: "100%",
                    zIndex: Number(img?.attributeId?.BurgerSque + 10),
                  }}
                />
              )}
            </React.Fragment>
          ))}
      </div>
    </>
  );
};

export default ProductImage;
