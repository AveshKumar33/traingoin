import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import ImageComponent from "./ImageComponent";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import { axiosInstance } from "../../../config";
import "./imagecomp.css";

const AddOnImages = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dotPosition, setDotPosition] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [video, setVideo] = useState("");

  const handleSubmit = async () => {
    const dotproduct = dotPosition
      .map((p) => {
        if (p?.productId) {
          return true;
        } else {
          return false;
        }
      })
      .every((p) => p === true);

    if (!dotproduct) {
      return toastError("Add Product To each Dot");
    }

    if (video === "" && (selectedFile === null || selectedFile === undefined)) {
      // alert("Fill all the fields")
      toastError("Please Fill Atleast One Field");
      return;
    }

    if (video !== "" && selectedFile !== null) {
      toastError("Please Select One fields");
      return;
    }
    if (video === "" && dotPosition?.length === 0) {
      toastError("Mark dot on Images");
      // alert("Mark dot on Images")
      return;
    }

    let dotProductData = new FormData();

    dotProductData.append("dotimg", selectedFile);
    dotProductData.append("dots", JSON.stringify(dotPosition));
    dotProductData.append("dotProductId", id);
    dotProductData.append("video", extractSrcFromIframe(video));

    try {
      const { data } = await axiosInstance.post(
        `/api/dot-product-image`,
        dotProductData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        toastSuceess(data?.message);

        navigate(`/admin/dot-product-new/view-images/${id}`);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };
  /**vedio logic here */
  function extractSrcFromIframe(iframeCode) {
    const match = iframeCode.match(/src=["'](.*?)["']/);
    if (match && match.length > 1) {
      return match[1];
    } else {
      // Return a default URL or handle the error appropriately
      return "";
    }
  }

  const handleChange = (e) => {
    const src = e.target.value;
    setVideo(src.trim());
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
                          <h3 className="m-0">Add Dot Product</h3>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <div className="card-body">
                        {/**image and vedio */}
                        <div style={{ marginLeft: "30px" }}>
                          <div className="main-title">
                            <h5 className="my-2">Add New Image</h5>
                          </div>
                          <hr />
                          <ImageComponent
                            setDotPosition={setDotPosition}
                            dotPosition={dotPosition}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                          />
                          <div>
                            {console.log("video", extractSrcFromIframe(video))}

                            <h5 className="my-2">Enter YouTube Embed Code</h5>
                            <input
                              style={{ width: "50%" }}
                              type="text"
                              className="form-control"
                              name="video"
                              value={video}
                              onChange={handleChange}
                              placeholder="Paste your YouTube embed code here..."
                            />

                            {video && (
                              <div className="mt-2">
                                <iframe
                                  width="560"
                                  height="315"
                                  src={extractSrcFromIframe(video)}
                                  title="YouTube video player"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            )}
                          </div>
                          <br></br>
                          <div className="d-flex gap-2 my-2">
                            <button
                              onClick={() => handleSubmit()}
                              className="btn btn-primary"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                        {/**image and vedio end here */}
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

export default AddOnImages;
