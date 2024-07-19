import React, { useState, useCallback, useEffect } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import UserOrder from "../../../components/userorder/UserOrder";
import RazorpayCheckout from "../checkout/RazorpayCheckout";
import "./TrackOrder.css";
import { REACT_APP_URL } from "../../../config";

const TrackOrder = () => {
  const [phone, setphone] = useState("");
  const [order, setAllOrder] = useState([]);
  // const [loader, setLoader] = useState(false);
  const [orderitem, setorderitem] = useState([]);
  const [headerImage, setHeaderImage] = useState({});

  const [handlepopup, sethandlepopup] = useState(false);
  const [orderid, setorderid] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoader(true);

      const { data } = await axiosInstance.get(
        `http://localhost:7000/api/order?Phone=${phone}`
      );

      if (data.success) {
        setAllOrder(data.data);
      }
    } catch (error) {
      toastError(error);
      // setLoader(true);
    }
  };

  const handleorderItem = (orderitem, id) => {
    setorderid(id);
    setorderitem(orderitem);
    sethandlepopup(true);
  };

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/header-image/title/Track`);

      if (data?.success) {
        setHeaderImage(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <div
        className="div"
        style={{
          height: headerImage?.pngImage ? "60vh" : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${headerImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      ></div>

     
      <div className="container TrackYourOrderMarginTop">
        <div className="row my-5">
          <h3 className="text-center" style={{ fontSize: "30px" }}>
            {" "}
            TRACK YOUR ORDER
          </h3>
          <br></br>
          <br></br>
          <br></br>
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            <form className="text-center" onSubmit={handleSubmit}>
              <div className="d-flex">
                <input
                  type="number"
                  className="form-control"
                  style={{ width: "80%" }}
                  placeholder="Search By Mobile No."
                  required
                  onChange={(e) => setphone(e.target.value)}
                />
                &nbsp;
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#475B52", border: "none" }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="col-lg-4"></div>

          {order && order.length > 0 && (
            <>
              {/* <h5 className='text-center mt-5'>Order List</h5> */}
              <div className="col-md-12">
                <UserOrder allorder={order} handleorderItem={handleorderItem} />
              </div>

              {handlepopup && (
                <div
                  id="ProfilePageOrderDetailsPopup"
                  className="popup-containerProfile"
                >
                  <div className="popup-contentProfile">
                    <div
                      className="close btn"
                      onClick={() => sethandlepopup(false)}
                    >
                      ×
                    </div>

                    <h5>Product Details</h5>
                    <br />

                    <div className="col-md-12 ">
                      {orderitem.map((order) => (
                        <>
                          <div className="table-responsive">
                            <table className="table mt-3">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Product Name</th>
                                  <th>Installment Type</th>
                                  <th>Qty</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style={{ width: "10%" }}>
                                    <img
                                      loading="lazy"
                                      className="ProfileProductImage"
                                      src={`${REACT_APP_URL}/images/product/${order.img}`}
                                      alt="prev"
                                    />
                                  </td>
                                  <td style={{ width: "30%" }}>
                                    <p className="ProfileProductName">
                                      {" "}
                                      {order.name}
                                    </p>
                                  </td>
                                  <td style={{ width: "40%" }}>
                                    {order.sellingType && (
                                      <span
                                        className=" p-1 rounded"
                                        style={{
                                          backgroundColor: "#475B52",
                                          color: "#fff",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {order.sellingType}
                                      </span>
                                    )}
                                    <br />
                                    <br />
                                    {order.sellingType === "Installment" &&
                                      order.Installment &&
                                      order.Installment.map((p, i) => (
                                        <tr key={p.Name}>
                                          <td style={{ padding: "0px" }}>
                                            <span className="my-5">
                                              {p.Name} - ₹ {p.Amount}-(
                                              {order.quantity}) -{" "}
                                              {Number(p.Amount) *
                                                Number(order.quantity)}
                                              &nbsp;&nbsp;
                                              {p.paymentstatus ? (
                                                <i
                                                  className="fa fa-check"
                                                  style={{ color: "green" }}
                                                ></i>
                                              ) : (
                                                <RazorpayCheckout
                                                  Amount={
                                                    Number(p.Amount) *
                                                    Number(order.quantity)
                                                  }
                                                  orderid={orderid}
                                                  paymentindex={i}
                                                  // setlocalpaymentstatus={
                                                  //   setlocalpaymentstatus
                                                  // }
                                                  // setinstallmentIndex={
                                                  //   setinstallmentIndex
                                                  // }
                                                />
                                              )}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: 18,
                                      fontWeight: 800,
                                      paddingTop: 30,
                                      color: "#475B52",
                                    }}
                                  >
                                    {order.quantity}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: 18,
                                      fontWeight: 800,
                                      paddingTop: 30,
                                      color: "#475B52",
                                    }}
                                  >
                                    ₹ {order.price}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default TrackOrder;
