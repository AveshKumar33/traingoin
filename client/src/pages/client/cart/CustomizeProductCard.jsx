import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";

import { setProductQuantity } from "../../../redux/slices/cartSlice";

import "./styles.css";
import { REACT_APP_URL } from "../../../config";
import { updateCartProductQuantity } from "../../../redux/slices/newCartSlice";
import { CustomizedFinialAmount } from "../../../utils/usefullFunction";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

const CustomizeProductCard = ({
  product,
  calculateCustomizedPrice,
  combination,
  setProductPrice,
  handleDeleteCartItem,
  handleMoveToWishlist,
  userdetails,
}) => {
  const dispatch = useDispatch();

  const [initialPrice, setInitialPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [cartProduct, setCartProduct] = useState(null);

  useEffect(() => {
    if (cartProduct) {
      const product = cartProduct?.customizeProduct;
      // for front
      const FrontPrice = calculateCustomizedPrice(
        product,
        cartProduct?.FrontCombinations,
        "FixedPrice",
        {
          width: cartProduct?.customizeProductWidth,
          height: cartProduct?.customizeProductHeight,
        }
      );

      let BackPrice = 0;

      // for back
      if (
        cartProduct?.SAF?.length > 0 &&
        cartProduct?.customizedProductBackSelected === "SAF"
      ) {
        BackPrice = calculateCustomizedPrice(
          product,
          cartProduct?.SAFCombinations,
          "FixedPriceSAF",
          {
            width: cartProduct?.customizeProductWidth,
            height: cartProduct?.customizeProductHeight,
          }
        );
      } else if (
        cartProduct?.CB?.length > 0 &&
        cartProduct?.customizedProductBackSelected === "CB"
      ) {
        BackPrice = calculateCustomizedPrice(
          product,
          cartProduct?.CBCombinations,
          "FixedPriceCB",
          {
            width: cartProduct?.customizeProductWidth,
            height: cartProduct?.customizeProductHeight,
          }
        );
      } else if (
        cartProduct?.IB?.length > 0 &&
        cartProduct?.customizedProductBackSelected === "IB"
      ) {
        BackPrice = calculateCustomizedPrice(
          product,
          cartProduct?.IBCombinations,
          "FixedPriceIB",
          {
            width: cartProduct?.customizeProductWidth,
            height: cartProduct?.customizeProductHeight,
          }
        );
      }

      const total = FrontPrice + BackPrice;
      const finalAmount = CustomizedFinialAmount(total, product);
      setPrice(Number(finalAmount) * Number(cartProduct?.quantity));
      setInitialPrice(Number(finalAmount));
      setQuantity(cartProduct?.quantity);
    }
  }, [cartProduct, calculateCustomizedPrice]);

  useEffect(() => {
    if (combination) {
      setCartProduct(combination);
    }
  }, [combination]);

  // useEffect(() => {
  //   if (updatedData && updatedData?.customizedProductId) {
  //     setCartProduct((prevState) => ({
  //       ...prevState,
  //       quantity: updatedData?.quantity,
  //     }));
  //   }
  // }, [updatedData]);

  // useEffect(() => {
  //   if (quantity) {
  //     setCartProduct((prevState) => ({
  //       ...prevState,
  //       quantity: quantity,
  //     }));
  //   }
  // }, [quantity]);

  useEffect(() => {
    if (cartProduct) {
      setProductPrice((prevState) => ({
        ...prevState,
        [cartProduct?._id]: price,
      }));
    }
  }, [price, setProductPrice, cartProduct]);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (cartProduct) {
  //       if (quantity !== cartProduct?.quantity) {
  //         dispatch(
  //           updateCartProductQuantity({
  //             id: cartProduct?._id,
  //             productData: { quantity },
  //           })
  //         );
  //       }
  //     }
  //   }, 500);

  //   // Cleanup function
  //   return () => clearTimeout(timeoutId);
  // }, [dispatch, quantity, cartProduct]);

  const debouncedDispatch = debounce((id, newQuantity) => {
    dispatch(
      updateCartProductQuantity({
        id,
        productData: { quantity: newQuantity },
      })
    );
  }, 500);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, quantity + value);
    setQuantity(newQuantity);
    const newPrice = initialPrice * newQuantity;
    setPrice(newPrice);

    if (cartProduct) {
      if (userdetails && Object.keys(userdetails).length > 0) {
        debouncedDispatch(cartProduct._id, newQuantity);
      } else {
        dispatch(
          setProductQuantity({ _id: cartProduct._id, quantity: newQuantity })
        );
      }
    }
  };

  return (
    <tr>
      <td>
        <Link
          to={`/customized-product/${product?.Collection[0]?.url}/${product?.Urlhandle}?cartId=${combination?._id}`}
        >
          <ImageCreation
            customuizedProductFront={combination?.FrontCombinations}
          />
        </Link>
      </td>
      <td>
        <p style={{ fontSize: "18px", backgroundColor: "transparent" }}>
          {product?.ProductName}
        </p>
        <div
          className="btn-group"
          style={{ zoom: "70%" }}
          role="group"
          aria-label="Basic mixed styles example mx-auto"
        >
          <button
            type="button"
            className="btn btn-success"
            style={{ backgroundColor: "#475B52" }}
            onClick={() =>
              handleMoveToWishlist(cartProduct?._id, "customizeProducts")
            }
          >
            MOVE TO WISHLIST
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              handleDeleteCartItem(combination?._id, "customizeProducts")
            }
          >
            REMOVE PERMANENTLY
          </button>
        </div>
      </td>
      <td>
        <div className="qty" style={{ backgroundColor: "transparent" }}>
          <div className="col-lg-12">
            <div className="input-group">
              <span className="input-group-btn">
                <button
                  type="button"
                  className="quantity-left-minus btn btn-default btn-number"
                  style={{
                    backgroundColor: "#475B52",
                    userSelect: "none",
                  }}
                  data-type="minus"
                  data-field=""
                  onClick={() => handleQuantityChange(-1)}
                >
                  <FaMinus style={{ color: "#fff" }} />
                </button>
              </span>
              &nbsp;
              <input
                style={{
                  textAlign: "center",
                  width: "50px",
                  borderRadius: "5px",
                  cursor: "default",
                  userSelect: "none",
                }}
                type="text"
                id="quantity"
                name="quantity"
                className="form-control input-number"
                min={1}
                max={100}
                readOnly
                disabled
                value={quantity}
              />
              &nbsp;
              <span className="input-group-btn">
                <button
                  type="button"
                  className="quantity-right-plus btn btn-default btn-number"
                  style={{
                    backgroundColor: "#475B52",
                    userSelect: "none",
                  }}
                  data-type="plus"
                  data-field=""
                  onClick={() => handleQuantityChange(1)}
                >
                  <FaPlus style={{ color: "#fff" }} />
                </button>
              </span>
            </div>
          </div>
        </div>
      </td>
      <td style={{ textAlign: "right", fontWeight: "600" }}>₹{price}</td>
    </tr>

    // <div style={{ alignSelf: "end" }}>
    //   <div
    //     className="btn-group"
    //     role="group"
    //     aria-label="Basic mixed styles example mx-auto"
    //   >
    //     <button
    //       type="button"
    //       className="btn btn-success"
    //       onClick={() =>
    //         handleMoveToWishlist(cartProduct?._id, "customizeProducts")
    //       }
    //     >
    //       MOVE TO WISHLIST
    //     </button>
    //     <button
    //       type="button"
    //       className="btn btn-danger"
    //       onClick={() =>
    //         handleDeleteCartItem(cartProduct?._id, "customizeProducts")
    //       }
    //     >
    //       REMOVE PERMANENTLY
    //     </button>
    //   </div>
    // </div>
    // </div>
    // </div>
    // </div>
  );
};

export default CustomizeProductCard;

const ImageCreation = ({ customuizedProductFront }) => {
  return (
    <>
      <div
        style={{
          position: "relative", // Add position relative to contain absolute positioning of child images
          // height: "80vh",
          backgroundColor: "transparent",
        }}
      >
        {customuizedProductFront &&
          customuizedProductFront.length > 0 &&
          customuizedProductFront.map((img, i) => (
            <img
              key={i}
              src={`${REACT_APP_URL}/images/parameterPosition/${img?.pngImage}`}
              alt="Preview"
              style={{
                position: i === 0 ? "relative" : "absolute", // Position images absolutely within the parent div
                top: 0,
                left: 0,
                // width: "300px",
                height: "15vh",
                objectFit: "cover", // Ensure the image fills its container without distortion
                zIndex: img?.attributeId?.BurgerSque, // Use zIndex from the image attribute
              }}
            />
          ))}
      </div>
    </>
  );
};
