import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MultiSelect } from "react-multi-select-component";
import { FaTrash } from "react-icons/fa";
import { REACT_APP_URL, axiosInstance } from "../../../config";

import JoditEditor from "jodit-react";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { usePutApi } from "../../../utils/Customhooks/ApiCalls";
import TopHeader from "../../../components/topheader/TopHeader";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { toastError } from "../../../utils/reactToastify";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Preloader from "../../../components/preloader/Preloader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Backdrop, Box, Modal, Fade, Button } from "@mui/material";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: "5px",
};

const EditCustomoziedProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoading: puloading, doPut } = usePutApi(
    `/api/customized-product/${id}`
  );
  const { data: alltags } = useGetApi("/api/tags");
  const { data: attributes } = useGetApi(
    `/api/parameter/filter?filter=${true}`
  );
  const { data: getCollection } = useGetApi(
    "/api/collection/getCollectionByName"
  );

  const initialState = {
    ProductName: "",
    FeaturedProduct: "",
    ProductStatus: "",
    Urlhandle: "",
    SeoProductTitle: "",
    SeoMetaDesc: "",
    GSTIN: "",
    video: "",
    FixedPrice: 0,
    FixedPriceSAF: 0,
    FixedPriceCB: 0,
    FixedPriceIB: 0,
    DefaultWidth: 0,
    MinWidth: 0,
    MaxWidth: 0,
    DefaultHeight: 0,
    MinHeight: 0,
    MaxHeight: 0,
    Wastage: 0,
    installnationCharge: 0,
    RequestForPrice: "",
  };

  // const { attributes } = useSelector((state) => state.attribute);
  const [productimage, setProductImage] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [Collection, setCollection] = useState([]);
  const [selected, setSelected] = useState([]);
  const [productdescription, setProductDescription] = useState();
  const [selectedattribute, setSelectedattribute] = useState([]);
  const [video, setVideo] = useState("");
  const [iframeString, setIframeString] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [displaySequence, setDisplaySequence] = useState();

  const editor = useRef(null);

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  //Installment Data
  const [installment, setinstallment] = useState([]);
  const [finalInstallment, setFinalInstallment] = useState([]);

  //Installment Edit
  const [handleEdit, sethandleEdit] = useState(false);

  const [installmentformdata, setinstallmentformdata] = useState({
    Name: "",
    Amount: "",
  });

  const { Name, Amount } = installmentformdata || {};

  const handleInstallmentformData = (e) => {
    setinstallmentformdata({
      ...installmentformdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveInstallement = () => {
    const Total =
      installment.reduce((sum, a) => sum + Number(a.Amount), 0) +
      Number(Amount);

    if (installment?.length > 0 && Total !== 100) {
      return toastError(`Total must be 100%`);
    }
    setFinalInstallment(installment);
    setOpen(false);
  };

  const handleInstallment = () => {
    const Total =
      installment.reduce((sum, a) => sum + Number(a.Amount), 0) +
      Number(Amount);
    if (Total > 100) {
      return toastError(`Not be Greater than 100%`);
    }
    setinstallment((previnstallment) => [
      ...previnstallment,
      installmentformdata,
    ]);

    setinstallmentformdata({
      Name: "",
      Amount: "",
    });
  };

  const getdata = useCallback(async () => {
    try {
      const createIframeFromSrc = (srcLink) => {
        return `<iframe width="560" height="315" src="${srcLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      };
      const { data } = await axiosInstance.get(
        `/api/customized-product/${id}`,
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );
      if (data) {
        const {
          ProductImage,
          attribute,
          varient,
          tags,
          Installment,
          attributePosition,
          BackSAF,
          BackCB,
          BackIB,
          BackIBPAQ,
          BackCBPAQ,
          BackSAFPAQ,
          video,
          displaySequence,
          Collection,
          ...product
        } = data.data;

        if (video) {
          const iframeString = createIframeFromSrc(video);
          setVideo(iframeString);
        }
        setIframeString(iframeString);
        let attributevalue = attribute.map((p) => {
          return {
            value: p?._id,
            label: p.Name,
            Display_Index: p.Display_Index,
          };
        });

        setCollection(
          Collection.map((p) => {
            return {
              label: p.title,
              value: p._id,
              rootPath: Collection?.rootPath ?? [],
            };
          })
        );

        setSelectedattribute(attributevalue);
        setDisplaySequence(displaySequence);
        setFormData(product);
        setProductImage(ProductImage);
        setinstallment(Installment);
        setFinalInstallment(Installment);

        setSelected(
          tags.map((p) => {
            return {
              label: p.name,
              value: p._id,
            };
          })
        );

        setProductDescription(product.ProductDescription);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id, iframeString]);

  useEffect(() => {
    getdata();
  }, [getdata]);

  const {
    ProductName,
    FeaturedProduct,
    ProductStatus,
    Urlhandle,
    SeoProductTitle,
    SeoMetaDesc,
    GSTIN,
    FixedPrice = 0,
    FixedPriceSAF = 0,
    FixedPriceCB = 0,
    FixedPriceIB = 0,
    DefaultWidth = 0,
    MinWidth = 0,
    MaxWidth = 0,
    DefaultHeight = 0,
    MinHeight = 0,
    MaxHeight = 0,
    Wastage = 0,
    RequestForPrice,
    installnationCharge = 0,
  } = formData || {};

  const handleFormChange = (e) => {
    if (
      e.target.name === "ShowSAF" ||
      e.target.name === "ShowIB" ||
      e.target.name === "ShowCB"
    ) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
        setProductImage((prevImages) => [
          ...prevImages,
          {
            file,
            preview: URL.createObjectURL(file),
          },
        ]);
      } else {
        toastError("Selected images are not of valid type!");
      }
    }
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
  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const Total =
      installment.reduce((sum, a) => sum + Number(a.Amount), 0) +
      Number(Amount);

    if (finalInstallment?.length > 0 && Total !== 100) {
      return toastError("Total Percentage must be 100%");
    }

    if (Collection.length === 0) {
      return toastError("Collection is Required");
    }
    if (selectedattribute.length === 0) {
      return toastError("Attribute is Required");
    }

    try {
      const filteredtagvalue = selected.map((p) => {
        return p.value;
      });

      const filteredattributevalue = selectedattribute.map((p) => {
        return p.value;
      });

      const filteredCollectionValue = Collection.map((p) => {
        return p.value;
      });

      let productdata = new FormData();

      productdata.append("DefaultWidth", formData.DefaultWidth ?? 0);
      productdata.append("MinWidth", formData.MinWidth ?? 0);
      productdata.append("MaxWidth", formData.MaxWidth ?? 0);
      productdata.append("DefaultHeight", formData.DefaultHeight ?? 0);
      productdata.append("MinHeight", formData.MinHeight ?? 0);
      productdata.append("MaxHeight", formData.MaxHeight ?? 0);
      productdata.append("RequestForPrice", formData.RequestForPrice);

      productdata.append("Wastage", formData.Wastage ?? 0);
      productdata.append(
        "installnationCharge",
        formData.installnationCharge ?? 0
      );

      productdata.append("ProductName", formData.ProductName);
      productdata.append("ProductDescription", productdescription);
      productdata.append("FeaturedProduct", formData.FeaturedProduct);
      productdata.append("tags", JSON.stringify(filteredtagvalue));
      productdata.append("Installment", JSON.stringify(finalInstallment));
      productdata.append("video", extractSrcFromIframe(video));

      productdata.append("ProductStatus", formData.ProductStatus);

      productdata.append("Urlhandle", formData.Urlhandle);
      productdata.append("SeoProductTitle", formData.SeoProductTitle);
      productdata.append("SeoMetaDesc", formData.SeoMetaDesc);
      productdata.append(
        "SellingType",
        finalInstallment.length > 0 ? "Installment" : "Normal"
      );
      productdata.append("GSTIN", formData.GSTIN);
      productdata.append("attribute", JSON.stringify(filteredattributevalue));
      productdata.append("FixedPrice", FixedPrice);
      productdata.append("displaySequence", displaySequence);

      //Add fixed price
      productdata.append("FixedPriceSAF", FixedPriceSAF);
      productdata.append("FixedPriceCB", FixedPriceCB);
      productdata.append("FixedPriceIB", FixedPriceIB);

      productdata.append("Collection", JSON.stringify(filteredCollectionValue));

      // const rootPath = Collection?.rootPath ?? [];

      // if (rootPath?.length > 0) {
      //   productdata.append(
      //     "CollectionChild",
      //     JSON.stringify([...rootPath, Collection.value])
      //   );
      // }

      for (let image of productimage) {
        if (image.file) {
          productdata.append("productimg", image.file);
        }
      }

      await doPut(productdata);

      if (!puloading) {
        // navigate("/admin/customized-product");
        navigate(-1);
      }
    } catch (error) {
      console.log(error, "check this error");
    }
  };

  const handledeleteInstallment = (index) => {
    setinstallment((previnstallment) => {
      const prevInstallment = [...previnstallment];
      prevInstallment.splice(index, 1);
      return prevInstallment;
    });
  };

  const handleeditInstallment = (index) => {
    sethandleEdit(true);
    const filteredInstallment = installment[index];
    setinstallmentformdata(filteredInstallment);
    setinstallment((previnstallment) => {
      const prevInstallment = [...previnstallment];
      prevInstallment.splice(index, 1);
      return prevInstallment;
    });
  };

  const handleRemove = async (index, imgloc, image) => {
    setProductImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    if (imgloc === "Server") {
      await axiosInstance.delete(
        `/api/customized-product/image/${id}/${image}`
      );
    }
  };

  const moveAttributeItem = (fromId, toId) => {
    const fromIndex = selectedattribute.findIndex(
      (item) => item.value === fromId
    );
    const toIndex = selectedattribute.findIndex((item) => item.value === toId);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }
    const updatedList = [...selectedattribute];
    const [item] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, item);
    // setUpl(updatedList);
    setSelectedattribute(updatedList);
  };

  if (puloading) {
    return (
      <>
        <Preloader />
      </>
    );
  }

  return (
    <>
      <SideBar />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="row mb-3">
              <div className="border mt-3">
                <h6
                  className="mt-2"
                  style={{
                    backgroundColor: "#2D1967",
                    padding: "15px",
                    color: "#fff",
                  }}
                >
                  Installment Distribution Section
                </h6>
                <div className="row my-3 ">
                  <div className="col-md-4">
                    {" "}
                    <label className="form-label" htmlFor="Shipping">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Shipping"
                      name="Name"
                      value={Name || ""}
                      onChange={handleInstallmentformData}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="Shipping">
                      Percentage
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="Shipping"
                      name="Amount"
                      value={Amount || 0}
                      onChange={handleInstallmentformData}
                    />
                  </div>
                  <div className="col-md-4  mt-4">
                    {handleEdit ? (
                      <button
                        className=" btn btn-primary mt-1"
                        type="button"
                        onClick={handleeditInstallment}
                      >
                        Edit Installment
                      </button>
                    ) : (
                      <button
                        className=" btn btn-primary mt-1"
                        type="button"
                        onClick={handleInstallment}
                      >
                        Add Installment
                      </button>
                    )}
                  </div>
                </div>

                <table className="table">
                  <tbody>
                    {installment &&
                      installment.map((p, i) => (
                        <tr key={i}>
                          <td className="col-md-2">
                            <h5>
                              <b>{i + 1}</b>
                            </h5>
                          </td>
                          <td className="col-md-4">
                            <h5>{p.Name}</h5>
                          </td>
                          <td className="col-md-4">
                            <h5>{p.Amount}%</h5>
                          </td>
                          <td className="col-md-2">
                            <span
                              className="bg-success p-1 rounded"
                              onClick={() => handleeditInstallment(i)}
                            >
                              <AiFillEdit />
                            </span>
                            &nbsp;
                            <span
                              className="bg-danger p-1 rounded"
                              onClick={() => handledeleteInstallment(i)}
                            >
                              <AiFillDelete />
                            </span>
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td style={{ fontWeight: "800" }}>Total</td>
                      <td></td>
                      <td style={{ fontWeight: "800" }}>
                        {installment.reduce(
                          (sum, a) => sum + Number(a.Amount),
                          0
                        )}
                        %
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveInstallement}
                type="button"
              >
                Save
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>

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
                          <h3 className="m-0">Product</h3>
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
                                id="Title"
                                placeholder="Title"
                                name="ProductName"
                                required
                                value={ProductName || ""}
                                onChange={handleFormChange}
                              />
                            </div>
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
                                name="SeoProductTitle"
                                value={SeoProductTitle || ""}
                                onChange={handleFormChange}
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
                                value={productdescription || ""}
                                config={config}
                                tabIndex={1} // tabIndex of textarea
                                onBlur={(newContent) =>
                                  setProductDescription(newContent)
                                } // preferred to use only this option to update the content for performance reasons
                              />
                            </div>
                          </div>

                          <div className="mb-3 row">
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
                                value={SeoMetaDesc || ""}
                                placeholder="Description"
                                name="SeoMetaDesc"
                                onChange={handleFormChange}
                              />
                            </div>
                          </div>
                          <div className="mb-3 row">
                            <div className="col-md-12">
                              {" "}
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

                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Product Image ("Image Size should less than equal
                              to 10 MB")
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
                              {productimage?.length !== 0 &&
                                productimage.map((image, index) =>
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
                                    <>
                                      <div
                                        className="image-area col-3"
                                        key={index}
                                      >
                                        <img
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
                                    </>
                                  )
                                )}
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
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Featured Products
                              </label>
                              <select
                                id="FeaturedProducts"
                                className="form-control"
                                name="FeaturedProduct"
                                value={FeaturedProduct || false}
                                onChange={handleFormChange}
                              >
                                <option>Choose...</option>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                              </select>
                            </div>
                            <div
                              className="col-md-4"
                              style={{ alignSelf: "end" }}
                            >
                              <Button
                                onClick={handleOpen}
                                variant="contained"
                                endIcon={
                                  finalInstallment.length > 0 && (
                                    <CheckCircleIcon />
                                  )
                                }
                              >
                                Installment
                              </Button>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Shipping">
                                Product Collection
                              </label>
                              {getCollection && getCollection?.length > 0 && (
                                <MultiSelect
                                  options={getCollection}
                                  required
                                  value={Collection}
                                  onChange={setCollection}
                                  labelledBy="Select Tag"
                                />
                              )}
                            </div>

                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Price">
                                FixedPrice
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="Price"
                                value={FixedPrice || 0}
                                required
                                name="FixedPrice"
                                onChange={handleFormChange}
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Price">
                                Back FixedPrice SAF
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={FixedPriceSAF || 0}
                                required
                                name="FixedPriceSAF"
                                onChange={handleFormChange}
                              />
                            </div>

                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Price">
                                Back FixedPrice CB
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="Price"
                                value={FixedPriceCB || 0}
                                required
                                name="FixedPriceCB"
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Price">
                                Back FixedPrice IB
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="Price"
                                value={FixedPriceIB || 0}
                                required
                                name="FixedPriceIB"
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-4">
                                  <label className="form-label" htmlFor="Price">
                                    Defult Width
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="DefaultWidth"
                                    value={DefaultWidth || 0}
                                    required
                                    name="DefaultWidth"
                                    onChange={handleFormChange}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label" htmlFor="Price">
                                    Min. Width
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="MinWidth"
                                    value={MinWidth || 0}
                                    required
                                    name="MinWidth"
                                    onChange={handleFormChange}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label" htmlFor="Price">
                                    Max. Width
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="MaxWidth"
                                    value={MaxWidth || 0}
                                    required
                                    name="MaxWidth"
                                    onChange={handleFormChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-4">
                                  <label className="form-label" htmlFor="Price">
                                    Defult Height
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="DefaultHeight"
                                    value={DefaultHeight || 0}
                                    required
                                    name="DefaultHeight"
                                    onChange={handleFormChange}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label" htmlFor="Price">
                                    Min. Height
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="MinHeight"
                                    value={MinHeight || 0}
                                    required
                                    name="MinHeight"
                                    onChange={handleFormChange}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label className="form-label" htmlFor="Price">
                                    Max. Height
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="MaxHeight"
                                    value={MaxHeight || 0}
                                    required
                                    name="MaxHeight"
                                    onChange={handleFormChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Product Status
                              </label>
                              <select
                                value={ProductStatus || ""}
                                id="FeaturedProducts"
                                className="form-control"
                                name="ProductStatus"
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Tags
                              </label>
                              {alltags && alltags?.length > 0 && (
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
                              )}
                            </div>
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Attribute
                              </label>
                              {attributes && attributes.length > 0 && (
                                <MultiSelect
                                  options={attributes.map((p) => {
                                    return {
                                      label: p.Name,
                                      value: p._id,
                                      Display_Index: p.Display_Index,
                                    };
                                  })}
                                  required
                                  value={selectedattribute}
                                  onChange={(e) => {
                                    e.sort(
                                      (a, b) =>
                                        a.Display_Index - b.Display_Index
                                    );
                                    setSelectedattribute(e);
                                  }}
                                  labelledBy="Select Attribute"
                                />
                              )}
                            </div>
                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Attribute
                              </label>
                              <br></br>
                              <DndProvider backend={HTML5Backend}>
                                {selectedattribute &&
                                  selectedattribute.map((p, index) => (
                                    <AttributeItemList
                                      item={p}
                                      key={index}
                                      index={index}
                                      moveAttributeItem={moveAttributeItem}
                                    />
                                  ))}
                              </DndProvider>
                              <br></br>
                              <br></br>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Shipping">
                                GST
                              </label>
                              <select
                                className="form-select"
                                aria-label="Default select example"
                                name="GSTIN"
                                value={GSTIN || "0"}
                                onChange={handleFormChange}
                              >
                                {/* <option selected>Open this select menu</option> */}
                                <option value="0">0 %</option>
                                <option value="5">5 %</option>
                                <option value="12">12 %</option>
                                <option value="18">18 %</option>
                                <option value="28">28 %</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-6">
                                  <label className="form-label" htmlFor="Price">
                                    Wastage
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="Wastage"
                                    value={Wastage || 0}
                                    required
                                    name="Wastage"
                                    onChange={handleFormChange}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label className="form-label" htmlFor="Price">
                                    Installation charges
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="installnationCharge"
                                    value={installnationCharge || 0}
                                    required
                                    name="installnationCharge"
                                    onChange={handleFormChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">
                              Request for Price
                            </label>
                            <select
                              className="form-control"
                              name="RequestForPrice"
                              required
                              value={RequestForPrice || false}
                              onChange={handleFormChange}
                            >
                              <option value="">
                                ------------ Choose ---------
                              </option>
                              <option value={true}>Active</option>
                              <option value={false}>Inactive</option>
                            </select>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Shipping">
                                Url Handle
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="Shipping"
                                name="Urlhandle"
                                required
                                value={Urlhandle || ""}
                                onChange={handleFormChange}
                              />
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

const AttributeItemList = ({ item, moveAttributeItem, index }) => {
  const [, drag] = useDrag({
    type: "ATTRIBUTE_LIST_ITEM",
    item: { id: item.value, index },
  });

  const [, drop] = useDrop({
    accept: "ATTRIBUTE_LIST_ITEM",
    hover: (draggedItem) => {
      if (draggedItem.id !== item.value) {
        moveAttributeItem(draggedItem.id, item.value);
        draggedItem.index = index;
      }
    },
  });

  return (
    <span
      ref={(node) => drag(drop(node))}
      style={{
        backgroundColor: "green",
        margin: "2px",
        padding: "4px",
        borderRadius: "5px",
        fontWeight: "900",
        color: "#fff",
      }}
    >
      {item.label}
    </span>
  );
};

export default EditCustomoziedProduct;
