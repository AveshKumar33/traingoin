import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { createCoupon } from "../../../redux/slices/couponSlice";
// import { getCurrentDateInput } from "../../../utils/useFullFunctions/getCurrentDate";
import SideBar from "../../../components/sidebar/SideBar";
import {
  createArchitect,
  resetState,
} from "../../../redux/slices/architectSlice";
import { toastError } from "../../../utils/reactToastify";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddArchitect = () => {
  const { loading } = useSelector((state) => state.architect);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [userimage, setUserImage] = useState({ userImage: "", preview: "" });
  const [formdata, setformdata] = useState({
    Name: "",
    Url: "",
    Password: "",
    MobNumber: "",
    Email: "",
    Address: "",
    status: null,
    firmName: "",
    maxDiscount: 0,
  });

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        createArchitect({
          ...formdata,
          architect: userimage?.userImage,
          Url:
            formdata.Url === ""
              ? formdata.Name.toLocaleLowerCase().replace(/\s+/g, "-")
              : formdata.Url.toLocaleLowerCase(),
        })
      ).unwrap();

      navigate("/admin/architect");
    } catch (error) {
      if (error?.includes("E11000")) {
        toastError("Url Already Present");
        return;
      }

      error
        .replace("architectModal validation failed:", "")
        .split(",")
        .map((err) => {
          return toastError(err);
        });
    }
  };

  const onChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <SideBar />
      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Architect</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="Tag Name">
                              Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Tag Name"
                              placeholder="Enter Architect Name"
                              name="Name"
                              required
                              // value={}
                              defaultValue={formdata.Name}
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="Tag Name">
                              Email
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Tag Name"
                              placeholder="Email"
                              name="Email"
                              required
                              // value={}
                              defaultValue={formdata.Email}
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="Tag Name">
                              Mob Number
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="Tag Name"
                              placeholder="Mobile Number"
                              name="MobNumber"
                              required
                              maxLength={10}
                              // value={}
                              defaultValue={parseInt(formdata.MobNumber)}
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>

                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="Tag Name">
                              Password
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Tag Name"
                              placeholder="Password"
                              name="Password"
                              required
                              // value={}
                              defaultValue={formdata.Password}
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-12 mt-2 ">
                            <label className="form-label" htmlFor="Tag Name">
                              Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Address"
                              placeholder="Address"
                              name="Address"
                              required
                              defaultValue={formdata.Address}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="Firm Name">
                              Firm Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Firm Name"
                              placeholder="Enter Firm Name"
                              name="firmName"
                              required
                              // value={}
                              defaultValue={formdata.firmName}
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="Firm Name">
                              Max Discount (in %)
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="maxDiscount"
                              name="maxDiscount"
                              required
                              defaultValue={formdata.maxDiscount}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="Tag Name">
                              Page Url
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Page_Url"
                              placeholder="Page Url"
                              name="Url"
                              required
                              // value={}
                              defaultValue={
                                formdata.Name.toLocaleLowerCase().replace(
                                  /\s+/g,
                                  "-"
                                ) || ""
                              }
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>
                          <div className="col-md-6 mt-2">
                            <label
                              className="form-label"
                              htmlFor="FeaturedProducts"
                            >
                              Status
                            </label>
                            <select
                              id="FeaturedProducts"
                              className="form-control"
                              name="status"
                              required
                              onChange={onChange}
                            >
                              <option selected value="">
                                ---- Choose ----
                              </option>
                              <option value={1}>Active</option>
                              <option value={0}>Inactive</option>
                            </select>
                          </div>
                          <div className="col-md-6 mt-2 ">
                            <label className="form-label" htmlFor="file">
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
                                  setUserImage({
                                    userImage: file,
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

                            {userimage.preview && (
                              <img
                                style={{ width: "100px", height: "100px" }}
                                src={userimage.preview}
                                alt="_profilemm"
                              />
                            )}
                          </div>
                        </div>
                        <br />

                        <center>
                          {loading === "pending" ? (
                            <button className="btn btn-primary">
                              Loading ....
                            </button>
                          ) : (
                            <button type="submit" className="btn btn-primary">
                              Save
                            </button>
                          )}
                        </center>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default AddArchitect;
