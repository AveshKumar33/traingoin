import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { AiTwotoneDelete } from "react-icons/ai";
import Preloader from "../../../components/preloader/Preloader";
import { Chip, TextField, Typography, Button, Grid } from "@mui/material";
import Modal from "../../../UI/Modal";
import { toastError } from "../../../utils/reactToastify";
import {
  fetchCollectionFilters,
  updateCollectionFilterTag,
  deleteCollectionFilter,
  deleteCollectionFilterTag,
} from "../../../redux/slices/newCollectionFilterSlice";

const CollectionFilters = () => {
  const { loading, CollectionFilters, tagId, CollectionFilterId } = useSelector(
    (state) => state.newCollectionFilter
  );

  const dispatch = useDispatch();

  const [FiltersData, setFiltersData] = useState([]);
  const [editedTag, setEditedTag] = useState({ id: "", tagName: "" });
  // const [filtersDataDelete, setFiltersDataDelete] = useState(false);
  const [open, setOpen] = useState({ editModel: false, deletedModel: false });

  useEffect(() => {
    dispatch(fetchCollectionFilters());
  }, [dispatch, tagId, CollectionFilterId]);

  useEffect(() => {
    if (loading === "fulfilled" && CollectionFilters?.length > 0) {
      setFiltersData(CollectionFilters);
    }
  }, [CollectionFilters, loading]);

  const deleteHandler = (id) => {
    try {
      const answer = window.confirm("Are You Sure !");
      if (answer) {
        dispatch(deleteCollectionFilter(id));
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  const deleteTag = (id) => {
    try {
      const answer = window.confirm("are you sure yu want to delete!");
      if (answer) {
        dispatch(deleteCollectionFilterTag(id));
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  };

  const handleTagEdit = () => {
    if (editedTag?.tagName === "") {
      return toastError("Tag name is required!");
    }
    dispatch(updateCollectionFilterTag(editedTag));

    if (loading === "fulfilled") {
      setEditedTag({ id: "", tagName: "" });
      setOpen((prevState) => ({ ...prevState, editModel: false }));
    }
  };

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      {open?.editModel && (
        <Modal>
          <Grid
            container
            spacing={{ xs: 1, md: 1 }}
            columns={{ xs: 12, sm: 12, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Typography
                variant="h6"
                display="block"
                gutterBottom
                textAlign="center"
              >
                Edit Tag
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                id="outlined-basic"
                size="small"
                placeholder="Tag Name"
                variant="outlined"
                style={{ width: "100%" }}
                value={editedTag?.tagName || ""}
                onChange={(e) =>
                  setEditedTag((prevState) => ({
                    ...prevState,
                    tagName: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            style={{ marginTop: "10px" }}
            columns={{ xs: 12, sm: 12, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12} style={{ textAlign: "center" }}>
              <Button
                color="success"
                sx={{ marginRight: 1 }}
                variant="contained"
                onClick={handleTagEdit}
              >
                Submit
              </Button>
              <Button
                color="warning"
                variant="contained"
                type="button"
                onClick={() => {
                  setEditedTag({ id: "", tagName: "" });
                  setOpen((prevState) => ({ ...prevState, editModel: false }));
                }}
              >
                Cancle
              </Button>
            </Grid>
          </Grid>
        </Modal>
      )}

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
                        to="/admin/add-collection-filters"
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
                            <th scope="col">Display Sequence</th>
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
                                <td>{t?.filterName}</td>
                                <td>{t?.displaySequence}</td>
                                <td>
                                  {t?.collectionTagIds &&
                                    t?.collectionTagIds.length > 0 &&
                                    t?.collectionTagIds?.map((tag) => (
                                      <Chip
                                        key={tag?._id}
                                        label={tag?.tagName}
                                        onClick={() => {
                                          setEditedTag({
                                            tagName: tag?.tagName,
                                            id: tag?._id,
                                          });
                                          setOpen((prevState) => ({
                                            ...prevState,
                                            editModel: true,
                                          }));
                                        }}
                                        onDelete={() => {
                                          deleteTag(tag?._id);
                                        }}
                                      />
                                    ))}
                                </td>
                                <td>
                                  <span>
                                    <Link
                                      to={`/admin/edit-collection-filters/${t?._id}`}
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
                                      deleteHandler(t?._id);
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
