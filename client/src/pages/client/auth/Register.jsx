import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../../redux/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../../../assets/img/RALINGOBlack.png";
import LoginImage from "./Login.png";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { toastError, toastSuceess } from "../../../utils/reactToastify";

const Register = () => {
  const { loading, user, success, message, userToken, userdetails } =
    useSelector((state) => state.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [userimage, setUserImage] = useState();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    MobNumber: "",
    Password: "",
    ConfirmPassword: "",
  });

  const { Name, Email, MobNumber, Password, ConfirmPassword } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      toastError("Password mismatch");
      return;
    }

    let userdata = new FormData();

    userdata.append("Name", Name);
    userdata.append("Email", Email);
    userdata.append("MobNumber", MobNumber);
    userdata.append("Password", Password);
    userdata.append("userimg", userimage);
    userdata.append("userRole", JSON.stringify(["661f6f770714fa34af44a5b6"]));

    if (userimage.size >= 2000000) {
      toastError("Image Size Should less than 2MB");
      return;
    }

    if (MobNumber.length > 10) {
      toastError("Moile Should be of 10 digit");
      return;
    }

    dispatch(createUser(userdata));
  };

  useEffect(() => {
    // redirect user to login page if registration was successful
    if (loading === "fulfilled" && success) {
      toastSuceess("Register Successfully");
      navigate("/login");
    }

    if (userToken && userdetails) navigate("/profile");
  }, [navigate, loading, success, userToken, userdetails]);

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
          style={{ float: "left", padding: "30px 50px 50px 50px" }}
        >
          <img
            src={Logo}
            loading="lazy"
            alt="logo"
            style={{ height: "7vh" }}
            className="logo"
          />
          <br />
          <br />
          <form onSubmit={handleSubmit} style={{ maxWidth: "none" }}>
            <div className="form-group">
              <label htmlFor="email" className="sr-only">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter Name"
                name="Name"
                required
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter Email address"
                name="Email"
                required
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="sr-only">
                Mob Number
              </label>
              <input
                type="number"
                id="mob"
                max={9999999999}
                className="form-control"
                placeholder="Enter Mob Number"
                name="MobNumber"
                required
                onChange={onChange}
              />
            </div>
            <div className="form-group col-lg-12">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="text"
                id="password"
                className="form-control"
                name="Password"
                required
                onChange={onChange}
                placeholder="Enter Password"
              />
            </div>
            <div className="form-group col-lg-12">
              <label htmlFor="password" className="sr-only">
                Confirm Password
              </label>
              <input
                type="password"
                id="confpassword"
                className="form-control"
                name="ConfirmPassword"
                required
                onChange={onChange}
                placeholder="Enter Confirm Password"
              />
            </div>
            <div className="form-group col-lg-12">
              <label htmlFor="password" className="sr-only">
                Image
              </label>
              <input
                type="file"
                id="image"
                className="form-control"
                name="ConfirmPassword"
                required
                onChange={(e) => setUserImage(e.target.files[0])}
                placeholder="Enter Iamge"
              />
            </div>
            <input
              name="login"
              id="login"
              className="btn btn-block login-btn mb-4"
              type="submit"
              defaultValue="Create"
              style={{ backgroundColor: "#806E62", color: "#fff" }}
            />
          </form>
          <p className="login-card-footer-text">
            have you account ? &nbsp;
            <Link to="/login" className="text-reset">
              Login here
            </Link>
            <br></br>
            <Link to="/" className="text-reset">
              Go to Home Page
            </Link>
          </p>
        </div>
      </div>
      {/* <MainFooter /> */}
    </>
  );
};

export default Register;
