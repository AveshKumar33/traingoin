import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";

import { setProductQuantity } from "../../../redux/slices/cartSlice";

import "./styles.css";
import { REACT_APP_URL } from "../../../config";
import { updateCartProductQuantity } from "../../../redux/slices/newCartSlice";
// import "../roomideas/RoomIdea.css";

import CustomizedCombinationImage from "../whislist/CustomizedCombinationImage";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

const CustomizedCombinationCard = ({
  product,
  cartData,
  setProductPrice,
  selectedCustomizedProduct,
  handleDeleteCartItem,
  handleMoveToWishlist,
  userdetails,
}) => {
  const dispatch = useDispatch();
  const [childComponentPrice, setchildComponentPrice] = useState([]);
  const [customizedCombination, setCustomizedCombination] = useState([]);
  const [initialPrice, setInitialPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [cartProduct, setCartProduct] = useState({});

  useEffect(() => {
    if (cartData) {
      setCartProduct(cartData);
    }
  }, [cartData]);

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

  useEffect(() => {
    const totalPrice = childComponentPrice.reduce((acc, ele) => {
      return Number(acc) + Number(ele?.price);
    }, 0);

    setPrice(totalPrice * cartProduct?.quantity);
    setInitialPrice(totalPrice);
    setQuantity(cartProduct?.quantity);
  }, [childComponentPrice, cartProduct]);

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

  const updateTotalPrice = useCallback((index, price) => {
    setchildComponentPrice((prevPrices) => {
      const newPrices = [...prevPrices];
      newPrices[index] = price;
      return newPrices;
    });
  }, []);

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
        <div className="ImageContainer" style={{ position: "relative" }}>
          {product && product?.image && (
            <Link to={`/customized-combination/${product?._id}`}>
              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/product/${product?.image}`}
                alt="Image_From_Server"
                className="img-fluid"
                style={{ height: "15vh" }}
              />
            </Link>
          )}

          {selectedCustomizedProduct?.length > 0 &&
            selectedCustomizedProduct?.map((p, i) => {
              return (
                <div key={i}>
                  <CustomizedCombinationImage
                    id={p?.customizedComboRectangleId?._id}
                    productId={product?._id}
                    index={i}
                    customuizedProduct={p?.customizedProductId}
                    combination={p}
                    key={p?._id}
                    PositionX={p?.customizedComboRectangleId?.top}
                    PositionY={p?.customizedComboRectangleId?.left}
                    Height={p?.customizedComboRectangleId?.height}
                    Width={p?.customizedComboRectangleId?.width}
                    updateTotalPrice={updateTotalPrice}
                    setCustomizedCombination={setCustomizedCombination}
                  />
                </div>
              );
            })}
        </div>
      </td>
      <td>
        <p style={{ fontSize: "18px", backgroundColor: "transparent" }}>
          {product?.Name}{" "}
        </p>

        <div
          className="btn-group"
          role="group"
          aria-label="Basic mixed styles example mx-auto"
        >
          <button
            type="button"
            className="btn btn-success"
            style={{ backgroundColor: "#475B52" }}
            onClick={() =>
              handleMoveToWishlist(cartProduct?._id, "customizedComboProducts")
            }
          >
            MOVE TO WISHLIST
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              handleDeleteCartItem(cartProduct?._id, "customizedComboProducts")
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
  );
};

export default CustomizedCombinationCard;
