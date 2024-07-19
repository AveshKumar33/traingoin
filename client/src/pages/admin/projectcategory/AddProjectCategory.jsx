import SideBar from "../../../components/sidebar/SideBar";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createprojectCategory } from "../../../redux/slices/projectcategorySlice";

const AddProjectCategory = () => {
  const { loading } = useSelector((state) => state.projectCategory);

  const [projectCategory, setprojectCategory] = useState();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(createprojectCategory({ Name: projectCategory }));

    if (loading === "fulfilled") {
      navigate("/admin/projectcategory");
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
                        <h3 className="m-0">Project Category</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-7">
                            <label
                              className="form-label"
                              htmlFor="Project Category Name"
                            >
                              Project Category Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Project Category Name"
                              placeholder="Project Category Name"
                              onChange={(e) =>
                                setprojectCategory(e.target.value)
                              }
                            />
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

export default AddProjectCategory;
