import React, { useEffect, useMemo, useState } from "react";
import { toastError } from "../../../utils/reactToastify";
import { findObjectFromArray } from "../productdetails/ProductDetails";
import Modal from "../../../components/modal/Modal";
import { axiosInstance } from "../../../config";
// import ProductCustomizedProduct from "../../productdetails/customizedproduct/ProductCustomizedProduct";
import { useDispatch } from "react-redux";
import { REACT_APP_URL } from "../../../config";
import { CustomizedProductByTags } from "../../../redux/slices/productSlice";

const ShowCustomizedProductModal = ({
  varientproductdetails,
  setvarientproductdetails,
  productdetails,
  productid,
  varientproductdetailsSAF,
  setvarientproductdetailsSAF,
  varientproductdetailsCB,
  setvarientproductdetailsCB,
  varientproductdetailsIB,
  setvarientproductdetailsIB,
  backselected,
  setbackselected,
  calculateTotalCustomizedProduct,
  updateTotalPrice,
  index,
  varientset,
  setvarientset,
  varientsetSAF,
  setvarientsetSAF,
  varientsetBC,
  setvarientsetBC,
  varientsetIB,
  setvarientsetIB,
  handleCartdata,
  customizedProductPriceSAF,
  customizedProductPriceCB,
  customizedProductPriceIB,
  customizedProductPrice,
}) => {
  console.log("productdetails", productdetails.tags);

  const dispatch = useDispatch();

  const [getallbackdetails, setgetallbackdetails] = useState({});

  const [loader, setloader] = useState(false);

  const getbackvarient = async (id) => {
    try {
      setloader(true);
      const { data } = await axiosInstance.post(
        `/api/product/getproductvarientSameasFront/${id}`,
        {
          SameAsFront: "SameAsFront",
          IgnoreBack: "IgnoreBack",
          CoverBack: "CoverBack",
        }
      );

      if (data.success) {
        setgetallbackdetails(data.data);

        setloader(false);
      }
    } catch (error) {
      toastError(error.response.data.message);
    }
  };

  const handleVarient = (attributeitemName, attributeItemGroup) => {
    setvarientset({
      ...varientset,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientset;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      productdetails.varient
    );
    setvarientproductdetails(result);
  };

  useEffect(() => {
    if (productdetails?.CustomizedProduct) {
      getbackvarient(productid);
    }
  }, []);

  useEffect(() => {
    //If Product is Custommized then Sent Request to the particular Customized Product
    // Handling Front Side

    let newobj = {};
    const attributeItemGroup = productdetails?.attribute?.map((p) => {
      newobj[p.Name] = p.OptionsValue[0].Name;
    });

    setvarientset(newobj);

    setvarientproductdetails(
      findObjectFromArray(newobj, productdetails.varient)
    );

    if (
      getallbackdetails.allCombinationssaf &&
      getallbackdetails.allCombinationssaf.length > 0
    ) {
      const SAFobj = {};

      productdetails.BackSAF.map((p) => {
        SAFobj[p.Name] = p.OptionsValue[0].Name;
      });

      //=============================================> Check For BAck Coming Or not <===========================

      setvarientsetSAF(SAFobj);

      const result = findObjectFromArray(
        SAFobj,
        getallbackdetails.allCombinationssaf
      );

      setvarientproductdetailsSAF(result);
    }

    // Cover Back
    const BCobj = {};

    productdetails.BackCB.map((p) => {
      BCobj[p.Name] = p.OptionsValue[0].Name;
    });

    setvarientsetBC(BCobj);

    setvarientproductdetailsCB(BCobj);

    //Ignore BAck
    const IBobj = {};

    productdetails.BackIB.map((p) => {
      IBobj[p.Name] = p.OptionsValue[0].Name;
    });

    setvarientsetIB(IBobj);

    setvarientproductdetailsIB(IBobj);
  }, [loader]);

  const handleVarientBC = (attributeitemName, attributeItemGroup) => {
    setvarientsetBC({
      ...varientsetBC,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientsetBC;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      getallbackdetails.allCombinationscb
    );
    setvarientproductdetailsCB(result);
  };

  const handleVarientIB = (attributeitemName, attributeItemGroup) => {
    setvarientsetIB({
      ...varientsetIB,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientsetIB;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      getallbackdetails.allCombinationsib
    );

    setvarientproductdetailsIB(result);
  };

  const handleVarientSAF = (attributeitemName, attributeItemGroup) => {
    setvarientsetSAF({
      ...varientsetSAF,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientsetSAF;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(
      newuseStateobject,
      getallbackdetails.allCombinationssaf
    );

    setvarientproductdetailsSAF(result);
  };

  //=============================================>Sending Cartdata Into Parent Components<==============================

  useEffect(() => {
    let newobj = {};

    let backpriceprice = 0;

    let backcustomizedproductImage = {};

    let frontcustomizedproductImage = {
      varientproductdetails: varientproductdetails,
      attribute: productdetails?.attribute,
      attributePosition: productdetails?.attributePosition,
    };

    if (backselected === "SAF" && varientproductdetailsSAF) {
      newobj = { ...varientsetSAF };
      backcustomizedproductImage = {
        varientproductdetails: varientproductdetailsSAF,
        attribute: productdetails?.BackSAF,
        attributePosition: productdetails?.BackSAFPAQ,
      };
      backpriceprice = customizedProductPriceSAF;
    }

    if (backselected === "CB" && varientproductdetailsCB) {
      newobj = { ...varientsetBC };
      backcustomizedproductImage = {
        varientproductdetails: varientproductdetailsCB,
        attribute: productdetails?.BackCB,
        attributePosition: productdetails?.BackCBPAQ,
      };

      backpriceprice = customizedProductPriceCB;
    }

    if (backselected === "IB" && varientproductdetailsIB) {
      newobj = { ...varientsetIB };

      backcustomizedproductImage = {
        varientproductdetails: varientproductdetailsIB,
        attribute: productdetails?.BackIB,
        attributePosition: productdetails?.BackIBPAQ,
      };

      backpriceprice = customizedProductPriceIB;
    }

    const cartdata = {
      name: `${productdetails.ProductName}`,
      quantity: 1,
      id: productdetails._id,
      sellingType: "Normal",
      maxquantity: productdetails.ProductInStockQuantity,
      gst: productdetails.GSTIN,
      frontcustomizedproductImage,
      backcustomizedproductImage,
      frontvarientset: varientset,
      backvarientset: newobj,
      backselected,
      backpriceprice,
      frontprice: customizedProductPrice,
    };

    //Call Function to update Front Side Data
    handleCartdata(index, cartdata);
  }, [
    calculateTotalCustomizedProduct,
    backselected,
    varientset,
    varientsetBC,
    varientsetIB,
    varientsetSAF,
  ]);

  useEffect(() => {
    updateTotalPrice(index, calculateTotalCustomizedProduct);
  }, [calculateTotalCustomizedProduct]);

  return (
    <div className="px-5">
      {loader ? (
        <>
          <h1>Loading....</h1>
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="row ">
                <div className="col-md-6">
                  {/* <ProductCustomizedProduct
                    varientproductdetails={varientproductdetails}
                    attribute={productdetails.attribute}
                    attributePosition={productdetails.attributePosition}
                    name="Front Side"
                    height="40vh"
                    width="28vw"
                    margin={"7px"}
                  /> */}
                </div>
                <div className="col-md-6">
                  {backselected === "SAF" && (
                    <>
                      {productdetails.BackSAF &&
                        productdetails.BackSAF.length > 0 && (
                          <>
                            {/* <ProductCustomizedProduct
                              varientproductdetails={varientproductdetailsSAF}
                              attribute={productdetails.BackSAF}
                              attributePosition={productdetails.BackSAFPAQ}
                              name="Same as Front"
                              height="40vh"
                              width="28vw"
                              margin={"7px"}
                            />   */}
                          </>
                        )}
                    </>
                  )}

                  {backselected === "CB" && (
                    <>
                      {productdetails.BackCB &&
                        productdetails.BackCB.length > 0 && (
                          <>
                            {/* <ProductCustomizedProduct
                              varientproductdetails={varientproductdetailsCB}
                              attribute={productdetails.BackCB}
                              attributePosition={productdetails.BackCBPAQ}
                              name="Cover Back"
                              height="40vh"
                              width="28vw"
                              margin={"7px"}
                            /> */}
                          </>
                        )}
                    </>
                  )}

                  {backselected === "IB" && (
                    <>
                      {productdetails.BackIB &&
                        productdetails.BackIB.length > 0 && (
                          <>
                            {/* <ProductCustomizedProduct
                              varientproductdetails={varientproductdetailsIB}
                              attribute={productdetails?.BackIB}
                              attributePosition={productdetails?.BackIBPAQ}
                              name="Ignore Back"
                              height="40vh"
                              width="28vw"
                              margin={"7px"}
                            /> */}
                          </>
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  {productdetails?.attribute &&
                    productdetails?.CustomizedProduct && (
                      <>
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
                      </>
                    )}

                  {productdetails?.attribute &&
                    productdetails.attribute
                      .filter((p) => p.enable === true)
                      .map((p) => {
                        return (
                          <>
                            <div key={p._id}>
                              <span
                                className="m-3"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div style={{ fontSize: "15px" }}>
                                  <b>{p.PrintName}</b> :
                                  {/* <b>{varientset[p.Name]}</b> */}
                                </div>
                                <AttributeOptionValue
                                  optionvalue={p.OptionsValue}
                                  handleVarient={handleVarient}
                                  Name={p.Name}
                                  varientset={varientset}
                                />
                              </span>
                            </div>
                          </>
                        );
                      })}
                </div>

                {productdetails.BackSAF &&
                  productdetails.BackSAF.length > 0 && (
                    <>
                      <div className="col-lg-6" style={{ float: "left" }}>
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
                            <button
                              type="button"
                              // className="bg-primary"
                              style={{
                                backgroundColor:
                                  backselected === "SAF" ? "#475B52" : "#fff",
                                border: "2px solid #475B52",
                                padding: "4px",
                                borderRadius: "3px",
                                margin: "2px",
                                color: backselected === "SAF" ? "#fff" : "#000",
                                fontWeight: "700",
                              }}
                              onClick={() => setbackselected("SAF")}
                            >
                              Same as Front
                            </button>

                            <button
                              type="button"
                              style={{
                                backgroundColor:
                                  backselected === "CB" ? "#475B52" : "#fff",
                                border: "2px solid #475B52",
                                padding: "4px",
                                borderRadius: "3px",
                                margin: "2px",
                                color: backselected === "CB" ? "#fff" : "#000",
                                fontWeight: "700",
                              }}
                              autoComplete="off"
                              onClick={() => setbackselected("CB")}
                            >
                              Cover Back
                            </button>

                            <button
                              type="button"
                              style={{
                                backgroundColor:
                                  backselected === "IB" ? "#475B52" : "#fff",
                                border: "2px solid #475B52",
                                padding: "4px",
                                borderRadius: "3px",
                                margin: "2px",
                                color: backselected === "IB" ? "#fff" : "#000",
                                fontWeight: "700",
                              }}
                              onClick={() => setbackselected("IB")}
                            >
                              {" "}
                              Back Ignore
                            </button>
                          </div>
                          <br></br>
                        </center>

                        {/* Select this If Same As Front Selected */}
                        {backselected === "SAF" && (
                          <>
                            {productdetails.BackSAF &&
                              productdetails.BackSAF.length > 0 &&
                              productdetails.BackSAF.filter(
                                (p) => p.enable === true
                              ).map((p) => {
                                return (
                                  <>
                                    <div key={p._id}>
                                      <span
                                        className="m-3"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div style={{ fontSize: "15px" }}>
                                          <b>{p.PrintName}</b> :{" "}
                                          <b>{varientsetSAF[p.Name]}</b>
                                        </div>

                                        <AttributeOptionValue
                                          optionvalue={p.OptionsValue}
                                          handleVarient={handleVarientSAF}
                                          Name={p.Name}
                                          varientset={varientsetSAF}
                                        />
                                      </span>
                                    </div>
                                  </>
                                );
                              })}
                          </>
                        )}

                        {/* Back Selected For CB */}
                        {backselected === "CB" && (
                          <>
                            {productdetails.BackCB &&
                              productdetails.BackCB.length > 0 &&
                              productdetails.BackCB.filter(
                                (p) => p.enable === true
                              ).map((p) => {
                                return (
                                  <>
                                    <div key={p._id}>
                                      <span
                                        className="m-3 "
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <br></br>
                                        <b>{p.PrintName}</b> :{" "}
                                        <b>{varientsetBC[p.Name]}</b>
                                        <AttributeOptionValue
                                          optionvalue={p.OptionsValue}
                                          handleVarient={handleVarientBC}
                                          Name={p.Name}
                                          varientset={varientsetBC}
                                        />
                                      </span>
                                    </div>
                                  </>
                                );
                              })}
                          </>
                        )}

                        {/* Back Selected For Ignore BAck */}
                        {backselected === "IB" && (
                          <>
                            {productdetails.BackIB &&
                              productdetails.BackIB.map((p) => {
                                return (
                                  <>
                                    <div key={p._id}>
                                      <span
                                        className="m-3 "
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <br></br>
                                        <b>{p.PrintName}</b> :{" "}
                                        <b>{varientsetIB[p.Name]}</b>
                                        <AttributeOptionValue
                                          optionvalue={p.OptionsValue}
                                          handleVarient={handleVarientIB}
                                          Name={p.Name}
                                          varientset={varientsetIB}
                                        />
                                      </span>
                                    </div>
                                  </>
                                );
                              })}
                          </>
                        )}
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AttributeOptionValue = ({
  optionvalue,
  handleVarient,
  Name,
  varientset,
}) => {
  const [show, setshow] = useState(false);

  const handleClose = () => {
    setshow(false);
  };

  let findimage = optionvalue?.find((p) => p.Name === varientset[Name]);

  return (
    <>
      <div>
        {/* <button
              className="btn "
              style={{ backgroundColor: "#475B52", color: "#fff" }}
              onClick={() => setshow(true)}
            >
              change {Name}
            </button> */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {findimage && Object.keys(findimage).length > 0 && (
            <>
              <div className="image-area ProductDetailsAttributeDivMobileView">
                <img
                  loading="lazy"
                  className="ProductDetailsAttributeImageMobileView"
                  src={`${REACT_APP_URL}/images/attribute/${findimage?.Photo}`}
                  alt="Preview"
                />
                <button
                  className="AttributeImageRemove-image"
                  type="button"
                  style={{ display: "inline" }}
                  onClick={() => setshow(true)}
                >
                  <i
                    className="fa-solid fa-pencil"
                    style={{ fontSize: "8px" }}
                  ></i>
                </button>
              </div>
              <br />
            </>
          )}
        </div>

        {/* 2nd */}
        <Modal handleClose={handleClose} show={show} height="100%" width="auto">
          <div
            style={{
              display: "-webkit-box",
              margin: "30px",
              padding: "70px 0px 0px 0px",
              // overflowX: "scroll",
            }}
          >
            {optionvalue?.map((option) => (
              <>
                <div
                  key={option._id}
                  className="image-area productDetailimage-area"
                  onClick={() => handleVarient(Name, option.Name)}
                >
                  <img
                    loading="lazy"
                    src={`${REACT_APP_URL}/images/attribute/${option.Photo}`}
                    alt="Preview"
                    style={{
                      border:
                        varientset[Name] === option.Name
                          ? "2px solid green"
                          : "2px dotted green",
                      padding: "4px",
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      position: "relative",
                    }}
                    onClick={handleClose}
                  />

                  {option.AttributePrice && (
                    <>
                      <p className="ms-3">
                        {" "}
                        ₹{" "}
                        {option.AttributePrice - optionvalue[0].AttributePrice}
                      </p>
                    </>
                  )}

                  {varientset[Name] === option.Name && (
                    <>
                      <img
                        loading="lazy"
                        src="https://img5.su-cdn.com/common/2023/04/12/5a3e03447c196fbc9002d68cd0469137.png"
                        alt="selected Icon"
                        style={{
                          position: "absolute",
                          width: "20px",
                          height: "20px",
                          bottom: "0%",
                          right: "18%",
                        }}
                      />
                    </>
                  )}
                </div>
              </>
            ))}
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ShowCustomizedProductModal;
