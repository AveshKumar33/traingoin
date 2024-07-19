import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { useEffect, useRef, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createproject } from "../../../redux/slices/projectSlice";
import { fetchprojectCategory } from "../../../redux/slices/projectcategorySlice";
import JoditEditor from "jodit-react";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { FaTrash } from "react-icons/fa";
import { toastError } from "../../../utils/reactToastify";
/**all  product s type slices import here */
import { fetchAllProducts } from "../../../redux/slices/newProductSlice";
import { fetchdotProduct } from "../../../redux/slices/dotProductSliceNew";
import { fetchCustomizedProduct } from "../../../redux/slices/customizeProductSlice";
import { fetchDotCustomizedProduct } from "../../../redux/slices/newDotCustomizedProductSlice";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddProject = () => {
  const { loading, project } = useSelector((state) => state.project);
  const { loading: projectcategoryLoading, projectCategory } = useSelector(
    (state) => state.projectCategory
  );
  /**selecter single product s */
  const { products } = useSelector((state) => state.newProducts);
  /**selecter single dot product s */
  const { dotproducts } = useSelector((state) => state.newDotProduct);
  /**selecter customize product s */
  const { customizedproducts } = useSelector((state) => state.customizeProduct);
  /**selecter customize product s */
  const { dotCustomizedProducts } = useSelector(
    (state) => state.newDotCustomization
  );

  // const { loading: productLoading, products } = useSelector(
  //   (state) => state.products
  // );

  //

  const editor = useRef(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [projectName, setprojectName] = useState("");
  const [ProjectDescription, setProjectDescription] = useState("");
  const [selectedProjectCategory, setselectedProjectCategory] = useState({});
  const [singleProducts, setSingleProducts] = useState([]);
  const [dotSingleProduct, setDotSingleProduct] = useState([]);
  const [customizedProduct, setCustomizedProduct] = useState([]);
  const [customizeDotProduct, setCustomizeDotProduct] = useState([]);
  const [video, setVideo] = useState("");

  const [ProjectVideo, setProjectVideo] = useState("");
  const [images, setImages] = useState([]);
  const [projectimage, setProjectImage] = useState();

  /**fetch single all projects categories */
  useEffect(() => {
    dispatch(fetchprojectCategory());
  }, [dispatch]);

  /**fetch single all product s */
  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);
  /**fetch single dot all product s */
  useEffect(() => {
    dispatch(fetchdotProduct({}));
  }, [dispatch]);
  /**fetch customize all product s */
  useEffect(() => {
    dispatch(fetchCustomizedProduct({}));
  }, [dispatch]);
  /**fetch dot customize all product s */
  useEffect(() => {
    dispatch(fetchDotCustomizedProduct({}));
  }, [dispatch]);

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
  /** add vedio field  */
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const singleProduct = singleProducts.map((p) => {
      return p.value;
    });

    const dotSingleProducts = dotSingleProduct.map((p) => {
      return p.value;
    });

    const customizedProducts = customizedProduct.map((p) => {
      return p.value;
    });

    const customizeDotProducts = customizeDotProduct.map((p) => {
      return p.value;
    });

    let projectdata = new FormData();
    projectdata.append("ProjectName", projectName);
    projectdata.append("ProjectDescription", ProjectDescription);

    if (
      !selectedProjectCategory.value ||
      selectedProjectCategory.value === undefined
    ) {
      toastError("Project Category Required");
      return;
    }

    projectdata.append("ProjectCategory", selectedProjectCategory.value);
    projectdata.append("singleProducts", JSON.stringify(singleProduct));
    projectdata.append("dotSingleProduct", JSON.stringify(dotSingleProducts));
    projectdata.append("customizedProduct", JSON.stringify(customizedProducts));
    projectdata.append("video", extractSrcFromIframe(video));
    projectdata.append(
      "customizeDotProduct",
      JSON.stringify(customizeDotProducts)
    );

    for (let index = 0; index < projectimage.length; index++) {
      projectdata.append("projectimg", projectimage[index]);
    }

    projectdata.append("projectvideo", ProjectVideo);

    dispatch(createproject(projectdata));

    if (loading === "fulfilled") {
      navigate("/admin/project");
    }
  };

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    const validImageFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size < 2000000) {
        validImageFiles.push(file);
      }
    }

    if (validImageFiles.length) {
      setProjectImage(validImageFiles);
      handleFiles(validImageFiles);
      return;
    }
    toastError("Selected images are not of valid type!");
  };

  const handleFiles = (files) => {
    const fileObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...fileObjects]);
  };

  const handleRemove = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
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
                        <h3 className="m-0">Project </h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-12">
                            <label
                              className="form-label"
                              htmlFor="Project  Name"
                            >
                              Project Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Project  Name"
                              name="ProjectName"
                              placeholder="Project Name"
                              onChange={(e) => setprojectName(e.target.value)}
                            />
                          </div>
                          <div className="col-md-12">
                            <label
                              className="form-label"
                              htmlFor="Project Category Name"
                            >
                              Project Description
                            </label>
                            <JoditEditor
                              ref={editor}
                              value={ProjectDescription}
                              config={config}
                              required
                              tabIndex={1} // tabIndex of textarea
                              onBlur={(newContent) =>
                                setProjectDescription(newContent)
                              } // preferred to use only this option to update the content for performance reasons
                              onChange={(newContent) => {}}
                            />
                          </div>
                          <div className="col-md-6">
                            <label
                              className="form-label"
                              htmlFor="Project Category Name"
                            >
                              Project Category
                            </label>
                            {projectCategory && (
                              <>
                                <Select
                                  className="col-12"
                                  defaultValue={selectedProjectCategory}
                                  onChange={setselectedProjectCategory}
                                  options={projectCategory.map((p) => {
                                    return {
                                      label: p.Name,
                                      value: p._id,
                                    };
                                  })}
                                  placeholder="Select Project Category"
                                />
                              </>
                            )}
                          </div>

                          <div className="col-md-6">
                            <label
                              className="form-label"
                              htmlFor="Project Category Name"
                            >
                              Products Used
                            </label>

                            {products && products.length > 0 && (
                              <>
                                <MultiSelect
                                  options={products.map((p) => {
                                    return {
                                      label: p.ProductName,
                                      value: p._id,
                                    };
                                  })}
                                  required
                                  value={singleProducts}
                                  onChange={setSingleProducts}
                                  labelledBy="Select Product "
                                />
                              </>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label
                              className="form-label"
                              htmlFor="Project Category Name"
                            >
                              Dot Products Used
                            </label>

                            {dotproducts && dotproducts.length > 0 && (
                              <>
                                <MultiSelect
                                  options={dotproducts.map((p) => {
                                    return {
                                      label: p.name,
                                      value: p._id,
                                    };
                                  })}
                                  required
                                  value={dotSingleProduct}
                                  onChange={setDotSingleProduct}
                                  labelledBy="Select Product "
                                />
                              </>
                            )}
                          </div>
                          <div className="col-md-6">
                            <label
                              className="form-label"
                              htmlFor="Project Category Name"
                            >
                              Customized Products Used
                            </label>

                            {customizedproducts &&
                              customizedproducts.length > 0 && (
                                <>
                                  <MultiSelect
                                    options={customizedproducts.map((p) => {
                                      return {
                                        label: p.ProductName,
                                        value: p._id,
                                      };
                                    })}
                                    required
                                    value={customizedProduct}
                                    onChange={setCustomizedProduct}
                                    labelledBy="Select Product "
                                  />
                                </>
                              )}
                          </div>
                          <div className="col-md-6">
                            <label
                              className="form-label"
                              htmlFor="Project Category Name"
                            >
                              Dot Customized Products Used
                            </label>

                            {dotCustomizedProducts && (
                              <>
                                <MultiSelect
                                  options={dotCustomizedProducts.map((p) => {
                                    return {
                                      label: p.name,
                                      value: p._id,
                                    };
                                  })}
                                  required
                                  value={customizeDotProduct}
                                  onChange={setCustomizeDotProduct}
                                  labelledBy="Select Product "
                                />
                              </>
                            )}
                          </div>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Product Image ("Image Size should less than 2 MB"
                              )
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
                              {images?.length !== 0 &&
                                images.map((image, index) => (
                                  <>
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
                                        onClick={() => handleRemove(index)}
                                      >
                                        <FaTrash />
                                      </button>
                                    </div>
                                  </>
                                  // <div key={index} className="image-preview">
                                  //   <img
                                  //     src={image.preview}
                                  //     alt="Preview"
                                  //     style={{ height: "100px" }}
                                  //   />
                                  //   <button onClick={() => handleRemove(index)}>
                                  //     Remove
                                  //   </button>
                                  // </div>
                                ))}
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div>
                              {console.log(
                                "video",
                                extractSrcFromIframe(video)
                              )}

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

export default AddProject;
