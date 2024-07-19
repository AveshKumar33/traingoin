import React, { useEffect, useState } from "react";

import "./CartButton.css";

const AddToCartButton = ({ onClick, status }) => {
  // useEffect(() => {
  //   if (status === "adding") {
  //     const id = setTimeout(() => {
  //       // setStatus("added");
  //     }, 2000);

  //     return () => {
  //       clearTimeout(id);
  //     };
  //   }
  // }, [status]);

  // function handleClick() {
  //   if (status === "removed") {
  //     setStatus("adding");

  //     if (typeof addToCart === "function") {
  //       addToCart();
  //     }
  //   } else if (status === "added") {
  //     setStatus("removed");

  //     if (typeof removeFromCart === "function") {
  //       removeFromCart();
  //     }
  //   }
  // }

  return (
    <button
      className={`add-to-cart ${status}`}
      type="button"
      aria-live="polite"
      onClick={onClick} style={{zoom:"70%"}}
    >
      <span
        className="removed text"
        aria-hidden={status !== "removed" ? "true" : "false"}
      >
         Add To Cart
      </span>

      <span aria-hidden="true" className="dotdotdot">
        <span className="dot one" />
        <span className="dot two" />
        <span className="dot three" />
      </span>

      <Cart aria-hidden="true" className="cart-icon" />

      <span
        className="added text"
        aria-hidden={status !== "added" ? "true" : "false"}
      >
        Go To Cart
      </span>
    </button>
  );
};

export default AddToCartButton;

const Cart = (props) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="#475B52"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ backgroundColor: "#475B52" }}
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path
        fill="#fff"
        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
      />
    </svg>
  );
};

function Plus(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="#475B52"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
