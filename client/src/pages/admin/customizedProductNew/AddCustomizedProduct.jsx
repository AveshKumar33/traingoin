import SideBar from "../../../components/sidebar/SideBar";
import { createCustomizedProduct } from "../../../redux/slices/customizeProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./styles.css";
import JoditEditor from "jodit-react";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { MultiSelect } from "react-multi-select-component";
import TopHeader from "../../../components/topheader/TopHeader";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { fetchAllisCustomizedAttribute } from "../../../redux/slices/newAttributeSlice";
import { toastError } from "../../../utils/reactToastify";

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

const AddCustomizedProduct = () => {
  // const { products } = useSelector((state) => state.products);
  const { loading } = useSelector((state) => state.customizeProduct);
  const { attributes } = useSelector((state) => state.newAttribute);
  const { data: getCollection } = useGetApi(
    "/api/collection/getCollectionByName"
  );
  const { data: alltags } = useGetApi("/api/tags");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [productimage, setProductImage] = useState([]);
  const [productdescription, setProductDescription] = useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Collection
  const [Collection, setCollection] = useState([]);

  //All Tag
  //  const [alltags, setalltags] = useState()
  const [selected, setSelected] = useState([]);
  const [selectedattribute, setSelectedattribute] = useState([]);
  const [video, setVideo] = useState("");
  const [displaySequence, setDisplaySequence] = useState();

  //Back
  // const [selectedattributeSAF, setSelectedattributeSAF] = useState([]);
  // const [selectedattributeCB, setSelectedattributeCB] = useState([]);
  // const [selectedattributeIB, setSelectedattributeIB] = useState([]);

  //Installment Data
  const [installment, setinstallment] = useState([]);
  const [finalInstallment, setFinalInstallment] = useState([]);
  const [installmentformdata, setinstallmentformdata] = useState({
    Name: "",
    Amount: "",
  });

  useEffect(() => {
    dispatch(fetchAllisCustomizedAttribute("true"));
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

  const { Name, Amount } = installmentformdata || {};

  const handleInstallmentformData = (e) => {
    setinstallmentformdata({
      ...installmentformdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleInstallment = () => {
    if (!Name || !Amount) {
      return toastError(`All fields are required!`);
    }
    if (!displaySequence) {
      return toastError("Please enter Display Sequence");
    }
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

  const [formData, setFormData] = useState({
    title: "",
    // description: "",
    featuredproduct: false,
    // price: "",
    // compareprice: "",
    productstatus: "",
    tags: "",
    // instockquantity: "",
    titleseo: "",
    descriptionseo: "",
    urlhandle: "",
    sku: null,
    barcode: "",
    sellingtype: "",
    GSTIN: 0,
    FixedPrice: "",
    FixedPriceSAF: 0,
    FixedPriceCB: 0,
    FixedPriceIB: 0,
    DefaultWidth: 0,
    MinWidth: 0,
    MaxWidth: 0,
    DefaultHeight: 0,
    MinHeight: 0,
    MaxHeight: 0,
    RequestForPrice: "",
  });

  const [handleEdit, sethandleEdit] = useState(false);
  const [editindex, seteditIndex] = useState(0);

  const handleEditInstallment = () => {
    setinstallment((previnstallment) => {
      const prevInstallment = [...previnstallment];
      prevInstallment.splice(editindex, 1, installmentformdata);
      return prevInstallment;
    });

    setinstallmentformdata({
      Name: "",
      Amount: "",
    });
    sethandleEdit(false);
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

  const editor = useRef(null);

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const {
      DefaultWidth,
      MaxWidth,
      MinWidth,
      DefaultHeight,
      MinHeight,
      MaxHeight,
    } = formData;

    // Perform validation
    if (name === "MinWidth") {
      if (parseFloat(value) > parseFloat(DefaultWidth)) {
        toastError("Min width can't be greater than Default width!");
        return;
      } else if (
        parseFloat(value) > parseFloat(MaxWidth) &&
        parseFloat(MaxWidth) !== 0
      ) {
        toastError("Min width can't be greater than Max width!");
        return;
      }
    } else if (name === "DefaultWidth") {
      if (
        parseFloat(value) < parseFloat(MinWidth) &&
        parseFloat(MinWidth) !== 0
      ) {
        toastError("Default Width can't be less than Min width!");
        return;
      } else if (
        parseFloat(value) > parseFloat(MaxWidth) &&
        parseFloat(MaxWidth) !== 0
      ) {
        toastError("Default Width can't be greater than Max width!");
        return;
      }
    } else if (name === "DefaultHeight") {
      if (
        parseFloat(value) < parseFloat(MinHeight) &&
        parseFloat(MinHeight) !== 0
      ) {
        toastError("Default height can't be less than Min height!");
        return;
      } else if (
        parseFloat(value) > parseFloat(MaxHeight) &&
        parseFloat(MaxHeight) !== 0
      ) {
        toastError("Default height can't be greater than Max height!");
        return;
      }
    } else if (name === "MinHeight") {
      if (parseFloat(value) > parseFloat(DefaultHeight)) {
        toastError("Min height can't be greater than Default height!");
        return;
      } else if (
        parseFloat(value) > parseFloat(MaxHeight) &&
        parseFloat(MaxHeight) !== 0
      ) {
        toastError("Min height can't be greater than Max height!");
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleeditInstallment = (index) => {
    sethandleEdit(true);
    const filteredInstallment = installment[index];
    setinstallmentformdata(filteredInstallment);
    seteditIndex(index);
    setinstallment((previnstallment) => {
      const prevInstallment = [...previnstallment];
      prevInstallment.splice(index, 1);
      return prevInstallment;
    });
  };

  const handleImage = (e) => {
    e.preventDefault();

    const { files } = e.target;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
        setProductImage((preState) => [
          ...preState,
          { file: file, preview: URL.createObjectURL(file) },
        ]);
      } else {
        // e.target.value = null;
        toastError("Selected images are not of valid type or size!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      DefaultWidth,
      MaxWidth,
      MinWidth,
      DefaultHeight,
      MinHeight,
      MaxHeight,
    } = formData;

    if (parseFloat(DefaultWidth) > parseFloat(MaxWidth)) {
      toastError("Max width can't be less than Default width!");
      return;
    }
    if (parseFloat(MinWidth) > parseFloat(MaxWidth)) {
      toastError("Min width can't be greater than Max width!");
      return;
    }

    if (parseFloat(DefaultHeight) > parseFloat(MaxHeight)) {
      toastError("Max height can't be less than Default height!");
      return;
    }
    if (parseFloat(MinHeight) > parseFloat(MaxHeight)) {
      toastError("Min height can't be greater than Max height!");
      return;
    }

    if (formData.sellingtype !== "" && formData.sellingtype === "Installment") {
      let amount = installment.reduce((sum, a) => sum + Number(a.Amount), 0);

      if (amount !== 100) {
        return toastError("Total Percentage must be 100%");
      }
    }

    if (Collection.length === 0) {
      return toastError("Collection is Required!");
    }

    if (selectedattribute.length === 0) {
      return toastError("Attribute is Required!");
    }

    const filteredtagvalue = selected.map((p) => {
      return p.value;
    });

    const filteredattributevalue = selectedattribute.map((p) => {
      return p.value;
    });

    const filteredCollectionValue = Collection.map((p) => {
      return p.value;
    });

    // const BackCB = selectedattributeCB.map((p) => {
    //   return p.value;
    // });

    // const BackSAF = selectedattributeSAF.map((p) => {
    //   return p.value;
    // });

    // const BackIB = selectedattributeIB.map((p) => {
    //   return p.value;
    // });

    let productdata = new FormData();
    productdata.append("DefaultWidth", formData.DefaultWidth || 0);
    productdata.append("MinWidth", formData.MinWidth || 0);
    productdata.append("MaxWidth", formData.MaxWidth || 0);
    productdata.append("DefaultHeight", formData.DefaultHeight || 0);
    productdata.append("MinHeight", formData.MinHeight || 0);
    productdata.append("MaxHeight", formData.MaxHeight || 0);
    productdata.append("Wastage", formData.Wastage || 0);
    productdata.append("RequestForPrice", formData.RequestForPrice || 0);
    productdata.append(
      "installnationCharge",
      formData.installnationCharge || 0
    );
    productdata.append("displaySequence", displaySequence);
    productdata.append("ProductName", formData.title);
    productdata.append("isCustomizeProduct", true);
    productdata.append("ProductDescription", productdescription);
    productdata.append("FeaturedProduct", formData.featuredproduct);
    productdata.append("tags", JSON.stringify(filteredtagvalue));
    productdata.append("Installment", JSON.stringify(finalInstallment));
    productdata.append("ProductStatus", formData.productstatus);
    productdata.append("video", extractSrcFromIframe(video));
    productdata.append(
      "SellingType",
      finalInstallment.length > 0 ? "Installment" : "Normal"
    );
    productdata.append("GSTIN", formData.GSTIN);
    productdata.append(
      "Urlhandle",
      formData.urlhandle === ""
        ? formData.title.replace(/\s+/g, "-")
        : formData.urlhandle
    );
    productdata.append("SeoProductTitle", formData.titleseo);
    productdata.append("SeoMetaDesc", formData.descriptionseo);
    productdata.append("attribute", JSON.stringify(filteredattributevalue));

    productdata.append("Collection", JSON.stringify(filteredCollectionValue));
    // productdata.append(
    //   "CollectionChild",
    //   JSON.stringify([...Collection.rootPath, Collection.value])
    // );

    productdata.append("FixedPrice", formData.FixedPrice || 0);
    productdata.append("BackIB", JSON.stringify(filteredattributevalue));
    productdata.append("BackCB", JSON.stringify(filteredattributevalue));
    productdata.append("BackSAF", JSON.stringify(filteredattributevalue));
    productdata.append(
      "FrontAttribute",
      JSON.stringify(filteredattributevalue)
    );

    //Set BAck Fixed Price
    productdata.append("FixedPriceSAF", formData.FixedPriceSAF || 0);
    productdata.append("FixedPriceCB", formData.FixedPriceCB || 0);
    productdata.append("FixedPriceIB", formData.FixedPriceIB || 0);

    for (let image of productimage) {
      productdata.append("productimg", image.file);
    }

    dispatch(createCustomizedProduct(productdata));

    if (loading === "fulfilled") {
      // navigate("/admin/customized-product");
      navigate(-1);
    }
  };

  const handledeleteInstallment = (index) => {
    setinstallment((previnstallment) => {
      const prevInstallment = [...previnstallment];
      prevInstallment.splice(index, 1);
      return prevInstallment;
    });
  };

  const handleRemove = (index) => {
    setProductImage((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <>
      <SideBar />

      {/* Installment Modal */}

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
                      value={Name}
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
                      value={Amount}
                      onChange={handleInstallmentformData}
                    />
                  </div>
                  <div className="col-md-4  mt-4">
                    {handleEdit ? (
                      <button
                        className=" btn btn-primary mt-1"
                        type="button"
                        onClick={handleEditInstallment}
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
                                required
                                placeholder="Title"
                                name="title"
                                onChange={handleFormChange}
                              />
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
                                  required
                                  placeholder="Title"
                                  name="titleseo"
                                  onChange={handleFormChange}
                                />
                              </div>
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
                                value={productdescription}
                                config={config}
                                required
                                tabIndex={1} // tabIndex of textarea
                                onBlur={(newContent) =>
                                  setProductDescription(newContent)
                                } // preferred to use only this option to update the content for performance reasons
                                onChange={(newContent) => {}}
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
                                placeholder="Description"
                                name="descriptionseo"
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

                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Product Image ("Image Size should less than equal
                              to 10 MB" )
                            </label>
                            <div className="upload-container">
                              <center>
                                <input
                                  type="file"
                                  id="file_upload"
                                  multiple
                                  accept="image/*"
                                  required
                                  onChange={handleImage}
                                />
                              </center>
                            </div>
                            <div
                              className="preview-container d-flex row"
                              style={{ padding: "0px" }}
                            >
                              {productimage?.length !== 0 &&
                                productimage?.map((image, index) => (
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
                                ))}
                            </div>
                            <div className="col-md-12">
                              <div>
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
                                name="featuredproduct"
                                required
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
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
                                    required
                                    value={formData?.DefaultWidth || ""}
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
                                    required
                                    value={formData?.MinWidth || ""}
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
                                    required
                                    value={formData?.MaxWidth || ""}
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
                                    required
                                    value={formData?.DefaultHeight || ""}
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
                                    value={formData?.MinHeight || ""}
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
                                    required
                                    name="MaxHeight"
                                    value={formData?.MaxHeight || ""}
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
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Attribute
                              </label>

                              {attributes && (
                                <MultiSelect
                                  options={attributes.map((p) => {
                                    return {
                                      label: p.Name,
                                      value: p._id,
                                    };
                                  })}
                                  required
                                  value={selectedattribute}
                                  onChange={setSelectedattribute}
                                  labelledBy="Select Attribute"
                                />
                              )}
                            </div>
                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-6">
                                  <label className="form-label" htmlFor="Price">
                                    Wastage %
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="Wastage"
                                    // value={Wastage}
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
                                    // value={installnationCharge}
                                    required
                                    name="installnationCharge"
                                    onChange={handleFormChange}
                                  />
                                </div>
                              </div>
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
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Product Status
                              </label>
                              <select
                                id="FeaturedProducts"
                                className="form-control"
                                name="productstatus"
                                required
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label">
                                Request for Price
                              </label>
                              <select
                                className="form-control"
                                name="RequestForPrice"
                                required
                                onChange={handleFormChange}
                              >
                                <option value="">
                                  ------------ Choose ---------
                                </option>
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="form-label" htmlFor="Shipping">
                                Url Handle
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="Shipping"
                                required
                                name="urlhandle"
                                defaultValue={formData.title.replace(
                                  /\s+/g,
                                  "-"
                                )}
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

export default AddCustomizedProduct;
