import React from "react";
import { REACT_APP_URL } from "../../config";

const UserOrder = ({ allorder, handleorderItem }) => {
  return (
    <div className="col-lg-12 ProfileAllOrders">
      <div id="accordion">
        <div
          className="card"
          style={{ backgroundColor: "rgb(250,247,242,0.4)" }}
        >
          <button
            className="btn btn-link"
            style={{ textDecoration: "none", color: "#000" }}
            data-toggle="collapse"
            data-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <div
              className="card-header"
              id="headingOne"
              style={{ backgroundColor: "rgb(250,247,242,0.4)" }}
            >
              <h5 className="mb-0" style={{ textAlign: "left", fontSize: 15 }}>
                All Orders
              </h5>
            </div>
          </button>
          <div
            id="collapseOne"
            className="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordion"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="card-body">
              <div className="table-responsive">
                <table className="table mt-3">
                  <tbody>
                    {allorder &&
                      allorder.map((p) => (
                        <>
                          {/* <a href="#ProfilePageOrderDetailsPopup"> */}
                          <tr
                            onClick={() => {
                              handleorderItem(p.orderItems, p._id);
                            }}
                            key={p._id}
                            style={{ borderColor: "#ddd" }}
                          >
                            <td style={{ width: "10%" }}>
                              <img
                                loading="lazy"
                                src={`${REACT_APP_URL}/images/product/${p.orderItems[0].img}`}
                                style={{ height: "18vh" }}
                              />
                            </td>

                            <td className="ProfileOrderName">
                              # {p?.OrderID}
                              <br />
                              {p.orderItems[0].name}
                              <br />
                              <span
                                style={{
                                  color: "#475B52",
                                  fontSize: 15,
                                  width: "40%",
                                }}
                              >
                                Total Amount : ₹ {p.Amount}
                                <br />
                                Payment Status : {p.paymentStatus}
                              </span>{" "}
                              &nbsp;&nbsp;
                              {/* <strike style={{ color: "darkgray", fontSize: 12 }}>
                              Rs. 1,200.00
                            </strike> */}
                            </td>
                            <td
                              style={{
                                width: "10%",
                                paddingTop: 30,
                                color: "#475B52",
                              }}
                            >
                              {p.Address},{p.City},{p.State} - {p.PinCode}
                              <br />
                            </td>
                            {/* <td
                            style={{
                              width: "30%",
                              fontWeight: 800,
                              paddingTop: 30,
                              color: "#475B52",
                            }}
                          >
                            Rs. 1,200.00
                          </td> */}
                          </tr>
                          {/* </a> */}
                        </>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
