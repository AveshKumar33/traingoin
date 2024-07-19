import { useEffect, useRef, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersDetails, updateUser } from "../../../redux/slices/userSlice";
import TopHeader from "../../../components/topheader/TopHeader";
import {
  fetchReviewDetails,
  updateReview,
} from "../../../redux/slices/reviewSlice";
import Select from "react-select";
import { fetchProducts } from "../../../redux/slices/newProductSlice";
import { REACT_APP_URL } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const EditReview = () => {
  const { id } = useParams();

  const { loading, reviews, reviewdetails } = useSelector(
    (state) => state.review
  );
  const { products } = useSelector((state) => state.newProducts);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchReviewDetails(id));
    // dispatch(fetchProducts());
  }, [dispatch]);

  // const [reviewimage, setReviewImage] = useState();
  const [reviewimage, setReviewImage] = useState({
    reviewimg: "",
    preview: "",
  });
  console.log("running post review", reviewimage);

  const [selected, setSelected] = useState(null);

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Rating: "",
    ReviewTitle: "",
    ReviewBody: "",
    // Product: "",
    UserDetails: "",
  });

  useEffect(() => {
    if (loading === "fulfilled" && reviewdetails) {
      const { ReviewPicture, ...review } = reviewdetails;
      setFormData(review);
      setReviewImage((prevState) => ({
        ...prevState,
        reviewimg: ReviewPicture,
      }));

      // let Selectedproduct = products.find(
      //   (p) => String(p._id) === String(Product)
      // );

      // products &&
      //   setSelected({
      //     label: Selectedproduct?.ProductName,
      //     value: Selectedproduct?._id,
      //   });
    }
  }, [loading]);

  const { Name, Email, Rating, ReviewTitle, ReviewBody, UserDetails } =
    formData;

  const handleFormChange = (e) => {
    if (e.target.name === "Rating" && e.target.value > 5) {
      alert("Rating Can't be more than 5");
      e.target.value = 5;
      return;
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let reviewdata = new FormData();

    reviewdata.append("Name", Name);
    reviewdata.append("Email", Email);
    reviewdata.append("Rating", Rating);
    reviewdata.append("ReviewTitle", ReviewTitle);
    reviewdata.append("ReviewBody", ReviewBody);
    // reviewdata.append("Product", selected.value);
    reviewdata.append("reviewimg", reviewimage.reviewimg);

    const updateddata = {
      id,
      reviewdata,
    };

    dispatch(updateReview(updateddata));

    // if (loading === "fulfilled") {
    navigate("/admin/review");
    // }
  };

  return (
    <>
      <SideBar />
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
                          <h3 className="m-0">Review</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Name
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Name"
                                name="Name"
                                value={Name}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Email
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Email"
                                name="Email"
                                value={Email}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Rating
                              </label>
                              <input
                                type="digit"
                                className="form-control"
                                id="Title"
                                placeholder="Rating"
                                name="Rating"
                                value={Rating}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Review Title
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="Title"
                                placeholder="Review Title"
                                name="ReviewTitle"
                                value={ReviewTitle}
                                required
                                onChange={handleFormChange}
                              />
                            </div>

                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Review Body
                              </label>
                              <textarea
                                type="text"
                                className="form-control"
                                id="Title"
                                placeholder="Review Body"
                                name="ReviewBody"
                                value={ReviewBody}
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            {/* <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Title"
                                placeholder="Image"
                                name="ReviewBody"
                                onChange={(e) =>
                                  setReviewImage(e.target.files[0])
                                }
                              />
                            </div> */}
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Title"
                                placeholder="Image"
                                name="image"
                                onChange={(e) => {
                                  const file = e.target.files[0];

                                  if (
                                    file.type.match(imageTypeRegex) &&
                                    file.size <= 10000000
                                  ) {
                                    setReviewImage({
                                      reviewimg: e.target.files[0],
                                      preview: URL.createObjectURL(
                                        e.target.files[0]
                                      ),
                                    });
                                  } else {
                                    e.target.value = null;
                                    toastError(
                                      "Selected images are not of valid type or size!"
                                    );
                                  }
                                }}
                              />
                              {reviewimage?.reviewimg &&
                                reviewimage?.preview === "" && (
                                  <img
                                    style={{ width: "100px", height: "100px" }}
                                    src={`${REACT_APP_URL}/images/review/${reviewimage?.reviewimg}`}
                                    alt="_profile"
                                  />
                                )}
                              {reviewimage?.preview && (
                                <img
                                  style={{ width: "100px", height: "100px" }}
                                  src={reviewimage?.preview}
                                  alt="_profilemm"
                                />
                              )}
                            </div>

                            {/* <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Product
                              </label>
                              {products && (
                                <>
                                  <Select
                                    className="col-12"
                                    value={selected}
                                    onChange={setSelected}
                                    options={products.map((p) => {
                                      return {
                                        label: p.ProductName,
                                        value: p._id,
                                      };
                                    })}
                                  />
                                </>
                              )}
                            </div> */}
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

export default EditReview;
