import React, { useEffect, useState } from "react";
import GalleryComponents from "../../../components/galleryComponents/GalleryComponents";
import SideBar from "../../../components/sidebar/SideBar";
// import searchicon from "../../../assets/icon/icon_search.svg";
// import profileicon from "../../../assets/img/Profile.jpg";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../../config";
// import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { fetchGallery } from "../../../redux/slices/gallerySlice";
import TopHeader from "../../../components/topheader/TopHeader";
import Preloader from "../../../components/preloader/Preloader";

const Gallery = () => {
  const { loading, gallery: allgallery } = useSelector(
    (state) => state.gallery
  );

  const [gallery, setgallery] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [galleryType, setgalleryType] = useState("product");
  const [btntype, setbtntype] = useState("product");

  const dispatch = useDispatch();

  useEffect(() => {
    handleGallery("product");
  }, []);

  const handleGallery = async (name) => {
    // e.preventDefault();
    try {
      dispatch(fetchGallery(name));

      const { data } = await axiosInstance.get(`/api/uploads?name=${name}`);
      setgallery(data);
      setgalleryType(name);
      setbtntype(name);
    } catch (error) {
      alert(error.response.data.messgae);
    }
  };

  if (isLoading) {
    return (
      <>
        <Preloader />
        {/* <h1>Loading</h1> */}
      </>
    );
  }

  return (
    <>
      <SideBar />

      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <TopHeader />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Gallery</h3>
                      </div>
                      <Link
                        to="/admin/add-product"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Image
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    {/* <div className="row">
                      <div className="col-md-4">
                        <button
                          onClick={(e) => handleGallery(e, "product")}
                          className="btn btn-primary"
                        >
                          Product
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button
                          onClick={(e) => handleGallery(e, "user")}
                          className="btn btn-primary"
                        >
                          User
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button
                          onClick={(e) => handleGallery(e, "extra")}
                          className="btn btn-primary"
                        >
                          Extra
                        </button>
                      </div>
                    </div> */}
                    <div className="row">
                      <center>
                        <ul className="nav nav-tabs">
                          <li
                            className="nav-item"
                            onClick={() => handleGallery("product")}
                          >
                            <a
                              className={
                                btntype === "product"
                                  ? `nav-link active`
                                  : "nav-link"
                              }
                              href="#"
                            >
                              Product
                            </a>
                          </li>
                          {/* <li
                            className="nav-item"
                            onClick={(e) => handleGallery(e, "user")}
                          >
                            <a className={btntype === "user" ?`nav-link active`:"nav-link"} href="#">
                              User
                            </a>
                          </li> */}
                          <li
                            className="nav-item"
                            onClick={() => handleGallery("extra")}
                          >
                            <a
                              className={
                                btntype === "extra"
                                  ? `nav-link active`
                                  : "nav-link"
                              }
                              href="#"
                            >
                              Other
                            </a>
                          </li>
                        </ul>
                      </center>
                    </div>
                    {!isLoading ? (
                      <GalleryComponents
                        name={galleryType}
                        gallerydata={allgallery}
                      />
                    ) : (
                      <h6>Loading</h6>
                    )}
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
                    Designed & Developed By{" "}
                    <a href="http://marwariplus.com/">Marwari Software</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="back-top" style={{ display: "none" }}>
        <a title="Go to Top" href="#">
          <i className="ti-angle-up"></i>
        </a>
      </div>
    </>
  );
};

export default Gallery;
