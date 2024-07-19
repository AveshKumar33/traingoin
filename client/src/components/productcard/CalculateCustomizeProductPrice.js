import React, { useState, useEffect } from "react";
import "./productcard.css";
import { CustomizedFinialAmount } from "../../utils/usefullFunction.js";

const CalculateCustomizeProductPrice = ({
  product,
  calculateCustomizedPrice,
  combination,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    if (combination) {
      // for front
      const FrontPrice = calculateCustomizedPrice(
        combination?.productId,
        combination?.Front,
        "FixedPrice"
      );

      let BackPrice = 0;

      // for back
      if (combination?.SAF?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.SAF,
          "FixedPriceSAF"
        );
      } else if (combination?.CB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.CB,
          "FixedPriceCB"
        );
      } else if (combination?.IB?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          combination?.productId,
          combination?.IB,
          "FixedPriceIB"
        );
      }

      const total = FrontPrice + BackPrice;
      setTotalPrice(total);
    }
  }, [combination, calculateCustomizedPrice]);

  useEffect(() => {
    const price = CustomizedFinialAmount(totalPrice, product);
    setFinalPrice(price);
  }, [product]);
  return <>{finalPrice}</>;
};

export default CalculateCustomizeProductPrice;
