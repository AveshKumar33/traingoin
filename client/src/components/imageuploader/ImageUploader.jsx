import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { axiosInstance } from "../../config";

const ImageUploader = () => {
  const [imageuploader, setimageuploader] = useState();
  const [images, setImages] = useState([]);

  const handleImage = (e) => {
    e.preventDefault();
    setimageuploader(e.target.files);
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const fileObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...fileObjects]);
  };

  const handleRemove = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleImageUpload = async () => {
    try {
      console.log("imageuploader", imageuploader);

      let imagedata = new FormData();

      for (let i = 0; i < imageuploader?.length; i++) {
        imagedata.append("userimg", imageuploader[i]);
      }

      console.log("imagedata", imagedata);

      for (let [key, value] of imagedata.entries()) {
        console.log("key value", key, value);
      }

      // http://localhost:7000/api/uploads/user

      const { data } = await axiosInstance.post(
        "http://localhost:7000/api/uploads/user",
          imagedata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

       
    } catch (error) {
       
    }
  };

  return (
    <>
      <div className="d-flex my-5">
        <input type="file" multiple onChange={handleImage} />
        <button className="btn btn-primary" onClick={handleImageUpload}>
          Submit
        </button>
      </div>

      <div className="preview-container d-flex row" style={{ padding: "0px" }}>
        {images?.length !== 0 &&
          images.map((image, index) => (
            <>
              <div className="image-area col-3" key={index}>
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
                  className="remove-image"
                  type="button"
                  style={{ display: "inline" }}
                  onClick={() => handleRemove(index)}
                >
                  <FaTrash />
                </button>
              </div>
            </>
          ))}
      </div>
    </>
  );
};

export default ImageUploader;
