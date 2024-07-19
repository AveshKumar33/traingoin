import React, { useRef, useState, useEffect } from "react";
import ReactToPrint from "react-to-print";
import { REACT_APP_URL } from "../../../../config";
import moment from "moment";

const getUOM = (UOMs, searchId) => {
  if (UOMs?.length > 0) {
    const foundData = UOMs.find((UOM) => UOM?._id === searchId);
    return foundData?.name;
  }

  return null;
};

const FinialAmount = (originalAmount, discountPercentage) => {
  let Amount = (originalAmount * discountPercentage) / 100;

  return Math.round(Amount);
};

// const FinialAmount = (Amount, GSTIN = 0) => {
//   let Sum = Amount;
//   Sum = Sum + getPercentage(Sum, GSTIN);
//   return Math.round(Sum);
// };

const getPrice = (P_Width, P_Height, fixedAmount, unit) => {
  let price = fixedAmount;

  switch (unit) {
    case "Pair":
      price = price * 2;
      break;
    case "Pice":
      break;
    case "Sq.ft":
      price = price * P_Height * P_Width;
      break;
    case "Length":
      price = price * P_Height;
      break;
    case "Width":
      price = price * P_Width;
      break;
    default:
  }

  return price;
};

const CostSheetPDF = ({
  productdetails,
  FrontCombination,
  SAFCombination,
  CBCombination,
  IBCombination,
  UOM,
  P_Width,
  P_Height,
  varientproductdetails,
  varientset,
  quantity,
  backselected,
  handleClose,
  customizedProduct,
  customizedProductPrice,
  backcustomizedproduct,
  backattributeItem,
}) => {
  const componentRef = useRef(null);

  const [toatl, setTotal] = useState(0);

  const BackSide =
    SAFCombination?.length > 0
      ? SAFCombination
      : CBCombination?.length > 0
      ? CBCombination
      : IBCombination?.length > 0
      ? IBCombination
      : [];

  useEffect(() => {
    if (FrontCombination?.length > 0 || BackSide?.length > 0) {
      let FrontTotalPrice = FrontCombination.reduce(
        (sum, item) =>
          sum +
          (item?.combinations[0]?.parameterId?.price
            ? item?.combinations[0]?.parameterId?.price
            : 0),
        productdetails?.FixedPrice || 0
      );

      let BackTotalPrice = 0;

      if (BackSide?.length > 0) {
        BackTotalPrice = BackSide.reduce(
          (sum, item) =>
            sum +
            (item?.combinations[0]?.parameterId?.price
              ? item?.combinations[0]?.parameterId?.price
              : 0),
          productdetails?.[`FixedPrice${backselected}`] || 0
        );
      }

      const totalPrice = FrontTotalPrice + BackTotalPrice;
      setTotal(totalPrice);
    }
  }, [BackSide, FrontCombination]);

  return (
    <>
      <div
        className="px-5"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "-30px",
        }}
      ></div>

      <div className="p-5" ref={componentRef}>
        <div className="row my-3">
          <div className="col-lg-8" style={{ float: "left" }}>
            <img
              src={`${REACT_APP_URL}/images/product/productimg-1707732851732.png`}
              loading="lazy"
              alt=""
              className="img-fluid"
              style={{ width: "200px", height: "auto" }}
            />
            <br></br>
            <p style={{ textAlign: "left" }}>
              <strong>Product Name:</strong>
              {moment().format("DD-MMMM-YYYY")}
            </p>{" "}
            <p style={{ textAlign: "left" }}>
              <strong>Size:</strong>
              {moment().format("DD-MMMM-YYYY")}
            </p>{" "}
            <p style={{ textAlign: "left" }}>
              <strong>Item Group:</strong>
              {moment().format("DD-MMMM-YYYY")}
            </p>{" "}
            <p style={{ textAlign: "left" }}>
              <strong>Series:</strong>
              {moment().format("DD-MMMM-YYYY")}
            </p>
            <p style={{ textAlign: "left" }}>
              <strong>Structure:</strong>
              {moment().format("DD-MMMM-YYYY")}
            </p>{" "}
            <p style={{ textAlign: "left" }}>
              <strong>Back:</strong>
              {moment().format("DD-MMMM-YYYY")}
            </p>
          </div>
          <div
            className="col-lg-4"
            style={{ float: "left", paddingTop: "20px" }}
          >
            <h3
              style={{
                textAlign: "right",
                fontSize: "30px",
                // backgroundColor: "blue",
                color: "blue",
              }}
            >
              Cost Sheet
            </h3>
            <br></br>
            <br></br>

            {/* Working Left Start */}
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
                          {backcustomizedproduct && (
                            <>{backcustomizedproduct}</>
                          )}
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

            {/* Working Left End */}
          </div>
        </div>
        <hr />
        <br></br>

        {/* <h4>{productdetails.ProductName}</h4>
        <br></br> */}

        <table class="table table-striped" style={{ marginTop: "40px" }}>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Perticulars</th>
              {/* <th>Quantity</th> */}
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              style={{
                fontWeight: "500",
                color: "#828bb2",
                fontStyle: "italic",
              }}
            >
              # Front Side
            </tr>
            <tr>
              <td>1</td>
              <td>Front Fixed Price</td>
              <td>{productdetails?.FixedPrice}</td>
              <td>{productdetails?.FixedPrice}</td>
            </tr>
            {FrontCombination &&
              FrontCombination?.length > 0 &&
              FrontCombination?.map((comb, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 2}</td>
                    <td>{`${comb?.combinations[0]?.attributeId?.Name} / ${comb?.combinations[0]?.parameterId?.name}`}</td>
                    <td>{`${
                      comb?.combinations[0]?.parameterId?.price
                    }.00 Per/${getUOM(UOM, comb?.attributeId?.UOMId)}`}</td>
                    <td>
                      {getPrice(
                        P_Width,
                        P_Height,
                        comb?.combinations[0]?.parameterId?.price,
                        getUOM(UOM, comb?.attributeId?.UOMId)
                      )}
                    </td>
                  </tr>
                );
              })}
            <tr
              style={{
                fontWeight: "500",
                color: "#828bb2",
                fontStyle: "italic",
              }}
            >
              # Back Side
            </tr>
            {BackSide && BackSide?.length > 0 && (
              <tr>
                <td>1</td>
                <td>Back Fixed Price</td>
                <td>{productdetails?.[`FixedPrice${backselected}`]}</td>
                <td>{productdetails?.[`FixedPrice${backselected}`]}</td>
              </tr>
            )}
            {BackSide &&
              BackSide?.length > 0 &&
              BackSide?.map((comb, index) => {
                return (
                  <tr key={index + 10}>
                    <td>{index + 2}</td>
                    <td>{`${comb?.combinations[0]?.attributeId?.Name} / ${comb?.combinations[0]?.parameterId?.name}`}</td>
                    <td>{`${
                      comb?.combinations[0]?.parameterId?.price
                    }.00 Per/${getUOM(UOM, comb?.attributeId?.UOMId)}`}</td>
                    <td>{`${comb?.combinations[0]?.parameterId?.price}`}</td>
                  </tr>
                );
              })}
            <tr>
              <td>Total</td>
              <td></td>
              <td></td>
              <td>
                {productdetails && (
                  <>
                    <p style={{ fontWeight: "700" }}>Sub Total : {toatl}</p>
                    <p style={{ fontWeight: "600" }}>
                      Wastage: {productdetails?.Wastage}
                    </p>
                    <p style={{ fontWeight: "600" }}>
                      installnationCharge: {productdetails?.installnationCharge}
                    </p>
                    <p style={{ fontWeight: "600" }}>
                      GST {productdetails?.GSTIN + "%"}:{" "}
                      {FinialAmount(
                        toatl +
                          productdetails?.Wastage +
                          productdetails?.installnationCharge,
                        productdetails?.GSTIN
                      )}
                    </p>
                    <p style={{ fontWeight: "600" }}>
                      Total :{" "}
                      {toatl +
                        productdetails?.Wastage +
                        productdetails?.installnationCharge +
                        FinialAmount(
                          toatl +
                            productdetails?.Wastage +
                            productdetails?.installnationCharge,
                          productdetails?.GSTIN
                        )}
                    </p>
                  </>
                )}
                {/* {productdetails.Installment &&
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
                  )} */}
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

export default CostSheetPDF;
