import SideBar from "../../../components/sidebar/SideBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import {
  deleteExperience,
  fetchExperience,
} from "../../../redux/slices/experienceSlice";
import Preloader from "../../../components/preloader/Preloader";
import { REACT_APP_URL } from "../../../config";

const Experience = () => {
  const { loading, Experience } = useSelector((state) => state.experience);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExperience());
  }, [dispatch]);

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
      dispatch(deleteExperience(id));
      if (loading === "fulfilled") {
        dispatch(fetchExperience());
      }
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
                        <h3 className="m-0">Experience Centers</h3>
                      </div>
                      <Link
                        to="/admin/add-experience"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Experience Centers
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col"></th>
                            <th scope="col">Name</th>
                            <th scope="col">Video</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {console.log("Experience", Experience)} */}
                          {loading === "fulfilled" &&
                            Experience &&
                            Experience.length > 0 &&
                            Experience.map((p, index) => (
                              <tr key={p._id}>
                                <th scope="row">{index + 1}</th>
                                <td scope="row">
                                  <img
                                    loading="lazy"
                                    src={`${REACT_APP_URL}/images/experience/${p.experienceImages[0]}`}
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                </td>
                                <td>{p?.name}</td>
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
                                <td>{p?.description}</td>
                                <td>
                                  <button
                                    className={
                                      p?.status === 1
                                        ? "btn btn-success"
                                        : "btn btn-danger"
                                    }
                                    style={{ fontSize: "14px" }}
                                  >
                                    {p.status ? "Active" : "Inactive"}
                                  </button>
                                </td>

                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/experience/${p._id}`}
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
                                    onClick={() => handleDeleteClick(p._id)}
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

export default Experience;
