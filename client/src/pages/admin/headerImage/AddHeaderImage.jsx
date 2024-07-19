import React from "react";

import UploadImage from "../../../assets/Image/UploadImage.png";
import { REACT_APP_URL } from "../../../config.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { toastError } from "../../../utils/reactToastify.js";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddHeaderImage = ({
  option,
  setuploadImagePNG,
  uploadImagePNG,
  handleDeleteItemPng,
}) => {
  return (
    <div key={uploadImagePNG}>
      {option.pngImage ? (
        <div style={{ position: "relative" }}>
          <img
            src={`${REACT_APP_URL}/images/header/${option?.pngImage}`}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <button
            className="AttributeImageRemove-image"
            type="button"
            style={{ display: "inline" }}
          >
            <DeleteIcon
              onClick={() => handleDeleteItemPng(option?._id)}
              style={{ padding: "5px" }}
            />
          </button>
        </div>
      ) : (
        <>
          <label htmlFor="FileDisplay" className="PlusBox">
            {!uploadImagePNG ? (
              <>
                <img
                  loading="lazy"
                  src={UploadImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
              </>
            ) : (
              <>
                <img
                  loading="lazy"
                  src={URL.createObjectURL(uploadImagePNG)}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
              </>
            )}

            <input
              type="file"
              id="FileDisplay"
              name="parameterPosition"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file.type.match(imageTypeRegex) && file.size <= 10000000) {
                  setuploadImagePNG(file);
                } else {
                  e.target.value = null;
                  toastError("Selected images are not of valid type or size!");
                }
              }}
            />
          </label>
        </>
      )}
    </div>
  );
};

export default AddHeaderImage;
