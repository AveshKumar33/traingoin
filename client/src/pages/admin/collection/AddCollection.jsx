import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { MultiSelect } from "react-multi-select-component";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { createCollection } from "../../../redux/slices/collectionSlice";
import { FaTrash } from "react-icons/fa";
import { toastError } from "../../../utils/reactToastify";
import { axiosInstance } from "../../../config";
import MultiCollection from "./MultiCollection";
import { returnSearchArrOfCollection } from "../../../utils/usefullFunction";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;
const AddCollection = () => {
  const { loading } = useSelector((state) => state.collections);
  // const { data: alltags } = useGetApi("/api/tags");
  const { data: collection } = useGetApi(`/api/collection`);
  const [images, setImages] = useState([]);
  const [CollectionImage, setCollectionImage] = useState([]);
  // const [selected, setSelected] = useState([]);
  const [SelectedCollectionType, setSelectedCollectionType] = useState([]);
  const [isSelectedCollection, setisSelectedCollection] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const editor = useRef(null);

  const [productdescription, setProductDescription] = useState();

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  //Collection Data
  const [title, seTitle] = useState("");
  const [selectedcollection, setSelectedCollection] = useState([]);
  const [seotitle, setseotitle] = useState("");
  const [status, setStatus] = useState(1);
  const [mostSellingProduct, setMostSellingProduct] = useState(0);
  const [seometadesc, setseometadesc] = useState("");
  const [url, seturl] = useState("");
  const [video, setVideo] = useState("");
  const [displaySequence, setDisplaySequence] = useState();

  // const [isRoot, setisRoot] = useState("");
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

  const handlecollection = async (e) => {
    e.preventDefault();

    if (productdescription === "" || !productdescription) {
      return alert("Collection Description Required");
    }
    if (!displaySequence) {
      return toastError("Please enter Display Sequence");
    }

    // const filteredtagvalue = selected.map((p) => {
    //   return p.value;
    // });

    const filteredchildcollection = selectedcollection.map((p) => {
      return p.value;
    });

    const returnSearchArr = returnSearchArrOfCollection(SelectedCollectionType);

    // console.log(returnSearchArr, "returnSearchArr");
    // const collecttiondata = {
    //   title: title,
    //   description: productdescription,
    //   productTags: filteredtagvalue,
    //   seoTitle: seotitle,
    //   seoMetaDescription: seometadesc,
    //   url: url === "" ? title.replace(/\s+/g, "-") : url.replace(/\s+/g, "-"),
    //   isRoot: isRoot,
    //   childCollections: filteredchildcollection,
    // };

    let collecttiondata = new FormData();
    collecttiondata.append("title", title);
    collecttiondata.append("description", productdescription);
    // collecttiondata.append("productTags", JSON.stringify(filteredtagvalue));
    collecttiondata.append("seoTitle", seotitle);
    collecttiondata.append("seoMetaDescription", seometadesc);
    collecttiondata.append("status", status);
    collecttiondata.append("mostSellingProduct", mostSellingProduct);
    collecttiondata.append("displaySequence", displaySequence);
    collecttiondata.append("video", extractSrcFromIframe(video));

    collecttiondata.append(
      "isRoot",
      returnSearchArr.length === 0 ? true : false
    );
    collecttiondata.append(
      "url",
      url === "" ? title.replace(/\s+/g, "-") : url.replace(/\s+/g, "-")
    );

    collecttiondata.append("rootPath", JSON.stringify(returnSearchArr));

    for (let i = 0; i < CollectionImage.length; i++) {
      collecttiondata.append("CollectionImage", CollectionImage[i]);
    }
    dispatch(createCollection(collecttiondata));

    if (loading === "fulfilled") {
      navigate("/admin/collection");
    }
  };

  const handleRemove = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };
  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    const validImageFiles = [...CollectionImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size < 2000000) {
        validImageFiles.push(file);
      }
    }

    if (validImageFiles.length) {
      setCollectionImage(validImageFiles);
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
    setImages((prevImages) => [...fileObjects]);
  };

  const callInsuranceData = async () => {
    try {
      const {
        data: { data },
      } = await axiosInstance.get("/api/collection/getRootCollection");
      setSelectedCollectionType([{ data, value: "" }]);
    } catch (error) {
      console.log(error);
    }
  };
  /** add vedio field  */
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  useEffect(() => {
    callInsuranceData();
  }, []);

  return (
    <>
      <SideBar />
      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <Header />
        <div className="main_content_iner ">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="col-lg-12" style={{ float: "left" }}>
                  <div className="white_card card_height_100 mb_30">
                    <div className="white_card_header">
                      <div className="box_header m-0">
                        <div className="main-title">
                          <h3 className="m-0">Collection</h3>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="card-body">
                        {isSelectedCollection ? (
                          <div>
                            <div className="row">
                              {SelectedCollectionType &&
                                SelectedCollectionType?.length > 0 &&
                                SelectedCollectionType.map(
                                  (data, index) =>
                                    data &&
                                    data?.data?.length > 0 && (
                                      <MultiCollection
                                        key={data.value}
                                        Options={data}
                                        setSelectedCollectionType={
                                          setSelectedCollectionType
                                        }
                                        SelectedCollectionType={
                                          SelectedCollectionType
                                        }
                                        index={index}
                                        OptionsValue={data.value}
                                        IsFilter={true}
                                      />
                                    )
                                )}
                            </div>

                            <center>
                              <button
                                className="btn btn-primary mt-2"
                                onClick={() => {
                                  setisSelectedCollection(false);
                                }}
                              >
                                Next
                              </button>
                            </center>
                          </div>
                        ) : (
                          <form onSubmit={handlecollection}>
                            <div className="row mb-3">
                              <div className="col-md-12">
                                <label
                                  className="form-label"
                                  htmlFor="Shipping"
                                >
                                  Title
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="Shipping"
                                  required
                                  value={title}
                                  onChange={(e) => seTitle(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label"
                                htmlFor="Description"
                              >
                                Description
                              </label>
                              <JoditEditor
                                ref={editor}
                                value={productdescription}
                                config={config}
                                tabIndex={1} // tabIndex of textarea
                                onBlur={(newContent) =>
                                  setProductDescription(newContent)
                                } // preferred to use only this option to update the content for performance reasons
                                onChange={(newContent) => {}}
                              />
                            </div>
                            <div className="mb-3">
                              <label
                                className="form-label"
                                htmlFor="Description"
                              >
                                Product Image ("Image Size should less than
                                2MB")
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
                            <div className="row mb-3">
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
                              <br></br>
                              {/* <div className="col-md-4">
                                <label
                                  className="form-label"
                                  htmlFor="FeaturedProducts"
                                >
                                  Product Tags
                                </label>
                                {alltags && (
                                  <>
                                    <MultiSelect
                                      style={{ display: "unset" }}
                                      options={alltags.map((p) => {
                                        return {
                                          label: p.name,
                                          value: p._id,
                                        };
                                      })}
                                      value={selected}
                                      onChange={setSelected}
                                      labelledBy="Select Tag"
                                    />
                                  </>
                                )}
                            
                              </div> */}
                              {/* <div className="col-md-4">
                                <label
                                  className="form-label"
                                  htmlFor="FeaturedProducts"
                                >
                                  Is Parent
                                </label>
                                <select
                                  id="FeaturedProducts"
                                  className="form-control"
                                  required
                                  value={isRoot}
                                  onChange={(e) => setisRoot(e.target.value)}
                                >
                                  <option value="">Select Parent</option>
                                  <option value={true}>True</option>
                                  <option value={false}>False</option>
                                </select>
                              </div> */}
                              {/* {collection && (
                                <div className="col-md-4">
                                  <label
                                    className="form-label"
                                    htmlFor="FeaturedProducts"
                                  >
                                    Child Collection
                                  </label>
                                  <MultiSelect
                                    options={collection.map((p) => ({
                                      label: p.title,
                                      value: p._id,
                                    }))}
                                    value={selectedcollection}
                                    onChange={setSelectedCollection}
                                    labelledBy="Select Collection"
                                  />
                                </div>
                              )} */}
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-12">
                                <label className="form-label" htmlFor="Title">
                                  Title (Seo)
                                </label>
                                <input
                                  value={seotitle}
                                  required
                                  onChange={(e) => setseotitle(e.target.value)}
                                  type="Title"
                                  className="form-control"
                                  id="Title"
                                  placeholder="Title"
                                />
                              </div>
                            </div>
                            <div className="mb-3">
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
                                placeholder="Description"
                                required
                                value={seometadesc}
                                onChange={(e) => setseometadesc(e.target.value)}
                              />
                            </div>

                            <div className="row mb-3">
                              <div className="col-md-12">
                                <label
                                  className="form-label"
                                  htmlFor="Shipping"
                                >
                                  Url Identifier
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="Shipping"
                                  defaultValue={title.replace(/\s+/g, "-")}
                                  onChange={(e) => seturl(e.target.value)}
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
                                  id="FeaturedProducts"
                                  className="form-control"
                                  name="featuredproduct"
                                  required
                                  onChange={(e) => setStatus(e.target.value)}
                                >
                                  <option selected value="">
                                    Choose...
                                  </option>
                                  <option value={1}>Active</option>
                                  <option value={0}>Inactive</option>
                                </select>
                              </div>

                              <div className="col-md-6">
                                <label
                                  className="form-label"
                                  htmlFor="FeaturedProducts"
                                >
                                  Most selling product
                                </label>
                                <select
                                  id="mostSellingProduct"
                                  className="form-control"
                                  name="mostSellingProduct"
                                  required
                                  onChange={(e) =>
                                    setMostSellingProduct(e.target.value)
                                  }
                                >
                                  <option selected value="">
                                    Choose...
                                  </option>
                                  <option value={1}>Yes</option>
                                  <option value={0}>No</option>
                                </select>
                              </div>

                              <div className="col-md-6">
                                <label
                                  className="form-label"
                                  htmlFor="Display Sequence"
                                >
                                  Display Sequence
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="Display Sequence"
                                  placeholder="Display Sequence"
                                  required
                                  value={displaySequence}
                                  onChange={(e) =>
                                    setDisplaySequence(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <center>
                              <button type="submit" className="btn btn-primary">
                                Save
                              </button>
                            </center>
                          </form>
                        )}
                      </div>
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

export default AddCollection;
