import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import { MultiSelect } from "react-multi-select-component";
import { MultiSelect } from "react-multi-select-component";
import TopHeader from "../../../components/topheader/TopHeader";
import { createUser } from "../../../redux/slices/userSlice";
import { fetchUserRoles } from "../../../redux/slices/userRoleSlice";
import { toastError } from "../../../utils/reactToastify";
const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const AddUser = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { loading } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { userRoles } = useSelector((state) => state.userRoles);

  useEffect(() => {
    dispatch(fetchUserRoles());
  }, [dispatch]);

  const roles = userRoles?.filter((role) => role.status === 1);

  const [userimage, setUserImage] = useState({ userImage: "", preview: "" });

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    MobNumber: "",
    password: "",
    status: 1,
  });

  const { Name, Email, MobNumber, password, status } = formData;

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getId = (arr) => {
    return arr.map((x) => x.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const str = MobNumber.toString();

    if (str.length !== 10) {
      return toastError("Mobile number must be at least 10 digits");
    }

    if (selectedRoles.length === 0) {
      return toastError("Please select role");
    }
    let userdata = new FormData();

    userdata.append("Name", Name);
    userdata.append("Email", Email);
    userdata.append("MobNumber", MobNumber);
    userdata.append("Password", password);
    userdata.append("userimg", userimage.userImage);
    userdata.append("status", status);

    const userRoles = getId(selectedRoles);

    for (let i = 0; i < userRoles?.length; i++) {
      userdata.append("userRole", userRoles[i]);
    }

    dispatch(createUser(userdata));

    if (loading === "fulfilled") {
      navigate("/admin/user");
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
                          <h3 className="m-0">User</h3>
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
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                name="Email"
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Mob Number
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="number"
                                placeholder="Mob. Number"
                                name="MobNumber"
                                required
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Password
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                name="password"
                                required
                                onChange={handleFormChange}
                              />
                            </div>

                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Role (Designation)
                              </label>
                              <MultiSelect
                                options={roles.map((p) => {
                                  return {
                                    label: p.name,
                                    value: p._id,
                                  };
                                })}
                                required
                                value={selectedRoles}
                                onChange={setSelectedRoles}
                                labelledBy="Select Tag"
                              />
                            </div>

                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Status
                              </label>
                              <select
                                id="status"
                                className="form-control"
                                name="status"
                                required
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>

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

                          {/* <div className="mb-3">
                            <label className="form-label" htmlFor="Description">
                              Product Image ("Image Size should less than 2 MB"
                              )
                            </label>
                            <div className="upload-container">
                              <center>
                                <input
                                  type="file"
                                  id="file_upload"
                                  multiple
                                  
                                />
                              </center>
                            </div>
                          </div> */}
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

export default AddUser;
