import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import { useEffect, useState, useCallback } from "react";
import { FiEdit } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import Preloader from "../../../components/preloader/Preloader";
import { axiosInstance } from "../../../config";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import SearchIcon from "@mui/icons-material/Search";
import { TablePagination } from "@mui/material";

const AttributeCategor = () => {
  const [loading, setLoading] = useState(false);

  const [A_Category, setA_Cateogy] = useState();
  const [totalCount, setTotalCount] = useState();
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [searchText, setsearchtext] = useState("");
  const [searchData, setSearchData] = useState("");
  const fetchAttributeCategor = useCallback(
    async ({ searchData = "", currentPage = 0, rowsPerPage = 3 }) => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          `/api/AttributeCategor?search=${searchData}&page=${
            currentPage + 1
          }&limit=${rowsPerPage}`,
          {},
          {
            headers: {
              "Content-Type": "multipart/form-data",
              token: localStorage.getItem("token"),
            },
          }
        );

        setLoading(false);
        setA_Cateogy(data.data);
        setTotalCount(data.totalCount);
      } catch (error) {
        setLoading(false);
        toastSuceess(error?.response?.data?.message);
      }
    },
    [searchData, page.currentPage, rowsPerPage]
  );

  // useEffect(() => {
  //   fetchAttributeCategor();
  // }, [fetchAttributeCategor]);

  useEffect(() => {
    let currentPage = page?.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);
    fetchAttributeCategor({ searchData, currentPage, rowsPerPage });
  }, [searchData, page.currentPage, rowsPerPage]);

  useEffect(() => {
    if (loading === "fulfilled") {
      setPage((prevState) => ({ ...prevState, totaltems: totalCount }));
    }
  }, [loading, totalCount]);

  /**loader  */
  if (loading) {
    return <Preloader />;
  }
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
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const handleDeleteClick = async (id) => {
    const answer = window.confirm("Are You Sure !");
    try {
      if (answer) {
        const { data } = await axiosInstance.delete(
          `/api/AttributeCategor/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        if (data?.success) {
          toastSuceess(data?.message);
          fetchAttributeCategor({});
        }
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  return (
    <>
      {/* <SideBar /> */}
      {/* <section className="main_content dashboard_part large_header_bg"> */}
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
                        <h3 className="m-0">Attribute Categor</h3>
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
                          to="/admin/add-AttributeCategor"
                          className="btn btn-outline-primary mb-3"
                        >
                          Add Attribute Categor
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
                            <th scope="col">Name</th>
                            <th scope="col">Display Index</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {A_Category &&
                            A_Category.length > 0 &&
                            A_Category.map((t, ind) => (
                              <tr key={t._id}>
                                <th scope="row">{ind + index}</th>
                                <td>{t.Name}</td>
                                <td>{t.displayIndex}</td>
                                <td>{t.status ? "Active" : "Inactive"}</td>
                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/AttributeCategor/${t._id}`}
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
                                    }}
                                    onClick={() => handleDeleteClick(t._id)}
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
        <Footer></Footer>
      </section>
    </>
  );
};

export default AttributeCategor;
