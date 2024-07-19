import React, { useEffect, useState } from "react";
import logo from "../../assets/img/RAILINGOWHITECOLORPNG.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus } from "../../redux/slices/menuSlice";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
// import CartIcon from "../Carticon/CartIcon";
import MobileMenuIcon from "../MobileMenuIcon/MobileMenuIcon";
// import { FiLogOut } from "react-icons/fi";
// import { axiosInstance } from "../../config";
import { logout } from "../../redux/slices/authSlice";
// import Preloader from "../preloader/Preloader";
import { AiOutlineDoubleRight } from "react-icons/ai";

import SearchIcon from "@mui/icons-material/Search";
// import PersonIcon from "@mui/icons-material/Person";
// import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import "./MainHeader.css";
// import { EncryptData } from "../../utils/func/datefunc";
// import CollectionHeader from "../../pages/client/home/CollectionHeader";

const MainHeader = ({
  isImageAvailable,
  searchValue = "",
  handleSubmitFunction = () => {},
}) => {
  const { menus } = useSelector((state) => state.menu);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const { userdetails } = useSelector((state) => state.auth);
  // const [reviewdata, setreviewdata] = useState([]);
  const navigate = useNavigate();

  // console.log("Userdetails",Object.keys(userdetails).length !==0)
  // const [managecart, setmanagecart] = useState(false);

  const [searchtext, setsearchtext] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (searchValue) {
      setsearchtext(searchValue);
    }
    function handleScroll() {
      setScrollY(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [searchValue]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const closeNav = () => {
    // mySidebar.current.style.width = "0";
  };

  // const toggleCart = () => {
  //   setmanagecart(!managecart);
  // };

  const handleLogout = () => {
    const answer = window.confirm("Are you sure ?");
    if (answer) {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };

  const handleSearchIconClick = () => {
    setShowSearch(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchtext}`);
  };

  return (
    <>
      <>
        <section className="main">
          <div>
            <nav
              id="desknav"
              className="d-none d-lg-block container-fluid navbar navbar-expand-lg navbar-light stickybar"
              style={{
                position: "fixed",
                zIndex: 99,
                // backgroundColor:
                //   scrollY > 0 ? "rgba(71,91,82,0.9)" : "transparent",
                backgroundColor: isImageAvailable
                  ? scrollY > 0
                    ? "rgba(71,91,82,0.9)"
                    : "transparent"
                  : "rgba(71,91,82,0.9)",
              }}
            >
              {/**whole header div started*/}
              <div
                className="container-fluid"
                style={{ paddingTop: "10px", paddingbottom: "20px" }}
              >
                {/** logo link started here */}
                <Link to="/">
                  <img
                    src={logo}
                    alt="_logo"
                    style={{ height: "7vh", marginLeft: "20px" }}
                    loading="lazy"
                  />
                </Link>
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
                {/** logo link ended here */}

                <div
                  className="collapse navbar-collapse justify-content-center"
                  id="navbarNavDropdown"
                >
                  {/** home started here */}
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          HOME
                        </span>
                      </Link>
                    </li>
                    {/** home ended here */}
                    {/** buy from elevation started here */}
                    {userdetails &&
                      userdetails.userRole?.find(
                        (role) =>
                          role?.name === "admin" || role?.name === "Architect"
                      ) && (
                        <li className="nav-item">
                          <Link className="nav-link" to="/room-ideas">
                            <span
                              style={{
                                color: "#fff",
                                fontSize: "15px",
                                fontWeight: "600",
                              }}
                            >
                              BUY FROM ELEVATION
                            </span>
                          </Link>
                        </li>
                      )}
                    {/** buy from elevation ended here */}
                    {/** customize elevation started here */}

                    {userdetails &&
                      userdetails.userRole?.find(
                        (role) =>
                          role?.name === "admin" || role?.name === "Architect"
                      ) && (
                        <li className="nav-item">
                          <Link
                            className="nav-link"
                            to="/customized-combination"
                          >
                            <span
                              style={{
                                color: "#fff",
                                fontSize: "15px",
                                fontWeight: "600",
                              }}
                            >
                              CUSTOMIZED ELEVATION
                            </span>
                          </Link>
                        </li>
                      )}
                    {/** customize elevation ended here */}
                    {/** shop started here */}
                    <li className="mydropdown ">
                      <div
                        className="nav-link service1"
                        id="about_open"
                        style={{ cursor: "pointer" }}
                      >
                        {/* <Link to={`/collection/${p?.url}`}>
                                {p.title}
                              </Link> */}
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          SHOP
                        </span>
                      </div>
                      <div className="service-menu" id="service-menu">
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
                                    overflow: "scroll",
                                  }}
                                >
                                  <Link to={`/collection/${menu?.P?.url}`}>
                                    <h6
                                      className="text-center"
                                      style={{ fontWeight: 600 }}
                                    >
                                      {menu?.P?.title}
                                    </h6>
                                  </Link>

                                  {menu.Child &&
                                    menu.Child.map((c, index) => (
                                      <div key={index}>
                                        <Link to={`/collection/${c?.url}`}>
                                          <p
                                            style={{
                                              color: "#475B52",
                                              fontSize: "12px",
                                              fontWeight: "600",
                                              fontStyle: "normal",
                                              textTransform: "uppercase",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            {c.title}
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
                      </div>
                    </li>
                    {/** shop ended here */}
                    {/** blog started here */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/blog">
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          BLOG
                        </span>
                      </Link>
                    </li>
                    {/** blog ended here */}
                    {/** studio started here */}
                    {/* <li className="nav-item">
                      <div
                        style={{ cursor: "pointer" }}
                        className="nav-link"
                        href="#"
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          STUDIO
                        </span>
                      </div>
                    </li> */}
                    {/** studio ended here */}
                    {/** track started here */}
                    {/* <li className="nav-item">
                      <Link to="/track-order" className="nav-link" href="#">
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          TRACK
                        </span>
                      </Link>
                    </li> */}
                    <li className="nav-item">
                      <Link to="/Contact" className="nav-link" href="#">
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          CONTACT NOW
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/experience-centers"
                        className="nav-link"
                        href="#"
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          LOCATE US
                        </span>
                      </Link>
                    </li>
                    {/** track ended here */}
                    {/** contac t started here */}
                    {/* <li className="nav-item">
                      <Link to="/Contact" className="nav-link" href="#">
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          CONTACT
                        </span>
                      </Link>
                    </li> */}
                    {/** contact ended here */}
                  </ul>
                  {/* Dynamic menus */}
                  {/** Adimn  started here */}
                  &nbsp; &nbsp;
                  {userdetails && Object.keys(userdetails)?.length !== 0 ? (
                    <div
                      style={{ backgroundColor: "#475B52", cursor: "pointer" }}
                      className="btn btn-outline-default"
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Hi {userdetails.Name.slice(0, 4)}..
                      </span>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        style={{ backgroundColor: "#475B52" }}
                        className="btn btn-outline-default"
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          LOGIN
                        </span>
                      </Link>
                    </>
                  )}
                  {/** Adimn  ended here */}
                  {/** search wishlist profile logout  started here */}
                  {/* <form
                    className="d-flex"
                    onSubmit={(e) => {
                      e.preventDefault();
                      // navigate(`/search/${searchtext}`);
                    }}
                  > */}
                  {/* </form> */}
                  {/* {showSearch && (
                        <form
                          className="d-flex"
                          onSubmit={handleSubmit}
                          style={{ top: "20" }}
                        >
                          <div className="input-group">
                            <input
                              className="form-control border-end-0 border"
                              type="search"
                              required
                              placeholder="Search"
                              id="example-search-input"
                              value={searchtext}
                              onChange={(e) => setsearchtext(e.target.value)}
                            />
                            <button
                              className="btn btn-outline-secondary bg-white border-start-0 border-bottom-0 border ms-n5"
                              type="submit"
                            >
                              <SearchIcon />
                            </button>
                          </div>
                        </form>
                      )} */}
                  {/* {userdetails && Object.keys(userdetails)?.length !== 0 && (
                    <>
                      <button
                        id="button-addon1"
                        type="button"
                        className="btn btn-link text-primary"
                        onClick={() => navigate("/profile")}
                      >
                        <PersonIcon style={{ color: "#fff" }} />
                      </button>

                      <button
                        className="btn btn-link text-primary"
                        onClick={handleLogout}
                      >
                        <FiLogOut style={{ color: "#fff" }} />
                      </button>
                    </>
                  )} */}
                  {/* {userdetails &&
                  userdetails?.userRole?.find(
                    (role) => role?.name === "Architect"
                  ) ? (
                    <>
                      &nbsp; &nbsp;
                      <Link
                        to="/architect/dashboard"
                        className="nav-link"
                        target="_blank"
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          DASHBOARD
                        </span>
                      </Link>
                    </>
                  ) : (
                    <></>
                  )} */}
                  <div>
                    {!showSearch && (
                      <button className="btn" onClick={handleSearchIconClick}>
                        <SearchIcon style={{ color: "#fff" }} />
                      </button>
                    )}
                    {showSearch && (
                      <div
                        className="modal"
                        style={{
                          display: "block",
                          marginTop: "-150px",
                          marginLeft: "400px",
                        }}
                      >
                        <div className="modal-dialog">
                          <div style={{ marginLeft: "100px" }}>
                            <div
                              className="modal-content"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.7)",
                              }}
                            >
                              <div className="modal-body">
                                <button
                                  style={{
                                    marginLeft: "300px",
                                    marginBottom: "10px",
                                  }}
                                  aria-label="Close"
                                  type="button"
                                  className="btn-close"
                                  onClick={() => setShowSearch(false)}
                                ></button>
                                <form
                                  className="d-flex"
                                  onSubmit={handleSubmit}
                                >
                                  <div className="input-group">
                                    <input
                                      className="form-control border-end-0 border"
                                      type="search"
                                      required
                                      id="example-search-input"
                                      value={searchtext}
                                      onChange={(e) =>
                                        setsearchtext(e.target.value)
                                      }
                                    />
                                    <button
                                      className="btn btn-outline-secondary bg-white border-start-0 border-bottom-0 border ms-n5"
                                      type="submit"
                                    >
                                      <SearchIcon />{" "}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    id="button-addon1"
                    type="button"
                    className="btn btn-link text-primary"
                    onClick={toggleSidebar}
                  >
                    <FaBars style={{ color: "#fff" }} />
                  </button>
                  {sidebarOpen && (
                    <div
                      className="sidebarMenu"
                      style={{ right: "0", padding: "90px 30px 10px 30px" }}
                    >
                      <center>
                        <span
                          style={{
                            fontSize: "16px",
                            textAlign: "center",
                            backgroundColor: "#475B52",
                            color: "#fff",
                            padding: "10px 40px 10px 40px",
                            fontFamily: "Macondo, cursive",
                          }}
                        >
                          USER ACCOUNT
                        </span>
                      </center>
                      <br></br>
                      <ul>
                        {userdetails &&
                        userdetails?.userRole?.find(
                          (role) => role?.name === "Architect"
                        ) ? (
                          <>
                            {/* &nbsp; &nbsp;
                      <Link
                        to="/architect/dashboard"
                        className="nav-link"
                        target="_blank"
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                            fontWeight: "600",
                          }}
                        >
                          DASHBOARD
                        </span>
                      </Link> */}
                            <div>
                              <Link
                                style={{
                                  textDecoration: "none",
                                  cursor: "pointer",
                                  letterSpacing: "1px",
                                  fontFamily: "Macondo, cursive",
                                  color: "#484B4F",
                                }}
                                to="/architect/dashboard"
                              >
                                <MdOutlineKeyboardDoubleArrowRight /> Dashboard
                              </Link>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {/* Sidebar content */}
                        {userdetails &&
                          Object.keys(userdetails)?.length !== 0 && (
                            <>
                              <div
                                style={{
                                  textDecoration: "none",
                                  cursor: "pointer",
                                  letterSpacing: "1px",
                                  fontFamily: "Macondo, cursive",
                                }}
                                onClick={() => navigate("/profile")}
                              >
                                <MdOutlineKeyboardDoubleArrowRight /> Your
                                Profile
                              </div>
                            </>
                          )}
                        <div
                          onClick={() => navigate("/orders")}
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontFamily: "Macondo, cursive",
                          }}
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> Your Orders
                        </div>
                        <div
                          onClick={() => navigate("/whishlist")}
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontFamily: "Macondo, cursive",
                          }}
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> Your Wishlist
                        </div>
                        <a
                          href="/track-order"
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            color: "#212529",
                            fontFamily: "Macondo, cursive",
                          }}
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> Track your Order
                        </a>
                        {userdetails &&
                          Object.keys(userdetails)?.length !== 0 && (
                            <>
                              <br></br>
                              <div
                                style={{
                                  textDecoration: "none",
                                  cursor: "pointer",
                                  letterSpacing: "1px",
                                  fontFamily: "Macondo, cursive",
                                }}
                                onClick={handleLogout}
                              >
                                <MdOutlineKeyboardDoubleArrowRight /> Sign Out
                              </div>
                            </>
                          )}
                      </ul>
                      <br></br>
                      <br></br>
                      <center>
                        <span
                          style={{
                            fontSize: "16px",
                            textAlign: "center",
                            backgroundColor: "#475B52",
                            color: "#fff",
                            padding: "10px 40px 10px 40px",
                            fontFamily: "Macondo, cursive",
                          }}
                        >
                          IMPORTANT LINKS
                        </span>
                      </center>
                      <br></br>
                      <ul>
                        {/* Sidebar content */}
                        <a
                          href="/AboutUs"
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontFamily: "Macondo, cursive",
                            color: "#212529",
                          }}
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> About Railingo
                        </a>
                        <br></br>
                        <a
                          href="/CompletedProject"
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontFamily: "Macondo, cursive",
                            color: "#212529",
                          }}
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> Completed
                          Project
                        </a>
                        <br></br>
                        <a
                          href="/PartnerWithUs"
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontFamily: "Macondo, cursive",
                            color: "#212529",
                          }}
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> Partner With Us
                        </a>
                        <br></br>
                        <a
                          href="/Exibhitions"
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontFamily: "Macondo, cursive",
                            color: "#212529",
                          }}
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> Exibhitions
                        </a>
                        <br></br>
                        <a
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            color: "#212529",
                            letterSpacing: "1px",
                            fontFamily: "Macondo, cursive",
                          }}
                          href="/Contact"
                        >
                          <MdOutlineKeyboardDoubleArrowRight /> Contact Now
                        </a>
                      </ul>
                      <div className="close-btn" onClick={toggleSidebar}>
                        <FaTimes className="close-icon" />
                      </div>
                    </div>
                  )}
                </div>
                {/* <div class="col-1"></div> */}
              </div>{" "}
              {/**whole header div end*/}
            </nav>
          </div>

          {/* Desktop Navbar===== */}

          {/* <div
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
            <div style={{ cursor: "pointer" }}>Room Ideas</div>
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
                <div
                  style={{ color: "black", fontSize: 17 }}
                  className="dropdown-item"
                  href="#"
                >
                  Test 1
                </div>
                <div
                  style={{ color: "black", fontSize: 17 }}
                  className="dropdown-item"
                  href="#"
                >
                  Test 2
                </div>
              </div>
            </div>
          </div> */}

          {/* Mobile Navbar===== */}
          <div
            className="HideInDesktop topfixedbar"
            style={{
              position: "fixed",
              zIndex: 1000,
              backgroundColor: isImageAvailable
                ? scrollY > 0
                  ? "rgba(71,91,82,0.9)"
                  : "transparent"
                : "rgba(71,91,82,0.9)",
            }}
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
                  alt="_logo"
                  // src="assets/Image/RAILINGOWHITECOLORPNG.png"
                  style={{ height: "5vh" }}
                />
              </div>
              {/* <button
                style={{
                  padding: "25px 0px 25px 25px",
                  marginLeft: "80px",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <SearchIcon style={{ color: "#fff", fontSize: "30px" }} />
              </button> */}
              {!showSearch && (
                <button
                  className="btn"
                  onClick={handleSearchIconClick}
                  style={{
                    padding: "25px 0px 25px 25px",
                    marginLeft: "80px",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  <SearchIcon style={{ color: "#fff" }} />
                </button>
              )}
              {showSearch && (
                <div
                  className="modal"
                  style={{
                    display: "block",
                    marginTop: "-150px",
                    marginLeft: "-20px",
                  }}
                >
                  <div className="modal-dialog">
                    <div style={{ marginLeft: "100px" }}>
                      <div
                        className="modal-content"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.7)",
                        }}
                      >
                        <div className="modal-body">
                          <button
                            style={{
                              marginLeft: "210px",
                              marginBottom: "10px",
                            }}
                            aria-label="Close"
                            type="button"
                            className="btn-close"
                            onClick={() => setShowSearch(false)}
                          ></button>
                          <form className="d-flex" onSubmit={handleSubmit}>
                            <div className="input-group">
                              <input
                                className="form-control border-end-0 border"
                                type="search"
                                required
                                id="example-search-input"
                                value={searchtext}
                                onChange={(e) => setsearchtext(e.target.value)}
                              />
                              <button
                                className="btn btn-outline-secondary bg-white border-start-0 border-bottom-0 border ms-n5"
                                type="submit"
                              >
                                <SearchIcon />{" "}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <button
                style={{ padding: 15 }}
                id="button-addon1"
                type="button"
                className="btn btn-link text-primary"
              >
                <SearchIcon />
              </button> */}
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
        {/* <div style={{ height: "20vh" }}></div> */}
      </>
    </>
  );
};
export default MainHeader;
