import React, { useEffect, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { fetchRaiseAQuery } from "../../../../src/redux/slices/raiseAQuerySlice";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { TablePagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
const Queries = () => {
  const { raiseAQuery, totalCount: countDocument, loading } = useSelector(
    (state) => state.raiseQuery
  );
  const [riseQueryData, setRiseQueryData] = useState([]);
  const [totalCount, setTotalCount] = useState();
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [searchText, setsearchtext] = useState("");
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    let currentPage = page?.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);
    dispatch(fetchRaiseAQuery({ searchData, currentPage, rowsPerPage }));
  }, [dispatch, searchData, page.currentPage, rowsPerPage]);

  useEffect(() => {
    if (loading === "fulfilled" && raiseAQuery) {
      setRiseQueryData(raiseAQuery);
      setTotalCount(countDocument);
    }
  }, [loading, raiseAQuery, countDocument]);

  useEffect(() => {
    if (loading === "fulfilled") {
      setPage((prevState) => ({ ...prevState, totaltems: totalCount }));
    }
  }, [loading, totalCount]);
  /**pagination logic write here */
  const handleSearch = (e) => {
    e.preventDefault();
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
    setSearchData(searchText);
  };

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  function formateDate(date) {
    const utcDate = new Date(date);
    const indianLocaleTimeString = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    return indianLocaleTimeString;
  }
  return (
    <>
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
                        <h3 className="m-0">Request Quotation</h3>
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
                              placeholder="Name Email Phone Number"
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
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Created Date</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">MobNumber</th>
                            <th scope="col">Message</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {riseQueryData &&
                            riseQueryData?.length > 0 &&
                            riseQueryData?.map((user, i) => (
                              <tr key={i + index}>
                                <th scope="row">{index + i}</th>
                                <td>
                                  {formateDate(user?.firstDocument?.createdAt)}
                                </td>
                                <td>{user?.firstDocument?.Name}</td>
                                <td>{user?.firstDocument?.Email}</td>
                                <td>{user?.firstDocument?.MobNumber}</td>
                                <td>{user?.firstDocument?.Message}</td>
                                <td>
                                  <span className="btn btn-success">
                                    <Link
                                      to={`/admin/user-products?email=${user?.firstDocument?.Email}&mobNo=${user?.firstDocument?.MobNumber}`}
                                      style={{
                                        color: "#fff",
                                      }}
                                    >
                                      View Products
                                    </Link>
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
                      count={totalCount || 0}
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
    </>
  );
};

export default Queries;
