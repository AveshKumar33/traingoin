import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./style.module.css";

import blackLogo from "../../../assets/quotation/black-logo-with-name.png";
import whiteLogo from "../../../assets/quotation/white-logo-with-name.png";
import QRCode from "../../../assets/quotation/QR-Code.png";

import ProductImage from "./ProductImage";
import SelectedAttribute from "./SelectedAttribute";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";
// import { CustomizedFinialAmount } from "../../../utils/usefullFunction";
import { formateAmount, numberToWords } from "../../../utils/formateAmount";
import { roundNumber } from "../../../utils/useFullFunctions/roundNumber";
import Preloader from "../../../components/preloader/Preloader";

import { getPercentage } from "../../../utils/usefullFunction";
import { getRequestForPriceProductCombinations } from "../../../redux/slices/raiseAQuerySlice";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";

const initialState = {
  product: null,
  architectDetails: {},
  clientDetails: {},
  singleProductCombination: {},
  P_Height: 0,
  P_Width: 0,
  backSelected: "",
  FrontCombination: [],
  BackCombination: [],
  totalPrice: 0,
  discountAmount: 0,
  GSTAmount: 0,
  installationCharge: 0,
  WastageAmount: 0,
  netAmount: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCT":
      return { ...state, product: action.payload };
    case "SET_SINGLE_PRODUCT_COMBINATION":
      return { ...state, singleProductCombination: action.payload };
    case "SET_ARCHITECT_DETAILS":
      return { ...state, architectDetails: action.payload };
    case "SET_CLIENT_DETAILS":
      return { ...state, clientDetails: action.payload };
    case "SET_HEIGHT":
      return { ...state, P_Height: action.payload };
    case "SET_WIDTH":
      return { ...state, P_Width: action.payload };
    case "SET_BACK_SELECTED":
      return { ...state, backSelected: action.payload };
    case "SET_FRONT_COMBINATION":
      return { ...state, FrontCombination: action.payload };
    case "SET_BACK_COMBINATION":
      return { ...state, BackCombination: action.payload };
    case "SET_TOTAL_PRICE":
      return { ...state, totalPrice: action.payload };
    case "SET_GST_AMOUNT":
      return { ...state, GSTAmount: action.payload };
    case "SET_DISCOUNT_AMOUNT":
      return { ...state, discountAmount: action.payload };
    case "SET_INSTALLATION_CHARGE":
      return { ...state, installationCharge: action.payload };
    case "SET_WASTAGE_CHARGE":
      return { ...state, WastageAmount: action.payload };
    case "SET_NET_AMOUNT":
      return { ...state, netAmount: action.payload };
    default:
      return state;
  }
};

const calculateCustomizedPrice = (productDetails, combinations, priceFor) => {
  if (productDetails && combinations?.length > 0) {
    const { DefaultWidth, DefaultHeight } = productDetails || {};

    const totalCustomizedPrice =
      productDetails[priceFor] +
      getPriceForCollectionClient(
        productDetails,
        combinations,
        {
          DefaultWidth: DefaultWidth ? DefaultWidth : 0,
          DefaultHeight: DefaultHeight ? DefaultHeight : 0,
        },
        false
      );

    return totalCustomizedPrice;
  }
  return 0;
};

function getFormattedDate() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const currentDate = new Date();

  return formatter.format(currentDate);
}

const Quotation = () => {
  const { productType, id } = useParams();

  const dispatch = useDispatch();

  const { requestForPriceProductCombinations, loading: rfpLoading } =
    useSelector((state) => state.raiseQuery);

  const [loading, setLoading] = useState(false);
  const [state, dispatchState] = useReducer(reducer, initialState);

  const {
    product,
    singleProductCombination,
    architectDetails,
    clientDetails,
    P_Height,
    P_Width,
    backSelected,
    FrontCombination,
    BackCombination,
    totalPrice,
    discountAmount,
    GSTAmount,
    installationCharge,
    WastageAmount,
    netAmount,
  } = state;

  useEffect(() => {
    const fetchSingleProductCombinationa = async (id) => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/api/raiseAQuery/single-product/combination-for-quotation/${id}`
        );

        if (data?.success) {
          dispatchState({
            type: "SET_SINGLE_PRODUCT_COMBINATION",
            payload: data.product[0],
          });
          dispatchState({
            type: "SET_PRODUCT",
            payload: data.product[0]?.singleProductId,
          });

          dispatchState({
            type: "SET_CLIENT_DETAILS",
            payload: data?.data[0],
          });

          dispatchState({
            type: "SET_ARCHITECT_DETAILS",
            payload: data?.data[0].architectId,
          });

          dispatchState({
            type: "SET_TOTAL_PRICE",
            payload: data.product[0]?.SalePrice,
          });

          const discount =
            (data.product[0]?.SalePrice * data?.data[0].discount ?? 0) / 100;

          dispatchState({
            type: "SET_DISCOUNT_AMOUNT",
            payload: discount,
          });

          let Amount =
            (data.product[0]?.SalePrice *
              data.product[0]?.singleProductId?.GSTIN ?? 0) / 100;
          const getAmont = Math.round(Amount);

          dispatchState({
            type: "SET_GST_AMOUNT",
            payload: getAmont,
          });

          const newAmount = data.product[0]?.SalePrice + getAmont - discount;

          dispatchState({
            type: "SET_NET_AMOUNT",
            payload: newAmount,
          });
        }
      } catch (error) {
        toastError(error.response.data.message);
      }
      setLoading(false);
    };

    if (id && productType === "singleProduct") {
      fetchSingleProductCombinationa(id);
    }
  }, [id, productType]);

  useEffect(() => {
    if (id && productType === "customizeProduct") {
      dispatch(getRequestForPriceProductCombinations(id));
    }
  }, [id, productType, dispatch]);

  useEffect(() => {
    if (product && productType === "customizeProduct" && clientDetails) {
      const FrontPrice = calculateCustomizedPrice(
        product,
        FrontCombination,
        "FixedPrice"
      );

      let BackPrice = 0;

      if (BackCombination?.length > 0) {
        BackPrice = calculateCustomizedPrice(
          product,
          BackCombination,
          `FixedPrice${backSelected}`
        );
      }

      const total = FrontPrice + BackPrice;

      let Amount =
        ((product?.installnationCharge + product?.Wastage + total) *
          product?.GSTIN ?? 0) / 100;
      const getAmont = Math.round(Amount);

      dispatchState({
        type: "SET_GST_AMOUNT",
        payload: getAmont,
      });
      dispatchState({
        type: "SET_TOTAL_PRICE",
        payload: total,
      });

      const discount = (total * clientDetails.discount ?? 0) / 100;

      dispatchState({
        type: "SET_DISCOUNT_AMOUNT",
        payload: discount,
      });

      dispatchState({
        type: "SET_INSTALLATION_CHARGE",
        payload: product?.installnationCharge,
      });
      dispatchState({
        type: "SET_WASTAGE_CHARGE",
        payload: product?.Wastage,
      });

      const newAmount =
        total -
        discount +
        getAmont +
        product?.installnationCharge +
        product?.Wastage;

      dispatchState({
        type: "SET_NET_AMOUNT",
        payload: newAmount,
      });
    }
  }, [
    product,
    productType,
    clientDetails,
    FrontCombination,
    BackCombination,
    backSelected,
  ]);

  useEffect(() => {
    if (
      rfpLoading === "fulfilled" &&
      requestForPriceProductCombinations &&
      requestForPriceProductCombinations?.updatedWishlist &&
      requestForPriceProductCombinations?.updatedWishlist?.length > 0
    ) {
      //   console.log(
      //     "requestForPriceProductCombinations",
      //     requestForPriceProductCombinations
      //   );
      const productDetails =
        requestForPriceProductCombinations?.updatedWishlist[0];

      dispatchState({
        type: "SET_PRODUCT",
        payload: productDetails?.customizeProduct,
      });

      dispatchState({
        type: "SET_ARCHITECT_DETAILS",
        payload: requestForPriceProductCombinations?.queryDetails?.architectId,
      });

      dispatchState({
        type: "SET_CLIENT_DETAILS",
        payload: requestForPriceProductCombinations?.queryDetails,
      });

      dispatchState({
        type: "SET_HEIGHT",
        payload: requestForPriceProductCombinations?.customizeProductHeight,
      });
      dispatchState({
        type: "SET_WIDTH",
        payload: requestForPriceProductCombinations?.customizeProductWidth,
      });
      dispatchState({
        type: "SET_BACK_SELECTED",
        payload:
          requestForPriceProductCombinations?.customizedProductBackSelected,
      });
      dispatchState({
        type: "SET_FRONT_COMBINATION",
        payload: productDetails?.FrontCombinations,
      });

      if (
        requestForPriceProductCombinations?.customizedProductBackSelected ===
        "SAF"
      ) {
        dispatchState({
          type: "SET_BACK_COMBINATION",
          payload: productDetails?.SAFCombinations,
        });
      } else if (
        requestForPriceProductCombinations?.customizedProductBackSelected ===
        "CB"
      ) {
        dispatchState({
          type: "SET_BACK_COMBINATION",
          payload: productDetails?.CBCombinations,
        });
      } else if (
        requestForPriceProductCombinations?.customizedProductBackSelected ===
        "IB"
      ) {
        dispatchState({
          type: "SET_BACK_COMBINATION",
          payload: productDetails?.IBCombinations,
        });
      }
    }
  }, [rfpLoading, requestForPriceProductCombinations]);

  const unit =
    P_Width && P_Height
      ? "Sq.ft"
      : P_Width
      ? "Length"
      : P_Height
      ? "Rft"
      : "Pice";

  if (rfpLoading === "pending" || loading) {
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.firstPage}>
        <div className={styles.whiteLogo} />
        <div className={styles.text}>
          <p>We are honored to have the opportunity to serve you.</p>
          <p>
            As you review this quotation, please know that our team is dedicated
            to providing you with the highest quality products and exceptional
            customer service. We look forward to the possibility of working
            together to bring your vision to life.
          </p>
          <p>
            Thank you again for choosing Railingo PVT Ltd. We are here to assist
            you every step of the way.
          </p>
        </div>
      </div>

      <div className={styles.blackBorder} />

      {/* Client And Architect Details */}
      <div className={styles.secondPage}>
        <div className={styles.blackLogoContainer}>
          <img src={blackLogo} alt="_logo" className={styles.blackLogo} />
        </div>

        <div className={styles.secondPageContainer}>
          <div className={styles.headerText}> Quotation</div>
          <div className={styles.dateContaiiner}>
            <div className={styles.date}>Date : {getFormattedDate()}</div>
          </div>

          <div className={styles.companyDetailsContainer}>
            <div className={styles.titleContainer}>Company Details</div>
            <table className={styles.companyTable}>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody className={styles.companyDetails}>
                <tr>
                  <th>Company Name</th>
                  <td>Railingo PVT. Ltd.</td>
                  <th>Quotation No</th>
                  <td>766NH8985</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>8755999395</td>
                  <th>Person Name</th>
                  <td></td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>info@railingo.com</td>
                  <th>GST Details</th>
                  <td>Company GST No</td>
                </tr>
                {/* <tr>
                  <th>GST Details</th>
                  <td>Railingo PVT Ltd</td>
                  <th>Quotation No</th>
                  <td>766NH8</td>
                </tr> */}
                <tr>
                  <th>Website</th>
                  <td>https://railingo.com</td>
                  {/* <th>Quotation No</th>
                  <td>766NH8</td> */}
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.clientContainer}>
            <table className={styles.clientTable}>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody className={styles.clientDetails}>
                <tr>
                  <td className={styles.columnsCollaps1} colSpan="3">
                    <span className={styles.titleContainer}>
                      Client Details
                    </span>
                  </td>
                  <td className={styles.columnsCollaps2} colSpan="3">
                    <span className={styles.titleContainer}>
                      Architect Details
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Client Code</th>
                  <td>009</td>
                  <th>GST Details</th>
                  <td>{clientDetails?.gstNo}</td>
                  <th>Arch. Name</th>
                  <td>{architectDetails && architectDetails?.Name}</td>
                </tr>
                <tr>
                  <th>Client Name</th>
                  <td colSpan="2">{clientDetails?.Name}</td>
                  <th>Firm. Name</th>
                  <td colSpan="2">
                    {architectDetails && architectDetails?.firmName}
                  </td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td colSpan="2">{clientDetails?.MobNumber}</td>
                  <th>Cantact</th>
                  <td colSpan="2">
                    {architectDetails && architectDetails?.MobNumber}
                  </td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td colSpan="2">{clientDetails?.Address}</td>
                  <th>Address</th>
                  <td colSpan="2">
                    {architectDetails && architectDetails?.Address}
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td colSpan="2">{clientDetails?.Email}</td>
                  <th>Email</th>
                  <td colSpan="2">
                    {architectDetails && architectDetails?.Email}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-1">
            <table className="table table-bordered ">
              <thead style={{ fontSize: "11px", fontWeight: "600" }}>
                <tr>
                  <th
                    style={{
                      backgroundColor: "#324A42",
                      color: "#ffffff",
                    }}
                    colSpan={productType === "singleProduct" ? 5 : 0}
                  >
                    Description
                  </th>
                  {productType === "customizeProduct" && (
                    <th
                      style={{
                        backgroundColor: "#324A42",
                        color: "#ffffff",
                      }}
                    >
                      Length (In Feet)
                    </th>
                  )}
                  {productType === "customizeProduct" && (
                    <th
                      style={{
                        backgroundColor: "#324A42",
                        color: "#ffffff",
                      }}
                    >
                      Running Feet
                    </th>
                  )}
                  {productType === "customizeProduct" && (
                    <th
                      style={{
                        backgroundColor: "#324A42",
                        color: "#ffffff",
                      }}
                    >
                      Total Area {`(In ${unit})`}
                    </th>
                  )}
                  {productType === "customizeProduct" && (
                    <th
                      style={{
                        backgroundColor: "#324A42",
                        color: "#ffffff",
                      }}
                    >
                      Rate / {`(In ${unit})`}
                    </th>
                  )}
                  <th
                    style={{
                      backgroundColor: "#324A42",
                      color: "#ffffff",
                      width: "15%",
                      textAlign: "right",
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "11px", fontWeight: "600" }}>
                <tr>
                  <td colSpan={productType === "singleProduct" ? 5 : 0}>
                    {product?.ProductName}
                  </td>
                  {productType === "customizeProduct" && (
                    <td style={{ color: "#FF0000" }}>
                      {unit === "Length"
                        ? P_Width
                        : unit === "Sq.ft"
                        ? P_Width
                        : ""}
                    </td>
                  )}
                  {productType === "customizeProduct" && (
                    <td style={{ color: "#FF0000" }}>
                      {unit === "Rft"
                        ? P_Height
                        : unit === "Sq.ft"
                        ? P_Height
                        : ""}
                    </td>
                  )}
                  {productType === "customizeProduct" && (
                    <td style={{ color: "#FF0000" }}>
                      {P_Width && P_Height
                        ? P_Width * P_Height
                        : P_Width
                        ? P_Width
                        : P_Height
                        ? P_Height
                        : 0}
                    </td>
                  )}
                  {productType === "customizeProduct" && (
                    <td style={{ color: "#FF0000" }}>
                      {formateAmount(
                        roundNumber(
                          Number(
                            P_Width && P_Height
                              ? totalPrice / (P_Width * P_Height)
                              : P_Width
                              ? totalPrice / P_Width
                              : P_Height
                              ? totalPrice / P_Height
                              : 0
                          )
                        )
                      )}
                    </td>
                  )}
                  <td style={{ textAlign: "right" }}>
                    <span style={{ color: "#FF0000" }}>
                      {formateAmount(totalPrice)}
                    </span>
                  </td>
                  {/* <td>{CustomizedFinialAmount(totalPrice, product)}</td> */}
                </tr>
                <tr style={{ textAlign: "right" }}>
                  <td colSpan="5">Sub Total</td>
                  <td>{formateAmount(totalPrice)}</td>
                </tr>
                {discountAmount !== 0 && (
                  <tr style={{ textAlign: "right" }}>
                    <td colSpan="5">
                      Discount {`(${clientDetails?.discount})%`}
                    </td>
                    <td>{formateAmount(discountAmount || 0)}</td>
                  </tr>
                )}
                {discountAmount !== 0 && (
                  <tr style={{ textAlign: "right" }}>
                    <td colSpan="5">Gross Total</td>
                    <td>{formateAmount(totalPrice - (discountAmount || 0))}</td>
                  </tr>
                )}
                {productType === "customizeProduct" && (
                  <tr style={{ textAlign: "right" }}>
                    <td colSpan="5">Installation Charge</td>
                    <td>{formateAmount(installationCharge)}</td>
                  </tr>
                )}
                {productType === "customizeProduct" && (
                  <tr style={{ textAlign: "right" }}>
                    <td colSpan="5">Westage</td>
                    <td>{formateAmount(WastageAmount || 0)}</td>
                  </tr>
                )}
                <tr style={{ textAlign: "right" }}>
                  <td colSpan="5">GST {`(${product?.GSTIN})%`}</td>
                  <td>{formateAmount(GSTAmount)}</td>
                </tr>
                <tr style={{ textAlign: "right" }}>
                  <td colSpan="5">Net Amount</td>
                  <td>
                    <span style={{ color: "#FF0000" }}>
                      {formateAmount(netAmount)}
                    </span>{" "}
                  </td>
                </tr>
                <tr style={{ textAlign: "right" }}>
                  <td colSpan="5">Transportation Charge</td>
                  <td style={{ fontSize: "10px" }}>
                    <span style={{ color: "#FF0000" }}>As Per Actual</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mb-2">
              <span style={{ fontSize: "12px" }}>Amount in Words</span>&nbsp;
              &nbsp;
              <span
                style={{
                  color: "#FF0000",
                  borderBottom: "1px solid black",
                  fontSize: "11px",
                  paddingBottom: "3px",
                  fontWeight: "600",
                }}
              >
                {numberToWords(netAmount)}
              </span>
            </div>
          </div>
          {product?.SellingType === "Installment" && (
            <>
              <div style={{ textAlign: "center" }}>
                <div className={styles.titleContainer}>Payment Schedule</div>
              </div>
              <div className="mt-2">
                <table className="table table-bordered ">
                  <thead style={{ fontSize: "11px", fontWeight: "600" }}>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#324A42",
                          color: "#ffffff",
                        }}
                      >
                        Payment From
                      </th>
                      {product?.Installment &&
                        product?.Installment.map((installment) => (
                          <th
                            style={{
                              backgroundColor: "#324A42",
                              color: "#ffffff",
                              textAlign: "center",
                            }}
                          >
                            {installment?.Name} {`(${installment?.Amount}%)`}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "11px", fontWeight: "600" }}>
                    <tr>
                      <td>{clientDetails?.Name}</td>
                      {product?.Installment &&
                        product?.Installment.map((installment) => (
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {formateAmount(
                              getPercentage(netAmount, installment.Amount)
                            )}
                            /-
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.blackBorder} />

      {/* Customize Product Image and Attribute Details */}
      <div className={styles.thirdPage}>
        <div className={styles.blackLogoContainer}>
          <img src={blackLogo} alt="_logo" className={styles.blackLogo} />
        </div>
        <div className={styles.customizeProductDetailsContainer}>
          <div className={styles.productName}>
            <div>Product Name: {`${product?.ProductName}`} </div>
          </div>
          <div className={`${styles.headerText} ${styles.headerName}`}>
            Referance image prepared for Mrs. {clientDetails?.Name}
          </div>

          <div className={`col-md-"12"`}>
            {productType === "customizeProduct" && (
              <ProductImage
                varientproductdetails={FrontCombination}
                name="Front Side"
              />
            )}

            {productType === "singleProduct" && singleProductCombination && (
              <div className="mt-2">
                <img
                  className="SliderProductImages2"
                  src={`${REACT_APP_URL}/images/product/${singleProductCombination?.image}`}
                  alt="_product_image_"
                  styles={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            )}
            <div className={styles.imageDecleration}>
              This Design is just for reference, it will vary on site as per
              your section os Shatd, Material & Concept.
            </div>
          </div>
        </div>
        <div className={styles.articles}>Selected Articles</div>
        <div className={`col-md-"12"`}>
          <table className="table table-striped">
            <thead className={styles.attTableHead}>
              <tr>
                <th style={{ backgroundColor: "#324A42", color: "#ffffff" }}>
                  Available Customization
                </th>
                <th style={{ backgroundColor: "#324A42", color: "#ffffff" }}>
                  Current Selection
                </th>
                <th
                  style={{
                    backgroundColor: "#324A42",
                    color: "#ffffff",
                    textAlign: "right",
                  }}
                >
                  Visuals
                </th>
              </tr>
            </thead>
            <tbody>
              {productType === "customizeProduct" &&
                FrontCombination &&
                FrontCombination.length > 0 &&
                FrontCombination.map((p, index) => {
                  return (
                    <SelectedAttribute key={index} id="Front" optionvalue={p} />
                  );
                })}
              {productType === "singleProduct" &&
                singleProductCombination &&
                singleProductCombination.combinations?.length > 0 &&
                singleProductCombination.combinations.map((p, index) => {
                  return (
                    <SelectedAttribute key={index} id="Front" optionvalue={p} />
                  );
                })}
            </tbody>
          </table>
        </div>

        {productType === "customizeProduct" &&
          BackCombination &&
          BackCombination?.length > 0 && (
            <>
              <div className={`col-md-"12"`}>
                <ProductImage
                  varientproductdetails={BackCombination}
                  name="Back Side"
                />
                <div className={styles.imageDecleration}>
                  This Design is just for reference, it will vary on site as per
                  your section os Shatd, Material & Concept.
                </div>
              </div>
              <div className={styles.articles}>Selected Articles</div>
              <div className={`col-md-"12"`}>
                <table className="table table-striped">
                  <thead className={styles.attTableHead}>
                    <tr>
                      <th
                        style={{ backgroundColor: "#324A42", color: "#ffffff" }}
                      >
                        Available Customization
                      </th>
                      <th
                        style={{ backgroundColor: "#324A42", color: "#ffffff" }}
                      >
                        Current Selection
                      </th>
                      <th
                        style={{
                          backgroundColor: "#324A42",
                          color: "#ffffff",
                          textAlign: "right",
                        }}
                      >
                        Visuals
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {BackCombination &&
                      BackCombination.length > 0 &&
                      BackCombination.map((p, index) => {
                        return (
                          <SelectedAttribute
                            key={index}
                            id="Front"
                            optionvalue={p}
                          />
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}
      </div>

      {/* Terms and Conditions */}
      <div className={styles.blackBorder} />
      <div className={styles.fourthPage}>
        <div className={styles.whiteLogoContainer}>
          <img src={whiteLogo} alt="_logo" className={styles.bottomWhiteLogo} />
        </div>
        <div className={styles.accountDetailsContainer}>
          <div className={styles.accountDetails}>
            <div className={styles.accountData}>
              <div>Account Name:</div>
              <div>Railingo Private Limited</div>
            </div>
            <div className={styles.accountData}>
              <div>Bank Name:</div>
              <div>ICICI Bank</div>
            </div>
            <div className={styles.accountData}>
              <div>Account Number:</div>
              <div>777705403240</div>
            </div>
            <div className={styles.accountData}>
              <div>IFSC Code:</div>
              <div>ICIC0000436</div>
            </div>
          </div>
          <div className={styles.QRCode}>
            <img src={QRCode} alt="_QR" />
            <div className={styles.QRText}>Scan To Pay</div>
          </div>
        </div>
        <div className={styles.tAndC}>Terms And Conditions</div>
        <div className={styles.tAcdCDetails}>
          <p>
            1.&nbsp; The quotation is valid for a period of 10 days from the
            date of issuance, unless otherwise stated. Railingo reserves the
            right to revise the quotation after the expiry of the validity
            period.
          </p>
          <p>
            2.&nbsp; Payment shall be made by the Client to Railingo in
            accordance with the payment terms specified in the quotation.
          </p>
          <p>
            3.&nbsp; Railingo will use reasonable efforts to meet the agreed
            delivery timelines, but delays may occur due to unforeseen
            circumstances. Railingo shall not be liable for any damages or
            losses arising from such delays.
          </p>
          <p>
            4.&nbsp;Railingo warrants that the services will be performed with
            reasonable care and skill. However, Railingo does not warrant that
            the services will be error-free or uninterrupted.
          </p>
          <p>
            5.&nbsp;Railingo shall not be liable for any indirect, incidental,
            consequential, or special damages, even if advised of the
            possibility of such damages.
          </p>
          <p>
            6.&nbsp;Railingo agrees to keep confidential all information
            disclosed by the Client in connection with the services. The Client
            agrees to keep confidential all information disclosed by Railingo in
            connection with the services.
          </p>
          <p>
            7.&nbsp;Railingo shall not be liable for any delay or failure to
            perform its obligations under these Terms due to causes beyond its
            reasonable control, including, but not limited to, acts of God,
            natural disasters, war, terrorism, labor disputes, and government
            regulations.
          </p>
          <p>
            8.&nbsp;After the product is installed, the responsibility for
            packing will not lie with the company's team. Any packing required
            will be done by the client, and if the client requests packing after
            installation, it will incur additional charges.
          </p>
          <p>
            9.&nbsp;We shall not be responsible for any damage/breakage of
            materials once installed at site.
          </p>
          <p>
            10.&nbsp;Any cutting/repair of R.C.C. stone or brick work, flooring
            or plastering etc, for fixing the frame is not in our work scope.
          </p>
          <p>
            11.&nbsp;When transporting goods, if there is any dent or damage
            during transit, it will be covered only if there is insurance;
            otherwise, it will remain the client's responsibility.
          </p>
          <p>
            12.&nbsp;The provision of electricity and other necessary facilities
            should be provided from Client's side to the team.
          </p>
        </div>
        <div className={styles.signature}>
          <div className={styles.signatureContainer}>
            <div>Client Confirmation</div>
            <div>Authorised Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
