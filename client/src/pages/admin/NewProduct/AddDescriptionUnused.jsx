import React, { useEffect, useRef, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import TopHeader from "../../../components/topheader/TopHeader";
import JoditEditor from "jodit-react";
import { FaTrash } from "react-icons/fa";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import { axiosInstance } from "../../../config";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { REACT_APP_URL } from "../../../config";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddDescription = () => {
  const { id } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const _id = queryParams.get("_id");
  const Mode = queryParams.get("Mode");
  // Mode is TRUE means is EDIT a Description

  const [ProductImage, setProductImage] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [Title, setTitle] = useState();
  const [images, setImages] = useState([]);
  const [Descriptions, setDescriptions] = useState();
  const editor = useRef(null);
  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let productDescriptions = new FormData();

    productDescriptions.append("Title", Title);
    productDescriptions.append("Descriptions", Descriptions);
    productDescriptions.append("Product", id);

    for (let i = 0; i < ProductImage.length; i++) {
      productDescriptions.append("productimg", ProductImage[i]);
    }

    try {
      const { data } = await axiosInstance.post(
        "/api/ProductDescriptions",
        productDescriptions,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
      navigate(`/admin/product-new/view-description/${id}`);
      toastSuceess(data.message);
    } catch (error) {
      setLoading(false);
    }
  };

  const UpdateHandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let productDescriptions = new FormData();

    productDescriptions.append("Title", Title);
    productDescriptions.append("Descriptions", Descriptions);
    productDescriptions.append("Product", id);

    for (let i = 0; i < ProductImage.length; i++) {
      productDescriptions.append("productimg", ProductImage[i]);
    }

    try {
      const { data } = await axiosInstance.put(
        `/api/ProductDescriptions/${_id}`,
        productDescriptions,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      setLoading(false);
      navigate(`/admin/product-new/view-description/${id}`);
      toastSuceess(data.message);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    const validImageFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
        validImageFiles.push(file);
      }
    }

    if (validImageFiles.length) {
      setProductImage(validImageFiles);
      handleFiles(validImageFiles);
      return;
    }
    e.target.value = null;
    toastError("Selected images are not of valid type or size!");
  };

  const handleFiles = (files) => {
    const fileObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...fileObjects]);
  };

  const handleRemove = async (index, imgloc, image) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    if (imgloc === "Server") {
      try {
        await axiosInstance.delete(
          `/api/ProductDescriptions/deleteImg/${_id}/${image}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
      } catch (error) {
        console.log(error, "check this err");
      }
    }
  };

  const getProductDescription = async () => {
    try {
      const {
        data: { data },
      } = await axiosInstance.get(`/api/ProductDescriptions/${_id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setTitle(data.Title);
      setImages(data.Picture);
      setDescriptions(data.Descriptions);
    } catch (error) {
      console.log(error, "getProductDescription");
    }
  };

  useEffect(() => {
    if (_id && Mode) {
      getProductDescription();
    }
  }, []);
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
                <div className="col-lg-12 p-3" style={{ float: "left" }}>
                  <div className="white_card card_height_100 mb_30">
                    <div className="">
                      <div className="box_header m-0">
                        <div className="main-title">
                          <h3 className="m-0">
                            {!Mode
                              ? " Create Product Description"
                              : " Edit Product Description"}
                          </h3>
                        </div>
                      </div>
                      <p className="py-2">
                        <Link
                          to={`/`}
                          style={{ color: "#707087", fontSize: 16 }}
                        >
                          <i className="fa-solid fa-house-user"></i>
                        </Link>{" "}
                        &nbsp;
                        <i
                          className="fa fa-chevron-right"
                          style={{ fontSize: 16 }}
                        />{" "}
                        <Link
                          style={{ fontSize: 16 }}
                          to={`/admin/product-new`}
                        >
                          {" "}
                          Products
                        </Link>{" "}
                        {Mode && (
                          <>
                            &nbsp;
                            <i
                              className="fa fa-chevron-right"
                              style={{ fontSize: 16 }}
                            />{" "}
                            <Link
                              style={{ fontSize: 16 }}
                              to={`/admin/product-new/view-description/${id}`}
                            >
                              {" "}
                              View Description
                            </Link>{" "}
                          </>
                        )}
                        &nbsp;
                        <i
                          className="fa fa-chevron-right"
                          style={{ fontSize: 16 }}
                        />{" "}
                        <Link style={{ fontSize: 16 }}>
                          {!Mode ? "Create Description" : "Edit Description"}
                        </Link>{" "}
                      </p>
                    </div>
                    <div className="">
                      <div className="">
                        <form
                          onSubmit={Mode ? UpdateHandleSubmit : handleSubmit}
                        >
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Title
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                required
                                placeholder="Title"
                                name="Title"
                                value={Title}
                                onChange={(e) => setTitle(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="Description"
                              >
                                Description
                              </label>
                              <JoditEditor
                                ref={editor}
                                value={Descriptions}
                                config={config}
                                required
                                tabIndex={1} // tabIndex of textarea
                                onBlur={(newContent) =>
                                  setDescriptions(newContent)
                                } // preferred to use only this option to update the content for performance reasons
                                onChange={(newContent) => {}}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Description Image ("Image Size should less than or
                              equal to 10MB")
                            </label>
                            <div className="upload-container">
                              <center>
                                <input
                                  type="file"
                                  id="file_upload"
                                  multiple
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </center>
                            </div>
                            <div
                              className="preview-container d-flex row"
                              style={{ padding: "0px", marginTop: "30px" }}
                            >
                              {images?.length !== 0 &&
                                images.map((image, index) =>
                                  image.file ? (
                                    <div
                                      className="productimage-area col-3"
                                      key={index}
                                    >
                                      <img
                                        loading="lazy"
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
                                        loading="lazy"
                                        src={`${REACT_APP_URL}/images/product/${image}`}
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

                          <center>
                            {loading ? (
                              <button className="btn btn-primary">
                                Loading ....
                              </button>
                            ) : (
                              <button type="submit" className="btn btn-primary">
                                Save
                              </button>
                            )}
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
                    Designed & Developed By{" "}
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

export default AddDescription;
