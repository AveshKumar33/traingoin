import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { createAboutUs } from "../../../redux/slices/aboutUsSlice";
import { toastError } from "../../../utils/reactToastify";
import { FaTrash } from "react-icons/fa";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddAboutUs = () => {
  const { loading } = useSelector((state) => state.aboutUs);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [aboutUsImage, setAboutUsImage] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 1,
  });

  const { title, status, description } = formData;

  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
        setAboutUsImage((preState) => [
          ...preState,
          { file: file, preview: URL.createObjectURL(file) },
        ]);
      } else {
        e.target.value = null;
        toastError("Selected images are not of valid type or size!");
      }
    }
  };
  const handleRemove = (index) => {
    setAboutUsImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let createAboutUsData = new FormData();
    createAboutUsData.append("title", title);
    createAboutUsData.append("description", description);
    createAboutUsData.append("status", status);
    for (let image of aboutUsImage) {
      createAboutUsData.append("aboutusimg", image.file);
    }

    dispatch(createAboutUs(createAboutUsData));
    if (loading === "fulfilled") {
      navigate("/admin/about-us");
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
                          <h3 className="m-0">About us</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Title
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Title"
                                name="title"
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Description
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Description"
                                name="description"
                                required
                                onChange={handleFormChange}
                              />
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
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>

                            <div className="mb-3">
                              <label
                                className="form-label"
                                htmlFor="Description"
                              >
                                Product Image ("Image Size should less than or
                                equal to 10MB")
                              </label>
                              <div className="upload-container">
                                <center>
                                  <input
                                    type="file"
                                    id="file_upload"
                                    required
                                    multiple
                                    accept="image/*"
                                    onChange={handleImage}
                                  />
                                </center>
                              </div>
                              <div
                                className="preview-container d-flex row"
                                style={{ padding: "0px" }}
                              >
                                {aboutUsImage?.length !== 0 &&
                                  aboutUsImage.map((image, index) => (
                                    <div
                                      className="productimage-area col-3"
                                      key={index}
                                    >
                                      <img
                                        src={image.preview}
                                        alt="Preview"
                                        style={{
                                          width: "100vw",
                                          height: "150px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <button
                                        className="productremove-image"
                                        type="button"
                                        style={{ display: "inline" }}
                                        onClick={() => handleRemove(index)}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  ))}
                              </div>
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

export default AddAboutUs;
