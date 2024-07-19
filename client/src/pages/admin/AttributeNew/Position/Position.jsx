import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../../../components/footer/Footer";
import Header from "../../../../components/header/Header";
import {
  fetchPositionByAttributeId,
  deletePosition,
} from "../../../../redux/slices/positionSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { TablePagination } from "@mui/material";

import { AiTwotoneDelete } from "react-icons/ai";
import "../Attribute.css";
//import { toastError, toastSuceess } from "../../../../utils/reactToastify";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Position = () => {
  const { Name: attributeName, id } = useParams();
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [index, setIndex] = useState(1);

  const { loading, positions, totalData, positionId } = useSelector(
    (state) => state.positions
  );
  // console.log(" position ", positions);

  const dispatch = useDispatch();

  useEffect(() => {
    const currentPage = page?.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);
    dispatch(fetchPositionByAttributeId({ id, currentPage, rowsPerPage }));
  }, [dispatch, id, page?.currentPage, rowsPerPage, positionId]);

  useEffect(() => {
    if (loading === "fulfilled") {
      setPage((prevState) => ({ ...prevState, totaltems: totalData }));
    }
  }, [loading, totalData]);

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
      dispatch(deletePosition(id));
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
                    <Link
                      className="btn btn-outline-primary mb-3"
                      to={`/admin/attribute/add-position/${attributeName}/${id}`}
                    >
                      Create
                    </Link>
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
                    <Link style={{ fontSize: 16 }} to="/admin/attribute-new">
                      Attribute
                    </Link>{" "}
                    &nbsp;
                    {/* <i
                      className="fa fa-chevron-right"
                      style={{ fontSize: 16 }}
                    />{" "} */}
                    <ArrowForwardIosIcon style={{ fontSize: 16 }} />
                    <Link style={{ fontSize: 16 }}>Position</Link>{" "}
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
                          <th scope="col" style={{ width: "20%" }}>
                            Name
                          </th>
                          <th scope="col" style={{ width: "20%" }}>
                            Status
                          </th>
                          <th scope="col" style={{ width: "20%" }}>
                            Parameter Position Image
                          </th>
                          <th scope="col" style={{ width: "15%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions &&
                          positions.length > 0 &&
                          positions.map((position, indx) => (
                            <tr key={position._id}>
                              <th scope="row">{index + indx}</th>

                              <td>{position?.name}</td>
                              <td>
                                {position?.status === 1 ? "Active" : "Inactive"}
                              </td>
                              <td>
                                <Link
                                  style={{
                                    color: "#fff",
                                  }}
                                  className="btn btn-info"
                                  to={`/admin/attribute/parameters/position/${attributeName}/${
                                    position.name
                                  }/${id}/${position?._id}/${true}`}
                                >
                                  Position Image
                                </Link>
                              </td>
                              <td>
                                <span>
                                  <Link
                                    to={`/admin/attribute/edit-position/${attributeName}/${id}/${position?._id}`}
                                    style={{
                                      backgroundColor: "#198754",
                                      padding: "7px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                    }}
                                  >
                                    <FiEdit />
                                  </Link>
                                </span>
                                &nbsp;
                                <span
                                  style={{
                                    backgroundColor: "#dc3545",
                                    padding: "7px",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleDeleteClick(position._id)
                                  }
                                >
                                  <AiTwotoneDelete />
                                </span>
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

export default Position;
