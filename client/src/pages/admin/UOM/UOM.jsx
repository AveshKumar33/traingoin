import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
// import SideBar from "../../../components/sidebar/SideBar";
import { useEffect } from "react";
import { deleteUOM, fetchUOM } from "../../../redux/slices/UOMSlice";
import { FiEdit } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import Preloader from "../../../components/preloader/Preloader";

const UOM = () => {
  const { loading, uoms, uomId } = useSelector((state) => state.uoms);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUOM());
  }, [dispatch, uomId]);

  if (loading === "pending") {
    return <Preloader />;
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteUOM(id));
    }
  };

  return (
    <>
      {/* <SideBar /> */}
      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">UOM</h3>
                      </div>
                      {/* <Link
                        to="/admin/add-uom"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add UOM
                      </Link> */}
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name (UOM)</th>
                            <th scope="col">Status</th>
                            {/* <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {uoms &&
                            uoms.map((uom, index) => (
                              <tr key={uom?._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{uom?.name}</td>
                                <td>
                                  {uom?.status === 1 ? "Active" : "Inactive"}
                                </td>
                                {/* <td>
                                  <span>
                                    <Link
                                      to={`/admin/edit-uom/${uom?._id}`}
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
                                    }}
                                    onClick={() => handleDeleteClick(uom?._id)}
                                  >
                                    <AiTwotoneDelete />
                                  </span>
                                </td> */}
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
        <Footer></Footer>
      </section>
    </>
  );
};

export default UOM;
