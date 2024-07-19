import SideBar from "../../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { REACT_APP_URL, axiosInstance } from "../../../../config";

import { useState, useEffect } from "react";
import TopHeader from "../../../../components/topheader/TopHeader";
import {
  fetchParametersDetails,
  updateParameter,
} from "../../../../redux/slices/parameterSlice";
import { toastError } from "../../../../utils/reactToastify";

const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;

const EditParameter = () => {
  const navigate = useNavigate();

  const { Name: attributeName, attId, id, isVisibleInCustomized } = useParams();

  const [profileImage, setprofileImage] = useState({
    profileImage: "",
    preview: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    attributeId: "",
    attributeCategoryId: "",
    displayIndex: "",
    price: "",
    status: 1,
  });

  const { loading, parametersDetails } = useSelector(
    (state) => state.parameters
  );

  useEffect(() => {
    if (loading === "fulfilled") {
      setFormData({
        name: parametersDetails?.name,
        attributeId: parametersDetails?.attributeId?._id,
        attributeCategoryId: parametersDetails?.attributeCategoryId?._id,
        displayIndex: parametersDetails?.displayIndex,
        price: parametersDetails?.price,
        status: parametersDetails?.status,
      });

      setprofileImage({
        profileImage: parametersDetails?.profileImage,
        preview: "",
      });
    }
  }, [loading, parametersDetails]);

  const dispatch = useDispatch();

  const [A_Category, setA_Cateogy] = useState();
  const fetchAttributeCategor = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/AttributeCategor`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setA_Cateogy(data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchAttributeCategor();
    dispatch(fetchParametersDetails(id));
  }, [dispatch, id]);

  const {
    name,
    attributeId,
    attributeCategoryId,
    displayIndex,
    price,
    status,
  } = formData;

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attributeCategoryId) {
      return toastError("Attribute Category is required!");
    }

    let parameterData = new FormData();

    parameterData.append("name", name);
    parameterData.append("attributeId", attributeId);
    parameterData.append("attributeCategoryId", attributeCategoryId);
    parameterData.append("displayIndex", displayIndex);
    parameterData.append("price", price);
    parameterData.append("profileImage", profileImage.profileImage);
    parameterData.append("status", status);

    const updateddata = {
      id,
      parameterData,
    };

    dispatch(updateParameter(updateddata));

    if (loading === "fulfilled") {
      navigate(
        `/admin/attribute/parameters/${attributeName}/${attId}/${isVisibleInCustomized}`
      );
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
                          <h3 className="m-0">{attributeName}</h3>
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
                                name="name"
                                required
                                value={formData?.name || ""}
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                                name="attributeCategoryId"
                              >
                                Attribute Category
                              </label>
                              <select
                                className="form-select"
                                name="attributeCategoryId"
                                value={formData.attributeCategoryId || null}
                                onChange={handleFormChange}
                              >
                                <option>--Attribute Category ---</option>
                                {A_Category?.map((attCat) => (
                                  <option key={attCat?._id} value={attCat?._id}>
                                    {attCat.Name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Display Index
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="Title"
                                name="displayIndex"
                                required
                                value={formData?.displayIndex || 0}
                                onChange={handleFormChange}
                              />
                            </div>
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Price
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="price"
                                name="price"
                                required
                                value={formData?.price || 0}
                                onChange={handleFormChange}
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
                                value={formData?.status || 0}
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>

                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Profile Image
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                id="Title"
                                placeholder="Image"
                                name="profileImage"
                                onChange={(e) => {
                                  const file = e.target.files[0];

                                  if (
                                    file.type.match(imageTypeRegex) &&
                                    file.size <= 10000000
                                  ) {
                                    setprofileImage({
                                      profileImage: file,
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

                              {profileImage.profileImage &&
                                profileImage.preview === "" && (
                                  <img
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                      marginTop: "10px",
                                    }}
                                    src={`${REACT_APP_URL}/images/parameter/${profileImage.profileImage}`}
                                    alt="_profile"
                                  />
                                )}
                              {profileImage.preview && (
                                <img
                                  style={{ width: "100px", height: "100px" }}
                                  src={profileImage.preview}
                                  alt="_profilemm"
                                />
                              )}
                            </div>
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

export default EditParameter;
