import { useEffect, useRef, useState } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchprojectCategoryDetails,
  updateprojectCategory,
} from "../../../redux/slices/projectcategorySlice";


const EditProjectCategory = () => {
  const { loading, projectCategorydetails } = useSelector(
    (state) => state.projectCategory
  );
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [formdata, setformdata] = useState({
    Name: "",
  });

  const { Name } = formdata;

  useEffect(() => {
    dispatch(fetchprojectCategoryDetails(id));
  }, [dispatch]);

  useEffect(() => {
    if (loading === "fulfilled" && projectCategorydetails) {
      setformdata(projectCategorydetails);
    }
  }, [loading]);

  const onChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateddata = {
      id,
      projectCategorydata: {
        Name,
      },
    };

    dispatch(updateprojectCategory(updateddata));

    navigate("/admin/projectcategory");
  };

  return (
    <>
      <SideBar />
     {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-0 sm_padding_15px">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Coupon</h3>
                      </div>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="Tag Name">
                              Project Category Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="Project Name"
                              placeholder="Enter "
                              name="Name"
                              required
                              value={Name}
                              // value={tag}
                              onChange={onChange}
                            />
                          </div>
                        </div>
                        <br />
                        <button type="submit" className="btn btn-primary">
                          Save
                        </button>
                      </form>
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

export default EditProjectCategory;
