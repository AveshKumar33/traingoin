import React, { useEffect, useState, useCallback, useRef } from "react";
import ShareIcon from "@mui/icons-material/Share";
import SideBar from "../../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import RoomCatalogueCusProd from "../../../client/roomideas/RoomCatalogueCusProd";

import TopHeader from "../../../../components/topheader/TopHeader";
import "../../../../index.css";
import Preloader from "../../../../components/preloader/Preloader";
import { CustomizedFinialAmount } from "../../../../utils/usefullFunction";
import "./productdetails.css";
import { useParams } from "react-router-dom";
import CartSidebar from "../../../../components/cartSidebar/CartSidebar";
import { Helmet } from "react-helmet";
import ShareProduct from "../../../client/ShareProduct/ShareProduct";
import CostSheetPDF from "./CostSheetPDF";
import ProductCalculation from "./ProductCalculation";
import { getPrice } from "../../../../utils/varientimge/getPrice";
// import AttributeCombinations from "./AttributeCombinations";
import AttributeCombinations from "../../../../components/attributeCombinations/AttributeCombinations";
import ProductCustomizedProduct from "./ProductCustomizeProduct";
import { fetchCustomizeProductWithCombinations } from "../../../../redux/slices/customizeProductSlice";
import Modal from "../../../../components/modal/Modal";

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

const ProductDetails = () => {
  const componentRef = useRef(null);

  const { pName, id } = useParams();
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
  const [showShareModal, setshowShareModal] = useState(false);
  const [show, setshow] = useState(false);
  const [varientproductdetails] = useState({});
  const [pdfbackattributeItem] = useState();

  const [managecart, setmanagecart] = useState(false);
  const handleClose = () => {
    setshow(false);
  };
  useEffect(() => {
    if (loading === "fulfilled" && productCombinationDetails) {
      if (productCombinationDetails?.product?.length > 0) {
        setProductDetails(productCombinationDetails?.product[0]);
      }
      setFrontCombination(sortCombinations(productCombinationDetails?.Front));
      setSAFCombination(sortCombinations(productCombinationDetails?.SAF));
      setCBCombination(sortCombinations(productCombinationDetails?.CB));
      setIBCombination(sortCombinations(productCombinationDetails?.IB));
      setUOM(productCombinationDetails?.UOM);
    }
  }, [loading, productCombinationDetails]);

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
            DefaultHeight: P_Height,
            DefaultWidth: P_Width,
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
      setcalculateTotalCustomizedProduct(
        Number(customizedProductPrice.customizedProductPriceFront) +
          Number(customizedProductPrice[selectedKey])
      );
    } else {
      setcalculateTotalCustomizedProduct(
        Number(customizedProductPrice.customizedProductPriceFront)
      );
    }
  }, [backselected, customizedProductPrice]);

  const ShareModalClose = () => {
    setshowShareModal(false);
  };

  const toggleCart = () => {
    setmanagecart(!managecart);
  };

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <SideBar />
      <ShareProduct
        ProductName={productDetails?.ProductName}
        showShareModal={showShareModal}
        ShareModalClose={ShareModalClose}
      />

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

      {/* Seo TItle Desc */}

      <Helmet>
        <meta charset="UTF-8" />
        <title>{productDetails?.ProductName}</title>
        <meta name="description" content={productDetails?.SeoMetaDesc} />
        <meta name="keywords" content={productDetails?.SeoProductTitle} />
      </Helmet>

      {/* Open Cart Sidebar */}
      {/* {managecart && <CartSidebar toggleCart={toggleCart} />} */}

      {/* product details with image */}

      <SideBar />
      <section className="">
        <TopHeader />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">{pName}</h3>
                      </div>
                    </div>
                  </div>

                  <div
                    className="row mobileproductdetailsTopdiv"
                    style={{ padding: "0px 0px 0px 13px" }}
                  >
                    <div className="col-lg-8 col-12">
                      <div
                        // className="row"
                        style={{
                          overflowY: "scroll",
                          paddingTop: "20px",
                          display: "flex",
                        }}
                      >
                        <ProductCustomizedProduct
                          varientproductdetails={FrontCombination}
                          attribute={FrontCombination}
                          attributePosition={FrontCombination}
                          name="Front Side"
                          margin={"7px"}
                          product={productDetails}
                        />
                        {/* <ProductImageSection img={productDetails} /> */}

                        {SAFCombination?.length > 0 &&
                          backselected === "SAF" && (
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
                      <div className="col-md-13 col-12 RoomIdeaDetailsMarginBottom">
                        {productDetails &&
                          productDetails?.ProductImage?.length > 0 && (
                            <RoomCatalogueCusProd
                              productImages={productDetails?.ProductImage}
                              type=""
                            />
                          )}
                      </div>
                    </div>

                    <div
                      className="col-lg-4"
                      style={{
                        padding: "40px 40px 20px 20px",
                        // height: "100vh",
                        height: "auto",
                        overflowY: "scroll",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div>
                        <h4 style={{ color: "#324040", fontSize: "22px" }}>
                          {productDetails?.ProductName}
                          <div
                            className="shareOpen"
                            onClick={() => {
                              setshowShareModal(true);
                            }}
                          >
                            <ShareIcon /> <p>Share</p>
                          </div>
                        </h4>
                      </div>

                      <ProductCalculation
                        product={productDetails}
                        setP_Height={setP_Height}
                        setP_Width={setP_Width}
                        P_Width={P_Width}
                        P_Height={P_Height}
                        calculateTotalCustomizedProduct={
                          calculateTotalCustomizedProduct
                        }
                      />

                      <div className="row">
                        <div
                          className="col-md-6"
                          style={{
                            float: "left",
                            // borderRight: "4px solid #F8F8F8",
                          }}
                        >
                          <br></br>
                          <center>
                            <h6
                              style={{
                                backgroundColor: "#F8F8F8",
                                padding: "10px",
                                color: "#475B52",
                                borderRadius: "10px",
                              }}
                            >
                              FRONT SIDE
                            </h6>
                          </center>
                          {FrontCombination &&
                            FrontCombination.length > 0 &&
                            FrontCombination.map((p, index) => {
                              return (
                                p?.combinations?.length > 0 && (
                                  <div key={index}>
                                    <span
                                      className="m-3"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div style={{ fontSize: "15px" }}>
                                        <b>
                                          {
                                            p?.combinations[0]?.attributeId
                                              ?.PrintName
                                          }
                                        </b>{" "}
                                        :{" "}
                                        <b>
                                          {
                                            p?.combinations[0]?.parameterId
                                              ?.name
                                          }
                                        </b>
                                      </div>
                                      <AttributeCombinations
                                        id="Front"
                                        optionvalue={p}
                                        setCombination={setFrontCombination}
                                        Combination={FrontCombination}
                                      />
                                    </span>
                                  </div>
                                )
                              );
                            })}
                        </div>

                        {(SAFCombination?.length > 0 ||
                          CBCombination?.length > 0 ||
                          IBCombination?.length > 0) && (
                          <div className="col-lg-6" style={{ float: "left" }}>
                            <br></br>
                            <center>
                              <h6
                                style={{
                                  backgroundColor: "#F8F8F8",
                                  padding: "10px",
                                  color: "#475B52",
                                  borderRadius: "10px",
                                }}
                              >
                                BACK SIDE
                              </h6>
                              <br></br>
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
                              <br></br>
                            </center>

                            {/* Select this If Same As Front Selected */}
                            {backselected === "SAF" &&
                              SAFCombination &&
                              SAFCombination.length > 0 &&
                              SAFCombination.map((p, index) => {
                                return (
                                  p?.combinations?.length > 0 && (
                                    <div key={index}>
                                      <span
                                        className="m-3"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div style={{ fontSize: "15px" }}>
                                          <b>
                                            {
                                              p?.combinations[0]?.attributeId
                                                ?.PrintName
                                            }
                                          </b>{" "}
                                          :{" "}
                                          <b>
                                            {
                                              p?.combinations[0]?.parameterId
                                                ?.name
                                            }
                                          </b>
                                        </div>
                                        <AttributeCombinations
                                          optionvalue={p}
                                          id="SAF"
                                          setCombination={setSAFCombination}
                                          Combination={SAFCombination}
                                        />
                                      </span>
                                    </div>
                                  )
                                );
                              })}

                            {/* Back Selected For CB */}
                            {backselected === "CB" &&
                              CBCombination &&
                              CBCombination.length > 0 &&
                              CBCombination.map((p, index) => {
                                return (
                                  p?.combinations?.length > 0 && (
                                    <div key={index}>
                                      <span
                                        className="m-3"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div style={{ fontSize: "15px" }}>
                                          <b>
                                            {
                                              p?.combinations[0]?.attributeId
                                                ?.PrintName
                                            }
                                          </b>{" "}
                                          :{" "}
                                          <b>
                                            {
                                              p?.combinations[0]?.parameterId
                                                ?.name
                                            }
                                          </b>
                                        </div>
                                        <AttributeCombinations
                                          optionvalue={p}
                                          id="CB"
                                          setCombination={setCBCombination}
                                          Combination={CBCombination}
                                        />
                                      </span>
                                    </div>
                                  )
                                );
                              })}

                            {/* Back Selected For Ignore BAck */}
                            {backselected === "IB" &&
                              IBCombination &&
                              IBCombination.length > 0 &&
                              IBCombination.map((p, index) => {
                                return (
                                  p?.combinations?.length > 0 && (
                                    <div key={index}>
                                      <span
                                        className="m-3"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div style={{ fontSize: "15px" }}>
                                          <b>
                                            {
                                              p?.combinations[0]?.attributeId
                                                ?.PrintName
                                            }
                                          </b>{" "}
                                          :{" "}
                                          <b>
                                            {
                                              p?.combinations[0]?.parameterId
                                                ?.name
                                            }
                                          </b>
                                        </div>
                                        <AttributeCombinations
                                          optionvalue={p}
                                          id="IB"
                                          setCombination={setIBCombination}
                                          Combination={IBCombination}
                                          Name={p}
                                          varientset={p}
                                        />
                                      </span>
                                    </div>
                                  )
                                );
                              })}
                          </div>
                        )}
                      </div>

                      {/* Productdetails Attribute */}

                      {/* <br></br> */}
                      {/* <br></br> */}

                      {/* Product Customized Price */}

                      <h4 style={{ color: "red" }}>
                        ₹{" "}
                        {CustomizedFinialAmount(
                          calculateTotalCustomizedProduct,
                          productDetails
                        )}
                      </h4>
                      <div className="HideInPhone mt-4">
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <button
                            className="btn"
                            style={{
                              backgroundColor: "#475B52",
                              color: "#fff",
                            }}
                            onClick={() => setshow(true)}
                          >
                            Cost Sheet
                          </button>
                        </div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer_part">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer_iner text-center">
                  <p>
                    Designed & Developed By{" "}
                    <a href="http://marwariplus.com/">Marwari Software</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
