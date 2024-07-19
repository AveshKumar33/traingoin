import { useState } from "react";
import Rating from "@mui/material/Rating";
import "./CreatRating.css";
// import { createReview } from "../../../redux/slices/reviewSlice";
// import { useDispatch } from "react-redux";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import CloseIcon from "@mui/icons-material/Close";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp|pdf|PDF)/gm;
const CreatingRatingDrawer = ({
  closeCreatingRatingDrawer,
  productdetails,
  model,
  setUserRatingData,
  getTotalRating,
}) => {
  const [P_Rating, setP_rating] = useState(5);
  const [reviewimg, setreviewimg] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    ReviewTitle: "",
    ReviewBody: "",
    UserDetails: "",
  });

  const { Name, Email, ReviewTitle, ReviewBody } = formData;

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    if (!ReviewTitle) {
      return toastError(`ReviewTitle fields are required!`);
    }
    if (!ReviewBody) {
      return toastError(`ReviewBody fields are required!`);
    }
    if (!Email) {
      return toastError(`Email fields are required!`);
    }

    if (!Name) {
      return toastError(`Name fields are required!`);
    }
    if (reviewimg.length === 0) {
      return toastError(`image fields are required!`);
    }

    let reviewdata = new FormData();
    reviewdata.append("Name", Name);
    reviewdata.append("Email", Email);
    reviewdata.append("Rating", P_Rating);
    reviewdata.append("ReviewTitle", ReviewTitle);
    reviewdata.append("ReviewBody", ReviewBody);
    reviewdata.append(`${model}`, productdetails._id);
    for (let i = 0; i < reviewimg.length; i++) {
      reviewdata.append("reviewimg", reviewimg[i]);
    }

    try {
      const { data } = await axiosInstance.post("/api/review", reviewdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUserRatingData((pre) => {
        return {
          totalUser: pre.totalUser + 1,
          totalRating: pre.totalRating + P_Rating,
          ratingData: {
            ...pre.ratingData,
            [P_Rating]: pre["ratingData"][P_Rating] + 1,
          },
        };
      });
      toastSuceess(data.message);

      closeCreatingRatingDrawer();
      getTotalRating();
    } catch (error) {
      console.log(error, "check errpr");
    }
  };

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
      setreviewimg(validImageFiles);

      return;
    }
    toastError("Selected images are not of valid type!");

    //Previous code
    // setProductImage(e.target.files);
    // const files = Array.from(e.target.files);
    // handleFiles(files);
  };

  return (
    <div id="CartSidebar" className="sidebarHome1">
      <div className="ratingDrawer">
        <div></div>
        <div>
          <p className="Heading-reviews"> Write a Review</p>
        </div>
        <div>
          <CloseIcon
            className="fa-solid fa-xmark"
            style={{
              cursor: "pointer",
            }}
            onClick={() => closeCreatingRatingDrawer()}
          />
        </div>
      </div>
      <hr />
      {model === "singleProduct" || model === "customizedProduct" ? (
        <section className="product-box">
          <section className="product-img">
            <img
              className="product-img-1"
              src={`${REACT_APP_URL}/images/product/${productdetails?.ProductImage[0]}`}
              loading="lazy"
              alt={productdetails?.ProductName}
              title={productdetails?.ProductName}
            />{" "}
            {/**/}
          </section>{" "}
          <section className="product-desc">
            <p className="d-grid">{productdetails?.ProductName}</p>{" "}
            <div className="d-flex gap-2 align-items-center">
              <Rating
                value={P_Rating}
                onChange={(ele) => {
                  setP_rating(ele.target.value);
                }}
              />
              <h5 className="d-grid">{`${P_Rating}.0`}</h5>{" "}
            </div>
          </section>
        </section>
      ) : model === "customizedCombo" ? (
        <section className="product-box">
          <section className="product-img">
            <img
              className="product-img-1"
              src={`${REACT_APP_URL}/images/product/${productdetails?.image}`}
              loading="lazy"
              alt={productdetails?.Name}
              title={productdetails?.Name}
            />{" "}
            {/**/}
          </section>{" "}
          <section className="product-desc">
            <p className="d-grid">{productdetails?.Name}</p>{" "}
            <div className="d-flex gap-2 align-items-center">
              <Rating
                value={P_Rating}
                onChange={(ele) => {
                  setP_rating(ele.target.value);
                }}
              />
              <h5 className="d-grid">{`${P_Rating}.0`}</h5>{" "}
            </div>
          </section>
        </section>
      ) : (
        <section className="product-box">
          <section className="product-img">
            <img
              className="product-img-1"
              src={`${REACT_APP_URL}/images/product/${productdetails?.dotProductImageIds[0]?.image}`}
              loading="lazy"
              alt={productdetails?.name}
              title={productdetails?.name}
            />{" "}
            {/**/}
          </section>{" "}
          <section className="product-desc">
            <p className="d-grid">{productdetails?.name}</p>{" "}
            <div className="d-flex gap-2 align-items-center">
              <Rating
                value={P_Rating}
                onChange={(ele) => {
                  setP_rating(ele.target.value);
                }}
              />
              <h5 className="d-grid">{`${P_Rating}.0`}</h5>{" "}
            </div>
          </section>
        </section>
      )}
      <section className="Add-Your-Review">
        <h6 className="">Add a Title</h6>
        <input
          className="form-control my-2"
          name="ReviewTitle"
          required
          value={ReviewTitle}
          onChange={handleFormChange}
          placeholder="Write your Title here."
        />
        <h6 className="m-0">Add Your Review*</h6>
        <p className="my-1">Your review valuable for us:-</p>
        <textarea
          className="ant-input"
          placeholder="Write your review here."
          name="ReviewBody"
          required
          value={ReviewBody}
          onChange={handleFormChange}
        />
        <h6 className="">About You*</h6>
        <p>Email*</p>
        <input
          className="form-control my-2"
          placeholder="We will only use email to verify our buyers"
          name="Email"
          required
          value={Email}
          onChange={handleFormChange}
        />
        <p>Name*</p>
        <input
          className="form-control my-2"
          placeholder="Enter Your Name"
          name="Name"
          required
          value={Name}
          onChange={handleFormChange}
        />

        <div className="upload-container-rating">
          <h6 className="form-label" htmlFor="Description">
            Upload Documents & Image
          </h6>
          <center>
            <input
              type="file"
              id="file_upload"
              required
              multiple
              accept="image/*"
              onChange={handleImage}
            />
          </center>
        </div>
        <p
          className="create-Rating-button"
          style={{
            cursor: "pointer",
          }}
          onClick={() => handleSubmit()}
        >
          Submit
        </p>
      </section>
    </div>
  );
};

export default CreatingRatingDrawer;
