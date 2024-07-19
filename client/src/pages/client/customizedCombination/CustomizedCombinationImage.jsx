import React, { useEffect, useState } from "react";
import "./CustomizedCombinationImage.css";
import { REACT_APP_URL } from "../../../config";
import CustomizedProductDetails from "./customizeProduct/CustomizedProductDetails";
import { getPrice } from "../../../utils/varientimge/getPrice";
import { CustomizedFinialAmount } from "../../../utils/usefullFunction";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  height: "95vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "scroll",
  p: 4,
};

const calculateCustomizedPrice = (
  productDetails,
  UOM,
  combinations,
  priceFor,
  { width, height }
) => {
  if (productDetails && combinations?.length > 0) {
    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPrice(productDetails, combinations, UOM, {
        DefaultWidth: width,
        DefaultHeight: height,
      });

    return totalCustomizedPrice;
  }
  return 0;
};

const CustomizedCombinationImage = ({
  PositionX,
  PositionY,
  Height,
  Width,
  customuizedProduct,
  id,
  index,
  updateTotalPrice,
  comboRectangle,
  setComboRectangle,
  setCustomizedCombination,
  productId = "",
}) => {
  const [open, setOpen] = React.useState(false);
  const [price, setPrice] = React.useState({ productName: "", price: "" });

  const handleClose = () => setOpen(false);

  // console.log("id", id);

  const [UOM, setUOM] = useState([]);
  const [unit, setUnit] = useState({ width: 0, height: 0 });
  const [backSelected, setBackSelected] = useState("");
  const [customuizedProductFront, setCustomuizedProductFront] = useState([]);
  const [SAFCombination, setSAFCombination] = useState([]);
  const [CBCombination, setCBCombination] = useState([]);
  const [IBCombination, setIBCombination] = useState([]);
  const [customuizedProductDetails, setCustomuizedProductDetails] = useState();

  const [customizedProductPrice, setcustomizedProductPrice] = useState({
    customizedProductPriceFront: 0,
    customizedProductPriceSAF: 0,
    customizedProductPriceCB: 0,
    customizedProductPriceIB: 0,
  });

  useEffect(() => {
    if (customuizedProduct) {
      setCustomuizedProductDetails(customuizedProduct?.product[0]);

      setCustomuizedProductFront(customuizedProduct?.Front);
      setSAFCombination(customuizedProduct?.SAF);
      setCBCombination(customuizedProduct?.CB);
      setIBCombination(customuizedProduct?.IB);
      setUOM(customuizedProduct?.UOM);
      setUnit({
        width: customuizedProduct?.product[0]?.DefaultWidth,
        height: customuizedProduct?.product[0]?.DefaultHeight,
      });
    }
  }, [customuizedProduct]);

  useEffect(() => {
    if (customuizedProductDetails) {
      setCustomizedCombination((prevState) => {
        const existingIndex = prevState.findIndex(
          (data) => data?.customizedComboRectangleId === id
        );
        if (existingIndex >= 0) {
          prevState[existingIndex] = {
            customizedComboRectangleId: id,
            customizedComboId: productId,
            customizedProductId: customuizedProductDetails?._id,
            Front: customuizedProductFront,
            SAF: SAFCombination,
            CB: CBCombination,
            IB: IBCombination,
            width: unit.width,
            height: unit.height,
            customizedProductBackSelected: backSelected,
          };
          return [...prevState];
        } else {
          return [
            ...prevState,
            {
              customizedComboRectangleId: id,
              customizedProductId: customuizedProductDetails?._id,
              customizedComboId: productId,
              Front: customuizedProductFront,
              SAF: SAFCombination,
              CB: CBCombination,
              IB: IBCombination,
              width: unit.width,
              height: unit.height,
              customizedProductBackSelected: backSelected,
            },
          ];
        }
      });

      setcustomizedProductPrice((prevState) => ({
        ...prevState,
        customizedProductPriceFront: calculateCustomizedPrice(
          customuizedProductDetails,
          UOM,
          customuizedProductFront,
          "FixedPrice",
          unit
        ),
        customizedProductPriceSAF: calculateCustomizedPrice(
          customuizedProductDetails,
          UOM,
          SAFCombination,
          "FixedPriceSAF",
          unit
        ),
        customizedProductPriceCB: calculateCustomizedPrice(
          customuizedProductDetails,
          UOM,
          CBCombination,
          "FixedPriceCB",
          unit
        ),
        customizedProductPriceIB: calculateCustomizedPrice(
          customuizedProductDetails,
          UOM,
          IBCombination,
          "FixedPriceIB",
          unit
        ),
      }));
    }
  }, [
    SAFCombination,
    CBCombination,
    IBCombination,
    customuizedProductFront,
    UOM,
    customuizedProductDetails,
    id,
    setCustomizedCombination,
    unit,
    backSelected,
    productId,
  ]);

  useEffect(() => {
    if (SAFCombination?.length > 0) {
      const totalPrice =
        Number(customizedProductPrice.customizedProductPriceFront) +
        Number(customizedProductPrice.customizedProductPriceSAF);

      setPrice({
        productName: customuizedProductDetails?.ProductName,
        price: CustomizedFinialAmount(totalPrice, customuizedProductDetails),
      });
      setBackSelected("SAF");
    } else if (CBCombination?.length > 0) {
      const totalPrice =
        Number(customizedProductPrice.customizedProductPriceFront) +
        Number(customizedProductPrice.customizedProductPriceCB);

      setPrice({
        productName: customuizedProductDetails?.ProductName,
        price: CustomizedFinialAmount(totalPrice, customuizedProductDetails),
      });
      setBackSelected("CB");
    } else if (IBCombination?.length > 0) {
      const totalPrice =
        Number(customizedProductPrice.customizedProductPriceFront) +
        Number(customizedProductPrice.customizedProductPriceIB);

      setPrice({
        productName: customuizedProductDetails?.ProductName,
        price: CustomizedFinialAmount(totalPrice, customuizedProductDetails),
      });
      setBackSelected("IB");
    } else {
      const totalPrice = Number(
        customizedProductPrice.customizedProductPriceFront
      );

      setPrice({
        productName: customuizedProductDetails?.ProductName,
        price: CustomizedFinialAmount(totalPrice, customuizedProductDetails),
      });
    }
  }, [
    customizedProductPrice,
    setPrice,
    customuizedProductDetails,
    CBCombination,
    SAFCombination,
    IBCombination,
  ]);

  useEffect(() => {
    updateTotalPrice(index, price);

    if (Object.keys(comboRectangle)?.length > 0) {
      const JSONrectangles = JSON.stringify(comboRectangle);
      const rectangles = JSON.parse(JSONrectangles);

      const updatedRectangel = rectangles.map((rectangle) => {
        if (rectangle._id === id) {
          rectangle.customizedProductDetails?.forEach((customizeProd) => {
            if (
              customizeProd?.product?.[0]?._id ===
              customuizedProductDetails?._id
            ) {
              customizeProd.Front = customuizedProductFront;
              customizeProd.IB = IBCombination;
              customizeProd.SAF = SAFCombination;
              customizeProd.CB = CBCombination;

              customizeProd.product = [customuizedProductDetails];
            }
          });
          return rectangle;
        } else {
          return rectangle;
        }
      });

      if (updatedRectangel?.length > 0) {
        // console.log("updatedRectangel", updatedRectangel);
        setComboRectangle([...updatedRectangel]);
      }
    }
  }, [
    price,
    index,
    updateTotalPrice,
    customuizedProductFront,
    IBCombination,
    SAFCombination,
    CBCombination,
    customuizedProductDetails,
    id,
  ]);

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
            <CustomizedProductDetails
              id={customuizedProductDetails?._id}
              pName={customuizedProductDetails?.ProductName}
              handleColse={handleClose}
              customuizedProductFront={customuizedProductFront}
              customuizedProductSAF={SAFCombination}
              customuizedProductCB={CBCombination}
              customuizedProductIB={IBCombination}
              setCustomuizedProductFront={setCustomuizedProductFront}
              setCustomuizedProductSAF={setSAFCombination}
              setCustomuizedProductCB={setCBCombination}
              setCustomuizedProductIB={setIBCombination}
              setPrice={setPrice}
              setUnit={setUnit}
              setBackSelected={setBackSelected}
            />
          </Box>
        </Fade>
      </Modal>

      <ImageCreation
        PositionX={PositionX}
        PositionY={PositionY}
        customuizedProductFront={customuizedProductFront}
        Height={Height}
        Width={Width}
        setOpen={setOpen}
      />
    </>
  );
};

const ImageCreation = ({
  customuizedProductFront,
  PositionX,
  PositionY,
  Height,
  Width,
  setOpen,
  // varientproductdetails,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${PositionX * 100}%`,
        top: `${PositionY * 100}%`,
        height: `${Height * 100}%`,
        width: `${Width * 100}%`,
      }}
      className="blinking-border"
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          height: `100%`,
          width: `100%`,
          overflow: "hidden",
          // border:"2px solid red"
        }}
        className="blinking-border"
        onClick={() => setOpen(true)}
      >
        {customuizedProductFront &&
          customuizedProductFront.length > 0 &&
          customuizedProductFront.map((img, i) => (
            <img
              loading="lazy"
              key={i}
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
          ))}
      </div>
    </div>
  );
};

export default CustomizedCombinationImage;
