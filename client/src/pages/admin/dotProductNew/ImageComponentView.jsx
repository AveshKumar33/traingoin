/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "./imagecomp.css";
import Modal from "../../../components/modal/Modal";
import Select from "react-select";
import { fetchAllProducts } from "../../../redux/slices/newProductSlice";
import { getDotProductImageId } from "../../../redux/slices/dotProductImageSlice";
import { REACT_APP_URL } from "../../../config";

import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config";
import { toastError, toastSuceess } from "../../../utils/reactToastify";

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

const ImageComponentView = () => {
  const { products } = useSelector((state) => state.newProducts);
  const [dotPosition, setDotPosition] = useState([]);
  // const [preview, setPreview] = useState();
  const [indexvalue, setIndexValue] = useState();
  const [selected, setSelected] = useState(null);
  const [dotProductImageData, setDotProductImageData] = useState();
  const [show, setshow] = useState(false);
  const [video, setVideo] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, dotProductsImages } = useSelector(
    (state) => state.dotProductImage
  );

  useEffect(() => {
    if (id) {
      dispatch(getDotProductImageId(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (loading === "fulfilled") {
      setDotProductImageData(dotProductsImages);
      const iframeString = createIframeFromSrc(dotProductImageData?.video);
      setVideo(iframeString);
      setDotPosition(dotProductsImages?.dots);
    }
  }, [loading, dotProductsImages, dotProductImageData]);

  const handleClose = () => {
    setshow(false);
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
  };
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

    if (products && productId) {
      let selectedproduct;
      if (productId._id) {
        selectedproduct = products.find(
          (p) => String(p._id) === String(productId._id)
        );
      } else {
        selectedproduct = products.find(
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

  //  save methood

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
        `/api/dot-product-image/${id}`,
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
          `/admin/dot-product-new/view-images/${dotProductsImages?.dotProductId?._id}`
        );
      }
    } catch (error) {
      toastError(error.response.data.message);
    }
  };

  return (
    <>
      <Modal handleClose={handleClose} show={show} height="60%">
        <div className="col-lg-11 m-3" style={{ padding: "20px" }}>
          <label className="form-label" htmlFor="FeaturedProducts">
            Product
          </label>
          {products && (
            <Select
              className="col-12"
              value={selected}
              onChange={setSelected}
              options={products?.map((p) => {
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
      <div className=" p-2 ">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            UpdatedImageDot();
          }}
        >
          Save
        </button>
      </div>
      {/** video logic started here */}
      <div style={{ marginLeft: "30px" }}>
        {dotProductImageData && dotProductImageData?.video && (
          <div>
            {console.log("video", extractSrcFromIframe(video))}

            <h5 className="my-2">Enter YouTube Embed Code</h5>
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
      {/** image logic started here */}

      {dotProductsImages?.image && dotProductImageData?.video === "" && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            margin: "auto",
          }}
        >
          <img
            src={`${REACT_APP_URL}/images/dotimage/${dotProductsImages?.image}`}
            alt="Image_From_Server"
            className="img-fluid"
            onClick={handleClick}
          />

          <br></br>
          {dotPosition &&
            dotPosition?.length > 0 &&
            dotPosition?.map((p, i) => {
              return (
                <React.Fragment key={i}>
                  <div
                    className="Dot fa fa-circle text-danger-glow blink"
                    onClick={() => handleModal(i, p.productId)}
                    style={{
                      left: `${p.positionX}%`,
                      top: `${p.positionY}%`,
                    }}
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
                        {p?.productId?.ProductName.slice(0, 10)}
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
    </>
  );
};

export default ImageComponentView;
