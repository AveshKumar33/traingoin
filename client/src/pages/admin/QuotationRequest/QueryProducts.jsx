import React, { useEffect, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { Link, useLocation } from "react-router-dom";
import Preloader from "../../../components/preloader/Preloader";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRequestForPriceProduct,
  deleteRaiseAQuery,
  updateRaiseAQuery,
} from "../../../redux/slices/raiseAQuerySlice";

import styles from "./style.module.css";

import Modal from "../../../UI/Modal";
import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import { ThreeDots } from "react-loader-spinner";

const QueryProducts = () => {
  const { allRequestForPriceProduct, loading } = useSelector(
    (state) => state.raiseQuery
  );

  const { userdetails } = useSelector((state) => state.auth);

  const location = useLocation();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") ?? "";
  const mobNo = searchParams.get("mobNo") ?? "";
  const [riseQueryData, setRiseQueryData] = useState([]);
  // const [discountValue, setDiscountValue] = useState(null);
  const [open, setOpen] = useState({
    isOpen: false,
    discountValue: null,
    id: "",
  });
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isArchitect, setIsArchitect] = useState(false);

  /** dispatch the getAllRequestForPriceProduct function  */
  useEffect(() => {
    dispatch(getAllRequestForPriceProduct({ Email: email, MobNumber: mobNo }));
  }, [dispatch, email, mobNo]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      const role = userdetails.userRole?.find(
        (role) => role?.name === "Architect"
      );
      setIsArchitect(role);
    }
  }, [userdetails]);

  /** set responce in state of getAllRequestForPriceProduct   */
  useEffect(() => {
    if (loading === "fulfilled" && allRequestForPriceProduct) {
      setRiseQueryData(allRequestForPriceProduct);
    }
  }, [loading, allRequestForPriceProduct]);

  function deleteProduct(id) {
    dispatch(deleteRaiseAQuery(id))
      .then(() =>
        dispatch(
          getAllRequestForPriceProduct({ Email: email, MobNumber: mobNo })
        )
      )
      .catch((error) => {
        console.log(error);
      });
  }

  const handleApplyDiscount = () => {
    try {
      if (open?.id) {
        dispatch(
          updateRaiseAQuery({
            id: open?.id,
            queryData: { discount: open?.discountValue },
          })
        );
      }
      setOpen({ isOpen: false, discountValue: "", id: "" });
    } catch (error) {
      console.log(error);
    }
  };

  function formateDateTime(date) {
    const utcDate = new Date(date);
    const indianLocaleTimeString = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    return indianLocaleTimeString;
  }

  const handleDownloadQuotation = async (productType, id, clientName) => {
    try {
      setDownloading(true);
      const response = await axiosInstance.get(
        `api/pdf/quotation/${productType}/${id}`,
        {
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const a = document.createElement("a");
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      a.href = pdfUrl;
      a.download = clientName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
    setDownloading(false);
  };

  return (
    <>
      {loading === "pending" && <Preloader />}
      {open?.isOpen && (
        <Modal>
          <Grid
            container
            spacing={{ xs: 1, md: 1 }}
            columns={{ xs: 6, sm: 6, md: 6 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Typography
                variant="body"
                display="block"
                gutterBottom
                textAlign="center"
              >
                Add Discount (in %)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Box display="flex" justifyContent="center">
                <TextField
                  id="outlined-basic"
                  type="number"
                  size="small"
                  variant="outlined"
                  className={styles["no-spin"]}
                  value={open?.discountValue || " "}
                  onChange={(e) => {
                    if (
                      isArchitect &&
                      userdetails &&
                      userdetails?.maxDiscount
                    ) {
                      setError(true);
                      return;
                    }
                    setOpen((prevState) => ({
                      ...prevState,
                      discountValue: e.target.value,
                    }));
                  }}
                  helperText={
                    error
                      ? `Discount value can't be greater than ${userdetails?.maxDiscount}`
                      : ""
                  }
                />
              </Box>
            </Grid>
          </Grid>
          <Grid
            container
            style={{ marginTop: "10px" }}
            columns={{ xs: 12, sm: 12, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
              <Button
                color="success"
                sx={{ marginRight: 1 }}
                variant="contained"
                onClick={handleApplyDiscount}
              >
                Apply
              </Button>
              <Button
                color="warning"
                variant="contained"
                type="button"
                onClick={() => {
                  // setEditedTag({ id: "", tagName: "" });
                  setOpen({ isOpen: false, discountValue: "", id: "" });
                }}
              >
                Cancle
              </Button>
            </Grid>
          </Grid>
        </Modal>
      )}
      <SideBar />
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Query Details</h3>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#eee",
                      padding: "10px 0px 10px 10px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        padding: "0px",
                        margin: "0px",
                      }}
                    >
                      <b>Name : </b> {riseQueryData[0]?.Name}{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <b>Mobile No. : </b> {riseQueryData[0]?.Email}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <b>Mobile No. : </b> {riseQueryData[0]?.MobNumber}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </p>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col" style={{ width: "5%" }}>
                              #
                            </th>
                            <th scope="col" style={{ width: "17%" }}>
                              Date
                            </th>
                            <th scope="col" style={{ width: "25%" }}>
                              Name
                            </th>
                            <th scope="col" style={{ width: "10%" }}>
                              Discount
                            </th>
                            <th scope="col" style={{ width: "38%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {riseQueryData &&
                            riseQueryData?.length > 0 &&
                            riseQueryData?.map((product, index) => (
                              <tr key={product._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{formateDateTime(product?.createdAt)}</td>
                                <td>
                                  {product?.customizedProductId
                                    ? product?.customizedProductId?.ProductName
                                    : product?.singleProductId?.ProductName}
                                </td>
                                <td>{product?.discount}%</td>

                                <td>
                                  {product?.customizedProductId
                                    ?.isCustomizedProduct ? (
                                    <span key={index}>
                                      <button
                                        className="btn btn-danger mx-1"
                                        onClick={() =>
                                          deleteProduct(product?._id)
                                        }
                                        style={{
                                          color: "#fff",
                                        }}
                                      >
                                        Delete
                                      </button>
                                      <Link
                                        className="btn btn-success"
                                        to={`/customized-product/${product?.customizedProductId?.Collection[0]?.url}/${product?.customizedProductId?.Urlhandle}?rfp_id=${product?._id}`}
                                        target="_blank"
                                        style={{
                                          color: "#fff",
                                        }}
                                      >
                                        View
                                      </Link>
                                      <button
                                        className="btn btn-warning mx-1"
                                        onClick={() =>
                                          setOpen({
                                            isOpen: true,
                                            discountValue: product?.discount,
                                            id: product?._id,
                                          })
                                        }
                                      >
                                        Add Discount
                                      </button>
                                      <button
                                        className="btn btn-success mx-1"
                                        onClick={() =>
                                          handleDownloadQuotation(
                                            "customizeProduct",
                                            product?._id,
                                            product?.Name
                                          )
                                        }
                                        target="_blank"
                                        style={{
                                          color: "#fff",
                                        }}
                                        disabled={downloading}
                                      >
                                        Quotation
                                      </button>
                                    </span>
                                  ) : (
                                    <span key={index}>
                                      <button
                                        className="btn btn-danger mx-1"
                                        onClick={() =>
                                          deleteProduct(product._id)
                                        }
                                        // style={{
                                        //   color: "#fff",
                                        // }}
                                      >
                                        Delete
                                      </button>

                                      <Link
                                        className="btn btn-success"
                                        target="_blank"
                                        to={`/product/${product?.singleProductId?.Collection[0]?.url}/${product?.singleProductId?.Urlhandle}?rfp_id=${product?._id}`}
                                        style={{
                                          color: "#fff",
                                        }}
                                      >
                                        View
                                      </Link>
                                      <button
                                        className="btn btn-warning mx-1"
                                        onClick={() =>
                                          setOpen({
                                            isOpen: true,
                                            discountValue: product?.discount,
                                            id: product?._id,
                                          })
                                        }
                                      >
                                        Add Discount
                                      </button>
                                      <button
                                        className="btn btn-success mx-1"
                                        target="_blank"
                                        style={{
                                          color: "#fff",
                                        }}
                                        disabled={downloading}
                                        onClick={() =>
                                          handleDownloadQuotation(
                                            "singleProduct",
                                            product?._id,
                                            product?.Name
                                          )
                                        }
                                      >
                                        Quotation
                                      </button>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default QueryProducts;
