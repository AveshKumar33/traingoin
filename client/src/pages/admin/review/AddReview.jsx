import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toastError } from "../../../utils/reactToastify";
// import { MultiSelect } from "react-multi-select-component";
import TopHeader from "../../../components/topheader/TopHeader";
import { createReview } from "../../../redux/slices/reviewSlice";
import Select from "react-select";
import { fetchProducts } from "../../../redux/slices/newProductSlice";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddReview = () => {
  const { loading, reviews, success } = useSelector((state) => state.review);
  const { products } = useSelector((state) => state.newProducts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [reviewimage, setReviewImage] = useState();
  const [reviewimage, setReviewImage] = useState({
    reviewimg: "",
    preview: "",
  });
  // const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Rating: "",
    ReviewTitle: "",
    ReviewBody: "",
    // Product: "",
    UserDetails: "",
  });
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

  // useEffect(() => {
  //   dispatch(fetchProducts({}));
  // }, [dispatch]);

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

    dispatch(createReview(reviewdata));

    if (loading === "fulfilled" && success) {
      navigate("/admin/review");
    }
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
                                required
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
                                id="file"
                                placeholder="Image"
                                name="Image"
                                required
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (
                                    file.type.match(imageTypeRegex) &&
                                    file.size <= 10000000
                                  ) {
                                    setReviewImage({
                                      reviewimg: file,
                                      preview: URL.createObjectURL(file),
                                    });
                                  } else {
                                    e.target.value = null;
                                    toastError(
                                      "Selected images are not of valid type or size!"
                                    );
                                  }
                                }}
                              />

                              {reviewimage.preview && (
                                <img
                                  style={{ width: "100px", height: "100px" }}
                                  src={reviewimage.preview}
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
                                    defaultValue={selected}
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

export default AddReview;
