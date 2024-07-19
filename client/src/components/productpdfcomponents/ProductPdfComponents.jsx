import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { REACT_APP_URL } from "../../config";
import railingoLogo from "../../assets/quotation/black-logo-with-name.png";
import moment from "moment";

const ProductPdfComponents = ({
  productdetails,
  varientproductdetails,
  varientset,
  quantity,
  handleClose,
  customizedProduct,
  customizedProductPrice,
  backcustomizedproduct,
  backattributeItem,
}) => {
  const componentRef = useRef(null);

  return (
    <>
      <div
        className="px-5"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          // marginTop: "-0px",
        }}
      ></div>

      <div className="p-5" ref={componentRef}>
        <div className="row my-3">
          <div className="col-lg-8" style={{ float: "left" }}>
            <img
              src={railingoLogo}
              loading="lazy"
              alt="_logo"
              className="img-fluid"
              style={{ width: "200px", height: "auto" }}
            />
            <p style={{ paddingLeft: "20px" }}>
              Hennur, Kuvempu Layout, Kothanpur, Bengaluru, Karnataka, 560077,
              India <br></br> info@railingo.com , +91 8755999395
            </p>
          </div>
          <div
            className="col-lg-4"
            style={{ float: "left", paddingTop: "20px" }}
          >
            <h3 style={{ textAlign: "right", fontSize: "30px" }}>QUOTATION</h3>
            <br></br>
            <br></br>
            <p style={{ textAlign: "right" }}>
              Date : {moment().format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </div>
        </div>
        <hr />
        <br></br>

        <h4>{productdetails.ProductName}</h4>
        <br></br>

        <div className="row">
          <div
            className="card"
            style={{
              width: productdetails?.CustomizedProduct ? "49%" : "100%",
              float: "left",
              marginLeft: "1%",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
            }}
          >
            <center>
              {customizedProduct && productdetails?.CustomizedProduct ? (
                <>{customizedProduct}</>
              ) : (
                <>
                  {varientproductdetails?.images &&
                  varientproductdetails.images.length > 0 ? (
                    <>
                      <img
                        loading="lazy"
                        src={`${REACT_APP_URL}/images/product/${varientproductdetails.images[0]}`}
                        className="img-fluid"
                        alt="..."
                      />
                    </>
                  ) : (
                    <>
                      {productdetails.ProductImage &&
                        productdetails.ProductImage.length > 0 && (
                          <>
                            <img
                              src={`${REACT_APP_URL}/images/product/${productdetails?.ProductImage[0]}`}
                              loading="lazy"
                              className="img-fluid"
                              alt="..."
                            />
                          </>
                        )}
                    </>
                  )}
                </>
              )}

              <div className="card-body">
                {productdetails?.CustomizedProduct &&
                  backattributeItem &&
                  Object.keys(backattributeItem).length > 0 && (
                    <>
                      <h5
                        className="card-title"
                        style={{ textAlign: "center" }}
                      >
                        FRONT SIDE
                      </h5>
                      <hr></hr>
                    </>
                  )}

                <table class="table table-striped">
                  <tbody>
                    {varientset &&
                      Object.entries(varientset).map(([key, value]) => (
                        <>
                          <tr>
                            <td>{key}</td>
                            <td style={{ textAlign: "right" }}>
                              {" "}
                              <button
                                type="button"
                                className="badge btn-default"
                                style={{
                                  border: "none",
                                  marginRight: "10px",
                                  backgroundColor: "#475B52",
                                  fontSize: "12px",
                                }}
                              >
                                {value}
                              </button>
                            </td>
                          </tr>
                        </>
                      ))}
                  </tbody>
                </table>
              </div>
            </center>
          </div>{" "}
          {productdetails?.CustomizedProduct &&
            customizedProduct &&
            backattributeItem &&
            Object.keys(backattributeItem).length > 0 && (
              <>
                <div
                  className="card"
                  style={{
                    width: "49%",
                    float: "left",
                    marginLeft: "1%",
                    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                  }}
                >
                  <center>
                    <div style={{ flex: 1, justifyContent: "center" }}>
                      {backcustomizedproduct && <>{backcustomizedproduct}</>}
                    </div>

                    <div className="card-body">
                      <h5
                        className="card-title"
                        style={{ textAlign: "center" }}
                      >
                        BACK SIDE
                      </h5>
                      <hr></hr>
                      <table class="table table-striped">
                        <tbody>
                          {backattributeItem && (
                            <>
                              {backattributeItem &&
                                backattributeItem &&
                                Object.entries(backattributeItem).map(
                                  ([key, value]) => (
                                    <>
                                      <tr>
                                        <td>{key}</td>
                                        <td style={{ textAlign: "right" }}>
                                          <button
                                            type="button"
                                            className="badge btn-default"
                                            style={{
                                              border: "none",
                                              marginRight: "10px",
                                              backgroundColor: "#475B52",
                                              fontSize: "12px",
                                            }}
                                            key={key}
                                          >
                                            {value}
                                          </button>
                                        </td>
                                      </tr>
                                    </>
                                  )
                                )}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </center>
                </div>
              </>
            )}
        </div>

        <table class="table table-striped" style={{ marginTop: "40px" }}>
          <thead>
            <tr>
              <th>Product Description</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{productdetails.ProductName}</td>
              <td>{quantity}</td>
              <td>
                {customizedProductPrice ? (
                  <>
                    <p style={{ fontWeight: "900", color: "#463D36" }}>
                      ₹ {customizedProductPrice * quantity}
                    </p>
                  </>
                ) : (
                  <>
                    {varientproductdetails?.OriginalPrice ? (
                      <>
                        <p style={{ fontWeight: "900" }}>
                          ₹ {varientproductdetails?.OriginalPrice} x {quantity}{" "}
                          = ₹ {varientproductdetails?.OriginalPrice * quantity}
                          {/* Price : ₹ {varientproductdetails?.OriginalPrice *  quantity} */}
                        </p>
                      </>
                    ) : (
                      <p style={{ fontWeight: "900" }}>
                        Price : ₹ {productdetails?.OriginalPrice} x {quantity} =
                        ₹ {productdetails?.OriginalPrice * quantity}
                        {/* Price : ₹ {varientproductdetails?.OriginalPrice *  quantity} */}
                      </p>
                    )}
                  </>
                )}

                {productdetails.Installment &&
                  productdetails.Installment.length > 0 && (
                    <>
                      <p style={{ fontWeight: "900", marginTop: "30px" }}>
                        Installment Price
                      </p>
                      {productdetails.Installment.map((p) => (
                        <>
                          <p style={{ fontWeight: "900" }} key={p._id}>
                            {p.Name} : {p.Amount}
                          </p>
                        </>
                      ))}
                    </>
                  )}
              </td>
            </tr>
            <tr>
              <td>Total</td>
              <td></td>
              <td>
                {customizedProductPrice ? (
                  <>
                    <p style={{ fontWeight: "900", color: "#463D36" }}>
                      ₹ {customizedProductPrice * quantity}
                    </p>
                  </>
                ) : (
                  <>
                    {varientproductdetails?.OriginalPrice ? (
                      <>
                        <p style={{ fontWeight: "900" }}>
                          ₹ {varientproductdetails?.OriginalPrice} x {quantity}{" "}
                          = ₹ {varientproductdetails?.OriginalPrice * quantity}
                          {/* Price : ₹ {varientproductdetails?.OriginalPrice *  quantity} */}
                        </p>
                      </>
                    ) : (
                      <p style={{ fontWeight: "900" }}>
                        Price : ₹ {productdetails?.OriginalPrice} x {quantity} =
                        ₹ {productdetails?.OriginalPrice * quantity}
                        {/* Price : ₹ {varientproductdetails?.OriginalPrice *  quantity} */}
                      </p>
                    )}
                  </>
                )}

                {productdetails.Installment &&
                  productdetails.Installment.length > 0 && (
                    <>
                      <p style={{ fontWeight: "900", marginTop: "30px" }}>
                        Installment Price
                      </p>
                      {productdetails.Installment.map((p) => (
                        <>
                          <p style={{ fontWeight: "900" }} key={p._id}>
                            {p.Name} : {p.Amount}
                          </p>
                        </>
                      ))}
                    </>
                  )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="px-5"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-50px",
        }}
      >
        <ReactToPrint
          trigger={() => (
            <button
              className="btn btn-primary"
              style={{ backgroundColor: "#475B52", color: "#fff" }}
            >
              Print Quotation
            </button>
          )}
          content={() => componentRef.current}
        />
      </div>
      <br></br>

      {/* <div>
        <button className="btn btn-primary" onClick={()=>handleClose()}>close</button>
      </div> */}
    </>
  );
};

export default ProductPdfComponents;
