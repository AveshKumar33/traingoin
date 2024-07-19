import React, { useEffect, useState } from "react";
import "./imagecomp.css";
import Modal from "../../../components/modal/Modal";
import Select from "react-select";
import { fetchCustomizedProduct } from "../../../redux/slices/customizeProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { toastError } from "../../../utils/reactToastify";

const ImageComponent = ({
  setDotPosition,
  dotPosition,
  setSelectedFile,
  selectedFile,
  showOnly = true,
}) => {
  const { customizedproducts } = useSelector((state) => state.customizeProduct);

  const [preview, setPreview] = useState();
  const [indexvalue, setIndexValue] = useState();

  const [selected, setSelected] = useState(null);

  const [show, setshow] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setshow(false);
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

  useEffect(() => {
    dispatch(fetchCustomizedProduct({}));
  }, [dispatch]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setDotPosition([]);

    return () => {
      URL.revokeObjectURL(objectUrl);
      setDotPosition([]);
    };
  }, [selectedFile, setDotPosition]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e.target.files[0].size > 10000000) {
      e.target.value = null;
      setSelectedFile(undefined);
      toastError("Image should be less than equal to 10 MB");
      return;
    }
    setSelectedFile(e.target.files[0]);
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
    newarr.splice(indexvalue, 1);
    setDotPosition(newarr);
    setshow(false);
  };

  const handleAddProductOndot = () => {
    if (!selected) {
      return toastError("Please select a product!");
    }

    setDotPosition((prev) => {
      return [...prev].map((p, i) => {
        if (i === indexvalue) {
          return {
            ...p,
            productId: selected.value,
            ProductName: selected?.label,
          };
        }
        return p;
      });
    });
    setSelected(null);
    setshow(false);
  };

  return (
    <>
      <Modal handleClose={handleClose} show={show} height="60%">
        <div className="col-lg-11 m-3" style={{ padding: "20px" }}>
          <label className="form-label" htmlFor="Featuredcustomizedproducts">
            Product
          </label>
          {customizedproducts && (
            <Select
              className="col-12"
              value={selected}
              onChange={setSelected}
              options={customizedproducts.map((p) => {
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

      <input type="file" onChange={onSelectFile} />
      <br></br>
      <br></br>
      {preview && (
        <div
          className="ImageContainer"
          style={{ position: "relative", display: "inline-block" }}
        >
          <img
            src={preview}
            alt="Clickable_Image"
            onClick={handleClick}
            className="img-fluid"
          />

          {dotPosition.map((p, i) => {
            return (
              <React.Fragment key={i}>
                <div
                  key={i}
                  className="Dot fa fa-circle text-danger-glow blink"
                  onClick={() => handleModal(i, p.productId)}
                  style={{ left: `${p.positionX}%`, top: `${p.positionY}%` }}
                ></div>

                <span
                  className="blink"
                  style={{
                    left: `${p.positionX + 3}%`,
                    top: `${p.positionY + 1}%`,
                    position: "absolute",
                    backgroundColor: "#3e6554",
                    padding: "2px 10px 2px 10px",
                    borderRadius: "3px",
                    border: "1px solid #fff",
                  }}
                >
                  {p?.ProductName && (
                    <p style={{ color: "#fff" }}>
                      {p?.ProductName.slice(0, 20)}
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

export default ImageComponent;
