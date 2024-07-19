import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import { MultiSelect } from "react-multi-select-component";
import { FaTrash } from "react-icons/fa";
import TopHeader from "../../../components/topheader/TopHeader";
import { createReview } from "../../../redux/slices/reviewSlice";
import Select from "react-select";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { postSlider } from "../../../redux/slices/sliderSlice";

const AddAdminSlider = () => {
  const { loading, slider, success } = useSelector((state) => state.slider);

  const [sliderimage, setsliderimage] = useState("");
  const [imageType, setimageType] = useState(false);
  

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let sliderdata = new FormData();
    sliderdata.append("SideImage", imageType);
    sliderdata.append("sliderimg", sliderimage);
    dispatch(postSlider(sliderdata));

    if (loading === "fulfilled" && success) {
      navigate("/admin/slider");
    }
  };

  return (
    <>
      <SideBar />
     {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <TopHeader />
        <div className="main_content_iner ">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="col-lg-12" style={{ float: "left" }}>
                  <div className="white_card card_height_100 mb_30">
                    <div className="white_card_header">
                      <div className="box_header m-0">
                        <div className="main-title">
                          <h3 className="m-0">Review</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image Type
                              </label>
                              <select
                                className="form-select"
                                aria-label="Default select example"
                                onChange={(e) => setimageType(e.target.value)}
                              >
                                <option >Select </option>
                                <option value={false}>Slider Image</option>
                                <option value={true}>Side Image</option>
                              </select>
                            </div>

                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Title"
                                placeholder="Image"
                                name="ReviewBody"
                                required
                                onChange={(e) =>
                                  setsliderimage(e.target.files[0])
                                }
                              />
                            </div>
                          </div>

                          <center>
                            <button type="submit" className="btn btn-primary">
                              Save
                            </button>
                          </center>
                        </form>
                      </div>
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
                    Designed &amp; Developed By{" "}
                    <a href="http://marwariplus.com/">Marwari Software</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddAdminSlider;
