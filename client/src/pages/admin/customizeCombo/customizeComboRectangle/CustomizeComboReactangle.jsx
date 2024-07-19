import React, { useState } from "react";
import SideBar from "../../../../components/sidebar/SideBar";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";
import TopHeader from "../../../../components/topheader/TopHeader";
import Preloader from "../../../../components/preloader/Preloader";

import {
  deleteCustomizedComboectangle,
  fetchCustomizedComboProductRectangle,
} from "../../../../redux/slices/customizeComboRectangleSlice";

const CustomizeComboReactangle = () => {
  const { productId } = useParams();

  const {
    loading,
    customizedComboRectangle,
    customizedComboProductRecatngleId,
  } = useSelector((state) => state.customizeComboRectangle);

  const [product, setProduct] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(fetchCustomizedComboProductRectangle(productId));
    }
  }, [dispatch, customizedComboProductRecatngleId, productId]);

  useEffect(() => {
    if (loading === "fulfilled" && customizedComboRectangle?.length > 0) {
      setProduct(customizedComboRectangle);
    }
  }, [loading, customizedComboRectangle]);

  if (loading === "pending") {
    return <Preloader />;
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteCustomizedComboectangle(id));
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
                        <h3 className="m-0">
                          Customized Combo Product Rectangle
                        </h3>
                      </div>
                      <div>
                        <Link
                          to={`/admin/customized-combo-product/add-rectangle/${productId}`}
                          className="btn btn-outline-primary mb-3"
                        >
                          Add Product
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product &&
                            product?.length > 0 &&
                            product.map((p, indx) => (
                              <tr key={p?._id}>
                                <td>{indx + 1}</td>
                                <td>{p?.name}</td>

                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/customized-combo-product/edit-rectangle/${productId}/${p?._id}`}
                                      style={{
                                        backgroundColor: "#198754",
                                        padding: "7px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                        cursor: "pointer",
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
                                    onClick={() => handleDeleteClick(p?._id)}
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
    </>
  );
};

export default CustomizeComboReactangle;
