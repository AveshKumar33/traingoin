import React, { useState, useEffect } from "react";
import { REACT_APP_URL } from "../../../config";
import { CustomizedFinialAmount } from "../../../utils/usefullFunction";
import './CustomizeCombinationDetails.css';

const CustomizeProductCard = ({
  product,
  calculateCustomizedPrice,
  handleSelectedCustomizedProduct,
  prod,
  isSelected,
}) => {
  const [customizedProductPrice, setcustomizedProductPrice] = useState(0);

  useEffect(() => {
    if (product) {
      // for front
      const FrontPrice = calculateCustomizedPrice(
        product?.product[0],
        product?.Front,
        product?.UOM,
        "FixedPrice"
      );

      let BackPrice = 0;

      // for back
      if (product?.SAF?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          product?.product[0],
          product?.SAF,
          product?.UOM,
          "FixedPriceSAF"
        );
      } else if (product?.CB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          product?.product[0],
          product?.CB,
          product?.UOM,
          "FixedPriceCB"
        );
      } else if (product?.IB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          product?.product[0],
          product?.IB,
          product?.UOM,
          "FixedPriceIB"
        );
      }

      const total = FrontPrice + BackPrice;
      setcustomizedProductPrice(total);
    }
  }, [product, calculateCustomizedPrice]);

  return (
    <>
      <div
        className=" card mx-2 my-2 CustomizedCombinationProducts"
        style={{
          cursor: "pointer",
          border: isSelected ? "4px dashed red" : "",
        }}
        onClick={() => handleSelectedCustomizedProduct(prod, product)}
      >
        <div className="View-image" style={{ display: "inline" }}>
          {product?.Front &&
            product?.Front.length > 0 &&
            product?.Front.map((img, i) => (
              // <div key={i}>
              <img
                key={i}
                loading="lazy"
                src={`${REACT_APP_URL}/images/parameterPosition/${img?.combinations[0]?.pngImage}`}
                alt="Preview"
                className="card-img-top"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "40vh",
                  zIndex: Number(img?.attributeId?.BurgerSque),
                  // height: "30vh",
                }}
              />
              // </div>
            ))}
          {/* <img
            loading="lazy"
            src={`${REACT_APP_URL}/images/product/${product?.product?.[0].ProductImage[0]}`}
            className="card-img-top"
            alt={product?.product?.[0].ProductName}
            style={{ height: "30vh" }}
          /> */}
        </div>
        <div
          className="d-flex  justify-content-between px-2 CustomizedCombinationProductsContent"
        >
          <div style={{ padding: "10px 10px 10px 10px" }}>
            <p className="CustomizedCombinationProductsName">
              <b>{product?.product?.[0].ProductName}</b>
            </p>
            <h6 style={{ fontWeight: "600" }}>
              ₹{" "}
              {CustomizedFinialAmount(
                customizedProductPrice,
                product?.product?.[0]
              )}
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizeProductCard;
