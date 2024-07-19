import { useEffect, useState } from "react";
import Logo from "../../../assets/img/RALINGOBlack.png";
import LoginImage from "./Login.png";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, otpSent, otpVerify } from "../../../redux/slices/authSlice";
import Preloader from "../../../components/preloader/Preloader";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { toastError } from "../../../utils/reactToastify";

const OtpLogin = () => {
  const {
    loading: authloading,
    user,
    error,
    userdetails,
    message,
  } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [logindata, setlogindata] = useState({
    MobNumber: "",
  });

  console.log("logindata", logindata);

  useEffect(() => {
    //Check for any user present
    if (Object.keys(userdetails).length !== 0) {
      if (userdetails.isAdmin) {
        navigate("/admin/product");
      } else {
        navigate("/");
      }
    }
  }, [authloading, userdetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message !== "") {
      dispatch(otpVerify(logindata));
    } else {
      dispatch(otpSent(logindata));
    }

    const previousPage = sessionStorage.getItem("previousPage");

    if (previousPage) {
      // Clear the previous page from session storage
      sessionStorage.removeItem("previousPage");

      // Redirect the user to the previous page
      navigate("/checkout");
    }
  };

  const onChange = (e) => {
    if (e.target.name === "MobNumber" && logindata.MobNumber.length > 10) {
      return toastError("Mobile Number should be 10 digit");
    }

    setlogindata({
      ...logindata,
      [e.target.name]: e.target.value,
    });
  };

  //   if (authauthloading === "pending") {
  //     return (
  //       <Preloader/>
  //     );
  //   }
  return (
    <>
      <div
        className="container"
        style={{
          marginTop: 30,
          borderRadius: 20,
          boxShadow: "0 10px 30px 0 rgba(172, 168, 168, 0.43)",
          height: "90vh",
          paddingLeft: 0,
        }}
      >
        <div
          className="col-lg-7"
          style={{
            float: "left",
            backgroundImage: `url(${LoginImage})`,
            height: "100%",
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div
          className="col-lg-5"
          style={{ float: "left", padding: "150px 50px 50px 50px" }}
        >
          <img
            loading="lazy"
            src={Logo}
            alt="logo"
            style={{ height: "7vh" }}
            className="logo"
          />
          <br />
          <br />
          <form onSubmit={handleSubmit} style={{ maxWidth: "none" }}>
            {message !== "" && (
              <>
                <div className="my-3 d-flex justify-content-center">
                  <button className="btn btn-primary text-center">
                    Login Code Sent Successfully
                  </button>
                </div>
              </>
            )}

            {error !== null && (
              <>
                <div className="my-3 d-flex justify-content-center">
                  <button className="btn btn-danger text-center">
                    {error}
                  </button>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email" className="sr-only">
                MobNumber
              </label>
              <input
                type="number"
                id="email"
                className="form-control"
                placeholder="Enter Mobile Number"
                name="MobNumber"
                required
                disabled={message !== "" ? true : false}
                onChange={onChange}
              />
            </div>

            {message !== "" ? (
              <>
                <div className="form-group">
                  <label htmlFor="email" className="sr-only">
                    OTP
                  </label>
                  <input
                    type="number"
                    id="email"
                    className="form-control"
                    placeholder="Enter OTP"
                    name="OTP"
                    required
                    onChange={onChange}
                  />
                </div>
              </>
            ) : null}

            {message === "" ? (
              <>
                <input
                  name="login"
                  id="login"
                  className="btn btn-block login-btn mb-4"
                  type="submit"
                  defaultValue="Create"
                  disabled={authloading === "pending" ? true : false}
                  style={{ backgroundColor: "#806E62", color: "#fff" }}
                />
              </>
            ) : (
              <>
                <input
                  name="login"
                  id="login"
                  className="btn btn-block login-btn mb-4"
                  type="submit"
                  defaultValue="Create"
                  disabled={authloading === "pending" ? true : false}
                  style={{ backgroundColor: "#806E62", color: "#fff" }}
                />
              </>
            )}
          </form>
          <p className="login-card-footer-text">
            Don't have an account ? &nbsp;
            <Link to="/register" className="text-reset">
              Sign Up here
            </Link>
            <br />
            <Link to="/login" className="text-reset">
              Sign In ?
            </Link>
            <br></br>
            <Link to="/" className="text-reset">
              Go to Home Page
            </Link>
          </p>
        </div>
      </div>

      <MainFooter />
    </>
  );
};

export default OtpLogin;
