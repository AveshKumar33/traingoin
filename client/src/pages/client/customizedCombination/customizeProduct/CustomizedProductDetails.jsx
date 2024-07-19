import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../index.css";
import Preloader from "../../../../components/preloader/Preloader";
import { CustomizedFinialAmount } from "../../../../utils/usefullFunction";
import "./productdetails.css";
import CostSheetPDF from "./CostSheetPDF";
// import ProductCalculation from "./ProductCalculation";
import { getPrice } from "../../../../utils/varientimge/getPrice";
// import AttributeCombinations from "./AttributeCombinations";
import AttributeCombinations from "../../../../components/attributeCombinations/AttributeCombinations";
// import ProductCustomizedProduct from "./ProductCustomizeProduct";
import ProductCustomizedProduct from "../../../../components/productCustomizedProduct/ProductCustomizedProduct";
import { fetchCustomizeProductWithCombinations } from "../../../../redux/slices/customizeProductSlice";
import Modal from "../../../../components/modal/Modal";
import { roundNumber } from "../../../../utils/useFullFunctions/roundNumber";

import { IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const sortCombinations = (combinations) => {
  if (combinations?.length > 0) {
    let sortedCombinations = [...combinations].sort(
      (a, b) => a.attributeId.Display_Index - b.attributeId.Display_Index
    );
    return sortedCombinations;
  }
};

const backselectedMap = {
  SAF: "customizedProductPriceSAF",
  CB: "customizedProductPriceCB",
  IB: "customizedProductPriceIB",
};

const CustomizedProductDetails = ({
  pName = "",
  id,
  handleColse = () => {},
  customuizedProductFront,
  customuizedProductSAF,
  customuizedProductCB,
  customuizedProductIB,
  setCustomuizedProductFront,
  setCustomuizedProductSAF,
  setCustomuizedProductCB,
  setCustomuizedProductIB,
  setPrice,
  setUnit,
  setBackSelected,
}) => {
  const componentRef = useRef(null);

  const { loading, productCombinationDetails } = useSelector(
    (state) => state.customizeProduct
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomizeProductWithCombinations(id));
  }, [dispatch, id]);

  const [productDetails, setProductDetails] = useState({});
  const [P_Width, setP_Width] = useState(0);
  const [P_Height, setP_Height] = useState(0);
  const [UOM, setUOM] = useState([]);

  // all selected combinations are
  const [FrontCombination, setFrontCombination] = useState([]);
  const [SAFCombination, setSAFCombination] = useState([]);
  const [CBCombination, setCBCombination] = useState([]);
  const [IBCombination, setIBCombination] = useState([]);

  const [customizedProductPrice, setcustomizedProductPrice] = useState({
    customizedProductPriceFront: 0,
    customizedProductPriceSAF: 0,
    customizedProductPriceCB: 0,
    customizedProductPriceIB: 0,
  });

  const [calculateTotalCustomizedProduct, setcalculateTotalCustomizedProduct] =
    useState();

  const [backselected, setbackselected] = useState();
  const [show, setshow] = useState(false);
  const [varientproductdetails] = useState({});
  const [pdfbackattributeItem] = useState();

  const handleClose = () => {
    setshow(false);
  };
  useEffect(() => {
    if (loading === "fulfilled" && productCombinationDetails) {
      if (productCombinationDetails?.product?.length > 0) {
        setProductDetails(productCombinationDetails?.product[0]);
      }
      setFrontCombination(sortCombinations(customuizedProductFront));
      setSAFCombination(sortCombinations(customuizedProductSAF));
      setCBCombination(sortCombinations(customuizedProductCB));
      setIBCombination(sortCombinations(customuizedProductIB));
      setUOM(productCombinationDetails?.UOM);
      setP_Height(productCombinationDetails?.product[0]?.DefaultHeight);
      setP_Width(productCombinationDetails?.product[0]?.DefaultWidth);
    }
  }, [
    loading,
    productCombinationDetails,
    customuizedProductFront,
    customuizedProductSAF,
    customuizedProductCB,
    customuizedProductIB,
  ]);

  let condition;
  if (
    FrontCombination !== undefined &&
    FrontCombination.length > 0 &&
    ((FrontCombination !== undefined &&
      FrontCombination.length > 0 &&
      CBCombination !== undefined &&
      CBCombination.length > 0) ||
      (IBCombination !== undefined && IBCombination.length > 0) ||
      (SAFCombination !== undefined && SAFCombination.length > 0))
  ) {
    condition = true;
  } else if (FrontCombination !== undefined && FrontCombination.length > 0) {
    condition = false;
  }

  useEffect(() => {
    const { SAF, CB, IB } = productCombinationDetails || {};

    if (SAF?.length > 0) {
      setbackselected("SAF");
    } else if (CB?.length > 0) {
      setbackselected("CB");
    } else if (IB?.length > 0) {
      setbackselected("IB");
    }
  }, [productCombinationDetails]);

  const calculateCustomizedPrice = useCallback(
    (combinations, priceFor) => {
      if (productDetails && combinations?.length > 0) {
        const totalCustomizedPrice =
          productDetails[priceFor] +
          getPrice(productDetails, combinations, UOM, {
            DefaultWidth: P_Width ? P_Width : 0,
            DefaultHeight: P_Height ? P_Height : 0,
          });

        return totalCustomizedPrice;
      }
      return 0;
    },
    [P_Width, P_Height, UOM, productDetails]
  );

  useEffect(() => {
    setcustomizedProductPrice((prevState) => ({
      ...prevState,
      customizedProductPriceFront: calculateCustomizedPrice(
        FrontCombination,
        "FixedPrice"
      ),
      customizedProductPriceSAF: calculateCustomizedPrice(
        SAFCombination,
        "FixedPriceSAF"
      ),
      customizedProductPriceCB: calculateCustomizedPrice(
        CBCombination,
        "FixedPriceCB"
      ),
      customizedProductPriceIB: calculateCustomizedPrice(
        IBCombination,
        "FixedPriceIB"
      ),
    }));
  }, [
    SAFCombination,
    CBCombination,
    IBCombination,
    FrontCombination,
    calculateCustomizedPrice,
  ]);

  useEffect(() => {
    const selectedKey = backselectedMap[backselected];

    if (selectedKey) {
      const totalPrice =
        Number(customizedProductPrice.customizedProductPriceFront) +
        Number(customizedProductPrice[selectedKey]);

      setBackSelected(backselected);
      setcalculateTotalCustomizedProduct(totalPrice);
    } else {
      const totalPrice = Number(
        customizedProductPrice.customizedProductPriceFront
      );
      setcalculateTotalCustomizedProduct(totalPrice);
      setBackSelected(backselected);
    }
  }, [backselected, customizedProductPrice, setBackSelected]);

  const handleApply = () => {
    setCustomuizedProductFront(FrontCombination || []);
    setCustomuizedProductSAF(SAFCombination || []);
    setCustomuizedProductCB(CBCombination || []);
    setCustomuizedProductIB(IBCombination || []);
    handleColse();
    setPrice({
      productName: pName,
      price: CustomizedFinialAmount(
        calculateTotalCustomizedProduct,
        productDetails
      ),
    });
  };

  const calculateWidth = (e) => {
    let value = e.target.value;
    setUnit((prevState) => ({ ...prevState, width: value }));
    setP_Width(value);
  };
  const calculateHeight = (e) => {
    setUnit((prevState) => ({ ...prevState, height: e.target.value }));
    setP_Height(e.target.value);
  };

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      {/* <ShareProduct
        ProductName={productDetails?.ProductName}
        showShareModal={showShareModal}
        ShareModalClose={ShareModalClose}
      /> */}

      {/* Quotation Show */}

      <Modal
        handleClose={handleClose}
        show={show}
        width="90%"
        height="80vh"
        // style={{overflowY:"scroll"}}
        overflow={"scroll"}
      >
        {productDetails && (
          <>
            <CostSheetPDF
              ref={componentRef}
              productdetails={productDetails}
              // varientset={varientset}
              varientproductdetails={varientproductdetails}
              FrontCombination={FrontCombination}
              SAFCombination={backselected === "SAF" ? SAFCombination : []}
              CBCombination={backselected === "CB" ? CBCombination : []}
              IBCombination={backselected === "IB" ? IBCombination : []}
              P_Width={P_Width}
              P_Height={P_Height}
              UOM={UOM}
              backselected={backselected}
              handleClose={handleClose}
              //PAss Total Customized Price
              // customizedProductPrice={calculateTotalCustomizedProduct}
              //Pass customized product data
              backattributeItem={pdfbackattributeItem}
              //Pass Customized Product In Reac
            />
          </>
        )}
      </Modal>

      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="white_card_header">
            <div className="box_header m-0">
              <div className="main-title">
                <h3
                  className="m-0"
                  style={{
                    fontWeight: "600",
                    fontSize: "20px",
                    color: "#475B52",
                    textTransform: "uppercase",
                  }}
                >
                  {pName}
                </h3>
              </div>
              <IconButton
                color="secondary"
                aria-label="close model"
                onClick={handleColse}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {/* {console.log("Test", condition)} */}
          <div
            className="row"
            style={{ paddingLeft: "0px", paddingRight: "0px" }}
          >
            <div
              className={`col-md-${condition ? "6" : "12"}`}
              //   overflowY: "scroll",
              //   // display: "flex",
              // }}
            >
              <div
                className={`col-md-${condition ? "12" : "6"}`}
                style={{ float: "left" }}
              >
                <ProductCustomizedProduct
                  varientproductdetails={FrontCombination}
                  attribute={FrontCombination}
                  attributePosition={FrontCombination}
                  name="Front Side"
                  margin={"7px"}
                  product={productDetails}
                />
              </div>
              {/* <ProductImageSection img={productDetails} /> */}
              <div
                className={`col-md-${condition ? "12" : "6"}`}
                style={{
                  float: "left",
                  margin: condition ? "7px 7px 8px" : "0",
                  width: condition ? "99%" : "45%",
                  marginLeft: condition ? "10px" : "50px",
                }}
              >
                <br></br>
                <center>
                  <h6
                    style={{
                      backgroundColor: "#475b52",
                      padding: "10px",
                      color: "#fff",
                      // borderRadius: "10px",
                    }}
                  >
                    FRONT VIEW
                  </h6>
                </center>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Available Customization</th>
                      <th>Current Selection</th>
                      <th style={{ textAlign: "center" }}>Visuals</th>
                      <th style={{ textAlign: "center" }}>Customize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FrontCombination &&
                      FrontCombination.length > 0 &&
                      FrontCombination.map((p, index) => {
                        return (
                          p?.combinations?.length > 0 && (
                            <AttributeCombinations
                              key={index}
                              id="Front"
                              optionvalue={p}
                              setCombination={setFrontCombination}
                              Combination={FrontCombination}
                            />
                          )
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div
                className="col-lg-6"
                // style={{
                //   overflowY: "scroll",
                //   // display: "flex",
                // }}
              >
                {SAFCombination?.length > 0 && backselected === "SAF" && (
                  <ProductCustomizedProduct
                    varientproductdetails={SAFCombination}
                    // attribute={getallbackdetails?.allCombinationssaf}
                    attribute={SAFCombination}
                    attributePosition={SAFCombination}
                    name="Same as Front"
                    margin={"7px"}
                    product={productDetails}
                  />
                )}

                {CBCombination?.length > 0 && backselected === "CB" && (
                  <ProductCustomizedProduct
                    varientproductdetails={CBCombination}
                    // attribute={getallbackdetails?.allCombinationssaf}
                    attribute={CBCombination}
                    attributePosition={CBCombination}
                    name="Cover Back"
                    margin={"7px"}
                    product={productDetails}
                  />
                )}

                {IBCombination?.length > 0 && backselected === "IB" && (
                  <ProductCustomizedProduct
                    varientproductdetails={IBCombination}
                    // attribute={getallbackdetails?.allCombinationssaf}
                    attribute={IBCombination}
                    attributePosition={IBCombination}
                    name="Ignore Back"
                    margin={"7px"}
                    product={productDetails}
                  />
                )}
              </div>
              <div
                className="col-lg-12"
                style={{ float: "left", margin: "7px 7px 8px" }}
              >
                {(SAFCombination?.length > 0 ||
                  CBCombination?.length > 0 ||
                  IBCombination?.length > 0) && (
                  <div className="col-lg-12" style={{ float: "left" }}>
                    <br></br>
                    <center>
                      <h6
                        style={{
                          backgroundColor: "#475b52",
                          padding: "10px",
                          color: "#fff",
                          // borderRadius: "10px",
                        }}
                      >
                        BACK VIEW
                      </h6>

                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic radio toggle button group"
                      >
                        {SAFCombination?.length > 0 && (
                          <>
                            <input
                              type="radio"
                              className="btn-check"
                              name="btnradio"
                              id="btnradio1"
                              autoComplete="off"
                              defaultChecked={backselected}
                              onClick={() => setbackselected("SAF")}
                            />
                            <label
                              className="btn btn-outline-primary buttongroupstyling"
                              htmlFor="btnradio1"
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                lineHeight: "1.2",
                              }}
                            >
                              Same as Front
                            </label>
                          </>
                        )}

                        {CBCombination?.length > 0 && (
                          <>
                            <input
                              type="radio"
                              className="btn-check"
                              name="btnradio"
                              id="btnradio2"
                              autoComplete="off"
                              onClick={() => setbackselected("CB")}
                            />
                            <label
                              className="btn btn-outline-primary buttongroupstyling"
                              htmlFor="btnradio2"
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                lineHeight: "1.2",
                              }}
                            >
                              Cover Back
                            </label>
                          </>
                        )}

                        {IBCombination?.length > 0 && (
                          <>
                            <input
                              type="radio"
                              className="btn-check"
                              name="btnradio"
                              id="btnradio3"
                              autoComplete="off"
                              onClick={() => setbackselected("IB")}
                            />
                            <label
                              className="btn btn-outline-primary buttongroupstyling"
                              htmlFor="btnradio3"
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                lineHeight: "1.2",
                              }}
                            >
                              Back Ignore
                            </label>
                          </>
                        )}
                      </div>
                    </center>
                    <br></br>

                    {/* Select this If Same As Front Selected */}
                    {backselected === "SAF" && (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Available Customization</th>
                            <th>Current Selection</th>
                            <th style={{ textAlign: "center" }}>Visuals</th>
                            <th style={{ textAlign: "center" }}>Customize</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backselected === "SAF" &&
                            SAFCombination &&
                            SAFCombination.length > 0 &&
                            SAFCombination.map((p, index) => {
                              return (
                                p?.combinations?.length > 0 && (
                                  // <div key={index}>
                                  <AttributeCombinations
                                    id="SAF"
                                    optionvalue={p}
                                    setCombination={setSAFCombination}
                                    Combination={SAFCombination}
                                  />
                                )
                              );
                            })}
                        </tbody>
                      </table>
                    )}

                    {/* Back Selected For CB */}
                    {backselected === "CB" && (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Available Customization</th>
                            <th>Current Selection</th>
                            <th style={{ textAlign: "center" }}>Visuals</th>
                            <th style={{ textAlign: "center" }}>Customize</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backselected === "CB" &&
                            CBCombination &&
                            CBCombination.length > 0 &&
                            CBCombination.map((p, index) => {
                              return (
                                p?.combinations?.length > 0 && (
                                  <AttributeCombinations
                                    id="CB"
                                    optionvalue={p}
                                    setCombination={setCBCombination}
                                    Combination={CBCombination}
                                  />
                                )
                              );
                            })}
                        </tbody>
                      </table>
                    )}
                    {/* Back Selected For Ignore BAck */}
                    {backselected === "IB" && (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Available Customization</th>
                            <th>Current Selection</th>
                            <th style={{ textAlign: "center" }}>Visuals</th>
                            <th style={{ textAlign: "center" }}>Customize</th>
                          </tr>
                        </thead>
                        <tbody>
                          {backselected === "IB" &&
                            IBCombination &&
                            IBCombination.length > 0 &&
                            IBCombination.map((p, index) => {
                              return (
                                p?.combinations?.length > 0 && (
                                  <AttributeCombinations
                                    id="IB"
                                    optionvalue={p}
                                    setCombination={setIBCombination}
                                    Combination={IBCombination}
                                  />
                                )
                              );
                            })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Calculation Start */}
          <div className="row" style={{ padding: "0px 0px 20px 70px" }}>
            {productDetails?.DefaultHeight ||
            productDetails?.MinHeight ||
            productDetails?.MaxHeight ? (
              <>
                <div className="col-lg-1" style={{ float: "left" }}>
                  <label htmlFor="height" style={{ color: "#000" }}>
                    {productDetails?.DefaultWidth ||
                    productDetails?.DefaultWidth ||
                    productDetails?.DefaultWidth
                      ? "Height (ft)"
                      : "Length (ft)"}
                  </label>
                  <input
                    type="number"
                    min={productDetails?.MinHeight}
                    max={productDetails?.MaxHeight}
                    value={P_Height}
                    id="height"
                    className="form-control"
                    placeholder="Enter Height"
                    onChange={calculateHeight}
                    step={1}
                  />
                  {P_Height > productDetails?.MaxHeight && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Height should not be greater than{" "}
                      {productDetails?.MaxHeight}
                    </p>
                  )}
                  {P_Height < productDetails?.MinHeight && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Height should not be less than {productDetails?.MinHeight}
                    </p>
                  )}
                </div>

                <div
                  className="col-lg-1"
                  style={{ paddingTop: "30px", float: "left", width: "4%" }}
                >
                  <center>
                    <span style={{ fontWeight: "600" }}> X </span>
                  </center>
                </div>
              </>
            ) : null}

            {productDetails?.DefaultWidth ||
            productDetails?.MinWidth ||
            productDetails?.MaxWidth ? (
              <>
                <div className="col-lg-1" style={{ float: "left" }}>
                  <label htmlFor="width" style={{ color: "#000" }}>
                    Width (ft)
                  </label>
                  <input
                    type="number"
                    min={productDetails?.MinWidth}
                    max={productDetails?.MaxWidth}
                    className="form-control"
                    placeholder="Enter Width"
                    id="width"
                    value={P_Width}
                    onChange={calculateWidth}
                  />
                  {P_Width > productDetails?.MaxWidth && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Width should not be greater than{" "}
                      {productDetails?.MaxWidth}
                    </p>
                  )}
                  {P_Width < productDetails?.MinWidth && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Width should not be less than {productDetails?.MinWidth}
                    </p>
                  )}
                </div>
                <div
                  className="col-lg-1"
                  style={{ paddingTop: "30px", float: "left", width: "4%" }}
                >
                  <center>
                    <span style={{ fontWeight: "600" }}> X </span>
                  </center>
                </div>
              </>
            ) : null}

            <div className="col-lg-1" style={{ float: "left", width: "12%" }}>
              <label htmlFor="rate" style={{ color: "#000" }}>
                Rate/
                {`${
                  P_Width && P_Height
                    ? "Sq.ft"
                    : P_Width
                    ? "Length"
                    : P_Height
                    ? "Rft"
                    : "Pice"
                }`}
              </label>
              <br></br>
              <input
                type="text"
                className="form-control"
                readOnly
               
                placeholder={`${roundNumber(
                  Number(
                    P_Width && P_Height
                      ? CustomizedFinialAmount(
                          calculateTotalCustomizedProduct,
                          productDetails
                        ) /
                          (P_Width * P_Height)
                      : P_Width
                      ? CustomizedFinialAmount(
                          calculateTotalCustomizedProduct,
                          productDetails
                        ) / P_Width
                      : P_Height
                      ? CustomizedFinialAmount(
                          calculateTotalCustomizedProduct,
                          productDetails
                        ) / P_Height
                      : 0
                  )
                )} / ${
                  P_Width && P_Height
                    ? "Sq.ft"
                    : P_Width
                    ? "Length"
                    : P_Height
                    ? "Rft"
                    : "Pice"
                }`}
                style={{
                  color: "#000",
                  border: "1px solid #E5E8EB",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  // width: "150px",
                  backgroundColor: "#fff",
                }}
              />
            </div>
            <div
              className="col-lg-1"
              style={{ paddingTop: "30px", float: "left", width: "4%" }}
            >
              <center>
                <span style={{ fontWeight: "600" }}> = </span>
              </center>
            </div>

            <div className="col-lg-2" style={{ float: "left" }}>
              <label htmlFor="totalPrice" style={{ color: "#000" }}>
                Total Price
              </label>
              <br></br>
              <input
                className="form-control"
                type="text"
                readOnly
                value={`${Number(
                  CustomizedFinialAmount(
                    calculateTotalCustomizedProduct,
                    productDetails
                  )
                ).toFixed(0)} /-`}
                style={{
                  color: "#000",
                  border: "1px solid #E5E8EB",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  // width: "150px",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              />
              <p
                style={{
                  color: "#768758",
                  fontSize: "12px",
                  marginTop: "5px",
                  textAlign: "center",
                }}
              >
                *GST Included
              </p>
            </div>

            <div className="col-lg-2" style={{ float: "left" }}>
              <center>
                <button
                  className="badge btn-default Request-for-Price-btn p-3 mb-1"
                  type="button"
                  style={{
                    width: "100%",
                    textTransform: "uppercase",
                    marginTop: "20px",
                    backgroundColor: "#475B52",
                    borderRadius: "10px",
                  }}
                >
                  Preview Quotation
                </button>
              </center>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleApply}
              style={{ backgroundColor: "#475B52" }}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizedProductDetails;
