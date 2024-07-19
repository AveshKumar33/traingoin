import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { REACT_APP_URL } from "../../../config";
// import Preloader from "../../../components/preloader/Preloader";

import { toastError } from "../../../utils/reactToastify";
import {
  fetchCustomizedComboProductDetails,
  updateCustomizedComboProduct,
} from "../../../redux/slices/customizeComboSlice";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const EdiDotProduct = () => {
  const { id } = useParams();
  const { loading, customizedComboProductDetails } = useSelector(
    (state) => state.customizeCombo
  );

  const [productImage, setProductImage] = useState({ image: "", preview: "" });

  const [formData, setFormData] = useState({
    Name: "",
    Title: "",
    Description: "",
    TitleSeo: "",
    DescriptionSeo: "",
    status: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCustomizedComboProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (loading === "fulfilled" && customizedComboProductDetails.length > 0) {
      const {
        Name,
        Description,
        DescriptionSeo,
        TitleSeo,
        Title,
        status,
        image,
      } = customizedComboProductDetails[0];

      setFormData({
        Name,
        Description,
        DescriptionSeo,
        TitleSeo,
        Title,
        status,
      });

      setProductImage((prevState) => ({ ...prevState, image: image }));
    }
  }, [loading, customizedComboProductDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let productdata = new FormData();

    productdata.append("productimg", productImage.image);
    for (let key in formData) {
      productdata.append(key, formData[key]);
    }

    const updateddata = {
      id,
      productdata,
    };

    dispatch(updateCustomizedComboProduct(updateddata));

    if (loading === "fulfilled") {
      setFormData({
        Name: "",
        Title: "",
        status: null,
        Description: "",
        TitleSeo: "",
        DescriptionSeo: "",
      });
      navigate("/admin/customized-combo-product");
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                          <h3 className="m-0">Edit Product Dot Bundle</h3>
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
                                name="Name"
                                value={formData.Name || ""}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
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
                                value={formData.Title || ""}
                                onChange={handleFormChange}
                              />
                            </div>
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
                                required
                                placeholder="Description"
                                value={formData.Description || ""}
                                name="Description"
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Title (Seo)
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="TitleSeo"
                                required
                                placeholder="Title SEO"
                                value={formData.TitleSeo || ""}
                                name="TitleSeo"
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="Description"
                              >
                                Description (Seo)
                              </label>
                              <textarea
                                type="text"
                                className="form-control"
                                id="Description"
                                required
                                value={formData.DescriptionSeo || ""}
                                placeholder="Description SEO"
                                name="DescriptionSeo"
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
                                value={formData?.status || 0}
                                required
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>

                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image ("Image Size should less than equal to 10
                                MB")
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Image"
                                placeholder="Image"
                                name="Image"
                                disabled
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (
                                    file.type.match(imageTypeRegex) &&
                                    file.size <= 10000000
                                  ) {
                                    setProductImage({
                                      image: file,
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
                              {productImage?.image &&
                                productImage?.preview === "" && (
                                  <img
                                    style={{
                                      width: "200px",
                                      height: "210px",
                                      marginTop: "2px",
                                    }}
                                    src={`${REACT_APP_URL}/images/product/${productImage?.image}`}
                                    alt="_profile"
                                  />
                                )}
                              {productImage?.preview && (
                                <img
                                  style={{
                                    width: "200px",
                                    height: "210px",
                                    marginTop: "2px",
                                  }}
                                  src={productImage?.preview}
                                  alt="_profilemm"
                                />
                              )}
                            </div>
                          </div>

                          <center>
                            {loading === "pending" ? (
                              <>
                                <button
                                  disabled
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Loading...
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Save
                                </button>
                              </>
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

export default EdiDotProduct;
