import React, { useEffect, useState } from "react";
import logo from "../../assets/img/RALINGOBlack.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus } from "../../redux/slices/menuSlice";
import { Link, useNavigate } from "react-router-dom";
import CartIcon from "../Carticon/CartIcon";
import MobileMenuIcon from "../MobileMenuIcon/MobileMenuIcon";
import { FiLogOut } from "react-icons/fi";
import { axiosInstance } from "../../config";
import { logout } from "../../redux/slices/authSlice";
// import Preloader from "../preloader/Preloader";
import { AiOutlineDoubleRight } from "react-icons/ai";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";

// import { EncryptData } from "../../utils/func/datefunc";
// import CollectionHeader from "../../pages/client/home/CollectionHeader";

const MainHeader = ({ searchValue = "", handleSubmitFunction = () => {} }) => {
  const { menus } = useSelector((state) => state.menu);

  const { loading: Authuserloader, userdetails } = useSelector(
    (state) => state.auth
  );
  const [reviewdata, setreviewdata] = useState([]);
  const navigate = useNavigate();

  // console.log("Userdetails",Object.keys(userdetails).length !==0)
  const [managecart, setmanagecart] = useState(false);

  const [searchtext, setsearchtext] = useState("");

  useEffect(() => {
    if (searchValue) {
      setsearchtext(searchValue);
    }
  }, [searchValue]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMenus());
  }, []);

  const closeNav = () => {
    // mySidebar.current.style.width = "0";
  };

  const toggleCart = () => {
    setmanagecart(!managecart);
  };

  const handleLogout = () => {
    const answer = window.confirm("Are you sure ?");
    if (answer) {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };

  const getreview = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/review`);
            &nbsp;
            setreviewdata(data.data);
    } catch (error) {
      console.log(error);
      // alert(error.response.data.message);
    }
  };

  // if (Authuserloader === "pending") {
  //   return (
  //     <>
  //       <Preloader />
  //     </>
  //   );
  // }

  return (
    <>
      <>
        <section className="main">
          {/* Desktop Navbar==== */}
          <div>
            <nav
              id="desknav"
              className="d-none d-lg-block container-fluid px-5 navbar navbar-expand-lg navbar-light stickybar"
              style={{
                position: "fixed",
                top: 0,
                zIndex: 100,
                backgroundColor: "#fff",
              }}
            >
              <div className="row w-100 align-items-center">
                <div className="col-4 d-flex justify-content-center">
                  {userdetails && Object.keys(userdetails)?.length !== 0 ? (
                    <>
                      <a
                        style={{ backgroundColor: "#E9860E" }}
                        className="btn1 btn-4 py-1 px-2"
                      >
                        Hi {userdetails.Name} !
                      </a>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        style={{ backgroundColor: "#E9860E" }}
                        className="btn1 btn-4 py-1 px-2"
                      >
                        Sign Up Now &nbsp;
                        <i
                          className="fa-regular fa-user"
                          aria-hidden="true"
                          style={{ color: "#fff" }}
                        />
                      </Link>
                    </>
                  )}
                </div>
                <div className="col-4">
                  <center>
                    <Link to="/">
                      <img
                        src={logo}
                        style={{ height: "8vh" }}
                        loading="lazy"
                      />
                    </Link>
                  </center>
                </div>
                <div className="col-4">
                  <form
                    className="d-flex"
                    onSubmit={(e) => {
                      e.preventDefault();
                      navigate(`/search/${searchtext}`);
                    }}
                  >
                    <div className="input-group">
                      <input
                        className="form-control border-end-0 border"
                        type="search"
                        required
                        placeholder="Search For Products"
                        id="example-search-input"
                        value={searchtext || ""}
                        onChange={(e) => setsearchtext(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary bg-white border-start-0 border-bottom-0 border ms-n5"
                        type="submit"
                      >
                        <SearchIcon />
                      </button>
                    </div>

                    {userdetails && Object.keys(userdetails)?.length !== 0 && (
                      <>
                        <button
                          id="button-addon1"
                          type="submit"
                          className="btn btn-link text-primary"
                          onClick={() => navigate("/profile")}
                        >
                          <PersonIcon style={{ color: "#000000" }} />
                        </button>

                        <button
                          className="btn btn-link text-primary"
                          onClick={handleLogout}
                        >
                          <FiLogOut style={{ color: "#000" }} />
                        </button>
                      </>
                    )}

                    <button
                      id="button-addon1"
                      onClick={() => navigate("/whishlist")}
                      className="btn btn-link text-primary"
                    >
                      <FavoriteIcon style={{ color: "#000000" }} />
                    </button>
                  </form>
                </div>
              </div>
            </nav>

            {/* Sidebar With Contact Us */}

            <nav
              id="desknav"
              className="d-none d-lg-block container-fluid px-5 navbar navbar-expand-lg navbar-light stickybar"
              style={{
                position: "fixed",
                top: 65,
                zIndex: 99,
                backgroundColor: "#E9860E",
              }}
            >
              <div className="container-fluid px-5">
                <button
                  className="navbar-toggler text-dark"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNavDropdown"
                  aria-controls="navbarNavDropdown"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div
                  className="collapse navbar-collapse justify-content-center"
                  id="navbarNavDropdown"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        <span style={{ color: "#fff" }}>Home</span>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/room-ideas">
                        <span style={{ color: "#fff" }}>
                          Buy From Elevation
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/customized-combination">
                        <span style={{ color: "#fff" }}>
                          Customized Elevation
                        </span>
                      </Link>
                    </li>
                    <li className="mydropdown ">
                      <a className="nav-link service1" id="about_open" href="#">
                        {/* <Link to={`/collection/${p?.url}`}>
                                {p.title}
                              </Link> */}
                        Shop
                      </a>
                      <div className="service-menu" id="service-menu" style={{}}>
                        <div
                          className="service-submenu"
                          style={{
                            width: "100%",
                            padding: "0px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                          >
                            {menus &&
                              menus.map((menu, index) => (
                                <div
                                  key={index}
                                  style={{
                                    // Dynamic width of menus item based on menu content
                                    flex: `0 0 ${100 / menus.length}%`,
                                    height: "70vh",
                                    backgroundColor:
                                      index % 2 === 0
                                        ? "#FCFCFC"
                                        : "transparent",
                                    padding: "20px",
                                    overflow:"scroll"
                                  }}
                                >
                                  <Link to={`/collection/${menu?.P?.url}`}>
                                    <h6 className="text-center">
                                      {menu?.P?.title}
                                    </h6>
                                  </Link>

                                  {menu.Child &&
                                    menu.Child.map((c, index) => (
                                      <div key={index}>
                                        <Link to={`/collection/${c?.url}`}>
                                          <p
                                            style={{
                                              color: "#000",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            <b>{c.title}</b>
                                          </p>
                                        </Link>
                                        {c?.childCollections?.map(
                                          (p, index) => (
                                            <Link
                                              to={`/collection/${p?.url}`}
                                              key={index}
                                            >
                                              <p className="ps-2">
                                                <AiOutlineDoubleRight />
                                                {p.title}
                                              </p>
                                            </Link>
                                          )
                                        )}
                                      </div>
                                    ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        \
                      </div>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/blog">
                        <span style={{ color: "#fff" }}>Blog</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span style={{ color: "#fff" }}>Find a Studio</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <Link to="/track-order" className="nav-link" href="#">
                        <span style={{ color: "#fff" }}>Track Your Order</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/Contact" className="nav-link" href="#">
                        <span style={{ color: "#fff" }}>Contact Us</span>
                      </Link>
                    </li>
                    {/* Dynamic menus */}
                  </ul>
                </div>
                {/* <div class="col-1"></div> */}
              </div>
            </nav>
          </div>

          {/* Desktop Navbar===== */}
          {/* Mobile Navbar===== */}

          <div
            id="mySidenav"
            className="sidenav "
            style={{ whiteSpace: "nowrap" }}
          >
            <div
              style={{ cursor: "pointer" }}
              className="closebtn "
              onClick={closeNav}
            >
              ×
            </div>
            <a href="#">Room Ideas</a>
            <a
              data-toggle="collapse"
              href="#Products"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Furnishings »
            </a>
            <div style={{ paddingLeft: 5 }} className="collapse" id="Products">
              <div
                style={{ paddingLeft: 15 }}
                className="collapse"
                id="Products"
              >
                <a
                  style={{ color: "black", fontSize: 17 }}
                  className="dropdown-item"
                  href="#"
                >
                  Test 1
                </a>
                <a
                  style={{ color: "black", fontSize: 17 }}
                  className="dropdown-item"
                  href="#"
                >
                  Test 2
                </a>
              </div>
            </div>
            {/* <a href="#">Sell on Pepperfry</a> */}
            {/* <a href="#">Login</a> */}
          </div>
          <div
            className="HideInDesktop topfixedbar"
            style={{ backgroundColor: "transparent", zIndex: 99 }}
          >
            <div
              className=" d-flex justify-content-between mx-0"
              style={{
                padding: "0px 0px 10px 20px",
                marginLeft: 5,
                height: "9vh",
                // background: "#E9860E",
              }}
            >
              <div
                id="mobilelogoimg"
                style={{
                  float: "left",
                  color: "white",
                  fontSize: 23,
                  marginTop: 15,
                }}
              >
                <img
                  loading="lazy"
                  src={logo}
                  // src="assets/Image/RAILINGOWHITECOLORPNG.png"
                  style={{ height: "5vh" }}
                />
              </div>
              <button
                style={{ padding: 15 }}
                id="button-addon1"
                type="button"
                className="btn btn-link text-primary"
              >
                <MobileMenuIcon />
              </button>
            </div>
          </div>

          {/* Mobile Navbar===== */}
        </section>
        <div style={{ height: "20vh" }}></div>
      </>
    </>
  );
};

export default MainHeader;
