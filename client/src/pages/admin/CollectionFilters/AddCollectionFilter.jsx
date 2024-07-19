import { useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
// import { FiEdit } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import { axiosInstance } from "../../../config";
const AddCollectionFilter = () => {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [FiltersName, setFilterName] = useState("");
  const [Filter, setFilter] = useState([]);
  const removeHandler = (index) => {
    const FilterArr = Filter;
    FilterArr.splice(index, 1);
    setFilter([...FilterArr]);
  };
  const addHandler = (e) => {
    e.preventDefault();
    if (!FiltersName) {
      return toastError("Please enter Filter Name");
    }
    setFilter([...Filter, FiltersName]);

    setFilterName("");
  };
  const editHandler = (data, index) => {
    const FilterArr = Filter;
    FilterArr.splice(index, 1);
    setFilter([...FilterArr]);
    setFilterName(data);
  };

  const createHandler = async () => {
    if (!Name) {
      return toastError("Please enter Name");
    }
    try {
      const { data } = await axiosInstance.post(
        `/api/CollectionFilter`,
        {
          Name,
          Filter,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        navigate("/admin/CollectionFilters");
        return toastSuceess(data.message);
      }
    } catch (error) {
      return toastError("Something went wrong");
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
                  <div className="p-3">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Add Collection Filters</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="card-body">
                      <div>
                        <div className="row mb-3">
                          <div className="col-md-7">
                            <label className="form-label" htmlFor="Name">
                              Name
                            </label>
                            <input
                              type="Name"
                              className="form-control"
                              id="Name"
                              placeholder="Name"
                              value={Name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-body CreateCard" style={{ zoom: "90%" }}>
                    <div className="row mx-2 ">
                      <form onSubmit={addHandler} className="d-flex gap-2">
                        <div className="col-md-3 align-items-center">
                          <label>Filters</label>
                          <input
                            className="form-control "
                            type="text"
                            name="Filters Name"
                            value={FiltersName}
                            onChange={(e) => setFilterName(e.target.value)}
                            placeholder="Enter Filters Name"
                            required //done
                          />
                        </div>
                        {
                          <div
                            className="col-md-3 align-items-center"
                            style={{
                              paddingTop: "1.4rem",
                            }}
                          >
                            <button
                              className="btn mybtn"
                              type="submit"
                              // onClick={() => {
                              //   addHandler();
                              // }}
                              style={{
                                color: "black",
                                backgroundColor: "green",
                              }}
                            >
                              Add filter Name
                            </button>
                          </div>
                        }
                      </form>
                      <div
                        className="col-md-12 align-items-center"
                        style={{ marginTop: "20px" }}
                      >
                        {
                          <table className="table table-striped table-bordered overflow-x mt-3">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tags</th>
                                {<th scope="col">Action</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {Filter.map((ele, index) => (
                                <tr key={ele}>
                                  <th scope="row">{index + 1}</th>
                                  <td>{ele}</td>

                                  {
                                    <td>
                                      <BiEdit
                                        size={32}
                                        style={{
                                          backgroundColor: "green",
                                          color: "#fff",
                                          padding: "5px",
                                          borderRadius: "5px",
                                          marginTop: "-5px",
                                        }}
                                        onClick={() => editHandler(ele, index)}
                                      />
                                      &nbsp;
                                      <AiFillDelete
                                        size={32}
                                        style={{
                                          backgroundColor: "#A50406",
                                          color: "#fff",
                                          padding: "5px",
                                          borderRadius: "5px",
                                          marginTop: "-5px",
                                        }}
                                        onClick={() => {
                                          const isTrue = window.confirm(
                                            "Do you want to delete!"
                                          );
                                          if (isTrue) {
                                            removeHandler(index);
                                          }
                                        }}
                                      />
                                    </td>
                                  }
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="m-3 p-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => createHandler()}
                    >
                      Save
                    </button>
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

export default AddCollectionFilter;
