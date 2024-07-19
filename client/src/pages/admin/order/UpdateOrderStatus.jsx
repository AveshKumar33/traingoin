import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "../../../../../client/src/components/order/OrderProducts.css";
import TopHeader from "../../../components/topheader/TopHeader";
import SideBar from "../../../components/sidebar/SideBar";
import { toastError } from "../../../utils/reactToastify";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { REACT_APP_URL } from "../../../config";
import Preloader from "../../../components/preloader/Preloader";
import {
  fetchOrderProductByOrderItemId,
  updateOrder,
} from "../../../redux/slices/orderSlice";
import { fetchOrderStatus } from "../../../redux/slices/orderStatusSlice";
import CustomizedCombinationImage from "../../client/whislist/CustomizedCombinationImage";
import {
  Button,
  Grid,
  CardContent,
  Autocomplete,
  TextField,
} from "@mui/material";

const initialState = {
  selectedStatus: null,
  message: "",
};

const UpdateOrderStatus = () => {
  const { productType, orderId, orderItemId } = useParams();
  const {
    loading: productLoading,
    orderProducts,
    product,
  } = useSelector((state) => state.orders);
  const { loading, orderStatus } = useSelector((state) => state.orderStatus);

  const [status, setStatus] = useState([]);
  const [currentData, setCurrentData] = useState(initialState);
  const [selectedData, setSelectedData] = useState([]);
  const [orderData, setOrderData] = useState();
  const [orderedProduct, setOrderedProduct] = useState();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrderStatus());
  }, [dispatch]);

  useEffect(() => {
    if (productType && orderId && orderItemId) {
      dispatch(
        fetchOrderProductByOrderItemId({ productType, orderId, orderItemId })
      );
    }
  }, [dispatch, productType, orderId, orderItemId]);

  useEffect(() => {
    if (loading === "fulfilled" && product && product?.length > 0) {
      setOrderedProduct(product[0]);
    }
  }, [loading, product]);
  useEffect(() => {
    if (loading === "fulfilled" && orderStatus && orderStatus?.length > 0) {
      setStatus(orderStatus);
    }
  }, [loading, orderStatus]);

  useEffect(() => {
    if (
      productLoading === "fulfilled" &&
      orderProducts &&
      orderProducts?.length > 0
    ) {
      setOrderData(orderProducts[0]);
    }
  }, [productLoading, orderProducts]);

  const removeHandler = (index) => {
    const selectedDataArr = [...selectedData];
    selectedDataArr.splice(index, 1);
    setSelectedData([...selectedDataArr]);
  };

  const addHandler = (e) => {
    e.preventDefault();
    if (!currentData?.selectedStatus) {
      return toastError("Please  Slectct Status");
    }
    setSelectedData((prevState) => [...prevState, currentData]);
    // setFilter([...Filter, FiltersName]);

    setCurrentData(initialState);
    // setFilterName("");
  };

  const editHandler = (data, index) => {
    const selectedDataArr = [...selectedData];
    selectedDataArr.splice(index, 1);
    setSelectedData([...selectedDataArr]);
    setCurrentData(data);
  };

  const updateHandler = () => {
    try {
      if (selectedData && selectedData?.length > 0) {
        const statusData = selectedData.map((data) => ({
          status: data?.selectedStatus?._id,
          message: data?.message,
        }));
        dispatch(
          updateOrder({ id: orderId, orderItemId, orderdata: statusData })
        );

        const data = selectedData.map((data) => ({
          status: data?.selectedStatus,
          message: data?.message,
        }));

        const updatedStatus = [...orderedProduct.status, ...data];

        setOrderedProduct((prevOrderData) => ({
          ...prevOrderData,
          status: updatedStatus,
        }));

        setSelectedData([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
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
                        <h3 className="m-0">Update Order Status</h3>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#fff",
                              color: "#475B52",
                              width: "15%",
                            }}
                          >
                            Order Id
                          </th>
                          <th
                            style={{
                              backgroundColor: "#fff",
                              color: "#475B52",
                            }}
                          >
                            Name
                          </th>
                          <th
                            style={{
                              backgroundColor: "#fff",
                              color: "#475B52",
                            }}
                          >
                            Mobile No.
                          </th>
                          {orderData?.alternatePhoneNumber && (
                            <th
                              style={{
                                backgroundColor: "#fff",
                                color: "#475B52",
                              }}
                            >
                              Alternate Mobile No.
                            </th>
                          )}

                          <th
                            style={{
                              backgroundColor: "#fff",
                              color: "#475B52",
                            }}
                          >
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData && (
                          <tr>
                            <td>{orderData?.orderId}</td>
                            <td>
                              {orderData?.firstName} {orderData?.lastName}
                            </td>
                            <td>{orderData?.phoneNumber}</td>
                            {orderData?.alternatePhoneNumber && (
                              <td>{orderData?.alternatePhoneNumber}</td>
                            )}
                            <td>₹ {orderData?.amount}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <hr />
                    {productType === "singleProducts" && orderedProduct && (
                      <div className="col-lg-8" style={{ float: "left" }}>
                        <img
                          src={`${REACT_APP_URL}/images/product/${orderedProduct?.image}`}
                          alt="img25"
                          style={{ width: "100%", height: "80vh" }}
                        />
                        {/* <div style={{ paddingTop: "10px" }}>
                          <p style={{ fontSize: "20px", fontWeight: "600" }}>
                            {orderedProduct?.singleProductId?.ProductName}
                          </p>
                          <p style={{ fontSize: "18px" }}>
                            ₹ {orderedProduct?.productAmount}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                            {orderedProduct?.quantity}
                          </p>
                        </div> */}
                      </div>
                    )}
                    {productType === "customizeProducts" && orderedProduct && (
                      <div className="col-lg-8" style={{ float: "left" }}>
                        <ImageCreation
                          customuizedProductFront={
                            orderedProduct?.FrontCombinations
                          }
                        />
                        {/* <div style={{ paddingTop: "10px" }}>
                          <p style={{ fontSize: "20px", fontWeight: "600" }}>
                            {orderedProduct?.customizeProduct?.ProductName}
                          </p>
                          <p style={{ fontSize: "18px" }}>
                            ₹ {orderedProduct?.productAmount}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                            {orderedProduct?.quantity}
                          </p>
                        </div> */}
                      </div>
                    )}

                    {(productType === "singleDotProducts" ||
                      productType === "customizeDotProducts") &&
                      orderedProduct && (
                        <div
                          className="col-lg-8 ImageContainer"
                          style={{ position: "relative", float: "left" }}
                        >
                          <img
                            loading="lazy"
                            src={`${REACT_APP_URL}/images/dotimage/${orderedProduct?.dotProductImageIds[0]?.image}`}
                            className="card-img-top RoomIdeaImageStyle"
                            alt={orderedProduct?.name}
                            style={{ width: "100%", height: "80vh" }}
                          />

                          {/* <div style={{ paddingTop: "10px" }}>
                            <p style={{ fontSize: "20px", fontWeight: "600" }}>
                              {product?.name}
                            </p>
                            <p style={{ fontSize: "18px" }}>
                              ₹ {orderedProduct?.productAmount}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                              {orderedProduct?.quantity}
                            </p>
                          </div> */}
                        </div>
                      )}

                    {productType === "customizeComboProducts" &&
                      orderedProduct && (
                        <div
                          className="col-lg-8 ImageContainer"
                          style={{ position: "relative", float: "left" }}
                        >
                          {orderedProduct?.customizedComboId?.image && (
                            <img
                              loading="lazy"
                              src={`${REACT_APP_URL}/images/product/${orderedProduct?.customizedComboId?.image}`}
                              alt="Image_From_Server"
                              className="img-fluid"
                              style={{ width: "100%", height: "80vh" }}
                            />
                          )}
                          {orderedProduct?.customizedComboRectangle &&
                            orderedProduct?.customizedComboRectangle?.length >
                              0 &&
                            orderedProduct?.customizedComboRectangle?.map(
                              (p, i) => {
                                return (
                                  <div key={i}>
                                    <CustomizedCombinationImage
                                      id={p?.customizedComboRectangleId?._id}
                                      productId={product?._id}
                                      index={i}
                                      customuizedProduct={
                                        p?.customizedProductId
                                      }
                                      combination={p}
                                      key={p?._id}
                                      PositionX={
                                        p?.customizedComboRectangleId?.top
                                      }
                                      PositionY={
                                        p?.customizedComboRectangleId?.left
                                      }
                                      Height={
                                        p?.customizedComboRectangleId?.height
                                      }
                                      Width={
                                        p?.customizedComboRectangleId?.width
                                      }
                                      updateTotalPrice={() => {}}
                                      setCustomizedCombination={() => {}}
                                    />
                                  </div>
                                );
                              }
                            )}
                          {/* <div style={{ paddingTop: "10px" }}>
                            <p style={{ fontSize: "20px", fontWeight: "600" }}>
                              {orderedProduct?.customizedComboId?.Name}
                            </p>
                            <p style={{ fontSize: "18px" }}>
                              ₹ {orderedProduct?.productAmount}
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                              {orderedProduct?.quantity}
                            </p>
                          </div> */}
                        </div>
                      )}
                    <div className="col-lg-4" style={{ float: "left" }}>
                      <section className="root122">
                        {/* <h4 style={{textAlign:"center"}}>Order Status</h4> */}
                        <figure className="figure12">
                          {/* <img src="#" alt="" /> */}
                          <figcaption>
                            {productType === "singleProducts" &&
                              orderedProduct && (
                                <>
                                  <h2 style={{ fontWeight: "600" }}>
                                    {
                                      orderedProduct?.singleProductId
                                        ?.ProductName
                                    }
                                  </h2>
                                  <h2>
                                    ₹ {orderedProduct?.productAmount}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                                    {orderedProduct?.quantity}
                                  </h2>
                                </>
                              )}
                            {productType === "customizeProducts" &&
                              orderedProduct && (
                                <>
                                  <h2 style={{ fontWeight: "600" }}>
                                    {
                                      orderedProduct?.customizeProduct
                                        ?.ProductName
                                    }
                                  </h2>
                                  <h2>
                                    ₹ {orderedProduct?.productAmount}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                                    {orderedProduct?.quantity}
                                  </h2>
                                </>
                              )}
                            {(productType === "singleDotProducts" ||
                              productType === "customizeDotProducts") &&
                              orderedProduct && (
                                <>
                                  <h2 style={{ fontWeight: "600" }}>
                                    {product?.name}
                                  </h2>
                                  <h2>
                                    ₹ {orderedProduct?.productAmount}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                                    {orderedProduct?.quantity}
                                  </h2>
                                </>
                              )}
                            {productType === "customizeComboProducts" &&
                              orderedProduct && (
                                <>
                                  <h2 style={{ fontWeight: "600" }}>
                                    {orderedProduct?.customizedComboId?.Name}
                                  </h2>
                                  <h2>
                                    ₹ {orderedProduct?.productAmount}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Qty :{" "}
                                    {orderedProduct?.quantity}
                                  </h2>
                                </>
                              )}
                          </figcaption>
                        </figure>
                        <div
                          className="order-track"
                          style={{ overflowY: "scroll", height: "75vh" }}
                        >
                          {orderedProduct &&
                            orderedProduct.status?.length > 0 && (
                              <>
                                {orderedProduct.status.map((status, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="order-track-step"
                                    >
                                      <div className="order-track-status">
                                        <span className="order-track-status-dot" />
                                        <span className="order-track-status-line" />
                                      </div>
                                      <div
                                        className="order-track-text"
                                        style={{
                                          overflowY:
                                            (status?.message || "").length > 100
                                              ? "scroll"
                                              : "visible",
                                          maxHeight:
                                            (status?.message || "").length > 100
                                              ? "200px"
                                              : "auto",
                                        }}
                                      >
                                        <p
                                          className="order-track-text-stat"
                                          style={{ fontWeight: "600" }}
                                        >
                                          {status?.status?.name}
                                        </p>
                                        <span
                                          className="order-track-text-sub"
                                          style={{
                                            color: "darkgray",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {status?.message}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                        </div>
                      </section>

                      {/* {orderedProduct && orderedProduct.status?.length > 0 && (
                        <div className="mt-2">
                          <h5>Status</h5>
                          {orderedProduct.status.map((status, index) => {
                            return (
                              <div
                                key={index}
                                style={{ display: "flex", gap: "10px" }}
                              >
                                <div>{status?.status?.name}</div>{" "}
                                <div>{status?.message}</div>
                              </div>
                            );
                          })}
                        </div>
                      )} */}
                    </div>
                  </div>

                  <div className="container">
                    <form onSubmit={addHandler} style={{ paddingLeft: "12%" }}>
                      <CardContent>
                        <Grid container spacing={2} wrap="wrap">
                          <Grid item md={4} sm={4} xs={12}>
                            <Autocomplete
                              fullWidth
                              // disableCloseOnSelect
                              size="small"
                              id="status"
                              value={currentData?.selectedStatus}
                              label="Select Status"
                              name="staus"
                              options={status || []}
                              getOptionLabel={(option) => option?.name}
                              isOptionEqualToValue={(option, value) =>
                                option?._id === value?._id
                              }
                              filterSelectedOptions
                              onChange={(event, value) =>
                                setCurrentData((prevState) => ({
                                  ...prevState,
                                  selectedStatus: value,
                                }))
                              }
                              renderInput={(params) => (
                                <TextField {...params} label="Select Status" />
                              )}
                              required
                            />
                          </Grid>
                          <Grid item md={4} sm={4} xs={12}>
                            <TextField
                              // error={errors.standard ? true : false}
                              sx={{ width: "100%" }}
                              id="outlined-basic"
                              size="small"
                              label="Message"
                              variant="outlined"
                              focused={currentData?.message !== ""}
                              value={currentData?.message || ""}
                              onChange={(e) =>
                                setCurrentData((prevState) => ({
                                  ...prevState,
                                  message: e.target.value,
                                }))
                              }
                              // helperText={errors.standard ? "Field is required!" : ""}
                            />
                          </Grid>
                          <Grid item md={4} sm={4} xs={12}>
                            <Button
                              className="btn mybtn"
                              type="submit"
                              style={{
                                color: "#fff",
                                backgroundColor: "green",
                              }}
                            >
                              Add Status
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </form>
                    <div className="card-body CreateCard">
                      <div className="row mx-2 ">
                        <div
                          className="col-md-12 align-items-center"
                          style={{ marginTop: "20px" }}
                        >
                          {
                            <table className="table table-striped table-bordered overflow-x mt-3">
                              <thead>
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Message</th>
                                  {<th scope="col">Action</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {selectedData.map((ele, index) => (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{ele?.selectedStatus?.name}</td>
                                    <td>{ele?.message}</td>

                                    {
                                      <td>
                                        <BiEdit
                                          size={32}
                                          style={{
                                            backgroundColor: "green",
                                            color: "#fff",
                                            padding: "5px",
                                            borderRadius: "5px",
                                            marginTop: "-5px",
                                          }}
                                          onClick={() =>
                                            editHandler(ele, index)
                                          }
                                        />
                                        &nbsp;
                                        <AiFillDelete
                                          size={32}
                                          style={{
                                            backgroundColor: "#A50406",
                                            color: "#fff",
                                            padding: "5px",
                                            borderRadius: "5px",
                                            marginTop: "-5px",
                                          }}
                                          onClick={() => {
                                            const isTrue = window.confirm(
                                              "Do you want to delete!"
                                            );
                                            if (isTrue) {
                                              removeHandler(index);
                                            }
                                          }}
                                        />
                                      </td>
                                    }
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="m-3 p-2 text-center ">
                      <Button
                        variant="contained"
                        sx={{ borderRadius: 0, px: 3 }}
                        type="submit"
                        className="btn btn-primary"
                        onClick={updateHandler}
                      >
                        Save
                      </Button>
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
                    <a href="http://marwariplus.com/">InnovateX Technology</a>
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

export default UpdateOrderStatus;

const ImageCreation = ({ customuizedProductFront }) => {
  return (
    <>
      <div
        style={{
          position: "relative", // Add position relative to contain absolute positioning of child images
          // height: "80vh",
          backgroundColor: "transparent",
        }}
      >
        {customuizedProductFront &&
          customuizedProductFront.length > 0 &&
          customuizedProductFront.map((img, i) => (
            <img
              key={i}
              src={`${REACT_APP_URL}/images/parameterPosition/${img?.pngImage}`}
              alt="Preview"
              style={{
                position: i === 0 ? "relative" : "absolute", // Position images absolutely within the parent div
                top: 0,
                left: 0,
                width: "100%",
                height: "80vh",
                objectFit: "cover", // Ensure the image fills its container without distortion
                zIndex: img?.attributeId?.BurgerSque, // Use zIndex from the image attribute
              }}
            />
          ))}
      </div>
    </>
  );
};
