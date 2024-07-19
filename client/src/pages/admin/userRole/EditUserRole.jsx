import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import Footer from "../../../components/footer/Footer";
import { axiosInstance } from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import { usePutApi } from "../../../utils/Customhooks/ApiCalls";
import { toastError } from "../../../utils/reactToastify";

const EditUserRole = () => {
  const [status, setStatus] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoading: puloading, doPut } = usePutApi(
    `/api/user-role/update/${id}`
  );

  const [role, setRole] = useState();

  useEffect(() => {
    getData();
  }, [id]);

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/user-role/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      if (data) {
        setRole(data?.data?.name);
        setStatus(data?.data?.status);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doPut({
        name: role,
        status,
      });

      if (!puloading) {
        navigate("/admin/user/role");
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
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
                        <h3 className="m-0">Tag</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-7">
                            <label className="form-label" htmlFor="Tag Name">
                              Tag Name
                            </label>

                            <input
                              type="Tag Name"
                              className="form-control"
                              id="Tag Name"
                              placeholder="Tag Name"
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
                              value={status || 0}
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

export default EditUserRole;
