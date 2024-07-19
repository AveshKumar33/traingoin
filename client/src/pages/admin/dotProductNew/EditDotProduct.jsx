import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { fetchCollectionFilters } from "../../../redux/slices/newCollectionFilterSlice";
import { MultiSelect } from "react-multi-select-component";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";

// import Preloader from "../../../components/preloader/Preloader";
import {
  fetchdotProductDetails,
  updatedotProduct,
} from "../../../redux/slices/dotProductSliceNew";
import { toastError } from "../../../utils/reactToastify";
import AddFilterTag from "./AddFilterTag";

const EdiDotProduct = () => {
  const { id } = useParams();
  const { loading, dotProductdetails } = useSelector(
    (state) => state.newDotProduct
  );
  const { CollectionFilters } = useSelector(
    (state) => state.newCollectionFilter
  );

  const { data: allTags } = useGetApi("/api/tags");

  const [Tags, setTags] = useState({});
  const [video, setVideo] = useState("");
  const [selected, setSelected] = useState([]);
  const [iframeString, setIframeString] = useState("");
  const AddTagData = (key, value) => {
    const arr = value.map((data) => data.value);
    setTags((pre) => {
      return {
        ...pre,

        [key]: arr,
      };
    });
  };

  const [dotproductname, setdotproductname] = useState("");
  // const [ImagefromServer, setImagefromServer] = useState("");
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    displaySequence: null,
    TitleSeo: "",
    DescriptionSeo: "",
    status: null,
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  /**fetch new collection filter  */
  useEffect(() => {
    dispatch(fetchCollectionFilters());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchdotProductDetails(id));
  }, [dispatch, id]);
  console.log("dotProductdetails", dotProductdetails);

  useEffect(() => {
    if (loading === "fulfilled" && dotProductdetails.length > 0) {
      const createIframeFromSrc = (srcLink) => {
        return `<iframe width="560" height="315" src="${srcLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      };
      const {
        name,
        Description,
        DescriptionSeo,
        displaySequence,
        TitleSeo,
        Title,
        video,
        status,
        productTags = [],
      } = dotProductdetails[0];
      if (video) {
        const iframeString = createIframeFromSrc(video);
        setVideo(iframeString);
        setIframeString(iframeString);
      }
      setFormData({
        Description,
        DescriptionSeo,
        displaySequence,
        TitleSeo,
        Title,
        video,
        status,
      });

      setSelected(
        productTags.map((p) => {
          return {
            label: p.name,
            value: p._id,
          };
        })
      );

      // getFilters();
      setdotproductname(name);
    }
  }, [loading, dotProductdetails]);
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
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const dotproduct = dotPosition
    //   .map((p) => {
    //     if (p.productId) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   })
    //   .every((p) => p === true);

    // if (!dotproduct) {
    //   return toastError("Add Product To each Dot");
    // }

    if (dotproductname === "") {
      // alert("Fill all the fields")
      toastError("Fill all the fields");
      return;
    }
    // if (dotPosition == []) {
    //   toastError("Mark dot on Images");
    //   // alert("Mark dot on Images")
    //   return;
    // }

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

    const updateddata = {
      id,
      dotproductdata,
    };

    dispatch(updatedotProduct(updateddata));

    setdotproductname("");
    setFormData({
      Title: "",
      status: null,
      Description: "",
      TitleSeo: "",
      video: "",
      DescriptionSeo: "",
    });
    setTags({});
    navigate("/admin/dot-product-new");
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
                                value={dotproductname || ""}
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
                                htmlFor="Display Sequence"
                              >
                                Display Sequence
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="DisplaySequence"
                                required
                                value={formData.displaySequence || null}
                                placeholder="Display Sequence"
                                name="displaySequence"
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
                          </div>

                          {/** video logic started here */}
                          <div style={{ marginLeft: "30px" }}>
                            {iframeString && (
                              <div>
                                <h5 className="my-2">
                                  Enter YouTube Embed Code
                                </h5>
                                <hr />
                                {console.log(
                                  "video",
                                  extractSrcFromIframe(video)
                                )}
                                <input
                                  style={{ height: "40px", width: "950px" }}
                                  className="form-control"
                                  type="text"
                                  name="video"
                                  placeholder="Paste your YouTube embed code here..."
                                  value={video || ""}
                                  onChange={handleChange}
                                />
                                <br></br>
                                <br></br>
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
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Tags
                              </label>
                              {allTags && allTags?.length > 0 && (
                                <MultiSelect
                                  options={allTags.map((p) => {
                                    return {
                                      label: p.name,
                                      value: p._id,
                                    };
                                  })}
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
                                let myTags = dotProductdetails?.Tags ?? {};

                                return (
                                  <div className="col-md-4" key={ele?.Name}>
                                    <AddFilterTag
                                      data={ele}
                                      AddTagData={AddTagData}
                                      TagsData={myTags[ele?.Name] ?? []}
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
                                  <div className="col-md-4" key={ele?._id}>
                                    <AddFilterTag
                                      data={ele}
                                      selectedData={dotProductdetails}
                                      AddTagData={AddTagData}
                                      TagsData={[]}
                                    />
                                  </div>
                                );
                              })}
                          </div>

                          {/*

                              const selectedData =
                                  dotProductdetails[index] &&
                                  dotProductdetails[index]?.data &&
                                  dotProductdetails[index]?.data[0]?._id ===
                                    ele?._id
                                    ? dotProductdetails[index]?.data
                                    : [];

 */}

                          {/* Handle Image Components */}

                          {/* <hr /> */}

                          {/* <div className="main-title">
                            <h5 className="my-2">Add Image Dot</h5>
                          </div> */}

                          {/* <ImageComponent
                            setDotPosition={setDotPosition}
                            dotPosition={dotPosition}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            setImagefromServer={setImagefromServer}
                            ImagefromServer={ImagefromServer}
                          /> */}
                          {/* <br></br>
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

export default EdiDotProduct;
