import SideBar from "../../../components/sidebar/SideBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import {
  deleteUserRole,
  fetchUserRoles,
} from "../../../redux/slices/userRoleSlice";
import Preloader from "../../../components/preloader/Preloader";

const UserRole = () => {
  const { loading, userRoles, userRoleId } = useSelector(
    (state) => state.userRoles
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserRoles());
  }, [dispatch, userRoleId]);

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
      dispatch(deleteUserRole(id));
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
                        <h3 className="m-0">User Roles</h3>
                      </div>
                      <Link
                        to="/admin/add-user-roles"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add User Role
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
                            <th scope="col">Status</th>

                            {/* <th scope="col">Password</th> */}
                            {/* <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th> */}

                            {/* <th scope="col">Tags</th> */}

                            {/* <th scope="col">Vendor</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {loading === "fulfilled" &&
                            userRoles &&
                            userRoles.map((p, index) => (
                              <tr key={p?._id}>
                                <th scope="row">{index + 1}</th>

                                <td>{p?.name}</td>
                                <td>
                                  {p?.status === 1 ? "Active" : "Inactive"}
                                </td>

                                {/* <td>{p.Password}</td> */}
                                {/* <td>
                                  <span>
                                    <Link
                                      to={`/admin/edit-user-role/${p?._id}`}
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
                                    onClick={() => handleDeleteClick(p?._id)}
                                  >
                                    <AiTwotoneDelete />
                                  </span>
                                </td> */}
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

export default UserRole;
