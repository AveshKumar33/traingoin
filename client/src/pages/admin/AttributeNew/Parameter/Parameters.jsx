import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TablePagination } from "@mui/material";
import { REACT_APP_URL } from "../../../../config";
import SearchIcon from "@mui/icons-material/Search";
import Footer from "../../../../components/footer/Footer";
import Header from "../../../../components/header/Header";
import {
  fetchParametersByAttributeId,
  deleteParameter,
} from "../../../../redux/slices/parameterSlice";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

import { AiTwotoneDelete } from "react-icons/ai";
import "../Attribute.css";
// import { toastError, toastSuceess } from "../../../../utils/reactToastify";

const Parameters = () => {
  const { Name: attributeName, id, isVisibleInCustomized } = useParams();
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [searchText, setsearchtext] = useState("");
  const [searchData, setSearchData] = useState("");

  const { loading, parameters, totalData, parameterId } = useSelector(
    (state) => state.parameters
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPage = page?.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);
    dispatch(
      fetchParametersByAttributeId({ id, searchData, currentPage, rowsPerPage })
    );
  }, [dispatch, id, searchData, page?.currentPage, rowsPerPage, parameterId]);

  useEffect(() => {
    if (loading === "fulfilled") {
      setPage((prevState) => ({ ...prevState, totaltems: totalData }));
    }
  }, [loading, totalData]);

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
      dispatch(deleteParameter(id));
    }
  };

  return (
    <section className="">
      <Header />
      <div className="main_content_iner">
        <div className="container-fluid p-2">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="white_card card_height_100 mb_30">
                <div className="p-2">
                  <div className="box_header m-0">
                    <div className="main-title">
                      <h3 className="m-0">{attributeName}</h3>
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

                      <Link
                        className="btn btn-outline-primary mb-3"
                        to={`/admin/attribute/add-parameters/${attributeName}/${id}/${isVisibleInCustomized}`}
                      >
                        Create
                      </Link>
                    </div>
                  </div>
                  <p>
                    <Link to={`/`} style={{ color: "#707087", fontSize: 16 }}>
                      <i className="fa-solid fa-house-user"></i>
                    </Link>{" "}
                    &nbsp;
                    {/* <i
                      className="fa fa-chevron-right"
                      style={{ fontSize: 16 }}
                    />{" "} */}
                    <div
                      style={{ fontSize: 16, display: "inline-block" }}
                      // to="/admin/attribute-new"
                      onClick={() => navigate(-1)}
                    >
                      Attribute
                    </div>{" "}
                    &nbsp;
                    {/* <i
                      className="fa fa-chevron-right"
                      style={{ fontSize: 16 }}
                    />{" "} */}
                    <ArrowForwardIosIcon style={{ fontSize: 16 }} />
                    <Link style={{ fontSize: 16 }}>Parameter</Link>{" "}
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
                          <th scope="col" style={{ width: "20%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {parameters &&
                          parameters?.length > 0 &&
                          parameters?.map((parameter, idx) => (
                            <tr
                              key={idx}
                              className={
                                parameter?.status === 0 ? "inactive" : ""
                              }
                            >
                              <th scope="row">{index + idx}</th>
                              <td>
                                <h5>
                                  Name:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {parameter?.name}
                                  </span>
                                </h5>
                                <h5>
                                  Attribute Category:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {parameter?.attributeCategoryId?.Name}
                                  </span>
                                </h5>
                                <h5>
                                  Display Index:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {parameter?.displayIndex}
                                  </span>
                                </h5>
                                <h5>
                                  Price:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {parameter?.price}
                                  </span>
                                </h5>
                                <h5>
                                  Status:{" "}
                                  <span style={{ fontWeight: "normal" }}>
                                    {parameter?.status === 1
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </h5>
                              </td>
                              <td>
                                <img
                                  src={`${REACT_APP_URL}/images/parameter/${parameter?.profileImage}`}
                                  className="card-img-top img-fluid"
                                  alt={parameter?.profileImage}
                                  style={{
                                    maxWidth: "150px",
                                    maxHeight: "200px",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      backgroundColor: "#dc3545",
                                      padding: "7px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                    }}
                                    onClick={() =>
                                      handleDeleteClick(parameter?._id)
                                    }
                                  >
                                    <AiTwotoneDelete />
                                  </span>

                                  <span>
                                    <Link
                                      to={`/admin/attribute/edit-parameters/${attributeName}/${id}/${parameter?._id}/${isVisibleInCustomized}`}
                                      style={{
                                        backgroundColor: "#198754",
                                        padding: "7px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        float: "left",
                                      }}
                                    >
                                      <FiEdit />
                                    </Link>
                                  </span>

                                  {isVisibleInCustomized === "true" && (
                                    <span>
                                      <Link
                                        style={{
                                          color: "#fff",
                                        }}
                                        className="btn btn-info"
                                        to={`/admin/attribute/parameters/position/${attributeName}/${parameter?.name}/${id}/${parameter?._id}/${isVisibleInCustomized}`}
                                      >
                                        Position Image
                                      </Link>
                                    </span>
                                  )}
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
      <Footer />
    </section>
  );
};

export default Parameters;
