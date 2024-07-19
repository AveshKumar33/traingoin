import React, { useState } from "react";
import CartSidebar from "../cartSidebar/CartSidebar";
import { useSelector } from "react-redux";
import { IoIosCart } from "react-icons/io";

const CartIcon = () => {
  const { cartdata, quantity } = useSelector((state) => state.cart);
  const [managecart, setmanagecart] = useState(false);

  const toggleCart = () => {
    setmanagecart(!managecart);
  };
  return (
    <>
      {/* {managecart && <CartSidebar toggleCart={toggleCart} />} */}

      <section
        className="Hoverclass"
        onClick={() => setmanagecart(!managecart)} style={{paddingTop:"0px"}}
      >
        <IoIosCart style={{ paddingLeft: 5, fontSize:"30px" }}/>
        {/* <i className="fa fa-cart-shopping" style={{ paddingLeft: 10 }} /> */}
        {/* <span
          style={{
            backgroundColor: "#EFEFEF",
            borderRadius: "50%",
            padding: "1px 4px 1px 4px",
            fontSize: 8,
            marginLeft: "-5px",
            marginTop: "-3px",
            color: "#324040",
            position: "absolute",
          }}
        >
          {quantity}
        </span> */}

        {/* <img src="~/Images/locateud.png" width="32" height="32" style="padding: 5px 0 0 5px; margin-top: -5px; margin-left: 0;"> */}
        {/* <p><a id="D3" href="" target="_blank" style="color: #fff; text-decoration: none;">GET ON ROAD PRICE</a></p> */}
      </section>
    </>
  );
};

export default CartIcon;
