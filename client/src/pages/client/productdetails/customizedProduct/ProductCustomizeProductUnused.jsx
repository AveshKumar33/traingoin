import React, { useState } from "react";
import Modal from "../../../../components/modal/Modal";
import FrontOverlay from "../../../../assets/Image/FrontOverlay.png";
import BackOverlay from "../../../../assets/Image/BackOverlay.png";
import { Link } from "react-router-dom";
import { REACT_APP_URL } from "../../../../config";

const ProductCustomizedProduct = ({
  varientproductdetails,
  height = "80vh",
  name,
  width,
  margin = 0,
  LinkUrl = "https://img.com",
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
        width="60%"
        height="600px"
        // style={{overflowY:"scroll"}}
        overflow={"scroll"}
        left={"50%"}
      >
        <div
          style={{
            position: "relative",
            // display: "flex",
            justifyContent: "center",
            height: "500px",
            margin: "10px",
            width: "91%",
            overflow: "hidden",
          }}
        >
          {varientproductdetails?.length > 0 &&
            varientproductdetails?.map(
              (img, i) =>
                img?.combinations &&
                img?.combinations?.length > 0 && (
                  // <Link to={LinkUrl} key={i}>
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
                        height: "100%",
                        right: "0",
                      }}
                    />

                    {name !== "cartImage" && (
                      <>
                        <span
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            color: "#475B52",
                            background: "#fff",
                            padding: "5px",
                            fontWeight: "800",
                            border: "1px solid #475B52",
                          }}
                        >
                          {name}
                        </span>
                      </>
                    )}
                  </>
                  // </Link>
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
                    zIndex: Number(
                      img.combinations[0]?.parameterId?.displayIndex + 10
                    ),
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
                      color: "#475B52",
                      background: "#fff",
                      padding: "5px",
                      fontWeight: "800",
                      border: "1px solid #475B52",
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
