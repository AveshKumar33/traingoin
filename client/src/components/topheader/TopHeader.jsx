import React from "react";
import profileicon from "../../assets/img/Profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import Header from "../header/Header";
// import profileicon from "../../assets";

const TopHeader = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    const answer = window.confirm("Are you sure ?");
    if (answer) {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <>
      <Header />
    </>
  );
};

export default TopHeader;

const OldTopHeader = () => {
  const { loading, userdetails } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    const answer = window.confirm("Are you sure ?");
    if (answer) {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <>
      <div className="container-fluid g-0">
        <div className="row">
          <div className="col-lg-12 p-0 ">
            <div className="header_iner d-flex justify-content-between align-items-center">
              <div className="sidebar_icon d-lg-none">
                <i className="ti-menu" />
              </div>
              <div className="serach_field-area d-flex align-items-center">
                <span className="f_s_14 f_w_400 ml_25 white_text text_white">
                  Apps
                </span>
              </div>
              <div className="header_right d-flex justify-content-between align-items-center">
                <div className="profile_info">
                  <img src={profileicon} alt="#" loading="lazy" />
                  <div
                    className="profile_info_iner"
                    style={{ boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)" }}
                  >
                    <div className="profile_author_name">
                      {/* <p style={{ fontSize: "14px" }}> </p> */}
                      <h5 style={{ fontSize: "18px" }}>{userdetails.Name}</h5>
                    </div>
                    <div className="profile_info_details">
                      <button className="btn ">My Profile </button>
                      {/* <a href="#">Change Password</a> */}
                      <button className="btn" onClick={handleLogout}>
                        Log Out{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
