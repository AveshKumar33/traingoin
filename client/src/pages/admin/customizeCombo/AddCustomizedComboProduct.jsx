import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { createCustomizedComboProduct } from "../../../redux/slices/customizeComboSlice";
import { toastError } from "../../../utils/reactToastify";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddCustomizedComboProduct = () => {
  const { loading } = useSelector((state) => state.customizeCombo);

  const [formData, setFormData] = useState({
    Name: "",
    Title: "",
    status: 1,
    Description: "",
    TitleSeo: "",
    DescriptionSeo: "",
  });
  const navigate = useNavigate();

  const [productImage, setProductImage] = useState({ image: "", preview: "" });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let productData = new FormData();

    productData.append("productimg", productImage.image);

    for (let key in formData) {
      productData.append(key, formData[key]);
    }

    dispatch(createCustomizedComboProduct(productData));

    if (loading === "fulfilled") {
      setFormData({
        Name: "",
        Title: "",
        status: 1,
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
                          <h3 className="m-0">Product Dot Bundle</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row">
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
                                id="Title"
                                required
                                placeholder="Title SEO"
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
                                required
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>

                            <div className="col-md-12 mt-2">
                              <label className="form-label" htmlFor="Title">
                                Image ("Image Size should less than equal to 10
                                MB")
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="file"
                                placeholder="Image"
                                name="Image"
                                required
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

                              {productImage.preview && (
                                <img
                                  style={{
                                    width: "200px",
                                    height: "210px",
                                    marginTop: "2px",
                                  }}
                                  src={productImage.preview}
                                  alt="_profilemm"
                                />
                              )}
                            </div>
                          </div>

                          {/* 
                          <div className="main-title">
                            <h5 className="my-2">Add Filter Tag</h5>
                          </div> */}

                          {/* <div className="row mb-3">
                            {FiltersData &&
                              FiltersData.length > 0 &&
                              FiltersData.map((ele) => {
                                return (
                                  <div className="col-md-4" key={ele?.Name}>
                                    <AddFilterTag
                                      data={ele}
                                      AddTagData={AddTagData}
                                      TagsData={[]}
                                    />
                                  </div>
                                );
                              })}
                          </div> */}

                          {/* <div className="row mb-3">
                            {CollectionFilters &&
                              CollectionFilters.length > 0 &&
                              CollectionFilters.map((ele) => {
                                return (
                                  <div
                                    className="col-md-4"
                                    key={ele?.filterName}
                                  >
                                    <AddFilterTag
                                      data={ele}
                                      AddTagData={AddTagData}
                                      selectedData={[]}
                                      TagsData={[]}
                                    />
                                  </div>
                                );
                              })}
                          </div> */}

                          {/* Handle Image Components */}
                          {/* <hr />
                          <div className="main-title">
                            <h5 className="my-2">Create Room</h5>
                          </div> */}
                          {/* 
                          <ImageComponent
                            setDotPosition={setDotPosition}
                            dotPosition={dotPosition}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                          />

                          <br></br> */}

                          <center className="mt-2">
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

export default AddCustomizedComboProduct;
