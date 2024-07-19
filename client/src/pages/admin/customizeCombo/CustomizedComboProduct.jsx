import React, { useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { AiFillSetting } from "react-icons/ai";
import { useEffect } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import Preloader from "../../../components/preloader/Preloader";
import { TablePagination } from "@mui/material";
import { REACT_APP_URL } from "../../../config";
import {
  deleteCustomizedComboProduct,
  fetchCustomizedComboProduct,
} from "../../../redux/slices/customizeComboSlice";

const CustomizedComboProduct = () => {
  const {
    loading,
    customizedComboProduct,
    totalData,
    customizedComboProductId,
  } = useSelector((state) => state.customizeCombo);

  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [product, setProduct] = useState([]);
  const [searchText, setsearchtext] = useState("");
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    let currentPage = page?.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);

    dispatch(
      fetchCustomizedComboProduct({ searchData, currentPage, rowsPerPage })
    );
  }, [
    dispatch,
    searchData,
    page.currentPage,
    rowsPerPage,
    customizedComboProductId,
  ]);

  useEffect(() => {
    if (loading === "fulfilled" && customizedComboProduct?.length > 0) {
      setProduct(customizedComboProduct);
      setPage((prevState) => ({ ...prevState, totaltems: totalData }));
    }
  }, [loading, totalData, customizedComboProduct]);

  if (loading === "pending") {
    return <Preloader />;
  }

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
      dispatch(deleteCustomizedComboProduct(id));
    }
  };

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
                        <h3 className="m-0">Customized Combo Product</h3>
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
                              placeholder="Name"
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
                        <Link
                          to="/admin/add-customized-combo-product"
                          className="btn btn-outline-primary mb-3"
                        >
                          Add Product
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Product Details</th>
                            <th scope="col">Image</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product &&
                            product?.length > 0 &&
                            product.map((p, indx) => (
                              <tr key={p._id}>
                                <td>{index + indx}</td>
                                <td>
                                  <h5>
                                    Name:{" "}
                                    <span style={{ fontWeight: "normal" }}>
                                      {p?.Name}
                                    </span>
                                  </h5>
                                  <h5>
                                    Title:{" "}
                                    <span style={{ fontWeight: "normal" }}>
                                      {p?.Title}
                                    </span>
                                  </h5>
                                  <h5>
                                    Status:{" "}
                                    <span style={{ fontWeight: "normal" }}>
                                      {p?.status ? "Active" : "Inactive"}
                                    </span>
                                  </h5>
                                </td>

                                <td>
                                  <img
                                    src={`${REACT_APP_URL}/images/product/${p.image}`}
                                    alt={p.image}
                                    style={{ width: "200px", height: "210px" }}
                                  />
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
                                          <Link
                                            to={`/admin/edit-customized-combo-product/${p._id}`}
                                            className="dropdown-item"
                                          >
                                            Edit
                                          </Link>

                                          <a
                                            href={`/admin/customized-combo-product/rectangle/${p._id}`}
                                            className="dropdown-item"
                                          >
                                            Add Product
                                          </a>
                                          <li
                                            className="dropdown-item"
                                            onClick={() =>
                                              handleDeleteClick(p._id)
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
                      count={page.totaltems || 0}
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

export default CustomizedComboProduct;
