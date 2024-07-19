import SideBar from "../../../components/sidebar/SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { fetchUOM } from "../../../redux/slices/UOMSlice";
import TopHeader from "../../../components/topheader/TopHeader";

import { axiosInstance } from "../../../config";
import { updateAttribute } from "../../../redux/slices/newAttributeSlice";
import { toastError } from "../../../utils/reactToastify";

const EditAttributeUpdated = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { uoms } = useSelector((state) => state.uoms);

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.newAttribute);

  const activeUOMs = uoms.filter((uom) => uom.status === 1);

  const [attributedata, setattributedata] = useState({
    Name: "",
    PrintName: "",
    UOMId: "",
    Display_Index: 0,
    isVisibleInCustomize: "",
    BurgerSque: 0,
    status: null,
  });

  useEffect(() => {
    dispatch(fetchUOM());
  }, [dispatch]);

  const getData = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/attribute-new/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      if (data?.data) {
        const {
          Name,
          PrintName,
          UOMId,
          Display_Index,
          isVisibleInCustomize,
          BurgerSque,
          status,
        } = data?.data;
        setattributedata({
          Name,
          PrintName,
          UOMId: UOMId?._id,
          Display_Index,
          isVisibleInCustomize,
          BurgerSque,
          status,
        });
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }, [id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleFormChange = (e) => {
    setattributedata({
      ...attributedata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateAttribute({ id, attributedata }));
      if (loading) {
        navigate("/admin/attribute-new");
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      <SideBar />
      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <TopHeader />
        <div className="main_content_iner ">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="col-lg-12" style={{ float: "left" }}>
                  <div className="white_card card_height_100 mb_30">
                    <div className="white_card_header">
                      <div className="box_header m-0">
                        <div className="main-title">
                          <h3 className="m-0">Attribute</h3>
                        </div>
                      </div>
                    </div>
                    <div className="white_card_body">
                      <div className="card-body">
                        <form onSubmit={handleSubmitForm}>
                          <div className="row mb-3">
                            <div className="col-md-12">
                              <div className="col-md-12">
                                <label className="form-label" htmlFor="Title">
                                  Attribute Type
                                </label>
                                <select
                                  className="form-select"
                                  name="isVisibleInCustomize"
                                  value={
                                    attributedata?.isVisibleInCustomize || false
                                  }
                                  onChange={handleFormChange}
                                >
                                  <option value="">
                                    --------- Please Select Attribute Type
                                    -----------
                                  </option>
                                  <option value={true}>
                                    Customized Product
                                  </option>
                                  <option value={false}>Single Product</option>
                                </select>
                              </div>
                              <label className="form-label" htmlFor="Title">
                                Name
                              </label>
                              <input
                                type="Title"
                                className="form-control"
                                id="Title"
                                placeholder="Attribute Name"
                                name="Name"
                                required
                                value={attributedata?.Name || ""}
                                onChange={handleFormChange}
                              />
                            </div>
                            {attributedata.isVisibleInCustomize.toString() ===
                              "true" && (
                              <div>
                                <label className="form-label" htmlFor="Title">
                                  BurgerSque
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="BurgerSque"
                                  // value={BurgerSque}
                                  value={attributedata?.BurgerSque || 0}
                                  onChange={handleFormChange}
                                />{" "}
                              </div>
                            )}
                            {attributedata.isVisibleInCustomize.toString() ===
                              "true" && (
                              <div className="col-md-12">
                                <label className="form-label" htmlFor="Title">
                                  Attribute Display Index
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="Display_Index"
                                  name="Display_Index"
                                  value={attributedata?.Display_Index || 0}
                                  // value={Display_Index}
                                  onChange={handleFormChange}
                                />
                              </div>
                            )}
                            <div className="col-md-12">
                              <label className="form-label" htmlFor="Title">
                                Print Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="Title"
                                placeholder="Attribute Print Name"
                                name="PrintName"
                                required
                                value={attributedata?.PrintName || ""}
                                onChange={handleFormChange}
                              />
                            </div>

                            {attributedata.isVisibleInCustomize.toString() ===
                              "true" && (
                              <div className="col-md-12">
                                <label className="form-label" htmlFor="Title">
                                  UOM
                                </label>
                                <select
                                  className="form-select"
                                  name="UOMId"
                                  required
                                  value={attributedata?.UOMId || ""}
                                  onChange={handleFormChange}
                                >
                                  <option>--Please Select UOM ---</option>
                                  {activeUOMs.map((uom) => (
                                    <option key={uom?._id} value={uom?._id}>
                                      {uom.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            <div className="col-md-12">
                              <label
                                className="form-label"
                                htmlFor="FeaturedProducts"
                              >
                                Status
                              </label>
                              <select
                                id="status"
                                className="form-control"
                                name="status"
                                required
                                value={attributedata?.status || 0}
                                onChange={handleFormChange}
                              >
                                <option value="">Choose...</option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                              </select>
                            </div>
                          </div>

                          <center>
                            <button type="submit" className="btn btn-primary">
                              Save
                            </button>
                          </center>
                        </form>
                      </div>
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
                    Designed &amp; Developed By{" "}
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

export default EditAttributeUpdated;
