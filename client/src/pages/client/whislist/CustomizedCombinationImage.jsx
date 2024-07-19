import React, { useEffect, useState } from "react";
import "./CustomizedCombinationImage.css";
import { REACT_APP_URL } from "../../../config";
// import CustomizedProductDetails from "./customizeProduct/CustomizedProductDetails";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";
import { CustomizedFinialAmount } from "../../../utils/usefullFunction";

const calculateCustomizedPrice = (
  productDetails,
  combinations,
  priceFor,
  { width, height }
) => {
  if (productDetails && combinations?.length > 0) {
    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForCollectionClient(
        productDetails,
        combinations,
        {
          DefaultWidth: width,
          DefaultHeight: height,
        },
        false
      );

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
  combination,
  setCustomizedCombination,
  productId = "",
}) => {
  const [price, setPrice] = React.useState({ productName: "", price: "" });

  const [unit, setUnit] = useState({ width: 0, height: 0 });
  const [backSelected, setBackSelected] = useState("");
  const [FrontCombination, setFrontCombination] = useState([]);
  const [SAFCombination, setSAFCombination] = useState([]);
  const [CBCombination, setCBCombination] = useState([]);
  const [IBCombination, setIBCombination] = useState([]);
  const [customuizedProductDetails, setCustomuizedProductDetails] =
    useState(false);

  const [customizedProductPrice, setcustomizedProductPrice] = useState({
    customizedProductPriceFront: 0,
    customizedProductPriceSAF: 0,
    customizedProductPriceCB: 0,
    customizedProductPriceIB: 0,
  });

  useEffect(() => {
    if (customuizedProduct) {
      setCustomuizedProductDetails(customuizedProduct);
    }

    setFrontCombination(combination?.FrontCombinations);
    setSAFCombination(combination?.SAFCombinations);
    setCBCombination(combination?.CBCombinations);
    setIBCombination(combination?.IBCombinations);
    // setUOM(customuizedProduct?.UOM);
    setUnit({
      width: customuizedProduct?.DefaultWidth,
      height: customuizedProduct?.DefaultHeight,
    });
  }, [customuizedProduct, combination]);

  useEffect(() => {
    setCustomizedCombination((prevState) => {
      const existingIndex = prevState.findIndex(
        (data) => data?.customizedComboRectangleId === id
      );
      if (existingIndex >= 0) {
        prevState[existingIndex] = {
          customizedComboRectangleId: id,
          customizedComboId: productId,
          customizedProductId: customuizedProductDetails?._id,
          Front: FrontCombination,
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
            Front: FrontCombination,
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
        FrontCombination,
        "FixedPrice",
        unit
      ),
      customizedProductPriceSAF: calculateCustomizedPrice(
        customuizedProductDetails,
        SAFCombination,
        "FixedPriceSAF",
        unit
      ),
      customizedProductPriceCB: calculateCustomizedPrice(
        customuizedProductDetails,
        CBCombination,
        "FixedPriceCB",
        unit
      ),
      customizedProductPriceIB: calculateCustomizedPrice(
        customuizedProductDetails,
        IBCombination,
        "FixedPriceIB",
        unit
      ),
    }));
  }, [
    SAFCombination,
    CBCombination,
    IBCombination,
    FrontCombination,
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
  }, [price, index, updateTotalPrice]);

  return (
    <>
      {/* <Modal
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
      </Modal> */}

      <ImageCreation
        PositionX={PositionX}
        PositionY={PositionY}
        customuizedProductFront={FrontCombination}
        Height={Height}
        Width={Width}
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
      >
        {customuizedProductFront &&
          customuizedProductFront.length > 0 &&
          customuizedProductFront.map((img, i) => (
            <img
              loading="lazy"
              key={i}
              src={`${REACT_APP_URL}/images/parameterPosition/${img?.pngImage}`}
              alt="Preview"
              style={{
                position: "absolute",
                top: `${img?.positionY || 0}%`,
                left: `${img?.positionX || 0}%`,
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
