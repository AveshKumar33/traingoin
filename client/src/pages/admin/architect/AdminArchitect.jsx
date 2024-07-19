import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import Preloader from "../../../components/preloader/Preloader";
import {
  deleteArchitect,
  fetchArchitect,
} from "../../../redux/slices/architectSlice";
import { AiTwotoneDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { REACT_APP_URL } from "../../../config";

const AdminArchitect = () => {
  const { loading, architects } = useSelector((state) => state.architect);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArchitect());
  }, [dispatch]);

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
      dispatch(deleteArchitect(id));
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
                        <h3 className="m-0">Enquiry</h3>
                      </div>
                      <Link
                        to="/admin/add-architect"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Architect
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Mob Number</th>
                            <th scope="col">Password</th>
                            <th scope="col">Page Url</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading === "fulfilled" &&
                            architects &&
                            architects.map((p, index) => (
                              <tr key={p._id}>
                                <th scope="row">{index + 1}</th>

                                <td>{p.Name}</td>
                                <td>{p.Email}</td>
                                <td>{p.MobNumber}</td>
                                <td>{p.Password}</td>
                                <td>{p.Url}</td>
                                <td>
                                  {p.status === 1 ? "Active" : "Inactive"}
                                </td>
                                <td>
                                  &nbsp;
                                  <span className="me-1">
                                    <Link
                                      to={`/admin/edit-architect/${p._id}`}
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

export default AdminArchitect;
