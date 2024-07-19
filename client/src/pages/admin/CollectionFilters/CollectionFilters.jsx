import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import Preloader from "../../../components/preloader/Preloader";
import { axiosInstance } from "../../../config";
import { Chip } from "@mui/material";
import { toastSuceess, toastError } from "../../../utils/reactToastify";

const CollectionFilters = () => {
  const [FiltersData, setFiltersData] = useState();
  const [filtersDataDelete, setFiltersDataDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFilters = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/api/CollectionFilter`,

        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data?.success) {
        setFiltersData(data?.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastSuceess(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getFilters();
  }, [filtersDataDelete]);

  const deleteHandler = async (id) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/CollectionFilter/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data?.success) {
        getFilters();
        toastSuceess(data?.message);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  if (loading) {
    return <Preloader />;
  }

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
                        <h3 className="m-0">Collection Filters</h3>
                      </div>
                      <Link
                        to="/admin/add-CollectionFilters"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Collection Filter
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Filter Name</th>
                            <th scope="col">Tag</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {FiltersData &&
                            FiltersData.length > 0 &&
                            FiltersData.map((t, index) => (
                              <tr key={t?._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{t?.Name}</td>
                                <td>
                                  {t?.Filter &&
                                    t?.Filter.length > 0 &&
                                    t?.Filter?.map((tag) => (
                                      <Chip
                                        label={tag}
                                        key={tag}
                                        className="m-1"
                                      />
                                    ))}
                                </td>
                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/CollectionFilters/${t?._id}`}
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
                                    onClick={() => {
                                      const isTrue = window.confirm(
                                        "you want to delete!"
                                      );
                                      if (isTrue) {
                                        deleteHandler(t?._id);
                                      }
                                      filtersDataDelete
                                        ? setFiltersDataDelete(false)
                                        : setFiltersDataDelete(true);
                                    }}
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

export default CollectionFilters;
