import React from "react";
import "./orderdetails.css";

const Orderdetails = () => {
  return (
    <>
      <div className="row orderDetails">
        {/* <h1 style="text-align: center; text-transform: uppercase;">Order Details</h1>
  <br>
  <br>
  <br> */}
        <h2 style={{ paddingLeft: 50, color: "#475B52" }}>Order #12345</h2>
        <p style={{ paddingLeft: 52, fontSize: 15 }}>
          21st Mar 2021 at 10:34 PM
        </p>
        <div className="col-lg-8 ProfileAllOrders">
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
                  <h5
                    className="mb-0"
                    style={{ textAlign: "left", fontSize: 15 }}
                  >
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
                  <table className="table">
                    <tbody>
                      <tr>
                        <td style={{ width: "10%" }}>
                          <img
                            loading="lazy"
                            src="assets/Image/Twin-Sleeper-Sofa.jpg"
                            style={{ height: "18vh" }}
                            alt="prev"
                          />
                        </td>
                        <td
                          style={{
                            width: "65%",
                            fontSize: 18,
                            fontWeight: 800,
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          Premium Quality Sofa
                          <br />
                          <span style={{ color: "#475B52", fontSize: 15 }}>
                            Rs. 1,200.00
                          </span>{" "}
                          &nbsp;&nbsp;
                          <strike style={{ color: "darkgray", fontSize: 12 }}>
                            Rs. 1,200.00
                          </strike>
                        </td>
                        <td
                          style={{
                            width: "10%",
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          01 <br />
                        </td>
                        <td
                          style={{
                            width: "30%",
                            fontWeight: 800,
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          Rs. 1,200.00
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "10%" }}>
                          <img
                            loading="lazy"
                            src="assets/Image/Twin-Sleeper-Sofa.jpg"
                            style={{ height: "18vh" }}
                            alt="prev"
                          />
                        </td>
                        <td
                          style={{
                            width: "65%",
                            fontSize: 18,
                            fontWeight: 800,
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          Premium Quality Sofa
                          <br />
                          <span style={{ color: "#475B52", fontSize: 15 }}>
                            Rs. 1,200.00
                          </span>{" "}
                          &nbsp;&nbsp;
                          <strike style={{ color: "darkgray", fontSize: 12 }}>
                            Rs. 1,200.00
                          </strike>
                        </td>
                        <td
                          style={{
                            width: "10%",
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          01 <br />
                        </td>
                        <td
                          style={{
                            width: "30%",
                            fontWeight: 800,
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          Rs. 1,200.00
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "10%" }}>
                          <img
                            loading="lazy"
                            src="assets/Image/Twin-Sleeper-Sofa.jpg"
                            style={{ height: "18vh" }}
                            alt="prev"
                          />
                        </td>
                        <td
                          style={{
                            width: "65%",
                            fontSize: 18,
                            fontWeight: 800,
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          Premium Quality Sofa
                          <br />
                          <span style={{ color: "#475B52", fontSize: 15 }}>
                            Rs. 1,200.00
                          </span>{" "}
                          &nbsp;&nbsp;
                          <strike style={{ color: "darkgray", fontSize: 12 }}>
                            Rs. 1,200.00
                          </strike>
                        </td>
                        <td
                          style={{
                            width: "10%",
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          01 <br />
                        </td>
                        <td
                          style={{
                            width: "30%",
                            fontWeight: 800,
                            paddingTop: 30,
                            color: "#475B52",
                          }}
                        >
                          Rs. 1,200.00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 ProfileCustomer">
          <div id="accordion">
            <div
              className="card"
              style={{ backgroundColor: "rgb(250,247,242,0.4)" }}
            >
              <button
                className="btn btn-link"
                style={{ textDecoration: "none", color: "#000" }}
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="true"
                aria-controls="collapseTwo"
              >
                <div
                  className="card-header"
                  id="headingOne"
                  style={{ backgroundColor: "rgb(250,247,242,0.4)" }}
                >
                  <h5
                    className="mb-0"
                    style={{ textAlign: "left", fontSize: 15 }}
                  >
                    Cutomer
                  </h5>
                </div>
              </button>
              <div
                id="collapseTwo"
                className="collapse show"
                aria-labelledby="headingOne"
                data-parent="#accordion"
                style={{ backgroundColor: "#fff" }}
              >
                <div className="card-body">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td style={{ width: "10%" }}>
                          <img
                            loading="lazy"
                            src="assets/Image/Twin-Sleeper-Sofa.jpg"
                            style={{ height: "10vh", borderRadius: "10%" }}
                            alt="prev"
                          />
                        </td>
                        <td
                          style={{
                            width: "90%",
                            fontWeight: 800,
                            paddingTop: 15,
                          }}
                        >
                          Customer Name Here
                          <br />{" "}
                          <span style={{ fontWeight: 500, fontSize: 12 }}>
                            3 Previous Orders
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "right" }}>
                          <i className="fa-regular fa-envelope" />
                          &nbsp;{" "}
                        </td>
                        <td>Testing@gmail.com</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <div style={{ paddingLeft: 20 }}>
                    <p style={{ fontWeight: 800 }}>Shipping Address</p>
                    <p>
                      180 North King Street,
                      <br />
                      Northhamtop Ma 1060
                    </p>
                  </div>
                  <br />
                  <div style={{ paddingLeft: 20 }}>
                    <p style={{ fontWeight: 800 }}>Billing Address</p>
                    <p>
                      180 North King Street,
                      <br />
                      Northhamtop Ma 1060
                    </p>
                  </div>
                  <br />
                  <center>
                    <button type="submit" className="button">
                      Edit Details
                    </button>
                  </center>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orderdetails;
