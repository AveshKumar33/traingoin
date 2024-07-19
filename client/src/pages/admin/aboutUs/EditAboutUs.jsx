import { useEffect, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAboutUsDetails,
  updateAboutUs,
} from "../../../redux/slices/aboutUsSlice";
import TopHeader from "../../../components/topheader/TopHeader";
import { REACT_APP_URL } from "../../../config";
import { FaTrash } from "react-icons/fa";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const EditAboutUs = () => {
  const { id } = useParams();
  const { loading, aboutUsdetails } = useSelector((state) => state.aboutUs);
  console.log("aboutUsdetails", aboutUsdetails);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [aboutUsImage, setAboutUsImage] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 1,
  });

  const { title, status, description } = formData;

  useEffect(() => {
    dispatch(fetchAboutUsDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (loading === "fulfilled" && aboutUsdetails) {
      const { aboutUsImages, ...aboutUs } = aboutUsdetails;
      setFormData(aboutUs);
      setAboutUsImage([...aboutUsImages]);
    }
  }, [loading, aboutUsdetails]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    e.preventDefault();
    const { files } = e.target;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
        setAboutUsImage((prevImages) => [
          ...prevImages,
          {
            file,
            preview: URL.createObjectURL(file),
          },
        ]);
      } else {
        e.target.value = null;
        toastError("Selected images are not of valid type or size!");
      }
    }
  };
  const handleRemove = async (index, imgloc, image) => {
    setAboutUsImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    if (imgloc === "Server") {
      await axiosInstance.put(`/api/about-us/${id}/${image}`);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let aboutUsData = new FormData();
    aboutUsData.append("title", title);
    aboutUsData.append("description", description);
    aboutUsData.append("status", status);
    for (let image of aboutUsImage) {
      if (image.file) {
        aboutUsData.append("aboutusimg", image.file);
      }
    }

    const updateddata = {
      id,
      aboutUsData,
    };

    dispatch(updateAboutUs(updateddata));
    navigate("/admin/about-us");
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
                          <h3 className="m-0">About Us</h3>
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
                                id="title"
                                placeholder="Title"
                                name="title"
                                value={title || ""}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="mb-3 row">
                              <div className="col-md-12">
                                <label
                                  className="form-label"
                                  htmlFor="Description"
                                >
                                  Description
                                </label>
                                <textarea
                                  type="text"
                                  className="form-control"
                                  id="Description"
                                  value={description || ""}
                                  placeholder="Description"
                                  name="description"
                                  onChange={handleFormChange}
                                />
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
                                id="FeaturedProducts"
                                className="form-control"
                                name="status"
                                required
                                value={status || 0}
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>
                            {/* UPLOAD IMAGE */}
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
                                    multiple
                                    onChange={handleImage}
                                  />
                                </center>
                              </div>
                              <div
                                className="preview-container d-flex row"
                                style={{ padding: "0px", marginTop: "30px" }}
                              >
                                {aboutUsImage &&
                                  aboutUsImage?.length !== 0 &&
                                  aboutUsImage.map((image, index) =>
                                    image.file ? (
                                      <div
                                        className="productimage-area col-3"
                                        key={index}
                                      >
                                        <img
                                          src={image.preview}
                                          alt="Preview"
                                          style={{
                                            width: "100vw",
                                            height: "100px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <button
                                          className="productremove-image"
                                          type="button"
                                          style={{ display: "inline" }}
                                          onClick={() =>
                                            handleRemove(index, "Local", false)
                                          }
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    ) : (
                                      <div
                                        className="image-area col-3"
                                        key={index}
                                      >
                                        <img
                                          src={`${REACT_APP_URL}/images/aboutUs/${image}`}
                                          alt="Preview"
                                          style={{
                                            width: "100vw",
                                            height: "100px",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <button
                                          className="productremove-image"
                                          type="button"
                                          style={{ display: "inline" }}
                                          onClick={() =>
                                            handleRemove(index, "Server", image)
                                          }
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    )
                                  )}
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

export default EditAboutUs;
