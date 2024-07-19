import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";

import { setProductQuantity } from "../../../redux/slices/cartSlice";

import "./styles.css";
import { REACT_APP_URL } from "../../../config";
import { updateCartProductQuantity } from "../../../redux/slices/newCartSlice";
// import "../roomideas/RoomIdea.css";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

const SingleDotProductCard = ({
  product,
  setProductPrice,
  handleDeleteCartItem,
  FinialAmount,
  handleMoveToWishlist,
  userdetails,
}) => {
  const dispatch = useDispatch();
  const [initialPrice, setInitialPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [cartProduct, setCartProduct] = useState(null);

  useEffect(() => {
    if (product) {
      setCartProduct(product);
    }
  }, [product]);

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

  // console.log("product", product);

  useEffect(() => {
    let productPrice = 0;
    if (cartProduct && cartProduct?.productCombination?.length > 0) {
      for (let combination of cartProduct?.productCombination) {
        productPrice += FinialAmount(
          combination?.SalePrice,
          combination?.singleProductId
        );
      }
    }

    setPrice(productPrice * cartProduct?.quantity);
    setInitialPrice(productPrice);
    setQuantity(cartProduct?.quantity);
  }, [cartProduct, FinialAmount]);

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
        <div className="ImageContainer" style={{ position: "relative" }}>
          {product?.dotProductImageIds[0]?.image && (
            <Link to={`/room-idea/${product?.singleDotProductId}`}>
              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/dotimage/${product?.dotProductImageIds[0]?.image}`}
                className="card-img-top RoomIdeaImageStyle"
                alt={product?.name}
                style={{ height: "15vh" }}
              />
            </Link>
          )}

          {/* {product?.dotProductImageIds[0]?.dots?.map((p, i) => {
            return (
              <React.Fragment key={p._id}>
                <div
                  className="Dot fa fa-circle text-danger-glow blink"
                  key={p._id}
                  // onClick={() => handleModal(i, p.productId)}
                  style={{
                    left: `${p.positionX}%`,
                    top: `${p.positionY}%`,
                  }}
                ></div>
                <span
                  className="blink"
                  style={{
                    left: `${p.positionX + 4}%`,
                    top: `${p.positionY + 1}%`,
                    position: "absolute",
                    backgroundColor: "#3e6554",
                    padding: "2px 10px 2px 10px",
                    borderRadius: "3px",
                    border: "1px solid #fff",
                  }}
                >
                  <p style={{ color: "#fff" }}>
                    {p?.productId?.ProductName.slice(0, 10)}
                  </p>
                </span>
              </React.Fragment>
            );
          })} */}
        </div>
      </td>
      <td>
        <p style={{ fontSize: "18px", backgroundColor: "transparent" }}>
          {product?.name}{" "}
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
              handleMoveToWishlist(cartProduct?._id, "dotProducts")
            }
          >
            MOVE TO WISHLIST
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              handleDeleteCartItem(cartProduct?._id, "dotProducts")
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

export default SingleDotProductCard;
