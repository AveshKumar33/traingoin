import React from "react";
import { axiosInstance } from "../../config";
import { REACT_APP_URL } from "../../config";
import { useDispatch } from "react-redux";
import { deleteGallery } from "../../redux/slices/gallerySlice";
import ImageUploader from "../imageuploader/ImageUploader";
import "./gallerycomponents.css";
import { AiFillDelete, AiOutlineCopy, AiTwotoneDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";

const GalleryComponents = ({ name, gallerydata, handleGallery }) => {
  const dispatch = useDispatch();

  const handleDelete = async (url, index) => {
    const answer = window.confirm("Are You Sure !");
    try {
      if (answer) {
        const deletedata = {
          url: url.slice(7),
          index: index,
        };
        dispatch(deleteGallery(deletedata));
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      <div classNameName="mt-3">
        {/* <ImageUploader /> */}
        <div className="row">
          {gallerydata &&
            gallerydata.map((p, i) => (
              <>
                {/* <img
                src={`${REACT_APP_URL}${p.url}`}
                alt=""
                key={p.url}
                height={"80px"}
              />
              <div style={{ display: "flex" }}>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${REACT_APP_URL}${p.url}`
                    )
                  }
                  classNameName="btn btn-primary"
                >
                  copy
                </button>
                &nbsp;
                <button
                  onClick={() => handleDelete(p.url, i)}
                  classNameName="btn btn-primary"
                >
                  Delete
                </button>
              </div> */}

                <div
                  className="image-area"
                  id="Product"
                  style={{ float: "left", marginTop: "40px" }}
                >
                  <img
                    src={`${REACT_APP_URL}${p.url}`}
                    alt="Preview"
                    loading="lazy"
                  />
                  <a className="Copy-image" style={{ display: "inline" }}>
                    <AiOutlineCopy
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${REACT_APP_URL}${p.url}`
                        )
                      }
                    />
                  </a>

                  <a className="remove-image" style={{ display: "inline" }}>
                    {/* <i
                      className="fa fa-trash"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete Image"
                      style={{ fontSize: "10px" }}
                    ></i> */}

                    <AiFillDelete onClick={() => handleDelete(p.url, i)} />
                  </a>
                </div>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default GalleryComponents;
