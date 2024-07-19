import React, { useState } from "react";
import "./checkout.css";
import "../home/custom.css";
import { REACT_APP_URL } from "../../../config";

// import MainHeader from "../../../components/mainheader/MainHeaderNew";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../../../config";
import { resetCart } from "../../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { post } from "../../../utils/paytmForm";
import Preloader from "../../../components/preloader/Preloader";
import { DynamicAttribute } from "../../../components/cartSidebar/CartSidebar";
import { BsCheckCircleFill } from "react-icons/bs";
import logo from "../../../assets/img/RALINGOBlack.png";
// import { useForm } from "react-hook-form";
import { toastError, toastSuceess } from "../../../utils/reactToastify";

import { RAZORPAY_KEY_ID } from "../../../config";
// import ProductCustomizedProduct from "../productdetails/customizedproduct/ProductCustomizedProduct";

// Paytm Integration
const paymentData = {
  amount: 100,
  email: "mihir@digisidekick.com",
  phoneNo: 9110193437,
};

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp|pdf|PDF)/gm;

const Checkout = ({ isloggedIn }) => {
  const [discountcode, setdiscountcode] = useState("");
  const [discountprice, setdiscountprice] = useState(0);
  const [coupondata, setcoupondata] = useState("");
  const [showlist, setshowlist] = useState(false);
  const [orderImages, setOrderImages] = useState([]);
  const [couponCodedata, setCouponCodedata] = useState({});

  const { cartdata } = useSelector((state) => state.cart);

  const { loading: Authuserloader, userdetails } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const totalprice = 10;
  // const totalprice = cartdata.reduce(
  //   (sum, item) => sum + Number(item.price),
  //   0
  // );

  const applyDiscount = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/coupon?CouponName=${discountcode.toUpperCase()}`
      );
      if (data?.data?.length !== 0) {
        if (
          data.data[0].ExpireDate.slice(0, 10) >=
          new Date().toISOString().slice(0, 10)
        ) {
          if (data?.data[0].CouponType === "Flat") {
            console.log(
              totalprice,
              data?.data[0].Min_Order_value_in_Flat,
              "check this one"
            );
            if (totalprice < data?.data[0].Min_Order_value_in_Flat) {
              return toastError(
                `Minimum Order value to alive this offer is ${data?.data[0].Min_Order_value_in_Flat}`
              );
            }
          }

          toastSuceess("Coupon Code Applied Successfully");
          setdiscountprice(data.data[0].CouponAmount);
          setcoupondata(data.data[0]);
          setdiscountcode("");
          setCouponCodedata(data.data[0]);
        } else {
          toastError("Coupon Code Expired");
        }
      } else {
        toastError("Coupon Code Invalid");
      }
    } catch (error) {
      toastError("Coupon Code Invalid");
    }
  };

  const [formdata, setformdata] = useState({
    Name: "",
    Email: "",
    Address: "",
    City: "",
    State: "",
    PinCode: "",
    Phone: "",
  });

  const [formErrors, setFormErrors] = useState({
    Name: "",
    Email: "",
    Address: "",
    City: "",
    State: "",
    PinCode: "",
    Phone: "",
  });

  const { Name, Email, Address, City, State, PinCode, Phone, Remarks } =
    formdata;

  const handleFormChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });

    const { name, value } = e.target;

    // Perform input validation and set error state accordingly
    if (name === "Name" && value.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        Name: "Name must be at least 3 characters long.",
      }));
    } else if (name === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        Email: "Invalid email address.",
      }));
    } else if (name === "Address" && value.length < 5) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        Address: "Address must be at least 5 characters long.",
      }));
    } else if (name === "City" && value.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        City: "City must be at least 3 characters long.",
      }));
    } else if (name === "State" && value.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        State: "State must be at least 3 characters long.",
      }));
    } else if (name === "PinCode" && value.length !== 6) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        PinCode: "Pincode must be 6 characters long.",
      }));
    } else if (name === "Phone" && value.length !== 10) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        Phone: "Phone must be 10 characters long.",
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const removeCouponCode = () => {
    setdiscountcode("");
    setdiscountprice(0);
    setcoupondata("");
    setCouponCodedata("");
  };

  //RazoryPay Script
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;

    for (const formerror in formErrors) {
      if (formErrors[formerror] !== "") {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      toastError("Error on Form Filling");
    } else {
      console.log("Checkout");
      razorpaycheckout();
    }
    // paytmcheckout()
  };

  //Paytm Integration

  const paytmcheckout = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axiosInstance.post(
        "/api/order",
        {
          Name: Name,
          Phone: Phone,
          Email: Email,
          Coupon: coupondata._id,
          Amount: totalprice - Number(discountprice),
          PinCode: PinCode,
          City: City,
          State: State,
          Address: Address,
          orderItems: cartdata,
          paymentStatus: "Not Successfull",
          UserDetails: userdetails._id,
        },
        config
      );

      let info = {
        action: "https://securegw.paytm.in/order/process",
        params: data.paytmParams,
      };

      post(info);
    } catch (error) {
      console.log();
    }
  };

  const razorpaycheckout = async () => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      let orderData = new FormData();

      orderData.append("Name", Name);
      orderData.append("Phone", Phone);
      orderData.append("Email", Email);

      orderData.append("Coupon", coupondata._id);
      orderData.append(
        "Amount",
        totalprice - calculatepercentageprice(couponCodedata, totalprice)
      );
      orderData.append("PinCode", PinCode);
      orderData.append("City", City);
      orderData.append("State", State);
      orderData.append("Address", Address);
      orderData.append("orderItems", JSON.stringify(cartdata));
      orderData.append("paymentStatus", "Not Successfull");
      orderData.append("UserDetails", userdetails._id);
      orderData.append(
        "DiscountAmount",
        calculatepercentageprice(couponCodedata, totalprice)
      );
      orderData.append("Remarks", Remarks);
      for (let i = 0; i < orderImages.length; i++) {
        orderData.append("ordersImage", orderImages[i]);
      }

      const { data } = await axiosInstance.post("/api/order", orderData);
      console.log(data, "datadatadata");
      const { amount, id: order_id, currency } = data.order;
      const { _id } = data.orderdata;

      const options = {
        key: RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Railingo",
        description: "Pay",
        image: logo,
        order_id: order_id,
        handler: async function (response) {
          const data = {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const res = await axiosInstance.get(`/api/order/${_id}`);

          const result = res.data.data.orderItems;

          let neworderItem = result.map((p) => {
            if (p.sellingType === "Installment") {
              const updatedInstallment = p.Installment.map((innerobj, i) => {
                if (i === 0) {
                  return {
                    ...innerobj,
                    paymentstatus: "Success",
                  };
                }
                return innerobj;
              });

              return { ...p, Installment: updatedInstallment };
            }
            return p;
          });

          await axiosInstance.put(`/api/order/${_id}`, {
            paymentStatus: "Successfull",
            orderItems: neworderItem,
          });

          dispatch(resetCart());

          alert("Payment Successfull");

          navigate("/");
        },
        prefill: {
          name: Name,
          email: Email,
          contact: Phone,
        },
        notes: {
          address: Address,
        },
        theme: {
          color: "#61dafb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log("error", error);
    }
  };

  if (Authuserloader === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    const validImageFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size < 2000000) {
        validImageFiles.push(file);
      }
    }

    if (validImageFiles.length) {
      setOrderImages(validImageFiles);

      return;
    }
    toastError("Selected images are not of valid type!");

    //Previous code
    // setProductImage(e.target.files);
    // const files = Array.from(e.target.files);
    // handleFiles(files);
  };
  // if (!isloggedIn) {
  //   return (
  //     <>
  //       <Navigate to="/" replace={true} />
  //     </>
  //   );
  // }

  return (
    <>
      <div className="row">
        <div
          className="col-lg-7 leftsection"
          style={{ backgroundColor: "#fff" }}
        >
          <img src={logo} style={{ height: "9vh" }} loading="lazy" alt="prev" />
          <br />
          <p style={{ fontSize: 12, paddingLeft: 12, paddingTop: 10 }}>
            <a style={{ color: "#707087" }}>Cart</a> &nbsp;
            <i className="fa fa-chevron-right" style={{ fontSize: 10 }} />{" "}
            &nbsp;
            <a style={{ fontWeight: 800 }}>Information</a> &nbsp;
            <i className="fa fa-chevron-right" style={{ fontSize: 10 }} />{" "}
            &nbsp;
            <a style={{ color: "#707087" }}>Shipping</a>
            &nbsp;
            <i className="fa fa-chevron-right" style={{ fontSize: 10 }} />{" "}
            &nbsp;
            <a style={{ color: "#707087" }}>Payment</a>
          </p>
          <br />
          <div
            id="accordion"
            className="HideInDesktop"
            style={{
              marginTop: 20,
              marginBottom: 20,
              width: "100vw",
              marginLeft: "-28px",
            }}
          >
            {/* Mobile Cart View */}
            <div className="card">
              <div className="card-header" id="headingTwo">
                <h5 className="mb-0">
                  <button
                    className="btn btn-link collapsed"
                    style={{ textDecoration: "none", color: "#000" }}
                    onClick={() => setshowlist(!showlist)}
                  >
                    <i className="fa fa-shopping-cart" /> Show Order Summary{" "}
                    <span style={{ paddingLeft: 70 }}>
                      ₹ {totalprice - Number(discountprice)}
                    </span>
                  </button>
                </h5>
              </div>
              {showlist && (
                <>
                  <div style={{ margin: "-16px" }}>
                    <div className="card-body">
                      <div className="col-lg-12 Mobilecartdetails">
                        <table className="table">
                          <tbody>
                            {cartdata.map((item) => (
                              <>
                                <tr>
                                  <td>
                                    <div className="CheckOutimage-area">
                                      {Object.keys(item.customizedProductImage)
                                        .length > 0 ? (
                                        <>
                                          <h1>d</h1>
                                        </>
                                      ) : (
                                        <>
                                          <h1>dwwwwwwww</h1>
                                        </>
                                      )}
                                      {/* <img
                                        src={`${
                                          REACT_APP_URL
                                        }/images/product/${item.img}`}
                                        alt="Preview"
                                      />
                                      <a
                                        className="CheckOutremove-image"
                                        href="#"
                                        style={{ display: "inline" }}
                                      >
                                        {item.quantity}
                                      </a> */}
                                    </div>
                                  </td>
                                  <td style={{ width: "55%", paddingTop: 30 }}>
                                    {item.name}
                                    <br />₹ {item.price / item.quantity} *{" "}
                                    {item.quantity}
                                  </td>
                                  <td style={{ paddingTop: 30 }}>
                                    ₹ {item.price}
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>

                        <table className="table">
                          <tbody>
                            <tr>
                              <td style={{ width: "50%" }}>Subtotal</td>
                              <td style={{ width: "50%", textAlign: "right" }}>
                                <b>₹ {totalprice}</b>
                              </td>
                            </tr>
                            <tr>
                              {!coupondata ? (
                                <>
                                  <td
                                    style={{
                                      width: "80%",
                                      borderBottom: "1px solid #475B52",
                                    }}
                                  >
                                    <div
                                      className="col-12"
                                      style={{ float: "left" }}
                                    >
                                      <div className="col">
                                        <div className="form-outline">
                                          <input
                                            type="text"
                                            id="form3Example1"
                                            className="form-control"
                                            value={discountcode}
                                            placeholder="Coupon Code"
                                            onChange={(e) =>
                                              setdiscountcode(e.target.value)
                                            }
                                            style={{
                                              border: "1px solid #ced4da",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      width: "20%",
                                      borderBottom: "1px solid #475B52",
                                    }}
                                  >
                                    <div
                                      className="col-3"
                                      style={{ float: "left" }}
                                    >
                                      <a
                                        type="button"
                                        className="button"
                                        onClick={applyDiscount}
                                      >
                                        Apply
                                      </a>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ width: "50%" }}>
                                    Discount <br></br>{" "}
                                    <span className="text-success">
                                      {/* <FaSquareCheck */}
                                      <BsCheckCircleFill color="green" />
                                      {coupondata.CouponName}
                                    </span>{" "}
                                    {/* applied{" "} */}
                                    <a onClick={removeCouponCode}>
                                      <i
                                        className="fa fa-trash"
                                        style={{ color: "#475B52" }}
                                      ></i>
                                    </a>
                                  </td>
                                  {/* <span className="text-success">{coupondata.CouponName}</span> */}
                                  <td
                                    style={{ width: "50%", textAlign: "right" }}
                                  >
                                    ₹ {discountprice}
                                  </td>
                                </>
                              )}
                            </tr>
                            <tr>
                              <td style={{ width: "50%" }}>
                                <b>Total</b>
                              </td>
                              <td style={{ width: "50%", textAlign: "right" }}>
                                <b>₹ {totalprice - Number(discountprice)}</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <br></br>

          <div className="col-lg-12">
            <div className="col-lg-4" style={{ float: "left" }}>
              <p style={{ fontSize: 16 }}>
                <b>Shipping address</b>
              </p>
            </div>

            <br></br>
            <br></br>
            <form onSubmit={handleSubmit}>
              {/* 2 column grid layout with text inputs for the first and last names */}
              <div className="row mb-4">
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      placeholder="Name"
                      name="Name"
                      onChange={handleFormChange}
                      required
                      style={{ border: "1px solid #ced4da" }}
                    />
                    {formErrors.Name !== "" && (
                      <p className="text-danger">{formErrors.Name}</p>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="email"
                      id="form3Example2"
                      className="form-control"
                      placeholder="Email"
                      name="Email"
                      required
                      onChange={handleFormChange}
                      style={{ border: "1px solid #ced4da" }}
                    />
                    {formErrors.Email !== "" && (
                      <p className="text-danger">{formErrors.Email}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      name="Address"
                      required
                      placeholder="Address"
                      onChange={handleFormChange}
                      style={{ border: "1px solid #ced4da" }}
                    />
                    {formErrors.Address !== "" && (
                      <p className="text-danger">{formErrors.Address}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="row mb-4">
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      placeholder="Apartment, Suite, etc. (Optional)"
                      style={{ border: "1px solid #ced4da" }}
                    />
                  </div>
                </div>
              </div> */}
              <div className="row mb-4">
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      placeholder="City"
                      name="City"
                      required
                      onChange={handleFormChange}
                      style={{ border: "1px solid #ced4da" }}
                    />
                    {formErrors.City !== "" && (
                      <p className="text-danger">{formErrors.City}</p>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      placeholder="State"
                      name="State"
                      required
                      onChange={handleFormChange}
                      style={{ border: "1px solid #ced4da" }}
                    />
                    {formErrors.State !== "" && (
                      <p className="text-danger">{formErrors.State}</p>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="number"
                      id="form3Example1"
                      className="form-control"
                      placeholder="PinCode"
                      name="PinCode"
                      onChange={handleFormChange}
                      style={{ border: "1px solid #ced4da" }}
                    />

                    {formErrors.PinCode !== "" && (
                      <p className="text-danger">{formErrors.PinCode}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="number"
                      id="form3Example1"
                      className="form-control"
                      placeholder="Mobile Number"
                      name="Phone"
                      required
                      onChange={handleFormChange}
                      style={{ border: "1px solid #ced4da" }}
                    />
                    {formErrors.Phone !== "" && (
                      <p className="text-danger">{formErrors.Phone}</p>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="form3Example1"
                      className="form-control"
                      placeholder="Message..."
                      name="Remarks"
                      required
                      onChange={handleFormChange}
                      style={{ border: "1px solid #ced4da" }}
                    />
                    {/* {formErrors.Remarks !== "" && (
                      <p className="text-danger">{formErrors.Remarks}</p>
                    )} */}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="Description">
                  Upload Documents & Image ("Size should less than 2 MB")
                </label>
                <div className="upload-container">
                  <center>
                    <input
                      type="file"
                      id="file_upload"
                      multiple
                      accept="image/*"
                      onChange={handleImage}
                    />
                  </center>
                </div>
              </div>
              <div className="col-12 buttonsection2 d-flex justify-content-end">
                <button type="submit" className="button">
                  Continue To Shipping
                </button>
              </div>
            </form>
            <br></br>
            <br></br>
          </div>
          <div
            className="col-lg-12"
            style={{ margin: "70px 0px 20px 0px", textAlign: "center" }}
          >
            <hr style={{ width: "100%" }} />
            <p>
              <a href="#" style={{ color: "#000" }}>
                Refund Policy
              </a>
              &nbsp;&nbsp;
              <a href="#" style={{ color: "#000" }}>
                Shipping Policy
              </a>
              &nbsp;&nbsp;
              <a href="#" style={{ color: "#000" }}>
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
        <div
          className="col-lg-5 HideInPhone"
          style={{
            backgroundColor: "#475B52",
            float: "left",
            padding: 70,
            borderLeft: "1px solid #CAC9C4",
          }}
        >
          {cartdata && cartdata.length !== 0 ? (
            <>
              <table className="table">
                <tbody>
                  {cartdata.map((item) => (
                    <>
                      <tr>
                        <td>
                          <div className="CheckOutimage-area">
                            {item.customizedProductImage &&
                            Object.keys(item.customizedProductImage).length >
                              0 &&
                            item.customizedProductImage.attribute.length > 0 ? (
                              <>
                                {/* <ProductCustomizedProduct
                                  varientproductdetails={
                                    item.customizedProductImage
                                      .varientproductdetails
                                  }
                                  attribute={
                                    item.customizedProductImage.attribute
                                  }
                                  attributePosition={
                                    item.customizedProductImage
                                      .attributePosition
                                  }
                                  height="100%"
                                  width="100%"
                                  name="cartImage"
                                /> */}
                                <a
                                  className="CheckOutremove-image"
                                  href="#"
                                  style={{ display: "inline" }}
                                >
                                  {item.quantity}
                                </a>
                              </>
                            ) : (
                              <>
                                <img
                                  src={`${REACT_APP_URL}/images/product/${item.img}`}
                                  // style={{ height: "10vh" }}
                                />
                                <a
                                  className="CheckOutremove-image"
                                  href="#"
                                  style={{ display: "inline" }}
                                >
                                  {item.quantity}
                                </a>
                              </>
                            )}

                            {/* <img
                              src={`${
                                REACT_APP_URL
                              }/images/product/${item.img}`}
                              alt="Preview"
                            />
                            <a
                              className="CheckOutremove-image"
                              href="#"
                              style={{ display: "inline" }}
                            >
                              {item.quantity}
                            </a> */}
                          </div>
                        </td>
                        <td style={{ width: "55%", paddingTop: 10 }}>
                          {item.name}
                          <br />₹{item.price / item.quantity} X {item.quantity}
                          <br />
                          {item.sellingType === "Installment" && (
                            <>
                              <span
                                className=" p-1 rounded"
                                style={{
                                  backgroundColor: "#475B52",
                                  color: "#fff",
                                  fontSize: "10px",
                                }}
                              >
                                {item.sellingType}
                              </span>
                            </>
                          )}
                          <br />
                          <DynamicAttribute item={item} />
                        </td>
                        <td style={{ paddingTop: 30 }}>₹ {item.price}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <></>
          )}
          {/* <br />
          <br /> */}
          {/* <div className="col-8" style={{ float: "left" }}>
            <div className="col mb-4">
              <div className="col">
                <div className="form-outline">
                  <input
                    type="text"
                    id="form3Example1"
                    className="form-control"
                    value={discountcode}
                    placeholder="Coupon Code"
                    onChange={(e) => setdiscountcode(e.target.value)}
                    style={{ border: "1px solid #ced4da" }}
                  />
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="col-1" style={{ float: "left" }}>
            &nbsp;
          </div>
          <div className="col-3" style={{ float: "left" }}>
            <button className="button" onClick={applyDiscount}>
              Apply
            </button>
          </div> */}
          <br />
          <table className="table">
            <tbody>
              <tr>
                <td style={{ width: "50%" }}>Subtotal</td>
                <td style={{ width: "50%", textAlign: "right" }}>
                  <b>₹ {totalprice}</b>
                </td>
              </tr>
              <tr style={{}}>
                {!coupondata ? (
                  <>
                    <td
                      style={{
                        width: "80%",
                        borderBottom: "1px solid #475B52",
                      }}
                    >
                      <div className="col-12" style={{ float: "left" }}>
                        <div className="col">
                          <div className="form-outline">
                            <input
                              type="text"
                              id="form3Example1"
                              className="form-control"
                              value={discountcode}
                              placeholder="Coupon Code"
                              onChange={(e) => setdiscountcode(e.target.value)}
                              style={{
                                border: "1px solid #ced4da",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        width: "20%",
                        borderBottom: "1px solid #475B52",
                      }}
                    >
                      <div className="col-3" style={{ float: "left" }}>
                        <a
                          type="button"
                          className="button"
                          onClick={applyDiscount}
                        >
                          Apply
                        </a>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ width: "70%" }}>
                      Discount <br></br>{" "}
                      <span className="text-success">
                        <BsCheckCircleFill color="green" /> &nbsp;
                        {coupondata.CouponName}&nbsp;
                      </span>{" "}
                      {/* applied{" "} */}
                      <a onClick={removeCouponCode}>
                        <i
                          className="fa fa-trash"
                          style={{ color: "#475B52" }}
                        ></i>
                      </a>
                    </td>
                    {/* <span className="text-success">{coupondata.CouponName}</span> */}
                    <td style={{ width: "50%", textAlign: "right" }}>
                      {/* <b>
                        {calculatepercentageprice(couponCodedata,totalprice)}
                        ₹
                        {couponCodedata.CouponType === "Percentage"
                          ? calculatepercentage(
                              totalprice,
                              couponCodedata.CouponPercentage
                            ) < couponCodedata.MaxDiscount
                            ? calculatepercentage(
                                totalprice,
                                couponCodedata.CouponPercentage
                              )
                            : couponCodedata.MaxDiscount
                          : discountprice}
                      </b> */}

                      <b>
                        {" "}
                        ₹ {calculatepercentageprice(couponCodedata, totalprice)}
                      </b>
                    </td>
                  </>
                )}
              </tr>
              <tr>
                <td style={{ width: "50%" }}>
                  <b>Total</b>
                </td>
                <td style={{ width: "50%", textAlign: "right" }}>
                  <b>
                    ₹{" "}
                    {totalprice -
                      calculatepercentageprice(couponCodedata, totalprice)}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const calculatepercentageprice = (couponCodedata, total) => {
  let coupondiscount = 0;

  if (couponCodedata.CouponType === "Percentage") {
    let discountamount = calculatepercentage(
      total,
      couponCodedata.CouponPercentage
    );

    if (couponCodedata.MaxDiscount === null || !couponCodedata.MaxDiscount) {
      coupondiscount = discountamount;
    }

    if (
      couponCodedata.MaxDiscount !== null &&
      discountamount > couponCodedata.MaxDiscount
    ) {
      coupondiscount = couponCodedata.MaxDiscount;
    } else {
      coupondiscount = discountamount;
    }
  }

  if (couponCodedata.CouponType === "Flat") {
    coupondiscount = couponCodedata.CouponAmount;
  }

  return coupondiscount;
};

const calculatepercentage = (price, percentage) => {
  let calculatepercentagevalue = price * (percentage / 100);

  return calculatepercentagevalue.toFixed(2);
};

export default Checkout;
