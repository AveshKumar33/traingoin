import SideBar from "../../../components/sidebar/SideBar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { useState } from "react";

import { toastError, toastSuceess } from "../../../utils/reactToastify";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config";

const AttributeCategorCreate = () => {
  const [Name, setName] = useState();
  const [displayIndex, setDisplayIndex] = useState(0);
  const [status, setStatus] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        "/api/AttributeCategor",
        {
          Name,
          status,
          displayIndex,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);
        navigate("/admin/AttributeCategor");
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
                        <h3 className="m-0">Attribute Categor</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-7">
                            <label className="form-label" htmlFor="Tag Name">
                              Name
                            </label>
                            <input
                              type="test"
                              className="form-control"
                              id="Attribute Categor"
                              placeholder="Enter Attribute Categor Name"
                              value={Name || ""}
                              required
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="col-md-7">
                            <label
                              className="form-label"
                              htmlFor="displayIndex"
                            >
                              Display Index
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="displayIndex"
                              name="displayIndex"
                              required
                              onChange={(e) => setDisplayIndex(e.target.value)}
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
                              name="featuredproduct"
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

export default AttributeCategorCreate;
