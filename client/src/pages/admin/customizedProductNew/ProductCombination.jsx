import React, { useCallback, useEffect, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductParametersAndPostions,
  createCustomizeProductCombination,
  fetchCustomizeProductCombination,
} from "../../../redux/slices/customizeProductSlice";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography, Button } from "@mui/material";
import { Box, Card } from "@mui/material";

import TopHeader from "../../../components/topheader/TopHeader";
import "../../../index.css";
import "./styles.css";
import Preloader from "../../../components/preloader/Preloader";
import ProductSetting from "./ProductSetting";
import { toastError } from "../../../utils/reactToastify";

import { axiosInstance } from "../../../config";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProductCombination = () => {
  const { id, name } = useParams();

  const { productParameterAndPositions, customizeProductCombination } =
    useSelector((state) => state.customizeProduct);

  const [productDetails, setProductDetails] = useState([]);

  const [formData, setFormData] = useState({
    ShowSAF: false,
    ShowIB: false,
    ShowCB: false,
  });

  //Attribute Position
  const [loading, setLoading] = useState(false);
  const [attributePosition, setattributePosition] = useState([]);
  const [attributePositionSAF, setAttributePositionSAF] = useState([]);
  const [attributePositionCB, setAttributePositionCB] = useState([]);
  const [attributePositionIB, setAttributePositionIB] = useState([]);

  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));
  };

  const { ShowSAF, ShowIB, ShowCB } = formData;

  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      const [productParametersAndPostionsResponse] = await Promise.all([
        axiosInstance.get(`/api/customized-product/all-details/${id}`),
      ]);

      if (
        productParametersAndPostionsResponse?.data &&
        productParametersAndPostionsResponse?.data?.data
      ) {
        setProductDetails(productParametersAndPostionsResponse?.data?.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
      console.error("Error fetching data:", error);
    }
  }, [id]);

  useEffect(() => {
    const callFetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchData()]);
      } catch (error) {
        console.log("error", error);
      }
    };
    callFetchData();
  }, [fetchData]);

  // useEffect(() => {
  //   const { data } = await axiosInstance.get(
  //     `/api/customized-product/all-details/${id}`
  //   );
  //   dispatch(fetchProductParametersAndPostions(id));
  // }, [dispatch, id]);

  useEffect(() => {
    if (loading === "fulfilled" && productParameterAndPositions) {
      setProductDetails(productParameterAndPositions);
    }
  }, [loading, productParameterAndPositions]);

  useEffect(() => {
    if (customizeProductCombination) {
      setattributePosition(customizeProductCombination.Front);
      setAttributePositionCB(customizeProductCombination.CB);
      setAttributePositionIB(customizeProductCombination.IB);
      setAttributePositionSAF(customizeProductCombination.SAF);

      setFormData({
        ShowSAF: customizeProductCombination?.ShowSAF,
        ShowIB: customizeProductCombination?.ShowIB,
        ShowCB: customizeProductCombination?.ShowCB,
      });
    }
  }, [customizeProductCombination]);

  useEffect(() => {
    dispatch(fetchCustomizeProductCombination(id));
  }, [dispatch, id]);

  // console.log(customizeProductCombination);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  const filterData = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [];
    }

    return arr
      .map((data) => {
        const positionId = data?.positionId?._id || null;
        const parameterId = data?.parameterId?._id || null;

        if (!positionId || !parameterId) {
          return null;
        }

        return {
          ...data,
          positionId,
          parameterId,
        };
      })
      .filter(Boolean); // Remove null values
  };

  const handleSave = async () => {
    try {
      const filteredAttributePosition = filterData(attributePosition);
      const filteredAttributePositionSAF = filterData(attributePositionSAF);
      const filteredAttributePositionCB = filterData(attributePositionCB);
      const filteredAttributePositionIB = filterData(attributePositionIB);

      if (filteredAttributePosition?.length === 0) {
        return toastError("Front combination is required!");
      }

      const newData = {
        productId: id,
        ShowSAF: filteredAttributePositionSAF?.length > 0,
        ShowIB: filteredAttributePositionIB?.length > 0,
        ShowCB: filteredAttributePositionCB?.length > 0,
        Front: filteredAttributePosition,
        SAF: filteredAttributePositionSAF,
        CB: filteredAttributePositionCB,
        IB: filteredAttributePositionIB,
      };

      dispatch(createCustomizeProductCombination(newData));
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  return (
    <>
      <SideBar />

      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <TopHeader />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div
                        className="main-title"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 className="m-0">{name}</h3>
                      </div>
                      <div>
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                          <Button
                            variant="contained"
                            color="warning"
                            style={{ padding: "5px 30px", fontSize: "1.3rem" }}
                            onClick={handleSave}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="d-flex gap-2 my-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ShowSAF"
                          name="ShowSAF"
                          disabled={true}
                          onChange={handleFormChange}
                          checked={ShowSAF || false}
                        />
                        <label className="form-check-label" htmlFor="ShowSAF">
                          SAF
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ShowCB"
                          name="ShowCB"
                          disabled={true}
                          onChange={handleFormChange}
                          checked={ShowCB || false}
                        />
                        <label className="form-check-label" htmlFor="ShowCB">
                          CB
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="ShowIB"
                          name="ShowIB"
                          disabled={true}
                          onChange={handleFormChange}
                          checked={ShowIB || false}
                        />
                        <label className="form-check-label" htmlFor="ShowIB">
                          IB
                        </label>
                      </div>
                    </div>
                    <div style={{ width: "100%" }}>
                      <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={value}
                          onChange={handleChange}
                          aria-label="basic tabs example"
                        >
                          <Tab label="Front" {...a11yProps(0)} />
                          <Tab label="SAF" {...a11yProps(1)} />
                          <Tab label="CB" {...a11yProps(2)} />
                          <Tab label="IB" {...a11yProps(3)} />
                        </Tabs>
                      </Card>

                      {/*  
                      <section
                        value={value}
                        index={0}
                        style={{ display: value === 0 ? "block" : "none" }}
                      >
                        {productDetails && productDetails.length > 0 && (
                          <div className="grid-container">
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                // width: "10%",
                              }}
                              // className="productVarientSetting"
                            >
                              Name
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                // width: "25%",
                              }}
                            >
                              <b>Select Parameter</b>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                // width: "25%",
                              }}
                            >
                              <b>Select Position</b>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                // width: "15%",
                              }}
                            >
                              <b>Start Position</b>
                              <br />
                              <b
                                style={{
                                  textAlign: "center",
                                  // fontSize: "12px",
                                }}
                              >
                                X-axis (%)
                              </b>
                            </div>
                            <div
                              style={{
                                textAlign: "center",
                                // width: "15%",
                              }}
                            >
                              <b>Start Position</b>
                              <br />
                              <b
                                style={{
                                  textAlign: "center",
                                  fontSize: "12px",
                                }}
                              >
                                Y-axis (%)
                              </b>
                            </div>

                            <div
                              style={{
                                textAlign: "center",
                                // width: "10%",
                              }}
                            >
                              <b>Applicable</b>
                            </div>

                            {productDetails.map((product, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    // className="productVarientSetting"
                                    style={{ color: "black" }}
                                  >
                                    {product?.attributeData?.Name}
                                  </td>

                                  <ProductSetting
                                    attributeData={product}
                                    AttributePositionName="attributePosition"
                                    Setting={attributePosition}
                                    productId={id}
                                    showField="FrontAttribute"
                                    id="FrontAttribute"
                                    setattributePosition={setattributePosition}
                                  />
                                </tr>
                              );
                            })}
                          </div>
                        )}
                      </section>
                      */}

                      <section
                        value={value}
                        index={0}
                        style={{ display: value === 0 ? "block" : "none" }}
                      >
                        {productDetails && productDetails.length > 0 && (
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                              <thead className="table table-bordered ">
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      width: "10%",
                                    }}
                                    // className="productVarientSetting"
                                  >
                                    Name
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Parameter</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Position</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      X-axis (%)
                                    </b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Y-axis (%)
                                    </b>
                                  </td>

                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "10%",
                                    }}
                                  >
                                    <b>Applicable</b>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {productDetails.map((product, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                        // className="productVarientSetting"
                                        style={{ color: "black" }}
                                      >
                                        {product?.attributeData?.Name}
                                      </td>

                                      <ProductSetting
                                        attributeData={product}
                                        AttributePositionName="attributePosition"
                                        Setting={attributePosition}
                                        productId={id}
                                        showField="FrontAttribute"
                                        id="FrontAttribute"
                                        setattributePosition={
                                          setattributePosition
                                        }
                                      />
                                    </tr>
                                  );
                                })}
                                <tr style={{ height: "150px" }}></tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>

                      <section
                        value={value}
                        index={1}
                        style={{ display: value === 1 ? "block" : "none" }}
                      >
                        {productDetails && productDetails.length > 0 && (
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                              <thead className="table table-bordered ">
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      width: "10%",
                                    }}
                                    // className="productVarientSetting"
                                  >
                                    Name
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Parameter</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Position</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      X-axis (%)
                                    </b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Y-axis (%)
                                    </b>
                                  </td>

                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "10%",
                                    }}
                                  >
                                    <b>Applicable</b>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {productDetails.map((product, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                      // className="productVarientSetting"
                                      // style={{ color: "white" }}
                                      >
                                        {product?.attributeData?.Name}
                                      </td>

                                      <ProductSetting
                                        attributeData={product}
                                        AttributePositionName="BackSAFPAQ"
                                        Setting={attributePositionSAF}
                                        productId={id}
                                        showField="BackSAF"
                                        id="FrontAttribute"
                                        setattributePosition={
                                          setAttributePositionSAF
                                        }
                                      />
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>

                      <section
                        value={value}
                        index={2}
                        style={{ display: value === 2 ? "block" : "none" }}
                      >
                        {productDetails && productDetails.length > 0 && (
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                              <thead className="table table-bordered ">
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      width: "10%",
                                    }}
                                    // className="productVarientSetting"
                                  >
                                    Name
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Parameter</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Position</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      X-axis (%)
                                    </b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Y-axis (%)
                                    </b>
                                  </td>

                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "10%",
                                    }}
                                  >
                                    <b>Applicable</b>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {productDetails.map((product, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                      // className="productVarientSetting"
                                      // style={{ color: "white" }}
                                      >
                                        {product?.attributeData?.Name}
                                      </td>
                                      <ProductSetting
                                        attributeData={product}
                                        AttributePositionName="BackCBPAQ"
                                        Setting={attributePositionCB}
                                        productId={id}
                                        showField="BackCB"
                                        setattributePosition={
                                          setAttributePositionCB
                                        }
                                      />
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>

                      <section
                        value={value}
                        index={3}
                        style={{ display: value === 3 ? "block" : "none" }}
                      >
                        {productDetails && productDetails.length > 0 && (
                          <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                              <thead className="table table-bordered ">
                                <tr>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      fontWeight: "bold",
                                      width: "10%",
                                    }}
                                    // className="productVarientSetting"
                                  >
                                    Name
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Parameter</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "25%",
                                    }}
                                  >
                                    <b>Select Position</b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      X-axis (%)
                                    </b>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "15%",
                                    }}
                                  >
                                    <b>Start Position</b>
                                    <br />
                                    <b
                                      style={{
                                        textAlign: "center",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Y-axis (%)
                                    </b>
                                  </td>

                                  <td
                                    style={{
                                      textAlign: "center",
                                      width: "10%",
                                    }}
                                  >
                                    <b>Applicable</b>
                                  </td>
                                </tr>
                              </thead>
                              <tbody>
                                {productDetails.map((product, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                      // className="productVarientSetting"
                                      // style={{ color: "white" }}
                                      >
                                        {product?.attributeData?.Name}
                                      </td>

                                      <ProductSetting
                                        attributeData={product}
                                        AttributePositionName="BackIBPAQ"
                                        Setting={attributePositionIB}
                                        productId={id}
                                        showField="BackIB"
                                        setattributePosition={
                                          setAttributePositionIB
                                        }
                                      />
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </section>
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
      <div id="back-top" style={{ display: "none" }}>
        <a title="Go to Top" href="google.com">
          <i className="ti-angle-up"></i>
        </a>
      </div>
    </>
  );
};

export default ProductCombination;
