import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { addTocart } from "../../../../redux/slices/cartSlice";
import { REACT_APP_URL } from "../../../../config";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const CustomizedProductTestimonial = ({
  product,
  calculateCustomizedSimilarProductPrice,
}) => {
  //   const dispatch = useDispatch();

  const [totalPrice, setTotalPrice] = useState(0);

  //   const handleAddTocart = (name, price, id, img, gst = 0) => {
  //     const product = {
  //       name,
  //       quantity: 1,
  //       price: price,
  //       id,
  //       img,
  //       sellingType: "Normal",
  //       gst: gst,
  //     };

  //     dispatch(addTocart({ product: product }));

  //     toast(`${name}, Added to Cart !`);
  //   };

  useEffect(() => {
    if (product) {
      // for front
      const FrontPrice = calculateCustomizedSimilarProductPrice(
        product?.productId,
        product?.Front,
        "FixedPrice"
      );

      let BackPrice = 0;

      // for back
      if (product?.SAF?.length > 0) {
        BackPrice = calculateCustomizedSimilarProductPrice(
          product?.productId,
          product?.SAF,
          "FixedPriceSAF"
        );
      } else if (product?.CB?.length > 0) {
        BackPrice = calculateCustomizedSimilarProductPrice(
          product?.productId,
          product?.CB,
          "FixedPriceCB"
        );
      } else if (product?.IB?.length > 0) {
        BackPrice = calculateCustomizedSimilarProductPrice(
          product?.productId,
          product?.IB,
          "FixedPriceIB"
        );
      }

      const total = FrontPrice + BackPrice;
      setTotalPrice(total);
    }
  }, [product, calculateCustomizedSimilarProductPrice]);

  return (
    <>
      <div className="item">
        <div className="shadow-effect ">
          <figure className="effect-zoe">
            <Link
              to={`/customized-product/${product?.productId?.Collection[0]?.url}/${product?.productId?.Urlhandle}`}
            >
              <img
                className="img-responsive"
                src={`${REACT_APP_URL}/images/product/${product?.productId?.ProductImage[0]}`}
                style={{ height: "40vh", width: "100%" }}
                alt=""
              />
            </Link>

            <figcaption
              className="SingleProductfigcaption"
              onClick={() => {
                alert("Sorry!, Work in progress!");
                // handleAddTocart(
                //     product?.productId?.ProductName,
                //   item?.SalePrice,
                //   item?._id,
                //   images,
                //   item?.singleProductId?.gst
                // );
              }}
              style={{ marginTop: "-50px" }}
            >
              <h2 style={{ fontSize: 16, color: "#fff" }}>Add to Cart </h2>
              <div style={{ textAlign: "right" }}>
                <AddShoppingCartIcon
                  className="fa-solid fa-cart-shopping"
                  style={{ color: "#fff" }}
                />
              </div>
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
              to={`/customized-product/${product?.productId?.Collection[0]?.url}/${product?.productId?.Urlhandle}`}
            >
              <p
                style={{
                  color: "#324040",
                  fontSize: "18px",
                  fontWeight: "800",
                }}
              >
                {product?.productId?.ProductName}
              </p>
            </Link>
            <br></br>
            <h6 style={{ color: "#000" }}>₹ {totalPrice}</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizedProductTestimonial;
