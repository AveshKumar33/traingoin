import React, { useMemo, useState } from "react";
import { REACT_APP_URL } from "../../config";
import { getvarientimage } from "../../utils/varientimge/VarientImage";
import Modal from "../modal/Modal";

const AdminVarientImage = ({ attribute, varient, attributePosition }) => {
  const [images, setimages] = useState([]);
  const [show, setshow] = useState(false);

  useMemo(() => {
    let varientImages = getvarientimage(attribute, varient);

    let ss;

    if (attributePosition) {
      ss = varientImages.map((p, i) => {
        return {
          ...p,
          positionx: attributePosition[i % attributePosition.length].PositionX,
          positiony: attributePosition[i % attributePosition.length].PositionY,
        };
      });
    } else {
      ss = varientImages.map((p, i) => {
        return {
          ...p,
        };
      });
    }

    setimages(ss);
  }, []);

  const handleClicked = () => {
    setshow(true);
  };

  const handleClose = () => {
    setshow(false);
  };

  return (
    <>
      <Modal
        handleClose={handleClose}
        show={show}
        width="400px"
        height="400px"
        overflow={"scroll"}
      >
        <div style={{ display: "flex", margin: "50px" }}>
          <CombinedImage
            images={images}
            handleClicked={handleClicked}
            width={"300px"}
            height={"300px"}
          />
        </div>

        {/* <div style={{ backgroundColor: "#000" }}> */}
        {/* <CombinedImage images={images} width={"200px"} height={"200px"} /> */}
        {/* </div> */}
      </Modal>
      <CombinedImage
        images={images}
        handleClicked={handleClicked}
        width={"35px"}
        height={"35px"}
      />
    </>
  );
};

const CombinedImage = ({ images, handleClicked, width, height }) => {
  return (
    <>
      <div
        style={{
          position: "relative",
          width: width,
          height: height,
          overflow: "hidden",
        }}
      >
        {images.map((img) => (
          <>
            <img
              key={img}
              src={`${REACT_APP_URL}/images/attribute/${img.Photo}`}
              alt="Preview"
              onClick={handleClicked}
              loading="lazy"
              style={{
                position: "absolute",
                top: img.positiony,
                left: img.positionx,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </>
        ))}
      </div>
    </>
  );
};

export default AdminVarientImage;
