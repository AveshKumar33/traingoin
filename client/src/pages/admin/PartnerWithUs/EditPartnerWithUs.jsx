import { useEffect, useState } from "react";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import TopHeader from "../../../components/topheader/TopHeader";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { toastError, toastSuceess } from "../../../utils/reactToastify";

const EditPartnerWithUs = () => {
  const imageTypeRegex = /image\/(jpeg|jpg|png|JPG|PNG|JPEG|webp)/gm;
  const videoTypeRegex = /video\/(mp4|webm)/gm;
  const { id } = useParams();
  const navigate = useNavigate();
  const [pWusimage, setPWusImage] = useState({ userImage: "", preview: "" });
  const [status, setStatus] = useState("");
  /** check preview type */
  const [isFileImage, setIsFileImage] = useState(false);
  if (pWusimage.preview) {
    fetch(pWusimage.preview)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const contentType = blob.type;
        if (contentType.startsWith("image/")) {
          setIsFileImage(true);
        } else if (contentType.startsWith("video/")) {
          setIsFileImage(false);
        } else {
          console.log("Neither an image nor a video");
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  }
  async function featchDataById(PId) {
    try {
      const { data } = await axiosInstance.get(`/api/partner-with-us/${PId}`);
      if (data.success) {
        setPWusImage((prev) => ({ ...prev, userImage: data?.data?.pwusImage }));
        setStatus(data?.data?.status);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
  async function updateDataById(updatedData) {
    try {
      const { data } = await axiosInstance.put(
        `/api/partner-with-us/${updatedData?.id}`,
        updatedData?.userdata,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        toastSuceess("Image updated successfully");
        navigate("/admin/partner-with-us");
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    featchDataById(id);
  }, [id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const userdata = new FormData();
    userdata.append("clientImages", pWusimage?.userImage);
    const updatedData = {
      id,
      userdata,
    };
    updateDataById(updatedData);
  };

  return (
    <>
      <SideBar />
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
                          <h3 className="m-0">Client Images</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Image
                              </label>
                              {status === "contactUsVideo" ? (
                                <input
                                  type="file"
                                  className="form-control"
                                  id="Title"
                                  placeholder="Image"
                                  name="Image"
                                  onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (
                                      file.type.match(videoTypeRegex) &&
                                      file.size <= 10000000
                                    ) {
                                      setPWusImage({
                                        userImage: e.target.files[0],
                                        preview: URL.createObjectURL(
                                          e.target.files[0]
                                        ),
                                      });
                                    } else {
                                      e.target.value = null;
                                      toastError(
                                        "Selected video are not of valid type or size!"
                                      );
                                    }
                                  }}
                                />
                              ) : (
                                <input
                                  type="file"
                                  className="form-control"
                                  id="Title"
                                  placeholder="Image"
                                  name="Image"
                                  onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (
                                      file.type.match(imageTypeRegex) &&
                                      file.size <= 10000000
                                    ) {
                                      setPWusImage({
                                        userImage: e.target.files[0],
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
                              )}
                              {status === "contactUsVideo"
                                ? pWusimage?.preview &&
                                  !isFileImage &&
                                  pWusimage?.preview && (
                                    <video
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      src={pWusimage?.preview}
                                      alt="_profilemm"
                                      controls
                                    />
                                  )
                                : pWusimage?.preview && (
                                    <img
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      src={pWusimage?.preview}
                                      alt="_profile"
                                    />
                                  )}

                              {status === "contactUsVideo"
                                ? pWusimage?.userImage &&
                                  pWusimage?.preview === "" && (
                                    <video
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      src={`${REACT_APP_URL}/images/clientImages/${pWusimage?.userImage}`}
                                      alt="_profile"
                                      controls
                                    />
                                  )
                                : pWusimage?.userImage &&
                                  pWusimage?.preview === "" && (
                                    <img
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      src={`${REACT_APP_URL}/images/clientImages/${pWusimage?.userImage}`}
                                      alt="_profile"
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

export default EditPartnerWithUs;
