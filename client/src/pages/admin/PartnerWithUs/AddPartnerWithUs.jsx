import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
// const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;
const imageTypeRegex = /(?:image\/(jpeg|jpg|png|JPG|PNG|JPEG))|(?:video\/(mp4|webm))/gm;

const AddPartnerWithUs = () => {
  const [pWusimage, setPWusImage] = useState({ userImage: "", preview: "" });
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const handleFormChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let pwithusData = new FormData();
    pwithusData.append("clientImages", pWusimage.userImage);
    pwithusData.append("status", status);
    try {
      const { data } = await axiosInstance.post(
        "/api/partner-with-us",
        pwithusData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        navigate("/admin/partner-with-us");
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  return (
    <>
      <SideBar />
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
                          <h3 className="m-0">Add Partner With Us</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Title"
                                placeholder="Image"
                                name="PWus Image"
                                required
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (
                                    file.type.match(imageTypeRegex) &&
                                    file.size <= 10000000
                                  ) {
                                    setPWusImage({
                                      userImage: file,
                                      preview: URL.createObjectURL(file),
                                    });
                                  } else {
                                    e.target.value = null;
                                    toastError(
                                      "Selected images are not of valid type or size!"
                                    );
                                  }
                                }}
                              />
                              {pWusimage.preview && (
                                <img
                                  style={{ width: "100px", height: "100px" }}
                                  src={pWusimage.preview}
                                  alt="_profilemm"
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-md-12">
                            <label
                              className="form-label"
                              htmlFor="FeaturedProducts"
                            >
                              Status
                            </label>
                            <select
                              id="status"
                              className="form-control"
                              name="status"
                              required
                              onChange={handleFormChange}
                            >
                              <option value="">Choose...</option>
                              <option value={"partenerWithUs"}>
                                partenerWithUs
                              </option>
                              <option value={"loginImage"}>loginImage</option>
                              <option value={"contactUsVideo"}>
                                contactUsVideo
                              </option>
                              <option value={"contactUsImage"}>
                                contactUsImage
                              </option>
                            </select>
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

export default AddPartnerWithUs;
