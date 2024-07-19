import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
// import SideBar from "../../../components/sidebar/SideBar";
import {
  deleteAttribute,
  fetchattribute,
} from "../../../redux/slices/newAttributeSlice";
import { TablePagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import Preloader from "../../../components/preloader/Preloader";
import { axiosInstance } from "../../../config";
import "./Attribute.css";
import { toastError } from "../../../utils/reactToastify";
import SearchIcon from "@mui/icons-material/Search";
import {
  encryptData,
  decryptedData,
} from "../../../utils/useFullFunctions/encryptDecrypt";

const Attribute = () => {
  const { loading, attributes, totalData, attributeId } = useSelector(
    (state) => state.newAttribute
  );

  let queryParams = new URLSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [index, setIndex] = useState(1);
  const [allAttributes, setAllAttributes] = useState([]);
  const [searchText, setsearchtext] = useState({
    text: "",
    attributeType: "",
  });
  const [searchData, setSearchData] = useState({
    text: "",
    attributeType: "",
  });
  const [count, setCount] = useState({ parameterCount: {}, positionCount: {} });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filteredId = searchParams.getAll("att");
    const filterText = searchParams.getAll("text");
    const filterIndex = searchParams.getAll("index");

    const decryptedAttType = filteredId.map((id) => decryptedData(id))[0] || "";
    const decryptedText =
      filterText.map((text) => decryptedData(text))[0] || "";
    const currentPage = Number(filterIndex[0] || 0);

    setPage((prevPage) => ({ ...prevPage, currentPage }));

    setsearchtext({
      attributeType: decryptedAttType,
      text: decryptedText,
    });

    setSearchData({
      attributeType: decryptedAttType,
      text: decryptedText,
    });
  }, [location.search, setPage, setsearchtext, setSearchData]);

  useEffect(() => {
    let currentPage = page?.currentPage;
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);
    dispatch(
      fetchattribute({
        searchData,
        currentPage,
        rowsPerPage,
      })
    );
  }, [dispatch, searchData, page?.currentPage, attributeId, rowsPerPage]);

  useEffect(() => {
    if (loading === "fulfilled" && attributes?.length > 0) {
      setPage((prevState) => ({ ...prevState, totaltems: totalData }));
      setAllAttributes(attributes);
    }
  }, [loading, totalData, attributes, searchData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));

    const { text, attributeType } = searchText;
    if (text !== "") {
      queryParams.append("text", encryptData(text));
      setSearchData((prevState) => ({ ...prevState, text: text }));
    } else {
      setSearchData((prevState) => ({ ...prevState, text: "" }));
    }

    if (attributeType !== "") {
      queryParams.append("att", encryptData(attributeType));
      setSearchData((prevState) => ({
        ...prevState,
        attributeType: attributeType,
      }));
    } else {
      setSearchData((prevState) => ({
        ...prevState,
        attributeType: "",
      }));
    }

    navigate({
      search: queryParams.toString(),
      replace: true,
    });
  };

  useEffect(() => {
    const getParameterCount = async () => {
      const [parameterCount, positionCount] = await Promise.all([
        axiosInstance.get("/api/parameter/count"),
        axiosInstance.get("/api/position/count"),
      ]);

      if (parameterCount?.data?.success && positionCount?.data?.success) {
        setCount({
          parameterCount: parameterCount?.data?.data[0] || {},
          positionCount: positionCount?.data?.data[0] || {},
        });
      }
    };

    try {
      getParameterCount();
    } catch (error) {
      toastError(error.response.data.message);
    }
  }, []);

  if (loading === "pending") {
    return (
      <div>
        <Preloader />
      </div>
    );
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteAttribute(id));
    }
  };

  const handleChangePage = (event, newPage) => {
    event.preventDefault();

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

  return (
    <>
      {/* <SideBar /> */}
      {/* <section className="main_content dashboard_part large_header_bg"> */}
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
                        <h3 className="m-0">Attribute</h3>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <form
                          onSubmit={handleSearch}
                          style={{ display: "flex", gap: "2px" }}
                        >
                          <div>
                            <input
                              type="search"
                              className="form-control"
                              id="search"
                              placeholder="Name/Print Name"
                              name="searchText"
                              value={searchText.text || ""}
                              onChange={(e) =>
                                setsearchtext((prevState) => ({
                                  ...prevState,
                                  text: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <select
                            className="form-select form-control"
                            name="isVisibleInCustomize"
                            value={searchText?.attributeType}
                            onChange={(e) =>
                              setsearchtext((prevState) => ({
                                ...prevState,
                                attributeType: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSearch(e);
                              }
                            }}
                          >
                            <option value="">Attribute Type</option>
                            <option value="true">Customized Product</option>
                            <option value="false">Single Product</option>
                          </select>
                          <div>
                            <button className="btn btn-success" type="submit">
                              <SearchIcon />
                            </button>
                          </div>
                        </form>
                        <Link
                          to="/admin/add-attribute-new"
                          className="btn btn-outline-primary mb-3"
                        >
                          Add Attribute
                        </Link>
                      </div>
                    </div>
                    <p>
                      <Link to={`/`} style={{ color: "#707087", fontSize: 16 }}>
                        <i className="fa-solid fa-house-user"></i>
                      </Link>{" "}
                      &nbsp;
                      <i
                        className="fa fa-chevron-right"
                        style={{ fontSize: 16, textDecoration: "none" }}
                      />{" "}
                      <Link style={{ fontSize: 16 }}>Attribute</Link>{" "}
                    </p>
                  </div>

                  <div className="px-2">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col" style={{ width: "5%" }}>
                              Sr. No.
                            </th>
                            <th scope="col" style={{ width: "5%" }}>
                              Burger Sque
                            </th>
                            <th scope="col" style={{ width: "5%" }}>
                              Display Index
                            </th>

                            <th scope="col" style={{ width: "20%" }}>
                              Name
                            </th>
                            <th scope="col" style={{ width: "20%" }}>
                              Print Name
                            </th>
                            <th scope="col" style={{ width: "8%" }}>
                              UOM
                            </th>
                            <th scope="col" style={{ width: "5%" }}>
                              Status
                            </th>

                            <th scope="col" style={{ width: "15%" }}>
                              Parameters
                            </th>
                            <th scope="col" style={{ width: "15%" }}>
                              Position
                            </th>
                            <th scope="col" style={{ width: "32%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {allAttributes &&
                            allAttributes?.length !== 0 &&
                            allAttributes.map((p, indx) => (
                              <tr key={p?._id}>
                                <th scope="row">{index + indx}</th>

                                <td>{p?.BurgerSque}</td>
                                <td>{p?.Display_Index}</td>
                                <td>{p?.Name}</td>
                                <td>{p?.PrintName}</td>
                                <td>{p?.UOMId?.name}</td>
                                <td>
                                  {/* {p?.status === 1 ? "Active" : "Inactive"} */}
                                  <button
                                    className={
                                      p?.status === 1
                                        ? "btn btn-success"
                                        : "btn btn-danger"
                                    }
                                    style={{ fontSize: "14px" }}
                                  >
                                    {p?.status ? "Active" : "Inactive"}
                                  </button>
                                </td>
                                <td>
                                  <span>
                                    <div
                                      onClick={() => {
                                        navigate(
                                          `/admin/attribute/parameters/${p?.Name}/${p?._id}/${p?.isVisibleInCustomize}`
                                        );
                                      }}
                                      className="btn btn-outline-primary mb-3"
                                    >
                                      {`Parameters (${
                                        count?.parameterCount[`${p?._id}`] || 0
                                      })`}
                                    </div>
                                  </span>
                                </td>
                                <td>
                                  {p?.isVisibleInCustomize && (
                                    <span>
                                      <Link
                                        to={`/admin/attribute/position/${p?.Name}/${p?._id}`}
                                        className="btn btn-outline-success mb-3"
                                      >
                                        {`Position (${
                                          count?.positionCount[`${p?._id}`] || 0
                                        })`}
                                      </Link>
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/edit-attribute-new/${p?._id}`}
                                      style={{
                                        display: "inline-block",
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

                                  <span
                                    style={{
                                      display: "inline-block",
                                      backgroundColor: "#dc3545",
                                      padding: "7px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                      float: "left",
                                    }}
                                    onClick={() => handleDeleteClick(p?._id)}
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
                      count={+page.totaltems}
                      rowsPerPage={+rowsPerPage}
                      page={+page.currentPage}
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

export default Attribute;
