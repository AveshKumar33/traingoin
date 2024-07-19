import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import { setProductQuantity } from "../../../redux/slices/cartSlice";
import "./styles.css";
import { REACT_APP_URL } from "../../../config";
import { updateCartProductQuantity } from "../../../redux/slices/newCartSlice";

import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";

const SingleProductCard = ({
  product,
  FinialAmount,
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
      const productPrice = FinialAmount(
        cartProduct?.SalePrice,
        cartProduct?.singleProductId
      );

      // console.log("cartProduct", cartProduct);
      setPrice(productPrice * Number(cartProduct?.quantity));
      setInitialPrice(productPrice);
      setQuantity(cartProduct?.quantity);
    }
  }, [cartProduct, FinialAmount]);

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
          to={`/product/${product?.singleProductId?.Collection[0]?.url}/${product?.singleProductId?.Urlhandle}?cartId=${product?._id}`}
        >
          <img
            src={`${REACT_APP_URL}/images/product/${product?.image}`}
            alt="img25"
            style={{ height: "15vh" }}
          />
        </Link>
      </td>
      <td>
        <p style={{ fontSize: "18px", backgroundColor: "transparent" }}>
          {product?.singleProductId?.ProductName}
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
              handleMoveToWishlist(cartProduct?._id, "cartSingleProducts")
            }
          >
            MOVE TO WISHLIST
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              handleDeleteCartItem(cartProduct?._id, "cartSingleProducts")
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
                value={quantity || 1}
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

export default SingleProductCard;
