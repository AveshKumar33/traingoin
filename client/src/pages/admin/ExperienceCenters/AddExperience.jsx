import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useReducer } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { createExperience } from "../../../redux/slices/experienceSlice";
import { toastError } from "../../../utils/reactToastify";
import { FaTrash } from "react-icons/fa";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddExperience = () => {
  const { loading } = useSelector((state) => state.experience);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [experienceImage, setExperienceImage] = useState([]);
  const [video, setVideo] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    mobNumber: "",
    description: "",
    status: 1,
  });

  const {
    name,
    status,
    contactPerson,
    mobNumber,
    email,
    description,
  } = formData;

  /**video logic here */
  function extractSrcFromIframe(iframeCode) {
    const match = iframeCode.match(/src=["'](.*?)["']/);
    if (match && match.length > 1) {
      return match[1];
    } else {
      // Return a default URL or handle the error appropriately
      return "";
    }
  }

  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
        setExperienceImage((preState) => [
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
    setExperienceImage((prevImages) => {
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
  /** add vedio field  */
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let experienceData = new FormData();
    experienceData.append("name", name);
    experienceData.append("description", description);
    experienceData.append("status", status);
    experienceData.append("mobNumber", mobNumber);
    experienceData.append("contactPerson", contactPerson);
    experienceData.append("email", email);
    experienceData.append("video", extractSrcFromIframe(video));

    for (let image of experienceImage) {
      experienceData.append("experienceimg", image.file);
    }

    dispatch(createExperience(experienceData));
    if (loading === "fulfilled") {
      navigate("/admin/experience");
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
                          <h3 className="m-0">catalogue</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Name
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Name"
                                name="name"
                                value={name}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Contact Person
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Contact Person"
                                name="contactPerson"
                                value={contactPerson}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Email
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Email"
                                name="email"
                                value={email}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Mob. Number
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Mob.Number"
                                name="mobNumber"
                                value={mobNumber}
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
                                value={description}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div>
                              <h5 className="my-2">Enter YouTube Embed Code</h5>
                              <input
                                style={{ width: "50%" }}
                                type="text"
                                className="form-control"
                                name="video"
                                value={video}
                                onChange={handleChange}
                                placeholder="Paste your YouTube embed code here..."
                              />

                              {video && (
                                <div className="mt-2">
                                  <iframe
                                    width="560"
                                    height="315"
                                    src={extractSrcFromIframe(video)}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                              )}
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
                                {experienceImage?.length !== 0 &&
                                  experienceImage.map((image, index) => (
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

export default AddExperience;
