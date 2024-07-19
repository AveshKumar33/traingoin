import { useEffect, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExibhitionsDetails,
  updateExibhitions,
} from "../../../redux/slices/exibhitionsSlice";
import TopHeader from "../../../components/topheader/TopHeader";
import { REACT_APP_URL } from "../../../config";
import { FaTrash } from "react-icons/fa";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const EditExibhitions = () => {
  const { id } = useParams();
  const { loading, exibhitionsdetails } = useSelector(
    (state) => state.exibhitions
  );
  // console.log("exibhitionsdetails", exibhitionsdetails);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [exibhitionsImage, setExibhitionsImage] = useState([]);
  const [video, setVideo] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 1,
  });

  const { title, status, description } = formData;
  const createIframeFromSrc = (srcLink) => {
    if (srcLink) {
      return `<iframe width="560" height="315" src="${srcLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    } else {
      return "";
    }
  };
  useEffect(() => {
    dispatch(fetchExibhitionsDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (loading === "fulfilled" && exibhitionsdetails) {
      const { exibhitionsImages, video, ...exibhitions } = exibhitionsdetails;
      setFormData(exibhitions);
      setExibhitionsImage(exibhitionsImages);
      const iframeString = createIframeFromSrc(video ?? "");
      setVideo(iframeString);
    }
  }, [loading, exibhitionsdetails]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  /**vedio logic here */
  function extractSrcFromIframe(iframeCode) {
    const match = iframeCode.match(/src=["'](.*?)["']/);
    if (match && match.length > 1) {
      return match[1];
    } else {
      // Return a default URL or handle the error appropriately
      return "";
    }
  }
  /**new add video code here */
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  const handleImage = (e) => {
    e.preventDefault();
    const { files } = e.target;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
        setExibhitionsImage((prevImages) => [
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
    setExibhitionsImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    if (imgloc === "Server") {
      await axiosInstance.put(`/api/exibhitions/${id}/${image}`);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (exibhitionsImage?.length > 10) {
      return toastError("You can't add more than 10 images!");
    }

    let exibhitionsData = new FormData();
    exibhitionsData.append("title", title);
    exibhitionsData.append("description", description);
    exibhitionsData.append("status", status);
    exibhitionsData.append("video", extractSrcFromIframe(video));

    for (let image of exibhitionsImage) {
      if (image.file) {
        exibhitionsData.append("exibhitionsimg", image.file);
      }
    }

    const updateddata = {
      id,
      exibhitionsData,
    };

    dispatch(updateExibhitions(updateddata));
    navigate("/admin/exibhitions");
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
                          <h3 className="m-0">Exibhitions</h3>
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
                            <div className="mb-3">
                              {/** video logic started here */}
                              <div style={{ marginLeft: "30px" }}>
                                {exibhitionsdetails && (
                                  <div>
                                    <h5 className="my-2">
                                      Enter YouTube Embed Code
                                    </h5>
                                    <input
                                      style={{ width: "50%" }}
                                      type="text"
                                      className="form-control"
                                      name="video"
                                      value={video || ""}
                                      onChange={handleChange}
                                      placeholder="Paste your YouTube embed code here..."
                                    />
                                    <br></br>
                                    <br></br>
                                    {video && (
                                      <iframe
                                        width="560"
                                        height="315"
                                        src={extractSrcFromIframe(video)}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                      ></iframe>
                                    )}
                                  </div>
                                )}
                              </div>
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
                                {exibhitionsImage &&
                                  exibhitionsImage?.length !== 0 &&
                                  exibhitionsImage.map((image, index) =>
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
                                          src={`${REACT_APP_URL}/images/exibhitions/${image}`}
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

export default EditExibhitions;
