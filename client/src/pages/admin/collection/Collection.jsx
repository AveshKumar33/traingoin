import { useEffect } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import {
  deleteCollection,
  fetchCollections,
} from "../../../redux/slices/collectionSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import Preloader from "../../../components/preloader/Preloader";

const Collection = () => {
  const { loading, collections } = useSelector((state) => state.collections);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCollections());
  }, [dispatch]);

  if (loading === "pending") {
    return (
      <div>
        <Preloader />
      </div>
    );
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteCollection(id));
    }
  };

  return (
    <>
      <SideBar />
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
                        <h3 className="m-0">Collection</h3>
                      </div>
                      <Link
                        to="/admin/add-collection"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Collection
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col" style={{ width: "25%" }}>
                              Path
                            </th>
                            {/* <th scope="col">Collection Name</th> */}
                            <th scope="col"> Sequence</th>
                            <th scope="col">Name</th>
                            <th scope="col">Most selling product </th>
                            {/* <th scope="col" style={{ width: "25%" }}>
                              Child Collection
                            </th>
                           */}

                            {/* <th scope="col" style={{ width: "25%" }}>
                              Tags
                            </th> */}
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading === "fulfilled" &&
                            collections &&
                            collections?.length !== 0 &&
                            collections.map((p, index) => (
                              <>
                                <tr>
                                  <th scope="row">{index + 1}</th>
                                  <td>
                                    {p?.rootPath &&
                                      p?.rootPath.length > 0 &&
                                      p?.rootPath?.map(
                                        (ele, i) =>
                                          `${ele.title} ${
                                            i === p?.rootPath.length - 1
                                              ? ""
                                              : "=>"
                                          } `
                                      )}
                                  </td>

                                  <td>{p?.displaySequence}</td>
                                  <td>{p?.title}</td>
                                  <td>
                                    {" "}
                                    <button
                                      className={
                                        p?.mostSellingProduct === 1
                                          ? "btn btn-success"
                                          : "btn btn-danger"
                                      }
                                      style={{ fontSize: "14px" }}
                                    >
                                      {p?.mostSellingProduct ? "Yes" : "No"}
                                    </button>
                                  </td>
                                  {/* <td>
                                    {p?.childCollections &&
                                      p?.childCollections.map((p) => (
                                        <>
                                          <span
                                            key={p._id}
                                            className="bg-success p-1 rounded"
                                            style={{
                                              display: "inline-flex",
                                              fontSize: "12px",
                                              margin: "2px",
                                            }}
                                          >
                                            {p?.title}
                                          </span>
                                          &nbsp;
                                        </>
                                      ))}
                                  </td> */}

                                  {/* <td>
                                    {p?.productTags &&
                                      p?.productTags.map((p) => (
                                        <>
                                          <span
                                            key={p?._id}
                                            className="bg-success p-1 rounded"
                                            style={{
                                              display: "inline-flex",
                                              fontSize: "12px",
                                              margin: "2px",
                                            }}
                                          >
                                            {p?.name}
                                          </span>
                                          &nbsp;
                                        </>
                                      ))}
                                  </td> */}

                                  <td>
                                    <span>
                                      <Link
                                        to={`/admin/edit-collection/${p?._id}`}
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
                                      onClick={() => handleDeleteClick(p?._id)}
                                    >
                                      <AiTwotoneDelete />
                                    </span>
                                  </td>
                                </tr>
                              </>
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
        <Footer />
      </section>
    </>
  );
};

export default Collection;
