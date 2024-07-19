import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCollectionFilters } from "../../../redux/slices/newCollectionFilterSlice";
import { useEffect, useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
// import ImageComponent from "./ImageComponent";
import { createDotCustomizedProduct } from "../../../redux/slices/newDotCustomizedProductSlice";
// import { toastError, toastSuceess } from "../../../utils/reactToastify";
import AddFilterTag from "./AddFilterTag";
import { MultiSelect } from "react-multi-select-component";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";

const AddDotCustomizedProduct = () => {
  const { loading } = useSelector((state) => state.newDotCustomization);
  const { CollectionFilters } = useSelector(
    (state) => state.newCollectionFilter
  );

  const { data: alltags } = useGetApi("/api/tags");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dotproductname, setdotproductname] = useState("");
  const [Tags, setTags] = useState({});
  const [video, setVideo] = useState("");
  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    status: 1,
    video: "",
    Description: "",
    displaySequence: null,
    TitleSeo: "",
    DescriptionSeo: "",
  });

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

  /** add video field  */
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagArrays = Object.values(Tags);
    const flattenedArray = tagArrays.flat();

    const filteredTagValue = selected.map((p) => {
      return p.value;
    });

    let dotproductdata = new FormData();
    dotproductdata.append("name", dotproductname);
    dotproductdata.append("Tags", JSON.stringify(flattenedArray));
    dotproductdata.append("productTags", JSON.stringify(filteredTagValue));
    dotproductdata.append("video", extractSrcFromIframe(video));

    for (let key in formData) {
      dotproductdata.append(key, formData[key]);
    }
    dispatch(createDotCustomizedProduct(dotproductdata));

    if (loading === "fulfilled") {
      // navigate(`/admin/dot-customized-product`);
      navigate(-1);
    }
  };
  const AddTagData = (key, value) => {
    const arr = value.map((data) => data.value);
    setTags((pre) => {
      return {
        ...pre,

        [key]: arr,
      };
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  /**fetch new collection filter  */
  useEffect(() => {
    dispatch(fetchCollectionFilters());
  }, [dispatch]);

  useEffect(() => {
    // getFilters();
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
                <div className="col-lg-12" style={{ float: "left" }}>
                  <div className="white_card card_height_100 mb_30">
                    <div className="white_card_header">
                      <div className="box_header m-0">
                        <div className="main-title">
                          <h3 className="m-0"> Customized Dot Bundle</h3>
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
                                onChange={(e) =>
                                  setdotproductname(e.target.value)
                                }
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
                              <label
                                className="form-label"
                                htmlFor="Display Sequence"
                              >
                                Display Sequence
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="DisplaySequence"
                                required
                                placeholder="Display Sequence"
                                name="displaySequence"
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
                            <div className="col-md-12">
                              <div>
                                {console.log(
                                  "video",
                                  extractSrcFromIframe(video)
                                )}

                                <h5 className="my-2">
                                  Enter YouTube Embed Code
                                </h5>
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
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Tags
                              </label>
                              {alltags && (
                                <MultiSelect
                                  options={alltags.map((p) => {
                                    return {
                                      label: p.name,
                                      value: p._id,
                                    };
                                  })}
                                  required
                                  value={selected}
                                  onChange={setSelected}
                                  labelledBy="Select Tag"
                                />
                              )}
                            </div>
                          </div>

                          <div className="main-title">
                            <h5 className="my-2">Add Filter Tag</h5>
                          </div>

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
                          <div className="row mb-3">
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
                                      TagsData={[]}
                                      selectedData={[]}
                                    />
                                  </div>
                                );
                              })}
                          </div>

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

export default AddDotCustomizedProduct;
