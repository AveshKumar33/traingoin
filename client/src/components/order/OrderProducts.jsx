import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import "./OrderProducts.css";
import SingleProductCard from "./SingleProductCard";
import CustomizeProductCard from "./CustomizeProductCard";
import SingleDotProductCard from "./SingleDotProductCard";
import CustomizeDotProductCard from "./CustomizeDotProductCard";
import BackgroundImageRight from "../../assets/Image/BackgroundImageRight.png";
import CustomizedCombinationCard from "./CustomizedCombinationCard";

function formateDate(date) {
  const utcDate = new Date(date);
  const indianLocaleTimeString = utcDate.toLocaleString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  return indianLocaleTimeString;
}

const OrderProducts = ({
  orderProducts,
  singleProducts,
  customizeProducts,
  singleDotProducts,
  customizeDotProducts,
  customizeComboProducts,
  isAdmin = false,
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null);

  const handleClose = () => {
    setStatus(null);
    setOpen(false);
  };

  useEffect(() => {
    if (status) {
      setOpen(true);
    }
  }, [status]);

  return (
    <>
      <Modal handleClose={handleClose} width="30%" show={open} left="50%">
        <section className="root12">
          <figure className="figure12">
            {/* <img src="#" alt="" /> */}
            <figcaption>
              {status && status?.singleProductId && (
                <h2 style={{ fontWeight: "600" }}>
                  {status?.singleProductId?.ProductName}
                </h2>
              )}
              {status && status?.customizeProduct && (
                <h2 style={{ fontWeight: "600" }}>
                  {status?.customizeProduct?.ProductName}
                </h2>
              )}
              {status &&
                (status?.singleDotProductId ||
                  status?.customizeDotProductId) && (
                  <h2 style={{ fontWeight: "600" }}>{status?.name}</h2>
                )}
              {status && status?.customizedComboId && (
                <h2 style={{ fontWeight: "600" }}>
                  {status?.customizedComboId?.Name}
                </h2>
              )}
              <h2>₹ {status?.productAmount}</h2>
            </figcaption>
          </figure>
          <div className="order-track">
            <div className="order-track-step">
              <div className="order-track-status">
                <span className="order-track-status-dot" />
                <span className="order-track-status-line" />
              </div>
              <div className="order-track-text">
                <p
                  className="order-track-text-stat"
                  style={{ fontWeight: "600" }}
                >
                  Order Received
                </p>
                <span
                  className="order-track-text-sub"
                  style={{ color: "darkgray", fontWeight: "500" }}
                >
                  We Received your order
                </span>
                <br></br>
                <span
                  className="order-track-text-sub"
                  style={{ color: "darkgray", fontWeight: "500" }}
                >
                  {formateDate(orderProducts?.createdAt)}
                </span>
              </div>
            </div>
            {status &&
              status?.status &&
              status?.status?.length > 0 &&
              status?.status?.map((data) => (
                <div key={data?._id} className="order-track-step">
                  <div className="order-track-status">
                    <span className="order-track-status-dot" />
                    <span className="order-track-status-line" />
                  </div>
                  <div
                    className="order-track-text"
                    style={{
                      overflowY:
                        (data?.message || "").length > 100
                          ? "scroll"
                          : "visible",
                      maxHeight:
                        (data?.message || "").length > 100 ? "200px" : "auto",
                    }}
                  >
                    <p
                      className="order-track-text-stat"
                      style={{ fontWeight: "600" }}
                    >
                      {data?.status?.name}
                    </p>
                    <span
                      className="order-track-text-sub"
                      style={{ color: "darkgray", fontWeight: "500" }}
                    >
                      {data?.message}
                    </span>
                    <br />
                    <span
                      className="order-track-text-sub"
                      style={{ color: "darkgray", fontWeight: "500" }}
                    >
                      {formateDate(data?.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </Modal>

      <div
        className="row"
        style={{
          backgroundImage: `url(${BackgroundImageRight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          paddingTop: "0px",
        }}
      >
        <div className="container" style={{ width: "1200px" }}>
          <div className="row">
            <div
              className="container"
              style={{ width: "1200px", paddingTop: "50px" }}
            >
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#fff",
                        color: "#475B52",
                        width: "15%",
                      }}
                    >
                      Order Id
                    </th>
                    <th
                      style={{
                        backgroundColor: "#fff",
                        color: "#475B52",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        backgroundColor: "#fff",
                        color: "#475B52",
                      }}
                    >
                      Mobile No.
                    </th>
                    {orderProducts?.alternatePhoneNumber && (
                      <th
                        style={{
                          backgroundColor: "#fff",
                          color: "#475B52",
                        }}
                      >
                        Alternate Mobile No.
                      </th>
                    )}
                    <th
                      style={{
                        backgroundColor: "#fff",
                        color: "#475B52",
                      }}
                    >
                      Alternate Mobile No.
                    </th>
                    <th
                      style={{
                        backgroundColor: "#fff",
                        color: "#475B52",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{orderProducts?.orderId}</td>
                    <td>
                      {orderProducts?.firstName} {orderProducts?.lastName}
                    </td>
                    <td>{orderProducts?.phoneNumber}</td>
                    {orderProducts?.alternatePhoneNumber && (
                      <td>{orderProducts?.alternatePhoneNumber}</td>
                    )}
                    <td>{orderProducts?.alternatePhoneNumber}</td>
                    <td>₹ {orderProducts?.amount}</td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#475B52",
                        color: "#fff",
                      }}
                    >
                      Delivery Address
                    </th>
                    <td colSpan={4}>
                      {" "}
                      {orderProducts?.addressLine1}{" "}
                      {orderProducts?.addressLine2}
                    </td>
                  </tr>
                </tbody>
              </table>

              <br></br>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th
                      style={{
                        backgroundColor: "#475B52",
                        color: "#fff",
                      }}
                    >
                      Image
                    </th>
                    <th
                      style={{
                        color: "#fff",
                        backgroundColor: "#475B52",
                      }}
                    >
                      Product Name
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        backgroundColor: "#475B52",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        backgroundColor: "#475B52",
                      }}
                    >
                      Qty
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        backgroundColor: "#475B52",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {singleProducts &&
                    singleProducts?.length > 0 &&
                    singleProducts.map((product, index) => (
                      <SingleProductCard
                        key={index}
                        product={product}
                        orderProducts={orderProducts}
                        setStatus={setStatus}
                        isAdmin={isAdmin}
                      />
                    ))}
                  {customizeProducts &&
                    customizeProducts?.length > 0 &&
                    customizeProducts.map((product) => (
                      <CustomizeProductCard
                        key={product?._id}
                        product={product?.customizeProduct}
                        combination={product}
                        orderProducts={orderProducts}
                        setStatus={setStatus}
                        isAdmin={isAdmin}
                      />
                    ))}

                  {singleDotProducts &&
                    singleDotProducts?.length > 0 &&
                    singleDotProducts?.map((p) => (
                      <SingleDotProductCard
                        key={p._id}
                        product={p}
                        setStatus={setStatus}
                        orderProducts={orderProducts}
                        isAdmin={isAdmin}
                      />
                    ))}

                  {customizeDotProducts &&
                    customizeDotProducts?.length > 0 &&
                    customizeDotProducts?.map((p) => (
                      <CustomizeDotProductCard
                        key={p._id}
                        product={p}
                        setStatus={setStatus}
                        orderProducts={orderProducts}
                        isAdmin={isAdmin}
                      />
                    ))}

                  {customizeComboProducts &&
                    customizeComboProducts?.length > 0 &&
                    customizeComboProducts.map((product) => (
                      <CustomizedCombinationCard
                        key={product?._id}
                        setStatus={setStatus}
                        data={product}
                        product={product?.customizedComboId}
                        selectedCustomizedProduct={
                          product?.customizedComboRectangle
                        }
                        orderProducts={orderProducts}
                        isAdmin={isAdmin}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderProducts;
