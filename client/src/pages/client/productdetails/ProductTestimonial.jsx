import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/slices/cartSlice";
import { REACT_APP_URL } from "../../../config";

const ProductTestimonial = ({ item = {}, collectionurl = "" }) => {
  const dispatch = useDispatch();

  const handleAddTocart = (name, price, id, img, gst = 0) => {
    const product = {
      name,
      quantity: 1,
      price: price,
      id,
      img,
      sellingType: "Normal",
      gst: gst,
    };

    dispatch(addTocart({ product: product }));

    toast(`${name}, Added to Cart !`);
  };

  const images =
    item?.image !== "default.png"
      ? [item?.image]
      : item?.singleProductId?.ProductImage[0];

  const directory =
    item?.image !== "default.png" ? "singleProductCombination" : "product";

  return (
    <>
      <div className="item">
        <div className="shadow-effect ">
          <figure className="effect-zoe">
            <Link
              to={`/product/${collectionurl}/${item?.singleProductId?.Urlhandle}`}
            >
              <img
                className="img-responsive"
                src={`${REACT_APP_URL}/images/${directory}/${images}`}
                style={{ height: "40vh", width: "100%" }}
                alt=""
              />
            </Link>

            <figcaption
              className="SingleProductfigcaption"
              onClick={() => {
                handleAddTocart(
                  item?.singleProductId?.ProductName,
                  item?.SalePrice,
                  item?._id,
                  images,
                  item?.singleProductId?.gst
                );
              }}
              style={{ marginTop: "-50px" }}
            >
              <h2 style={{ fontSize: 16, color: "#fff" }}>Add to Cart </h2>
              <p className="icon-links">
                <a>
                  <i
                    className="fa-solid fa-cart-shopping"
                    style={{ color: "#fff" }}
                  />
                </a>
              </p>
            </figcaption>
          </figure>

          <div
            className="item-details"
            style={{
              backgroundColor: "#fff",
              padding: 20,
              marginTop: "-25px",
            }}
          >
            <Link
              to={`/product/${collectionurl}/${item?.singleProductId?.Urlhandle}`}
            >
              <p
                style={{
                  color: "#324040",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                {item?.singleProductId?.ProductName}
              </p>
            </Link>
            <br></br>
            <h6 style={{ color: "#000" }}>
              ₹ {item?.SalePrice}&nbsp;
              <strike style={{ color: "red" }}>₹ {item?.MRP}</strike>
            </h6>
            <h6 style={{ color: "#324040" }}>
              Save ₹ {Number(item?.MRP) - Number(item?.SalePrice)} (
              {(
                100 -
                (Number(item?.SalePrice) / Number(item?.MRP)) * 100
              ).toFixed(2)}
              %)
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTestimonial;
