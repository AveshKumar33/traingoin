import React, { useState } from "react";
import Modal from "../modal/Modal";
import FrontOverlay from "../../assets/Image/FrontOverlay.png";
import BackOverlay from "../../assets/Image/BackOverlay.png";
import { Link } from "react-router-dom";
import { REACT_APP_URL } from "../../config";

const ProductCustomizedProduct = ({
  varientproductdetails,
  height = "87vh",
  name,
  width,
  margin = 0,
  // LinkUrl = "https://img.com",
  showSticker = true,
}) => {
  const [show, setshow] = useState(false);

  const handleClose = () => {
    setshow(false);
  };

  return (
    <>
      <Modal
        handleClose={handleClose}
        show={show}
        width="54%"
        height="540px"
        // style={{overflowY:"scroll"}}
        overflow={"scroll"}
      >
        <div
          style={{
            position: "relative",
            // display: "flex",
            justifyContent: "center",
            height: "100%",
            margin: "10px",
            width: "90%",
            overflow: "hidden",
          }}
        >
          {varientproductdetails?.length > 0 &&
            varientproductdetails?.map(
              (img, i) =>
                img?.combinations &&
                img?.combinations?.length > 0 && (
                  <Link to="#" key={i}>
                    <>
                      <img
                        key={img}
                        src={`${REACT_APP_URL}/images/parameterPosition/${img.combinations[0]?.pngImage}`}
                        alt="Preview"
                        style={{
                          zIndex: Number(img?.attributeId?.BurgerSque),
                          position: "absolute",
                          top: `${img?.positionY}%`,
                          left: `${img?.positionX}%`,
                          width: "100%",
                          height: "auto",
                        }}
                      />

                      {name !== "cartImage" && (
                        <>
                          <span
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              color: "#E9860E",
                              background: "#fff",
                              padding: "5px",
                              fontWeight: "800",
                              border: "1px solid #E9860E",
                            }}
                          >
                            {name}
                          </span>
                        </>
                      )}
                    </>
                  </Link>
                )
            )}
        </div>
      </Modal>

      {/* New Image Show */}
      <div
        className="customizedimage"
        style={{
          height: height,
          width: width,
          margin: margin,
          marginBottom: "8px",
        }}
        onClick={() => setshow(true)}
      >
        {varientproductdetails?.length > 0 &&
          varientproductdetails.map((img, i) => (
            <React.Fragment key={i}>
              <img
                key={img}
                src={`${REACT_APP_URL}/images/parameterPosition/${img?.combinations[0]?.pngImage}`}
                alt="Preview"
                style={{
                  position: "absolute",
                  top: `${img?.positionY}%`,
                  left: `${img?.positionX}%`,
                  width: "100%",
                  height: "auto",
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
                    height: "auto",
                    zIndex: Number(img?.attributeId?.BurgerSque + 10),
                  }}
                />
              )}
              {showSticker && name !== "cartImage" && (
                <>
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      color: "#E9860E",
                      background: "#fff",
                      padding: "5px",
                      fontWeight: "800",
                      border: "1px solid #E9860E",
                    }}
                  >
                    {name}
                  </span>
                </>
              )}
            </React.Fragment>
          ))}
      </div>
    </>
  );
};

export default ProductCustomizedProduct;
