import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TablePagination } from "@mui/material";
import { REACT_APP_URL } from "../../../config";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";

import { useDispatch } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../../config";

// import { AiTwotoneDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import "./product.css";
import WaningModal from "../../../UI/Modal";

import Backdrop from "@mui/material/Backdrop";
import { Box, Chip, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import { toastError, toastSuceess } from "../../../utils/reactToastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: "5px",
};

const ProductCombination = () => {
  const { id } = useParams();

  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [searchText, setsearchtext] = useState("");
  const [searchData, setSearchData] = useState("");
  const [updatedData, setUpdatedData] = useState();
  const [dataToMakeDefault, setDataToMakeDefault] = useState();
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  const [profileImage, setprofileImage] = useState({
    profileImage: "",
    preview: "",
  });

  const initialState = {
    _id: "",
    SKU: "",
    Barcode: "",
    MRP: "",
    SalePrice: "",
    ProductInStockQuantity: "",
  };

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(true);
  const [combinations, setCombinations] = useState();

  const [open, setOpen] = React.useState(false);

  const handleOpen = (data) => {
    setFormData({
      _id: data._id,
      SKU: data?.SKU,
      Barcode: data?.Barcode,
      MRP: data?.MRP,
      SalePrice: data?.SalePrice,
      ProductInStockQuantity: data?.ProductInStockQuantity,
    });
    setprofileImage({
      profileImage: data?.image,
      preview: "",
    });
    setOpen(true);
  };
  const handleClose = () => {
    setFormData(initialState);
    setOpen(false);
  };

  const dispatch = useDispatch();

  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const getData = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.get(
        `api/single-product-combination/${id}`
      );

      setCombinations(data.data);
      setLoading(false);

      // toastSuceess(data.message);
    } catch (error) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const currentPage = page?.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);
    getData();
  }, [
    dispatch,
    getData,
    searchData,
    page.currentPage,
    rowsPerPage,
    updatedData,
  ]);

  useEffect(() => {
    if (!loading) {
      setPage((prevState) => ({
        ...prevState,
        totaltems: combinations?.length,
      }));
    }
  }, [loading, combinations?.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
    setSearchData(searchText);
  };

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      //   dispatch(deletecombination(id));

      toast.success("Attribute Item Deleted Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleConfirmDefaultHandler = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/api/single-product-combination/${id}/${dataToMakeDefault}`,
        { isDefault: true },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        setUpdatedData(data?.data);
        toastSuceess(data.message);
        setIsWarningModalOpen(false);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
    // await dispatch(
    //   updateDataById({
    //     path: "/session",
    //     id: dataToActive?.id,
    //     data: formData,
    //   })
    // ).unwrap();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let combinationData = new FormData();

      const { _id, SKU, Barcode, MRP, SalePrice, ProductInStockQuantity } =
        formData;

      if (Number(MRP) < Number(SalePrice)) {
        return toastError("Sales price can't be greater than MRP!");
      }

      combinationData.append("SKU", SKU);
      combinationData.append("Barcode", Barcode);
      combinationData.append("SalePrice", SalePrice);
      combinationData.append("MRP", MRP);
      combinationData.append("ProductInStockQuantity", ProductInStockQuantity);
      combinationData.append("image", profileImage?.profileImage);

      const { data } = await axiosInstance.put(
        `api/single-product-combination/${_id}`,
        combinationData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        setUpdatedData(data?.data);
        toastSuceess(data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const closeActiveModal = () => setIsWarningModalOpen(false);

  return (
    <section className="">
      {isWarningModalOpen && (
        <WaningModal>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              active this combination
            </p>
            <Button
              color="success"
              sx={{ marginRight: 1 }}
              variant="contained"
              onClick={handleConfirmDefaultHandler}
            >
              Yes
            </Button>
            <Button
              color="warning"
              variant="contained"
              type="button"
              onClick={closeActiveModal}
            >
              Close
            </Button>
          </div>
        </WaningModal>
      )}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <h6
                  style={{
                    backgroundColor: "#475B52",
                    padding: "15px",
                    color: "#fff",
                  }}
                >
                  EDIT
                </h6>
                <div className="row ">
                  <div className="col-md-6">
                    {" "}
                    <label className="form-label" htmlFor="instockquantity">
                      Instock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      className="form-control"
                      id="instockquantity"
                      name="ProductInStockQuantity"
                      value={formData?.ProductInStockQuantity}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="Shipping">
                      SKU
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Shipping"
                      name="SKU"
                      value={formData?.SKU}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="Barcode">
                      Barcode
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Barcode"
                      name="Barcode"
                      value={formData?.Barcode}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-6 mt-1">
                    <label className="form-label" htmlFor="MRP">
                      MRP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="MRP"
                      required
                      name="MRP"
                      value={formData?.MRP}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-6 mt-1">
                    <label className="form-label" htmlFor="SalePrice">
                      SalePrice
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="SalePrice"
                      required
                      name="SalePrice"
                      value={formData?.SalePrice}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label" htmlFor="Title">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="Title"
                      placeholder="Image"
                      name="profileImage"
                      onChange={(e) =>
                        setprofileImage({
                          profileImage: e.target.files[0],
                          preview: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                    />

                    {profileImage?.preview ? (
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          marginTop: "10px",
                        }}
                        src={profileImage.preview}
                        alt="_profilemm"
                      />
                    ) : (
                      <img
                        style={{
                          width: "100px",
                          height: "100px",
                          marginTop: "10px",
                        }}
                        src={`${REACT_APP_URL}/images/product/${profileImage?.profileImage}`}
                        alt="_combin"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <button type="submit" className="btn btn-primary mt-4">
                  Save
                </button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>

      <Header />
      <div className="main_content_iner">
        <div className="container-fluid p-2">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="white_card card_height_100 mb_30">
                <div className="p-2">
                  <div className="box_header m-0">
                    <div className="main-title">
                      <h3 className="m-0">Combination</h3>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <form
                        onSubmit={handleSearch}
                        style={{ display: "flex", gap: "2px" }}
                      >
                        <div>
                          <input
                            type="search"
                            className="form-control"
                            id="search"
                            placeholder="Name/Price"
                            name="searchText"
                            value={searchText || ""}
                            onChange={(e) => setsearchtext(e.target.value)}
                          />
                        </div>
                        <div>
                          <button className="btn btn-success" type="submit">
                            <SearchIcon />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <p>
                    <Link to={`/`} style={{ color: "#707087", fontSize: 16 }}>
                      <i className="fa-solid fa-house-user"></i>
                    </Link>{" "}
                    &nbsp;
                    <i
                      className="fa fa-chevron-right"
                      style={{ fontSize: 16 }}
                    />{" "}
                    <Link style={{ fontSize: 16 }} to="/admin/product-new">
                      Product
                    </Link>{" "}
                    &nbsp;
                    <i
                      className="fa fa-chevron-right"
                      style={{ fontSize: 16 }}
                    />{" "}
                    <Link style={{ fontSize: 16 }}>Product Combination</Link>{" "}
                  </p>
                </div>

                <div className="">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col" style={{ width: "10%" }}>
                            Sr. No.
                          </th>
                          {/* <th scope="col">PNG</th> */}
                          <th scope="col" style={{ width: "40%" }}>
                            Name
                          </th>
                          <th scope="col" style={{ width: "30%" }}>
                            PNG
                          </th>
                          <th scope="col" style={{ width: "30%" }}>
                            Is Default
                          </th>
                          <th scope="col" style={{ width: "20%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {combinations &&
                          combinations.length > 0 &&
                          combinations.map((combination, idx) => (
                            <tr
                              key={idx}
                              className={
                                combination?.status === 0 ? "inactive" : ""
                              }
                            >
                              <th scope="row">{index + idx}</th>
                              <td>
                                <h5>
                                  Product Name:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {combination?.singleProductId?.ProductName}
                                  </span>
                                </h5>
                                {combination?.combinations?.map(
                                  (combination, index) => {
                                    return (
                                      <h5 key={index}>
                                        {`Parameter${index + 1} :`}
                                        <span style={{ fontWeight: "normal" }}>
                                          {combination?.parameterId?.name}
                                        </span>
                                      </h5>
                                    );
                                  }
                                )}
                                <h5>
                                  MRP:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {combination?.MRP}
                                  </span>
                                </h5>
                                <h5>
                                  Sell Price:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {combination?.SalePrice}
                                  </span>
                                </h5>
                                <h5>
                                  Product InStock Quantity:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {combination?.ProductInStockQuantity}
                                  </span>
                                </h5>

                                <h5>
                                  Default:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {combination.isDefault ? "true" : "false"}
                                  </span>
                                </h5>

                                <h5>
                                  Product Status:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {
                                      combination?.singleProductId
                                        ?.ProductStatus
                                    }
                                  </span>
                                </h5>
                              </td>
                              <td>
                                <img
                                  src={`${REACT_APP_URL}/images/product/${combination?.image}`}
                                  className="card-img-top img-fluid"
                                  alt={combination?.profileImage}
                                  style={{
                                    maxWidth: "150px",
                                    maxHeight: "200px",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                              <td>
                                {combination.isDefault ? (
                                  <Chip
                                    label="Yes"
                                    style={{
                                      backgroundColor: "#4caf50",
                                      color: "white",
                                    }}
                                    size="small"
                                  />
                                ) : (
                                  <Chip
                                    label="No"
                                    onClick={() => {
                                      if (
                                        combination?.ProductInStockQuantity ===
                                        0
                                      ) {
                                        return toastError(
                                          "Stock Quantity is 0!"
                                        );
                                      }
                                      setIsWarningModalOpen(true);
                                      setDataToMakeDefault(combination?._id);
                                    }}
                                    style={{
                                      backgroundColor: "#f44336",
                                      color: "white",
                                    }}
                                    size="small"
                                  />
                                )}
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                  }}
                                >
                                  {/* <span
                                    style={{
                                      backgroundColor: "#dc3545",
                                      padding: "7px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                    }}
                                    onClick={() =>
                                      handleDeleteClick(combination?._id)
                                    }
                                  >
                                    <AiTwotoneDelete />
                                  </span> */}

                                  <span
                                    style={{
                                      backgroundColor: "#198754",
                                      padding: "7px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                    }}
                                    onClick={() => {
                                      handleOpen(combination);
                                    }}
                                  >
                                    <FiEdit />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#1a2e45d7",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start",
                    marginTop: "5px",
                  }}
                >
                  <TablePagination
                    component="div"
                    className="text-white"
                    rowsPerPageOptions={[20, 25, 100, 200, 500]}
                    count={page.totaltems}
                    rowsPerPage={rowsPerPage}
                    page={page.currentPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default ProductCombination;
