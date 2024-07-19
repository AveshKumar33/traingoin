import { useEffect, useState } from "react";
import Logo from "../../../assets/img/RALINGOBlack.png";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/slices/authSlice";
import Preloader from "../../../components/preloader/Preloader";
import { resetWhislist } from "../../../redux/slices/wishlistSlice";
import { resetCart } from "../../../redux/slices/cartSlice";
import { addLocalStorageWishlistProduct } from "../../../redux/slices/newWishlistSlice";
import { toastError } from "../../../utils/reactToastify";
import { addLocalStorageCartProduct } from "../../../redux/slices/newCartSlice";

// import MainHeader from "../../../components/mainheader/MainHeader";
// import MainFooter from "../../../components/mainfooter/MainFooter";

const Login = () => {
  const { loading, userdetails } = useSelector((state) => state.auth);

  const { whishlistdata } = useSelector((state) => state.whishlist);
  const { cartdata } = useSelector((state) => state.cart);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [logindata, setlogindata] = useState({
    Email: "",
    Password: "",
  });
  const [loginImage, setLoginImage] = useState([]);
  let loginIma = loginImage.find((obj) => obj.status === "loginImage");
  let loginImageData = loginIma ?? "";
  async function featchAllData() {
    try {
      const { data } = await axiosInstance.get("/api/partner-with-us");
      if (data.success) {
        setLoginImage(data.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    featchAllData();
  }, []);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      if (whishlistdata?.length > 0) {
        dispatch(addLocalStorageWishlistProduct(whishlistdata));
        dispatch(resetWhislist());
      }
      if (cartdata?.length > 0) {
        dispatch(addLocalStorageCartProduct(cartdata));
        dispatch(resetCart());
      }
    }
  }, [dispatch, userdetails, whishlistdata, cartdata]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length !== 0) {
      const { userRole } = userdetails;
      const filteredData = userRole.map((role) => role?.name);

      if (
        ["admin"].some((role) => filteredData.includes(role)) &&
        !filteredData.includes("User")
      ) {
        navigate("/admin/product-new");
      } else {
        navigate("/");
      }
    }
  }, [loading, userdetails, navigate, dispatch, whishlistdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(login(logindata));

    const previousPage = sessionStorage.getItem("previousPage");

    if (previousPage) {
      // Clear the previous page from session storage
      sessionStorage.removeItem("previousPage");

      // Redirect the user to the previous page
      navigate("/checkout");
    }
  };

  const onChange = (e) => {
    setlogindata({
      ...logindata,
      [e.target.name]: e.target.value,
    });
  };

  if (loading === "pending") {
    return <Preloader />;
  }

  return (
    <>
      <>
        {/* <MainHeader /> */}
        <div
          className="container LoginPageContainer"
          style={{
            marginTop: 30,
            borderRadius: 20,
            height: "90vh",
            paddingLeft: 0,
            overflow: "hidden",
          }}
        >
          <div
            className="col-lg-7"
            style={{
              float: "left",
              backgroundImage: `url(${REACT_APP_URL}/images/clientImages/${loginImageData?.pwusImage})`,
              height: "100%",
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="col-lg-5 loginformstyle">
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
              <div className="form-group">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Email address"
                  name="Email"
                  required
                  onChange={onChange}
                />
              </div>
              <div className="form-group col-lg-12">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  name="Password"
                  required
                  onChange={onChange}
                  placeholder="***********"
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
              Don't have an account ? &nbsp;
              <Link to="/register" className="text-reset">
                Sign Up here
              </Link>
              <br />
              <Link to="/otplogin" className="text-reset">
                Login With Otp ?
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
    </>
  );
};

export default Login;
