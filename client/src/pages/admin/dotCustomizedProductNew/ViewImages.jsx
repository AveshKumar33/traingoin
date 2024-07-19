import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import TopHeader from "../../../components/topheader/TopHeader";
import {
  fetchDotCustomizedProductImage,
  deleteDotCustomizedProductImage,
} from "../../../redux/slices/dotCustomizedProductImageSlice";
// import { axiosInstance } from "../../../config";
import "./imagecomp.css";
import { REACT_APP_URL } from "../../../config";

const ViewImages = () => {
  const dispatch = useDispatch();
  const { loading, dotCustomizedProductsImages, deletedDataId } = useSelector(
    (state) => state.dotCustomizedProductImage
  );
  const { id } = useParams();

  const [dotProductImageData, setDotProductImageData] = useState([]);

  useEffect(() => {
    dispatch(fetchDotCustomizedProductImage(id));
  }, [dispatch, id, deletedDataId]);

  useEffect(() => {
    if (loading === "fulfilled" && dotCustomizedProductsImages?.length > 0) {
      setDotProductImageData(dotCustomizedProductsImages);
    }
  }, [loading, dotCustomizedProductsImages]);

  const handleDeleteClick = async (id) => {
    try {
      const answer = window.confirm("Are You Sure !");
      if (answer) {
        dispatch(deleteDotCustomizedProductImage(id));
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <SideBar />
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
                        <h3 className="m-0">View Images</h3>
                      </div>
                      <Link
                        to={`/admin/dot-customized-product/add-images/${id}`}
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Image
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Image</th>

                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {loading === "fulfilled" &&
                            dotProductImageData?.length > 0 &&
                            dotProductImageData?.map((p, index) => (
                              <tr key={p._id}>
                                <th scope="row">{index + 1}</th>
                                <th>
                                  {p?.image && (
                                    <img
                                      src={`${REACT_APP_URL}/images/dotimage/${p?.image}`}
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                      alt="prev"
                                    />
                                  )}

                                  {p?.video && (
                                    <iframe
                                      width="100"
                                      height="100"
                                      src={p?.video}
                                      title="YouTube video player"
                                      frameBorder="5"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    ></iframe>
                                  )}
                                </th>
                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/edit-dot-customized-product-image/${p._id}`}
                                      className="btn btn-outline-primary mb-3"
                                      style={{
                                        backgroundColor: "#198754",
                                        padding: "7px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                      }}
                                    >
                                      <FiEdit />
                                    </Link>
                                  </span>
                                  &nbsp;
                                  <span
                                    style={{
                                      backgroundColor: "#dc3545",
                                      padding: "7px",
                                      borderRadius: "8px",
                                      color: "#fff",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => handleDeleteClick(p._id)}
                                  >
                                    <AiTwotoneDelete />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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

export default ViewImages;
