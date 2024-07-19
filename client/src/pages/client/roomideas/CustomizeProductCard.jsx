import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { REACT_APP_URL } from "../../../config";

const CustomizeProductCard = ({ product, calculateCustomizedPrice }) => {
  const [customizedProductPrice, setcustomizedProductPrice] = useState(0);

  useEffect(() => {
    if (product) {
      // for front
      const FrontPrice = calculateCustomizedPrice(
        product?.productId,
        product?.Front,
        "FixedPrice"
      );

      let BackPrice = 0;

      // for back
      if (product?.SAF?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          product?.productId,
          product?.SAF,
          "FixedPriceSAF"
        );
      } else if (product?.CB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          product?.productId,
          product?.CB,
          "FixedPriceCB"
        );
      } else if (product?.IB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          product?.productId,
          product?.IB,
          "FixedPriceIB"
        );
      }

      const total = FrontPrice + BackPrice;
      setcustomizedProductPrice(total);
    }
  }, [product, calculateCustomizedPrice]);

  return (
    <>
      <div className="card  mx-2 my-2">
        <Link
          className="View-image"
          to={`/customized-product/${product?.productId?.Collection[0]?.url}/${product?.productId?.Urlhandle}`}
          style={{ display: "inline" }}
        >
          <img
            loading="lazy"
            src={`${REACT_APP_URL}/images/product/${product?.productId?.ProductImage[0]}`}
            className="card-img-top"
            alt={product?.productId?.ProductName}
            style={{ height: "30vh" }}
          />
        </Link>
        <div className="d-flex  justify-content-between px-2">
          <div style={{ padding: "10px 10px 10px 10px" }}>
            <p>
              <b>{product?.productId?.ProductName}</b>
            </p>
            <h6>₹ {customizedProductPrice}</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizeProductCard;
