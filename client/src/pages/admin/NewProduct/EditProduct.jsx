import SideBar from "../../../components/sidebar/SideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { FaTrash } from "react-icons/fa";
import "./product.css";
import JoditEditor from "jodit-react";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { REACT_APP_URL } from "../../../config";

import { usePutApi } from "../../../utils/Customhooks/ApiCalls";
import { axiosInstance } from "../../../config";
import TopHeader from "../../../components/topheader/TopHeader";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import warinigGif from "../../../assets/img/warning.gif";
// import AdminVarient from "./varient/AdminVarient";
import { toastError } from "../../../utils/reactToastify";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";

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

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;
const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoading: puloading, doPut } = usePutApi(`/api/product-new/${id}`);
  const { data: alltags } = useGetApi("/api/tags");
  const { data: getCollection } = useGetApi(
    "/api/collection/getCollectionByName"
  );
  const { data: attributes } = useGetApi(
    `/api/parameter/filter?filter=${false}`
  );

  const [productimage, setProductImage] = useState([]);
  const [Collection, setCollection] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formData, setFormData] = useState();
  const [selected, setSelected] = useState([]);
  const [productdescription, setProductDescription] = useState();
  const [selectedattribute, setSelectedattribute] = useState([]);
  const [video, setVideo] = useState("");
  const [iframeString, setIframeString] = useState("");
  const [displaySequence, setDisplaySequence] = useState();

  const [open, setOpen] = React.useState({
    installmentModel: false,
    attributeWariningModel: false,
  });
  const handleOpen = (model) =>
    setOpen((prevState) => ({ ...prevState, [model]: true }));
  const handleClose = () =>
    setOpen({
      installmentModel: false,
      attributeWariningModel: false,
    });

  const editor = useRef(null);

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  //Installment Data
  const [installment, setinstallment] = useState([]);
  const [finalInstallment, setFinalInstallment] = useState([]);

  const [installmentformdata, setinstallmentformdata] = useState({
    Name: "",
    Amount: "",
  });

  const { Name, Amount } = installmentformdata || {};

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

  const handleInstallmentformData = (e) => {
    setinstallmentformdata({
      ...installmentformdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleInstallment = () => {
    const { Name, Amount } = installmentformdata;

    if (!Name || !Amount) {
      return toastError(`All fields are required!`);
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

  const handleSaveInstallement = () => {
    const Total =
      installment.reduce((sum, a) => sum + Number(a.Amount), 0) +
      Number(Amount);

    if (installment?.length > 0 && Total !== 100) {
      return toastError(`Total must be 100%`);
    }
    setFinalInstallment(installment);
    setOpen({
      installmentModel: false,
      attributeWariningModel: false,
    });
  };

  const getdata = useCallback(async () => {
    try {
      const createIframeFromSrc = (srcLink) => {
        return `<iframe width="560" height="315" src="${srcLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      };

      const { data } = await axiosInstance.get(`/api/product-new/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      if (data) {
        const {
          ProductImage,
          ProductVideo,
          attribute,
          varient,
          tags,
          video,
          Installment,
          Collection,
          displaySequence,
          ...product
        } = data.data;
        if (video) {
          const iframeString = createIframeFromSrc(video);
          setVideo(iframeString);
        }
        setIframeString(iframeString);
        let attributevalue = attribute.map((p) => {
          return {
            label: p.Name,
            value: p._id,
          };
        });

        // console.log(Collection);

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

        setFormData(product);
        setDisplaySequence(displaySequence);
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
      console.log("222", error);
      console.log("error.response.data.message", error.response.data.message);
    }
  }, []);

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
    RequestForPrice,
  } = formData || {};

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        e.target.value = null;
        toastError("Selected images are not of valid type or size!");
      }
    }
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

    const filteredtagvalue = selected.map((p) => {
      return p.value;
    });

    const filteredattributevalue = selectedattribute.map((p) => {
      return p.value;
    });

    const filteredCollectionValue = Collection.map((p) => {
      return p.value;
    });

    const filteredCollectionChildValue = [];

    for (let collection of Collection) {
      if (collection?.rootPath?.length > 0) {
        filteredCollectionChildValue.push(
          ...collection.rootPath,
          collection.value
        );
      }
    }

    let productdata = new FormData();

    productdata.append("ProductName", formData.ProductName);
    productdata.append("ProductDescription", productdescription);
    productdata.append("FeaturedProduct", formData.FeaturedProduct);
    productdata.append("tags", JSON.stringify(filteredtagvalue));
    productdata.append("Installment", JSON.stringify(finalInstallment));
    productdata.append("ProductStatus", formData.ProductStatus);
    productdata.append("Wastage", formData.Wastage);
    productdata.append("RequestForPrice", formData?.RequestForPrice ?? false);
    productdata.append("InstallmentAmount", formData.InstallmentAmount);
    productdata.append("video", extractSrcFromIframe(video));
    productdata.append("displaySequence", displaySequence);

    productdata.append(
      "ProductInStockQuantity",
      formData.ProductInStockQuantity
    );
    productdata.append("SKU", formData.SKU);
    productdata.append("Barcode", formData.Barcode);
    productdata.append("Urlhandle", formData.Urlhandle);
    productdata.append("SeoProductTitle", formData.SeoProductTitle);
    productdata.append("SeoMetaDesc", formData.SeoMetaDesc);
    productdata.append(
      "SellingType",
      finalInstallment.length > 0 ? "Installment" : "Normal"
    );
    productdata.append("GSTIN", formData.GSTIN);
    productdata.append("Collection", JSON.stringify(filteredCollectionValue));

    productdata.append(
      "CollectionChild",
      JSON.stringify(filteredCollectionChildValue)
    );

    productdata.append("attribute", JSON.stringify(filteredattributevalue));

    for (let image of productimage) {
      if (image.file) {
        productdata.append("productimg", image.file);
      }
    }

    await doPut(productdata);

    if (!puloading) {
      // navigate("/admin/product-new");
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

  const handleeditInstallment = (index) => {
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
      await axiosInstance.delete(`/api/product-new/image/${id}/${image}`);
    }
  };

  return (
    <>
      <SideBar />

      {/* Installement Model */}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open.installmentModel}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open.installmentModel}>
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
                    <button
                      className=" btn btn-primary mt-1"
                      type="button"
                      onClick={handleInstallment}
                    >
                      Add Installment
                    </button>
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
              <button
                onClick={handleSaveInstallement}
                type="button"
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>

      {/* Attribute Warning Model */}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open.attributeWariningModel}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open.attributeWariningModel}>
          <Card sx={{ ...style, p: 0, width: "40%", textAlign: "center" }}>
            <div style={{ backgroundColor: "#f45656", paddingBottom: "5px" }}>
              <img src={warinigGif} alt="__warning" width="150px" />
            </div>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mt: 1, color: "#f45656" }}
              >
                All previous combinations will be deleted!
              </Typography>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ color: "#f45656" }}
              >
                Are you sure you want to edit!
              </Typography>
              <div>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ m: 1 }}
                  onClick={() => {
                    setIsDisabled(false);
                    handleClose();
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ m: 1 }}
                  onClick={handleClose}
                >
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
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
                    <div className="px-2">
                      <div className="box_header m-0">
                        <div className="main-title">
                          <h3 className="m-0">Product</h3>
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
                        &nbsp;
                        <i
                          className="fa fa-chevron-right"
                          style={{ fontSize: 16 }}
                        />{" "}
                        <Link style={{ fontSize: 16 }}>Edit Products</Link>{" "}
                      </p>
                    </div>
                    <div className="">
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
                          <div className="col-md-12">
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

                          {/* UPLOAD IMAGE */}
                          <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Product Image ("Image Size should less than or
                              equal to 10MB")
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
                                value={FeaturedProduct || ""}
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
                                onClick={() => handleOpen("installmentModel")}
                                type="button"
                                className="btn btn-info"
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
                                <>
                                  <MultiSelect
                                    options={getCollection}
                                    required
                                    value={Collection}
                                    onChange={setCollection}
                                    labelledBy="Select Tag"
                                  />
                                </>
                              )}
                            </div>

                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Tags
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
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Attribute
                              </label>
                              {attributes && (
                                <>
                                  <MultiSelect
                                    options={attributes.map((p) => {
                                      return {
                                        label: p?.Name,
                                        value: p?._id,
                                      };
                                    })}
                                    required
                                    disabled={isDisabled}
                                    value={selectedattribute}
                                    onChange={setSelectedattribute}
                                    labelledBy="Select Attribute"
                                  />
                                </>
                              )}
                            </div>
                            <div
                              className="col-md-4"
                              style={{ alignSelf: "end" }}
                            >
                              <button
                                onClick={() => {
                                  if (isDisabled) {
                                    handleOpen("attributeWariningModel");
                                  }
                                }}
                                type="button"
                                className="btn btn-warning"
                              >
                                Edit Attribute
                              </button>
                            </div>
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
                          </div>

                          <div className="row mb-3">
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

                        {/* Admin Varient Section */}
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

export default EditProduct;
