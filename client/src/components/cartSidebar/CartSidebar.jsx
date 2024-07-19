/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTocart,
  changePaymentMode,
  removeTocart,
  resetCart,
} from "../../redux/slices/cartSlice";
import { AiFillDelete } from "react-icons/ai";
import { REACT_APP_URL } from "../../config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toastError } from "../../utils/reactToastify";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
// import ProductCustomizedProduct from "../../pages/client/productdetails/customizedproduct/ProductCustomizedProduct";

const CartSidebar = ({ toggleCart }) => {
  const dispatch = useDispatch();

  const { cartdata } = useSelector((state) => state.cart);

  console.log(cartdata, "cartdatacartdata");
  const { loading, user, error, userdetails, userToken, auth } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const location = useLocation();

  const deletecartItems = (item) => {
    // dispatch(removeTocart({ id }));
    dispatch(removeTocart({ item }));
  };

  const totalprice = cartdata.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const handlelogin = () => {
    sessionStorage.setItem("previousPage", location.pathname);
    navigate("/login");
  };

  return (
    <>
      <div
        id="CartSidebar"
        className="sidebarHome"
        style={{ backgroundColor: "#fff" }}
      >
        <button
          className="closebtn btn"
          //   onClick={closeCartSidebar}
          onClick={() => toggleCart(false)}
          style={{ fontSize: 30, right: 10, marginLeft: 380 }}
        >
          ×
        </button>
        <div>
          <div className="d-flex justify-content-between pe-3">
            <p style={{ paddingLeft: 10, fontSize: 25, color: "#463D36" }}>
              Your Cart
            </p>
            <span>
              <button
                className="btn btn-primary"
                onClick={() => dispatch(resetCart())}
                style={{ backgroundColor: "#E9860E", border: "none" }}
              >
                Clear Cart
              </button>
            </span>
          </div>
          <br />
          <div
            style={{
              height: "50vh",
              overflowY: "scroll",
              marginTop: "-20px",
            }}
          >
            {/* CartItemdata */}

            {cartdata && cartdata.length !== 0 ? (
              <>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      {/* <td></td> */}
                      <th>Product</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  {cartdata.map((item, index) => (
                    <>
                      <CartItems
                        key={item.id}
                        item={item}
                        deletecartItems={deletecartItems}
                        index={index}
                      />
                    </>
                  ))}
                </table>
              </>
            ) : (
              <>
                <>
                  <div className="col-lg-12" style={{ paddingTop: "20px" }}>
                    <h6 style={{ textAlign: "center", color: "#000" }}>
                      Your Cart is Empty{" "}
                    </h6>
                  </div>
                </>
              </>
            )}
          </div>
          <div style={{ height: "30vh", backgroundColor: "#fff" }}>
            <div id="accordion">
              <div className="card">
                <div
                  className="card-header"
                  id="headingTwo"
                  style={{ backgroundColor: "#fff" }}
                >
                  <h5 className="mb-0">
                    <button
                      style={{ color: "#000", textDecoration: "none" }}
                      className="btn btn-link collapsed"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Order special instructions
                    </button>
                  </h5>
                </div>
                <div
                  id="collapseTwo"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#accordion"
                >
                  <div className="card-body">
                    <textarea
                      rows={1}
                      className="form-control"
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
            </div>
            <table style={{ color: "#E9860E", margin: "20px 20px 0px 20px" }}>
              <tr>
                <td
                  style={{ width: "70%", textAlign: "left", color: "#463D36" }}
                >
                  Sub Total
                </td>
                <td
                  style={{ width: "30%", textAlign: "right", color: "#463D36" }}
                >
                  Rs. {totalprice}
                </td>
              </tr>
              <tr
                style={{ width: "100%", textAlign: "left", color: "#463D36" }}
              >
                Taxes and shipping calculated at checkout
              </tr>
            </table>
            {/* <div className="col-12" style={{ padding: 15 }}>
              <div className="col-lg-7" style={{ float: "left", color:"#E9860E" }}>
                Sub Total
              </div>
              <div
                className="col-lg-5"
                style={{ float: "left", textAlign: "right", color:"#E9860E" }}
              >
                Rs. {totalprice}
              </div>
              <p>Taxes and shipping calculated at checkout</p>
            </div> */}
            <br />
            <center>
              {cartdata?.length !== 0 && (
                <>
                  {auth ? (
                    <Link to="/checkout">
                      <button type="button" className="button">
                        Checkout
                      </button>
                    </Link>
                  ) : (
                    // <Link to="/login">
                    <button
                      type="button"
                      onClick={handlelogin}
                      className="button"
                    >
                      Login To Checkout
                    </button>
                    // </Link>
                  )}
                </>
              )}
            </center>
          </div>
        </div>
        <div style={{ backgroundColor: "#fff" }} />
      </div>
    </>
  );
};

export const CartItems = ({ item, deletecartItems, index }) => {
  const dispatch = useDispatch();

  const increaseQuantity = (
    name,
    price,
    id,
    img,
    quantity,
    sellingType,
    Installment,
    maxquantity,
    gst,
    customizedProductImage
  ) => {
    let {
      name: itemname,
      quantity: itemqauntity,
      price: itemprice,
      id: itemid,
      img: itemimg,
      sellingType: itemsellingType,
      Installment: itemInstallment,
      gst: itemgst,
      customizedProductImage: itemcustomizedProductImage,
      ...rest
    } = item;

    if (quantity >= maxquantity) {
      toastError(`Quantity Can't be Greater Than ${maxquantity}`);
      return;
    }
    const qty = quantity + 1;
    const product = {
      name,
      quantity: qty,
      price: (price / quantity) * qty,
      id,
      img,
      sellingType,
      Installment,
      gst,
      customizedProductImage,
      ...rest,
      // ...item
    };

    dispatch(addTocart({ product: product }));
  };

  const decreaseQuantity = (
    name,
    price,
    id,
    img,
    quantity,
    sellingType,
    Installment,
    customizedProductImage
  ) => {
    const qty = quantity - 1;
    if (quantity <= 1) {
      return;
    }

    let {
      name: itemname,
      quantity: itemqauntity,
      price: itemprice,
      id: itemid,
      img: itemimg,
      sellingType: itemsellingType,
      Installment: itemInstallment,
      customizedProductImage: itemcustomizedProductImage,
      ...rest
    } = item;
    const product = {
      name,
      quantity: qty,
      price: (price / quantity) * qty,
      id,
      img,
      sellingType,
      Installment,
      customizedProductImage,
      ...rest,
    };
    dispatch(addTocart({ product: product }));
  };

  const changePaymentType = (paymentModeType) => {
    dispatch(
      changePaymentMode({
        item,
        index,
        paymentModeType,
      })
    );
  };

  return (
    <>
      <tbody style={{ backgroundColor: "#FDFCFA" }}>
        <tr>
          {/* <td>
            {item.customizedProductImage &&
            Object.keys(item.customizedProductImage).length > 0 &&
            item.customizedProductImage.attribute.length > 0 ? (
              <ProductCustomizedProduct
                varientproductdetails={
                  item.customizedProductImage.varientproductdetails
                }
                attribute={item.customizedProductImage.attribute}
                attributePosition={
                  item.customizedProductImage.attributePosition
                }
                height="10vh"
                width="10vh"
                name="cartImage"
              />
            ) : (
              <>
                <img
                  loading="lazy"
                  src={`${REACT_APP_URL}/images/product/${item.img}`}
                  style={{ height: "10vh" }}
                />
              </>
            )}
          </td> */}
          <td style={{ textAlign: "left" }}>
            {item.name} <br /> ₹ {item.price / item.quantity} <br />
            <div className="mb-1">
              {item.sellingType === "Installment" && (
                <span
                  className="badge btn-primary"
                  style={{ fontSize: "10px" }}
                >
                  {item.sellingType}
                </span>
              )}

              <br />
              <DynamicAttribute item={item} />
            </div>
            {item.Installment && item.Installment.length > 0 && (
              <div className="row my-2">
                <div className="col-md-12">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    value={item.sellingType}
                    onChange={(e) => changePaymentType(e.target.value)}
                  >
                    <option disabled>Choose Buying Type</option>
                    <option value="Normal">Normal</option>
                    <option value="Installment">Installment</option>
                  </select>
                </div>
              </div>
            )}
            <div className="col-lg-12">
              <div className="input-group">
                <span className="input-group-btn">
                  <button
                    type="button"
                    className="quantity-left-minus btn btn-default btn-number"
                    style={{ backgroundColor: "#E9860E" }}
                    data-type="minus"
                    data-field=""
                  >
                    <FaMinus style={{ color: "#fff" }} />
                  </button>
                </span>
                &nbsp;
                <input
                  style={{ textAlign: "center" }}
                  type="text"
                  id="quantity"
                  name="quantity"
                  className="form-control input-number"
                  defaultValue={1}
                  min={1}
                  max={100}
                  value={item.quantity}
                />
                &nbsp;
                <span className="input-group-btn">
                  <button
                    type="button"
                    className="quantity-right-plus btn btn-default btn-number"
                    style={{ backgroundColor: "#E9860E" }}
                    data-type="plus"
                    data-field=""
                  >
                    <FaPlus style={{ color: "#fff" }} />
                  </button>
                </span>
              </div>
            </div>
          </td>
          <td>
            ₹ {item.price} <br />
            <span
              style={{
                backgroundColor: "#E9860E",
                padding: "4px",
                borderRadius: "2px",
                color: "#fff",
                fontSize: "12px",
              }}
              onClick={() => {
                deletecartItems(item);
              }}
            >
              <AiFillDelete />
            </span>
          </td>
        </tr>
      </tbody>
    </>
  );
};

export const DynamicAttribute = ({ item }) => {
  // console.log("iem",item)

  let {
    name,
    quantity,
    price,
    id,
    img,
    sellingType,
    Installment,
    maxquantity,
    gst,
    customizedProductImage,
    OriginalPrice,
    InstallmentAmount,
    Wastage,
    ...rest
  } = item;

  return (
    <>
      {Object.entries(rest).map(([key, value]) => (
        <>
          {/* <span style={{backgroundColor:"red"}}>{key}</span>  <span style={{backgroundColor:"green",padding:"2px"}}>{value}</span><br/> */}

          <span style={{ fontSize: "12px" }}>
            <b>{key} : </b>
          </span>
          <button
            type="button"
            className="badge btn-default"
            style={{
              border: "none",
              marginRight: "10px",
              backgroundColor: "#E9860E",
              fontSize: "12px",
            }}
          >
            {value}
          </button>
          <br></br>
        </>
      ))}
    </>
  );
};

export default CartSidebar;
