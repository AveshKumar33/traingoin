import SideBar from "../../../components/sidebar/SideBar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillSetting } from "react-icons/ai";
import { REACT_APP_URL } from "../../../config";
import SearchIcon from "@mui/icons-material/Search";
import { axiosInstance } from "../../../config";
import Select from "react-select";

import {
  deleteProduct,
  fetchProducts,
} from "../../../redux/slices/newProductSlice";
import { TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import "../../../index.css";
import Preloader from "../../../components/preloader/Preloader";
import {
  encryptData,
  decryptedData,
} from "../../../utils/useFullFunctions/encryptDecrypt";
// import ProductConfiguration from "./ProductConfiguration";

const Product = () => {
  const { loading, products, totalData, deletedProductId } = useSelector(
    (state) => state.newProducts
  );

  let queryParams = new URLSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [searchText, setsearchtext] = useState({ text: "" });
  const [searchData, setSearchData] = useState({ text: "", SelectedIds: [] });
  const [SelectedCollectionType, setSelectedCollectionType] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const dispatch = useDispatch();
  const createOption = (ele) => ({
    label: ele.title,
    value: ele._id,
  });

  useEffect(() => {
    const callInsuranceData = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/api/collection/getRootCollection"
        );

        if (data?.success) {
          const option = data?.data.map((ele) => createOption(ele));
          setSelectedCollectionType(option);
        }
      } catch (error) {
        console.log(error);
      }
    };
    callInsuranceData();
  }, [dispatch]);

  useEffect(() => {
    const { currentPage } = page;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);

    dispatch(
      fetchProducts({
        searchData: searchData?.text,
        currentPage,
        rowsPerPage,
        SelectedIds: searchData?.SelectedIds,
      })
    );
  }, [
    dispatch,
    searchData,
    page.currentPage,
    rowsPerPage,
    deletedProductId,
    page,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Clear existing parameters before appending new ones
    queryParams = new URLSearchParams();

    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
    let SelectedIds = selectedCollections.map((collection) => collection.value);

    SelectedIds.forEach((id) => {
      queryParams.append("railingoclc", encryptData(id));
    });

    if (searchText?.text) {
      queryParams.append("railingoprod", encryptData(searchText?.text));
    }

    queryParams.append("index", 0);

    navigate({
      search: queryParams.toString(),
      replace: true,
    });

    setSearchData({ text: searchText?.text, SelectedIds });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filteredId = searchParams.getAll("railingoclc");
    const filterText = searchParams.getAll("railingoprod");
    const filterIndex = searchParams.getAll("index");

    const decryptedDataList = {
      objectId: filteredId.map((id) => decryptedData(id)),
      text: filterText.map((text) => decryptedData(text)),
    };

    const selectedCollectionData = SelectedCollectionType.filter((collection) =>
      decryptedDataList.objectId.includes(collection.value)
    );

    if (selectedCollectionData.length > 0) {
      setSelectedCollections(selectedCollectionData);
    }

    const currentPage = filterIndex[0] || 0;

    setPage((prevState) => ({
      ...prevState,
      currentPage: Number(currentPage),
    }));

    setSearchData((prevState) => ({
      ...prevState,
      SelectedIds: decryptedDataList.objectId,
      text: decryptedDataList.text[0] || "",
    }));
    setsearchtext({ text: decryptedDataList.text[0] || "" });
  }, [location.search, SelectedCollectionType]);

  const handleChangePage = (event, newPage) => {
    const existingSearchParams = new URLSearchParams(location.search);
    existingSearchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });

    // Set the new page index
    queryParams.set("index", newPage);

    navigate({
      search: queryParams.toString(),
    });
    window.scrollTo(0, 0);

    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteProduct(id));
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
                <div className="white_card card_height_100 p-3">
                  <div className="">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h5 className="m-0">Products</h5>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {SelectedCollectionType &&
                          SelectedCollectionType?.length > 0 && (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <form
                                onSubmit={handleSearch}
                                style={{ display: "flex", gap: "2px" }}
                              >
                                <div style={{ width: "60%" }}>
                                  <div>
                                    <Select
                                      placeholder="Select collection"
                                      isMulti
                                      isClearable
                                      closeMenuOnSelect={true}
                                      options={SelectedCollectionType}
                                      onChange={(newValue) => {
                                        setSelectedCollections(newValue);
                                      }}
                                      value={selectedCollections}
                                      styles={{
                                        container: (provided) => ({
                                          ...provided,
                                          width: "100%",
                                        }),
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <input
                                    type="search"
                                    className="form-control"
                                    id="search"
                                    placeholder="Name"
                                    name="searchText"
                                    value={searchText?.text || ""}
                                    onChange={(e) =>
                                      setsearchtext((prev) => ({
                                        ...prev,
                                        text: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div>
                                  <button
                                    className="btn btn-success"
                                    type="submit"
                                  >
                                    <SearchIcon />
                                  </button>
                                </div>
                              </form>

                              <Link
                                to="/admin/add-product-new"
                                className="btn btn-outline-primary mb-3"
                              >
                                Add
                              </Link>
                            </div>
                          )}
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
                      <Link style={{ fontSize: 16 }}>Products</Link>{" "}
                    </p>
                  </div>
                  <div className="">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Dis.Seq.</th>
                            <th scope="col">Product</th>
                            <th scope="col">Video</th>
                            <th scope="col">Product Name</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Is Installment Available
                            </th>
                            <th scope="col" style={{ width: "15%" }}>
                              Featured Product
                            </th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Setting
                            </th>

                            {/* <th scope="col">Tags</th> */}

                            {/* <th scope="col">Vendor</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {products &&
                            products?.length > 0 &&
                            products.map((p, indx) => (
                              <tr key={p?._id}>
                                <th scope="row">{index + indx}</th>
                                <td className="">
                                  <p
                                    className="test-inline-ellipsis"
                                    style={{
                                      color: "black",
                                    }}
                                  >
                                    {p?.displaySequence}
                                  </p>
                                </td>
                                <td>
                                  {p?.ProductImage &&
                                    p?.ProductImage?.length > 0 && (
                                      <img
                                        src={`${REACT_APP_URL}/images/product/${p?.ProductImage[0]}`}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                        alt="_product"
                                      />
                                    )}
                                  &nbsp; &nbsp;
                                </td>
                                <td>
                                  {p?.video && (
                                    <iframe
                                      width="50px"
                                      height="50px"
                                      src={p?.video}
                                      title="YouTube video player"
                                      frameBorder="5"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    ></iframe>
                                  )}
                                </td>
                                <td className="">
                                  <p
                                    className="test-inline-ellipsis"
                                    style={{
                                      color: "black",
                                    }}
                                  >
                                    {p?.ProductName}
                                  </p>
                                </td>

                                <td>
                                  {p?.SellingType === "Installment"
                                    ? "Yes"
                                    : "No"}
                                </td>
                                <td>
                                  <button
                                    className={
                                      p?.ProductStatus
                                        ? "btn btn-success"
                                        : "btn btn-danger"
                                    }
                                    style={{
                                      fontSize: "10px",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    {p?.ProductStatus ? "Yes" : "No"}
                                  </button>
                                </td>
                                <td>
                                  <button
                                    className={
                                      p?.ProductStatus === "Active"
                                        ? "btn btn-success"
                                        : "btn btn-danger"
                                    }
                                    style={{ fontSize: "10px" }}
                                  >
                                    {p?.ProductStatus}
                                  </button>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <button className="icon-button">
                                      <div className="dropdown">
                                        <AiFillSetting
                                          role="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                          data-bs-reference="parent"
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            color: "#475B52",
                                          }}
                                        />

                                        <ul className="dropdown-menu">
                                          <div
                                            onClick={() =>
                                              navigate(
                                                `/admin/product/view-description/${p?._id}`
                                              )
                                            }
                                            className="dropdown-item"
                                          >
                                            View Description
                                          </div>
                                          <Link
                                            to={`/admin/product-new/combination/${p?._id}`}
                                            className="dropdown-item"
                                          >
                                            Product Combination
                                          </Link>

                                          <div
                                            onClick={() => {
                                              navigate(
                                                `/admin/edit-product-new/${p?._id}`
                                              );
                                            }}
                                            className="dropdown-item"
                                          >
                                            Edit
                                          </div>
                                          <li
                                            className="dropdown-item"
                                            onClick={() =>
                                              handleDeleteClick(p?._id)
                                            }
                                          >
                                            Delete
                                          </li>
                                        </ul>
                                      </div>
                                    </button>
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
                      count={page.totaltems || totalData}
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

export default Product;
