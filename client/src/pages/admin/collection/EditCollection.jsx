import { useEffect, useRef, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_URL } from "../../../config";
import CalculateCustomizeProductPrice from "../../../components/productcard/CalculateCustomizeProductPrice";
import { getPriceForCollectionClient } from "../../../utils/varientimge/getPrice";

import {
  fetchCollectionsDetails,
  updateCollection,
} from "../../../redux/slices/collectionSlice";
import JoditEditor from "jodit-react";
// import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Preloader from "../../../components/preloader/Preloader";
import { FaTrash } from "react-icons/fa";
import { toastError } from "../../../utils/reactToastify";
import { axiosInstance } from "../../../config";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;
const VideoTypeRegex = /video\/(mp4)/gm;
const EditCollection = () => {
  const { loading, collectiondetails, products } = useSelector(
    (state) => state.collections
  );

  // const { data: alltags, isLoading } = useGetApi("/api/tags");
  // const { data: collection, isLoading: isloadingCollection } =
  //   useGetApi(`/api/collection`);

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCollectionsDetails(id));
  }, [dispatch, id]);

  const [formdata, setformdata] = useState({});
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(1);
  const [CollectionImage, setCollectionImage] = useState([]);
  const [mostSellingProduct, setMostSellingProduct] = useState(0);
  const [displaySequence, setDisplaySequence] = useState();

  // const [selected, setSelected] = useState([]);
  // const [Video, setVideo] = useState([]);
  // const [productVideo, setProductVideo] = useState([]);
  // const [selectedcollection, setSelectedCollection] = useState([]);
  const [video, setVideo] = useState("");
  const editor = useRef(null);

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const [productdescription, setProductDescription] = useState();

  const createIframeFromSrc = (srcLink) => {
    return `<iframe width="560" height="315" src="${srcLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
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

  useEffect(() => {
    if (
      loading === "fulfilled" &&
      Object.keys(collectiondetails).length !== 0
    ) {
      const {
        productTags,
        childCollections,
        description,
        CollectionImage,
        status,
        video,
        displaySequence,
        mostSellingProduct,
        CollectionVideo = [],
        ...collection
      } = collectiondetails;

      setStatus(status);
      setMostSellingProduct(mostSellingProduct);
      setformdata(collection);
      setDisplaySequence(displaySequence);
      setImages(CollectionImage);
      // setSelected(
      //   productTags?.map((p) => ({
      //     label: p.name,
      //     value: p._id,
      //   }))
      // );

      // setVideo(CollectionVideo);
      const iframeString = createIframeFromSrc(video);
      setVideo(iframeString);
      // setSelectedCollection(
      //   childCollections?.map((p) => ({
      //     label: p.title,
      //     value: p._id,
      //   }))
      // );
      setProductDescription(description);
    }
  }, [loading, collectiondetails]);

  const { title, seoMetaDescription, seoTitle, url } = formdata || {};

  const onChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const filteredtagvalue = selected.map((p) => {
    //   return p.value;
    // });

    // const filteredchildcollection = selectedcollection.map((p) => {
    //   return p.value;
    // });

    let collecttiondata = new FormData();
    collecttiondata.append("title", title);
    collecttiondata.append("description", productdescription);
    // collecttiondata.append("productTags", JSON.stringify(filteredtagvalue));
    collecttiondata.append("seoTitle", seoTitle);
    collecttiondata.append("status", status ?? 0);
    collecttiondata.append("mostSellingProduct", mostSellingProduct ?? 0);
    collecttiondata.append("seoMetaDescription", seoMetaDescription);
    collecttiondata.append("displaySequence", displaySequence);
    collecttiondata.append("video", extractSrcFromIframe(video));

    collecttiondata.append(
      "url",
      url === "" ? title.replace(/\s+/g, "-") : url.replace(/\s+/g, "-")
    );
    // collecttiondata.append(
    //   "childCollections",
    //   JSON.stringify(filteredchildcollection)
    // );

    for (let i = 0; i < CollectionImage.length; i++) {
      collecttiondata.append("CollectionImage", CollectionImage[i]);
    }

    const updateddata = {
      id,
      collectiondata: collecttiondata,
    };
    // console.log(productVideo, "productVideoproductVideo");
    // if (productVideo.length > 0) {
    //   await uploadVideoHandler();
    // }
    dispatch(updateCollection(updateddata));
    navigate("/admin/collection");
  };
  // const uploadVideoHandler = async () => {
  //   try {
  //     // /api/product/uploadProductVideo/name
  //     let uploadProductVideo = new FormData();

  //     for (let i = 0; i < productVideo.length; i++) {
  //       uploadProductVideo.append("uploadCollectionVideo", productVideo[i]);
  //     }
  //     await axiosInstance.put(
  //       `/api/collection/uploadCollectionVideo/name/${id}`,
  //       uploadProductVideo,
  //       {
  //         headers: {
  //           token: localStorage.getItem("token"),
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
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
        await axiosInstance.delete(`/api/collection/${id}/${image}`);
      } catch (error) {}
    }
  };
  /**new add video code here */
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  // const handleVideo = (e) => {
  //   // e.preventDefault();

  //   try {
  //     console.log("running video");
  //     const { files } = e.target;

  //     const validVideoFiles = [];

  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       console.log(file, "filesfilesfiles");
  //       if (file.type.match(VideoTypeRegex) && file.size < 40000000) {
  //         validVideoFiles.push(file);
  //       }
  //     }

  //     if (validVideoFiles.length) {
  //       setProductVideo(validVideoFiles);
  //       handleVideoFiles(validVideoFiles);
  //       return;
  //     }

  //     toastError("Selected Video are not of valid type!");
  //   } catch (error) {
  //     console.log(error, "error");
  //   }
  // };

  // const handleVideoFiles = (files) => {
  //   const fileObjects = files.map((file) => ({
  //     file,
  //     preview: URL.createObjectURL(file),
  //   }));
  //   setVideo((prevImages) => [...prevImages, ...fileObjects]);
  // };

  // const handleVideoRemove = async (index, imgloc, image) => {
  //   const newImages = [...Video];

  //   newImages.splice(index, 1);
  //   setVideo(newImages);

  //   if (imgloc === "Server") {
  //     await axiosInstance.delete(`/api/collection/delete/video/${id}/${image}`);
  //   }
  // };

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }
  /** calculate price of customize product */
  const calculateCustomizedPrice = (productDetails, combinations, priceFor) => {
    if (productDetails && combinations?.length > 0) {
      const { DefaultWidth, DefaultHeight } = productDetails || {};

      const totalCustomizedPrice =
        productDetails[priceFor] +
        getPriceForCollectionClient(productDetails, combinations, {
          DefaultWidth,
          DefaultHeight,
        });

      return totalCustomizedPrice;
    }
    return 0;
  };

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
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Shipping">
                                Title
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="Shipping"
                                name="title"
                                value={title}
                                onChange={onChange}
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
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
                          <div className="row mb-3">
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
                                name="isRoot"
                                value={isRoot}
                                onChange={onChange}
                              >
                                <option value="">Select Parent</option>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                              </select>
                            </div> */}
                            {/* 
                            {collection && (
                              <div className="col-md-4">
                                <label
                                  className="form-label"
                                  htmlFor="FeaturedProducts"
                                >
                                  Child Collection
                                </label>
                                <MultiSelect
                                  // Remove Same Collection
                                  options={collection
                                    .map((p) =>
                                      p._id === id
                                        ? null
                                        : {
                                            label: p.title,
                                            value: p._id,
                                          }
                                    )
                                    .filter((p) => p !== null)}
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
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Title"
                                value={seoTitle}
                                name="seoTitle"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Description (Seo)
                            </label>
                            <textarea
                              type="text"
                              className="form-control"
                              id="Description"
                              placeholder="Description"
                              defaultValue={""}
                              name="seoMetaDescription"
                              value={seoMetaDescription}
                              onChange={onChange}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Product Image
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
                              {images?.length !== 0 &&
                                images.map((image, index) => (
                                  <>
                                    {image.file ? (
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
                                      <>
                                        <div
                                          className="image-area col-3"
                                          key={index}
                                        >
                                          <img
                                            loading="lazy"
                                            src={`${REACT_APP_URL}/images/collection/${image}`}
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
                                              handleRemove(
                                                index,
                                                "Server",
                                                image
                                              )
                                            }
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </>
                                ))}
                            </div>
                          </div>
                          <br></br>
                          <br></br>
                          {/* UPLOAD VIDEO */}
                          <div className="mb-3">
                            {/** video logic started here */}
                            {console.log("video", extractSrcFromIframe(video))}

                            <div style={{ marginLeft: "30px" }}>
                              {collectiondetails && (
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
                            {/* <div className="upload-container">
                              <center>
                                <input
                                  type="file"
                                  id="file_upload"
                                  multiple
                                  onChange={handleVideo}
                                />
                              </center>
                            </div> */}
                            {/* <div
                              className="preview-container d-flex row"
                              style={{ padding: "0px", marginTop: "30px" }}
                            >
                              {Video?.length !== 0 &&
                                Video.map((videoFile, index) => (
                                  <>
                                    {videoFile.file ? (
                                      <div
                                        className="productimage-area col-3"
                                        key={index}
                                      >
                                        <video
                                          width="100%"
                                          height="100%"
                                          // progress={true}
                                          // autoPlay=""
                                          // loop=""
                                          controls={true}
                                        >
                                          <source
                                            src={videoFile.preview}
                                            type="video/mp4"
                                          />
                                        </video>

                                        <button
                                          className="productremove-image"
                                          type="button"
                                          style={{ display: "inline" }}
                                          onClick={() =>
                                            handleVideoRemove(
                                              index,
                                              "Local",
                                              false
                                            )
                                          }
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <div
                                          className="productimage-area col-3"
                                          key={videoFile}
                                        >
                                          <video
                                            width="100%"
                                            height="100%"
                                            // progress={true}
                                            // autoPlay=""
                                            // loop=""
                                            key={videoFile}
                                            controls={true}
                                          >
                                            <source
                                              src={`${REACT_APP_URL}/video/CollectionVideo/${videoFile}`}
                                              type="video/mp4"
                                            />
                                          </video>
                                          <button
                                            className="productremove-image"
                                            type="button"
                                            style={{ display: "inline" }}
                                            onClick={() =>
                                              handleVideoRemove(
                                                index,
                                                "Server",
                                                videoFile
                                              )
                                            }
                                          >
                                            <FaTrash />
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </>
                                ))}
                            </div> */}
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <label className="form-label" htmlFor="Shipping">
                                Url Identifier
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="Shipping"
                                name="url"
                                value={url}
                                onChange={onChange}
                              />
                            </div>

                            <div className="col-md-6">
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
                                value={mostSellingProduct || 0}
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
                                value={displaySequence || null}
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

                        {products && products.length > 0 && (
                          <>
                            <center className="mt-3">
                              <h6>Product List </h6>
                            </center>

                            <div className="table-responsive">
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th scope="col">Sr. No.</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Sale Price</th>
                                    {/* <th scope="col">Tags</th> */}

                                    {/* <th scope="col">Vendor</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {loading === "fulfilled" &&
                                    products &&
                                    products.map((p, index) => {
                                      return p?.ProductStatus === "Active" ? (
                                        <>
                                          <tr key={p._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                              <img
                                                loading="lazy"
                                                //   src="http://localhost:7000/images/product/productimg-1684237336836.png"
                                                src={`${REACT_APP_URL}/images/product/${p.ProductImage[0]}`}
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                }}
                                              />{" "}
                                              &nbsp; &nbsp;
                                            </td>
                                            <td>
                                              <Link
                                                to={`/product/${title}/${p?.Urlhandle}`}
                                              >
                                                {p?.ProductName}
                                              </Link>
                                            </td>
                                            <td>
                                              <span
                                                className={
                                                  p.ProductStatus === "Active"
                                                    ? "bg-success p-2 rounded"
                                                    : "bg-danger p-2 rounded"
                                                }
                                                style={{ fontSize: "10px" }}
                                              >
                                                {p.ProductStatus}
                                              </span>
                                            </td>
                                            <td>{p.relatedData[0].MRP}</td>
                                            <td>
                                              {p.relatedData[0].SalePrice}
                                            </td>
                                          </tr>
                                        </>
                                      ) : (
                                        <>
                                          <tr key={p._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                              <img
                                                loading="lazy"
                                                //   src="http://localhost:7000/images/product/productimg-1684237336836.png"
                                                src={`${REACT_APP_URL}/images/product/${p?.productId?.ProductImage[0]}`}
                                                style={{
                                                  width: "30px",
                                                  height: "30px",
                                                }}
                                              />{" "}
                                              &nbsp; &nbsp;
                                            </td>
                                            <td>
                                              <Link
                                                to={`/admin/customized-product-detaills/${p?.productId?.ProductName}/${p?.productId?._id}`}
                                              >
                                                {p?.productId?.ProductName}
                                              </Link>
                                            </td>
                                            <td>
                                              <span
                                                className={
                                                  p?.productId
                                                    ?.ProductStatus === "Active"
                                                    ? "bg-success p-2 rounded"
                                                    : "bg-danger p-2 rounded"
                                                }
                                                style={{ fontSize: "10px" }}
                                              >
                                                {p?.productId?.ProductStatus}
                                              </span>
                                            </td>
                                            <td>
                                              <CalculateCustomizeProductPrice
                                                key={p?._id}
                                                calculateCustomizedPrice={
                                                  calculateCustomizedPrice
                                                }
                                                product={p?.productId}
                                                productCombination={
                                                  p?.productId
                                                }
                                                combination={p}
                                              />
                                            </td>
                                            <td>
                                              <CalculateCustomizeProductPrice
                                                key={p?._id}
                                                calculateCustomizedPrice={
                                                  calculateCustomizedPrice
                                                }
                                                product={p?.productId}
                                                productCombination={
                                                  p?.productId
                                                }
                                                combination={p}
                                              />
                                              {/* {p.relatedData[0].SalePrice} */}
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </>
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

export default EditCollection;
