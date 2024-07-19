import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { toastError, toastSuceess } from "../../../utils/reactToastify";
import Preloader from "../../../components/preloader/Preloader";
import {
  updateCollectionFilter,
  fetchCollectionFiltersDetails,
  createCollectionFilterTag,
  updateCollectionFilterTag,
  deleteCollectionFilterTag,
} from "../../../redux/slices/newCollectionFilterSlice";

const EditCollectionFilters = () => {
  const { id } = useParams();

  const { loading, CollectionFilterdetails, tag, tagId } = useSelector(
    (state) => state.newCollectionFilter
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Name, setName] = useState("");
  const [tagName, setTagName] = useState({ name: "", id: null });
  const [Filter, setFilter] = useState([]);
  const [displaySequence, setDisplaySequence] = useState();
  const [tagData, setTagData] = useState({
    tagDisplaySequence: null,
    tagName: "",
    id: null,
  });

  // add tag
  const addHandler = (e) => {
    e.preventDefault();
    if (tagData?.tagName === "") {
      return toastError("Please enter Tag Name");
    }
    if (!tagData?.tagDisplaySequence) {
      return toastError("Please Enter Tag Display Sequence");
    }

    const updatedData = {
      tagName: tagData?.tagName,
      tagDisplaySequence: tagData?.tagDisplaySequence,
    };

    if (tagData?.id) {
      dispatch(
        updateCollectionFilterTag({
          id: tagData?.id,
          updatedData,
        })
      );
    } else {
      dispatch(
        createCollectionFilterTag({
          tagName: tagData?.tagName,
          tagDisplaySequence: tagData?.tagDisplaySequence,
          collectionFilterId: CollectionFilterdetails?._id,
        })
      );
    }

    if (loading === "fulfilled") {
      setTagData({ tagDisplaySequence: null, tagName: "", id: null });
    }
  };

  const editHandler = (data, index) => {
    const FilterArr = [...Filter];
    FilterArr.splice(index, 1);
    setFilter(FilterArr);
    setTagData({
      tagName: data?.tagName,
      tagDisplaySequence: data?.tagDisplaySequence,
      id: data?._id,
    });

    setDisplaySequence({
      displaySequence: data?.displaySequence,
      id: data?._id,
    });
  };

  const getId = (arr) => {
    return arr.map((data) => data?._id);
  };

  const updateHandler = async () => {
    if (!Name) {
      return toastError("Please enter Name");
    }
    if (!displaySequence) {
      return toastError("Please enter Display Sequence");
    }

    try {
      const updatedData = {
        filterName: Name,
        displaySequence: displaySequence,
        collectionTagIds: getId(Filter),
      };

      dispatch(
        updateCollectionFilter({ id, CollectionFilterdata: updatedData })
      );

      if (loading === "fulfilled") {
        navigate("/admin/collection-filters");
      }
    } catch (error) {
      return toastError(error);
    }
  };

  const deleteTag = (id) => {
    try {
      const answer = window.confirm("Are You Sure !");
      if (answer) {
        dispatch(deleteCollectionFilterTag(id));
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    dispatch(fetchCollectionFiltersDetails(id));
  }, [dispatch, id, tag, tagId]);

  useEffect(() => {
    if ((loading === "fulfilled", CollectionFilterdetails)) {
      const alltags = CollectionFilterdetails?.collectionTagIds;
      if (alltags?.length > 0) {
        setFilter(alltags);
      }
      setName(CollectionFilterdetails?.filterName);
      setDisplaySequence(CollectionFilterdetails?.displaySequence);
      // setTagDisplaySequence(CollectionFilterdetails?.tagDisplaySequence);
    }
  }, [loading, CollectionFilterdetails, tag]);

  if (loading === "pending") {
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
                  <div className="p-3">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Edit Collection Filters</h3>
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
                              value={Name || ""}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="card-body">
                      <div>
                        <div className="row mb-3">
                          <div className="col-md-7">
                            <label
                              className="form-label"
                              htmlFor="Display Sequence"
                            >
                              Display Sequence
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="Display Sequence"
                              placeholder="Display Sequence"
                              value={displaySequence || null}
                              onChange={(e) =>
                                setDisplaySequence(e.target.value)
                              }
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
                          <label>Tags</label>
                          <input
                            className="form-control "
                            type="text"
                            name="Filters Name"
                            value={tagData?.tagName || ""}
                            onChange={(e) =>
                              setTagData((prevState) => ({
                                ...prevState,
                                tagName: e.target.value,
                              }))
                            }
                            placeholder="Enter Filters Name"
                            required //done
                          />
                        </div>
                        <div className="col-md-3 align-items-center">
                          <label>Tag Display Sequence</label>
                          <input
                            className="form-control "
                            type="number"
                            name="Tag Display Sequence"
                            value={tagData?.tagDisplaySequence || null}
                            onChange={(e) =>
                              setTagData((prevState) => ({
                                ...prevState,
                                tagDisplaySequence: e.target.value,
                              }))
                            }
                            placeholder="Enter Tag Display Sequence"
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
                              style={{
                                color: "black",
                                backgroundColor: "green",
                              }}
                              // onClick={() => {
                              //   addHandler();
                              // }}
                            >
                              {tagData?.id ? "Update" : "Add filter Name"}
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
                                <th scope="col">Tag Display Sequence</th>
                                {<th scope="col">Action</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {Filter.map((ele, index) => (
                                <tr key={ele?._id}>
                                  <th scope="row">{index + 1}</th>
                                  <td>{ele?.tagName}</td>
                                  <td>{ele?.tagDisplaySequence}</td>
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
                                          deleteTag(ele?._id);
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
                      onClick={() => updateHandler()}
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

export default EditCollectionFilters;
