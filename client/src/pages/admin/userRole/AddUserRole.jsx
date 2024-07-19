import SideBar from "../../../components/sidebar/SideBar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserRole } from "../../../redux/slices/userRoleSlice";
import { useNavigate } from "react-router-dom";

const AddUserRoles = () => {
  const { loading } = useSelector((state) => state.userRoles);

  const [role, setRole] = useState();
  const [status, setStatus] = useState(1);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(createUserRole({ name: role, status }));

    if (loading === "fulfilled") {
      navigate("/admin/user/role");
    }
  };

  return (
    <>
      <SideBar />
      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">User Role</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-7">
                            <label className="form-label" htmlFor="Tag Name">
                              User Role
                            </label>
                            <input
                              type="User Role"
                              className="form-control"
                              id="User Role"
                              placeholder="User Role"
                              value={role || ""}
                              onChange={(e) => setRole(e.target.value)}
                            />
                          </div>
                          <div className="col-md-7">
                            <label
                              className="form-label"
                              htmlFor="FeaturedProducts"
                            >
                              Status
                            </label>
                            <select
                              id="FeaturedProducts"
                              className="form-control"
                              name="status"
                              required
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">Choose...</option>
                              <option value={1}>Active</option>
                              <option value={0}>Inactive</option>
                            </select>
                          </div>
                        </div>
                        <br />
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                      </form>
                    </div>
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

export default AddUserRoles;
