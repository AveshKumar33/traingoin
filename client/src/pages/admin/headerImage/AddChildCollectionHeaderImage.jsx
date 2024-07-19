import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import { REACT_APP_URL, axiosInstance } from "../../../config";

import Preloader from "../../../components/preloader/Preloader";
import Modal from "../../../components/modal/Modal";
import { FaImage } from "react-icons/fa";
import { toastError } from "../../../utils/reactToastify";

import AddHeaderImage from "./AddHeaderImage";

const HeaderImage = () => {
  const { id } = useParams();

  const [IsModal, setIsModal] = useState(false);
  const [uploadImagePNG, setUploadImagePNG] = useState();
  const [rootCollections, setRootCollections] = useState([]);
  const [rootCollectionsChildCount, setRootCollectionsChildCount] = useState(
    {}
  );
  const [Option, setOption] = useState("");

  const closeModal = () => {
    setIsModal(false);
    setUploadImagePNG("");
  };

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/header-image/${id}`);

      if (data?.success) {
        setRootCollectionsChildCount(data?.childCollections);
        setRootCollections(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  const handleDeleteItemPng = async (id) => {
    setUploadImagePNG("");
    let obj = {
      ...Option,
      pngImage: "",
    };
    setOption(obj);
  };

  const handleSubmitHeaderPng = async (id) => {
    try {
      let headerImageData = new FormData();
      headerImageData.append("headerImage", uploadImagePNG || "");

      const { data } = await axiosInstance.put(
        `/api/header-image/${id}`,
        headerImageData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        fetchRootCollection();
        setIsModal(false);
        setUploadImagePNG("");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  };
  const isMobile = window.innerWidth <= 768;
  const modalWidth = isMobile ? "90%" : "35%";
  return (
    <>
      <Modal
        handleClose={closeModal}
        width={modalWidth}
        show={IsModal}
        // height="65%"
      >
        <div style={{ padding: "2rem" }}>
          <h6>Upload Photo</h6>

          <AddHeaderImage
            option={Option}
            // id={id}
            closeModal={closeModal}
            setuploadImagePNG={setUploadImagePNG}
            uploadImagePNG={uploadImagePNG}
            handleDeleteItemPng={handleDeleteItemPng}
          />
        </div>

        <center>
          <button
            type="submit"
            className="btn btn-primary m-3"
            onClick={() => {
              handleSubmitHeaderPng(Option?._id);
            }}
          >
            Save
          </button>
        </center>
      </Modal>
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-3">
            <div className="row justify-content-center">
              <div className="col-lg-12 ">
                <div className="white_card card_height_100 mb_30">
                  <div className="">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">PNG</th>
                            <th scope="col" style={{ width: "25%" }}>
                              Upload
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rootCollections &&
                            rootCollections?.length > 0 &&
                            rootCollections.map((collection, indx) => (
                              <tr key={collection._id}>
                                <th scope="row">{indx + 1}</th>
                                <td>
                                  <h5>
                                    {collection?.collectionId?.title
                                      ? collection?.collectionId?.title
                                      : collection?.title}
                                  </h5>
                                </td>
                                <td>
                                  <img
                                    src={`${REACT_APP_URL}/images/header/${collection?.pngImage}`}
                                    style={{ width: "200px", height: "150px" }}
                                    alt="__headerImage"
                                  />{" "}
                                  &nbsp; &nbsp;
                                </td>

                                <td>
                                  <div
                                    onClick={() => {
                                      setOption(collection);
                                      setIsModal(true);
                                    }}
                                    style={{
                                      backgroundColor: "#d98926",
                                      padding: "7px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                      float: "left",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <FaImage />
                                  </div>

                                  {/* {rootCollectionsChildCount &&
                                    rootCollectionsChildCount?.[
                                      collection?.collectionId?._id
                                    ] > 0 && (
                                      <Link
                                        to={`/admin/header-images/:${collection?.collectionId?._id}`}
                                        className="btn btn-info"
                                        style={{
                                          display: "inline-block",
                                          marginLeft: "2px",
                                        }}
                                      >
                                        Add Child Coll. Image
                                      </Link>
                                    )} */}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#1a2e45d7",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                      marginTop: "5px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </section>
    </>
  );
};

export default HeaderImage;
