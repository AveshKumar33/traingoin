import React, { useEffect, useState } from "react";
import "./imagecomp.css";
import Modal from "../../../components/modal/Modal";
import Select from "react-select";
import { fetchCustomizedProduct } from "../../../redux/slices/customizeProductSlice";
import { fetchDotCustomizedProductImageDetails } from "../../../redux/slices/dotCustomizedProductImageSlice";
import { REACT_APP_URL } from "../../../config";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config";
import { toastError, toastSuceess } from "../../../utils/reactToastify";

const ImageComponentView = () => {
  const { customizedproducts } = useSelector((state) => state.customizeProduct);
  const [dotPosition, setDotPosition] = useState([]);
  const [indexvalue, setIndexValue] = useState();
  const [selected, setSelected] = useState(null);
  const [dotProductImageData, setDotProductImageData] = useState();
  const [show, setshow] = useState(false);
  const dispatch = useDispatch();
  const [video, setVideo] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, dotCustomizedProductsImagesDetails } = useSelector(
    (state) => state.dotCustomizedProductImage
  );

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

  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchDotCustomizedProductImageDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchCustomizedProduct({}));
  }, [dispatch]);

  useEffect(() => {
    if (loading === "fulfilled" && dotCustomizedProductsImagesDetails) {
      setDotProductImageData(dotCustomizedProductsImagesDetails);
      setDotPosition(dotCustomizedProductsImagesDetails?.dots);
      const iframeString = createIframeFromSrc(dotProductImageData?.video);
      setVideo(iframeString);
    }
  }, [loading, dotCustomizedProductsImagesDetails, dotProductImageData?.video]);

  const handleClick = (event) => {
    const imageRect = event.target.getBoundingClientRect();
    const posX = ((event.clientX - imageRect.left) / imageRect.width) * 100;
    const posY = ((event.clientY - imageRect.top) / imageRect.height) * 100;

    setDotPosition((prevvalue) => [
      ...prevvalue,
      { positionX: posX, positionY: posY },
    ]);
  };

  const handleModal = (index, productId) => {
    setIndexValue(index);

    if (customizedproducts && productId) {
      let selectedproduct;
      if (productId._id) {
        selectedproduct = customizedproducts.find(
          (p) => String(p._id) === String(productId._id)
        );
      } else {
        selectedproduct = customizedproducts.find(
          (p) => String(p._id) === String(productId)
        );
      }

      setSelected({
        label: selectedproduct?.ProductName,
        value: selectedproduct?._id,
      });
    } else {
      setSelected(null);
    }

    setshow(true);
  };

  const handleremoveDot = () => {
    const newarr = [...dotPosition];
    // remove elements from array
    newarr.splice(indexvalue, 1);
    //Set the value of arr
    setDotPosition(newarr);
    setshow(false);
  };

  const handleAddProductOndot = () => {
    if (!selected) {
      return toastError("Please select a product!");
    }
    setDotPosition((prev) => {
      return [...prev]?.map((p, i) => {
        if (i === indexvalue) {
          return {
            ...p,
            productId: selected.value,
            ProductName: selected.label,
          };
        }
        return p;
      });
    });

    setSelected(null);
    setshow(false);
  };

  const UpdatedImageDot = async () => {
    try {
      const answer = window.confirm("Are You Sure updating!");
      if (!answer) {
        return;
      }

      const dotproduct = dotPosition
        .map((p) => {
          if (p?.productId) {
            return true;
          } else {
            return false;
          }
        })
        .every((p) => p === true);

      if (!dotproduct) {
        return toastError("Add Product To each Dot");
      }

      if (video === "" && dotPosition?.length === 0) {
        toastError("Mark dot on Images");
        // alert("Mark dot on Images")
        return;
      }

      let dotProductData = new FormData();
      dotProductData.append("dots", JSON.stringify(dotPosition));
      dotProductData.append("video", extractSrcFromIframe(video));

      const { data } = await axiosInstance.put(
        `/api/customize-dot-product-image/${id}`,
        dotProductData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        toastSuceess(data.message);
        navigate(
          `/admin/dot-customized-product-new/view-images/${dotCustomizedProductsImagesDetails?.dotProductId?._id}`
        );
      }
    } catch (error) {
      toastError(error.response.data.message);
    }
  };

  const handleClose = () => {
    setshow(false);
  };

  return (
    <>
      <Modal handleClose={handleClose} show={show} height="60%">
        <div className="col-lg-11 m-3" style={{ padding: "20px" }}>
          <label className="form-label" htmlFor="FeaturedProducts">
            Product
          </label>
          {customizedproducts && (
            <Select
              className="col-12"
              value={selected}
              onChange={setSelected}
              options={customizedproducts?.map((p) => {
                return {
                  label: p.ProductName,
                  value: p._id,
                };
              })}
            />
          )}
        </div>
        <div
          className="col-lg-11 m-3"
          style={{ padding: "0px 20px 20px 20px" }}
        >
          <button
            type="button"
            className="btn me-3 btn-danger"
            onClick={handleremoveDot}
          >
            Remove Dot
          </button>
          <button
            type="button"
            className=" btn me-3 btn-success"
            onClick={handleAddProductOndot}
          >
            Add Product
          </button>
          <button type="button" className="btn btn-info" onClick={handleClose}>
            Close
          </button>
        </div>
      </Modal>
      {/** video logic started here */}
      <div style={{ marginLeft: "30px" }}>
        {dotProductImageData && dotProductImageData?.video && (
          <div>
            <h5 className="my-2">Enter YouTube Embed Code</h5>
            <hr />
            {console.log("video", extractSrcFromIframe(video))}
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

      {/** image logic started here */}
      {dotCustomizedProductsImagesDetails?.image &&
        dotProductImageData?.video === "" && (
          <div
            style={{
              padding: "10px",
              position: "relative",
              display: "inline-block",
              margin: "auto",
            }}
          >
            <img
              src={`${REACT_APP_URL}/images/dotimage/${dotCustomizedProductsImagesDetails?.image}`}
              alt="Image_From_Server"
              className="img-fluid"
              onClick={handleClick}
            />
            {dotPosition?.map((p, i) => {
              return (
                <React.Fragment key={i}>
                  <div
                    className="Dot fa fa-circle text-danger-glow blink"
                    onClick={() => handleModal(i, p.productId)}
                    style={{ left: `${p.positionX}%`, top: `${p.positionY}%` }}
                  ></div>

                  <span
                    className="blink"
                    style={{
                      left: `${p.positionX + 4}%`,
                      top: `${p.positionY + 1}%`,
                      position: "absolute",
                      backgroundColor: "#3e6554",
                      padding: "2px 10px 2px 10px",
                      borderRadius: "3px",
                      border: "1px solid #fff",
                    }}
                  >
                    {p?.productId?.ProductName && (
                      <p style={{ color: "#fff" }}>
                        {p?.productId?.ProductName.slice(0, 20)}
                      </p>
                    )}
                    {p.ProductName && (
                      <p style={{ color: "#fff" }}>
                        {p?.ProductName.slice(0, 10)}
                      </p>
                    )}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        )}

      <div className=" p-2 justify-content-between d-flex">
        <button
          type="button"
          className="btn btn-primary"
          onClick={UpdatedImageDot}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default ImageComponentView;
