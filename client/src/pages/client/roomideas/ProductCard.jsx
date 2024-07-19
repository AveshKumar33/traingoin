import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../../config";
import { FinialAmount } from "../../../utils/usefullFunction";
import { REACT_APP_URL } from "../../../config";

const ProductCard = ({ product }) => {
  const [productCombination, setProductCombination] = useState();

  const images =
    productCombination?.image !== "default.png"
      ? [productCombination?.image]
      : productCombination?.singleProductId?.ProductImage[0];

  const getProductCombination = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `api/single-product-combination/default/${product?._id}`
      );

      setProductCombination(data.data[0]);
    } catch (error) {
      console.log(error);
    }
  }, [product]);

  useEffect(() => {
    getProductCombination();
  }, [getProductCombination]);

  return (
    <>
      <div className="card  mx-2 my-2">
        <Link
          className="View-image"
          to={`/product/${product?.Collection[0]?.url}/${product?.Urlhandle}`}
          style={{ display: "inline" }}
        >
          <img
            loading="lazy"
            src={`${REACT_APP_URL}/images/product/${images}`}
            className="card-img-top"
            alt={product?.ProductName}
            style={{ height: "30vh" }}
          />
        </Link>
        <div className="d-flex justify-content-between px-2">
          <div style={{ padding: "10px 10px 10px 10px" }}>
            <p>
              <b>{product?.ProductName}</b>
            </p>
            <h6>
              ₹{" "}
              {FinialAmount(
                productCombination?.SalePrice,
                productCombination?.singleProductId
              )}{" "}
              &nbsp;&nbsp;&nbsp;
              <span style={{ color: "#D34527", fontSize: "14px" }}>
                ₹{" "}
                <s>
                  {FinialAmount(
                    productCombination?.MRP,
                    productCombination?.singleProductId
                  )}
                </s>
              </span>
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
