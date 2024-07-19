import SideBar from "../../components/sidebar/SideBar";
import { Link, useParams, useNavigate } from "react-router-dom";
import { REACT_APP_URL } from "../../config";

import { AiFillSetting, AiTwotoneDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
// import ReactHtmlParser from "react-html-parser";
import { useEffect, useState } from "react";
import TopHeader from "../../components/topheader/TopHeader";
import "../../index.css";
import Preloader from "../../components/preloader/Preloader";
import { axiosInstance } from "../../config";
import { toastSuceess } from "../../utils/reactToastify";

const ViewDescription = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [Descriptios, setDescriptios] = useState();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);

    try {
      const { data } = await axiosInstance.get(
        `/api/ProductDescriptions/getProductDescriptions/${id}`
      );

      setDescriptios(data.data);
      setLoading(false);

      // toastSuceess(data.message);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDeleteClick = async (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      //   dispatch(deleteProduct(id));
      const { data } = await axiosInstance.delete(
        `/api/ProductDescriptions/${id}`
      );
      getData();
      toastSuceess(data.message);
    }
  };

  if (loading) {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <SideBar />

      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <TopHeader />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12 p-3">
                <div className="white_card card_height_100 p-3">
                  <div className="">
                    <div className="white_card_header">
                      <div className="box_header m-0">
                        <div className="box_header m-0">
                          <div className="main-title">
                            <h3 className="m-0">View Descriptions</h3>
                          </div>
                        </div>
                        <Link
                          to={`/admin/product/create-description/${id}`}
                          className="btn btn-outline-primary mb-3"
                        >
                          Add Description
                        </Link>
                      </div>
                    </div>

                    <p className="py-2">
                      <Link to={`/`} style={{ color: "#707087", fontSize: 16 }}>
                        <i className="fa-solid fa-house-user"></i>
                      </Link>{" "}
                      &nbsp;
                      <i
                        className="fa fa-chevron-right"
                        style={{ fontSize: 16 }}
                      />{" "}
                      <div
                        style={{
                          fontSize: 16,
                          display: "inline-block",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(-1)}
                      >
                        {" "}
                        Products
                      </div>{" "}
                      &nbsp;
                      <i
                        className="fa fa-chevron-right"
                        style={{ fontSize: 16 }}
                      />{" "}
                      <Link style={{ fontSize: 16 }}>View Description</Link>{" "}
                    </p>
                  </div>

                  <div className="">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Descriptions</th>

                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Descriptios &&
                            Descriptios.map((p, index) => (
                              <tr key={p._id}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  <img
                                    loading="lazy"
                                    src={`${REACT_APP_URL}/images/product/${p.Picture[0]}`}
                                    style={{ width: "50px", height: "50px" }}
                                  />{" "}
                                  &nbsp; &nbsp;
                                </td>
                                <td>{p.Title}</td>
                                <td>
                                  {/* {ReactHtmlParser(
                                    p.Descriptions.slice(0, 100)
                                  )} */}
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: p?.Descriptions.slice(0, 100),
                                    }}
                                  ></div>
                                </td>

                                <td>
                                  <div className="d-flex align-items-center">
                                    <span
                                      style={{
                                        backgroundColor: "#198754",
                                        padding: "7px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                      }}
                                    >
                                      <Link
                                        to={`/admin/product/create-description/${id}?_id=${
                                          p._id
                                        }&Mode=${true}`}
                                        className="dropdown-item"
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
                                      onClick={() => handleDeleteClick(p._id)}
                                    >
                                      <AiTwotoneDelete />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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
                    <a href="http://marwariplus.com/">Marwari Software</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="back-top" style={{ display: "none" }}>
        <a title="Go to Top" href="#">
          <i className="ti-angle-up"></i>
        </a>
      </div>
    </>
  );
};

export default ViewDescription;
