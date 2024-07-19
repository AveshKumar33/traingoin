import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
// import SideBar from "../../../components/sidebar/SideBar";
import { useEffect } from "react";
import { deleteTag, fetchTags } from "../../../redux/slices/tagSlice";
import { FiEdit } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import Preloader from "../../../components/preloader/Preloader";
import { axiosInstance } from "../../../config";

const Tags = () => {
  const { loading, tags, tagId } = useSelector((state) => state.tags);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch, tagId]);

  if (loading === "pending") {
    return <Preloader />;
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteTag(id));
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
                        <h3 className="m-0">Tags</h3>
                      </div>
                      <Link
                        to="/admin/add-tags"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Tag
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Tag Name</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tags &&
                            tags.map((t, index) => (
                              <tr key={t?._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{t?.name}</td>
                                <td>
                                  {t?.status === 1 ? "Active" : "Inactive"}
                                </td>
                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/tags/${t?._id}`}
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
                                    onClick={() => handleDeleteClick(t?._id)}
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
        <Footer></Footer>
      </section>
    </>
  );
};

export default Tags;
