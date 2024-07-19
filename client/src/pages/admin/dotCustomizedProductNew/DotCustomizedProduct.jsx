import React, { useState, useEffect } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { AiFillSetting } from "react-icons/ai";
import TopHeader from "../../../components/topheader/TopHeader";
import Preloader from "../../../components/preloader/Preloader";
import { TablePagination } from "@mui/material";
import {
  deleteDotCustomizedProduct,
  fetchDotCustomizedProduct,
} from "../../../redux/slices/newDotCustomizedProductSlice";
import {
  encryptData,
  decryptedData,
} from "../../../utils/useFullFunctions/encryptDecrypt";

const DotCustomizedProduct = () => {
  const { loading, dotCustomizedProducts, totalData, deletedProductId } =
    useSelector((state) => state.newDotCustomization);

  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [searchText, setsearchtext] = useState("");
  const [searchData, setSearchData] = useState("");

  let queryParams = new URLSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let currentPage = page.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);

    dispatch(
      fetchDotCustomizedProduct({ searchData, currentPage, rowsPerPage })
    );
  }, [dispatch, searchData, page.currentPage, rowsPerPage, deletedProductId]);

  useEffect(() => {
    if (loading === "fulfilled") {
      setPage((prevState) => ({ ...prevState, totaltems: totalData }));
    }
  }, [loading, totalData]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const filterText = searchParams.getAll("railingoprod");
    const filterIndex = searchParams.getAll("index");

    const decryptedDataList = {
      text: filterText.map((text) => decryptedData(text)),
    };

    const currentPage = filterIndex[0] || 0;

    setPage((prevState) => ({
      ...prevState,
      currentPage: Number(currentPage),
    }));

    setsearchtext(decryptedDataList.text[0] || "");
    setSearchData(decryptedDataList.text[0] || "");
  }, [location.search]);

  // if (loading === "pending") {
  //   return <Preloader />;
  // }

  const handleSearch = (e) => {
    e.preventDefault();
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));

    if (searchText) {
      queryParams.append("railingoprod", encryptData(searchText));
    }

    queryParams.append("index", 0);

    navigate({
      search: queryParams.toString(),
      replace: true,
    });

    setSearchData(searchText);
  };

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    const existingSearchParams = new URLSearchParams(location?.search);
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

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteDotCustomizedProduct(id));
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
                      <div className="main-title">
                        <h3 className="m-0">Customized Dot Bundle</h3>
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
                        <div
                          onClick={() =>
                            navigate("/admin/add-dot-customized-product")
                          }
                          className="btn btn-outline-primary mb-3"
                        >
                          ADD PRODUCT
                        </div>
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
                            <th scope="col">Display Sequence</th>
                            <th scope="col">Status</th>

                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading === "fulfilled" &&
                            dotCustomizedProducts &&
                            dotCustomizedProducts?.length > 0 &&
                            dotCustomizedProducts.map((p, indx) => (
                              <tr key={p?._id}>
                                <th scope="row">{index + indx}</th>
                                <td>{p?.name}</td>
                                <td>{p?.displaySequence}</td>
                                <td>{p?.status ? "Active" : "Inactive"}</td>

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
                                                `/admin/edit-dot-customized-product/${p?._id}`
                                              )
                                            }
                                            className="dropdown-item"
                                          >
                                            Edit
                                          </div>

                                          <div
                                            onClick={() =>
                                              navigate(
                                                `/admin/dot-customized-product-new/view-images/${p?._id}`
                                              )
                                            }
                                            className="dropdown-item"
                                          >
                                            View Images
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
                      count={page?.totaltems || 0}
                      rowsPerPage={rowsPerPage}
                      page={page?.currentPage}
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
      {/* 
      <div id="back-top" style={{ display: "none" }}>
        <a title="Go to Top" href="#">
          <i className="ti-angle-up"></i>
        </a>
      </div> */}
    </>
  );
};

export default DotCustomizedProduct;
