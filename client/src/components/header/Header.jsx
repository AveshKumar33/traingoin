import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  // const { loading, userdetails } = useSelector((state) => state.auth);
  const [logoutMessage, setLogoutMessage] = useState("false");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    const answer = window.confirm("Are you sure ?");
    if (answer) {
      localStorage.removeItem("token");
      dispatch(logout());
      setLogoutMessage("true");
    }
  };

  useEffect(() => {
    if (logoutMessage === "true") {
      navigate("/login");
    }
  }, [navigate, logoutMessage]);

  return (
    <>
      <header id="page-topbar">
        <div
          className="topnav"
          style={{
            background:
              "linear-gradient(65.5deg, rgb(176 185 185 / 91%) -15.1%, #e07c03 71.5%)",
          }}
        >
          <div className="">
            <nav className="navbar navbar-light navbar-expand-lg topnav-menu">
              <div
                className="collapse navbar-collapse"
                id="topnav-menu-content"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Link
                    className="navbar-brand"
                    style={{
                      color: "#fff",
                      fontFamily: '"Sansita Swashed", cursive',
                      fontSize: 24,
                      letterSpacing: 4,
                      padding: 0,
                    }}
                  >
                    Railingo
                  </Link>
                </div>

                <div>
                  <ul className="navbar-nav">
                    {/* Admin */}

                    {
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          // to="/admin/rto"
                          id="topnav-emailtemplates"
                          role="button"
                          style={{ paddingTop: "25px" }}
                        >
                          <AiOutlineHome className="me-2" />
                          Admin
                        </Link>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="topnav-emailtemplates"
                        >
                          <Link to="/admin/user" className="dropdown-item">
                            Users
                          </Link>
                          {/* <Link to="/admin/user/role" className="dropdown-item">
                            User Role
                          </Link> */}
                          {/* <Link to="/admin/uom" className="dropdown-item">
                            UOM
                          </Link> */}
                          <Link to="/admin/tags" className="dropdown-item">
                            Tags
                          </Link>
                          <Link
                            to="/admin/collection"
                            className="dropdown-item"
                          >
                            Collection
                          </Link>
                          {/* <Link
                            to="/admin/CollectionFilters"
                            className="dropdown-item"
                          >
                            Collection Filters(Old)
                          </Link> */}
                          <Link
                            to="/admin/collection-filters"
                            className="dropdown-item"
                          >
                            Collection Filters
                          </Link>
                          <Link
                            to="/admin/AttributeCategor"
                            className="dropdown-item"
                          >
                            Attribute Categor
                          </Link>
                          {/* <Link to="/admin/attribute" className="dropdown-item">
                            Attribute (Old)
                          </Link> */}
                          <Link
                            to="/admin/attribute-new"
                            className="dropdown-item"
                          >
                            Attribute
                          </Link>

                          <Link to="/admin/coupon" className="dropdown-item">
                            Coupon
                          </Link>
                          <Link to="/admin/architect" className="dropdown-item">
                            Architect
                          </Link>
                          <Link
                            to="/admin/order-status"
                            className="dropdown-item"
                          >
                            Order Status
                          </Link>
                        </div>
                      </li>
                    }

                    {/* product */}

                    {
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          // to="/admin/rto"
                          id="topnav-emailtemplates"
                          role="button"
                          style={{ paddingTop: "25px" }}
                        >
                          <AiOutlineHome className="me-2" />
                          Products
                        </Link>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="topnav-emailtemplates"
                        >
                          {/* <Link to="/admin/product" className="dropdown-item">
                            Single Products (Old)
                          </Link> */}
                          <Link
                            to="/admin/product-new"
                            className="dropdown-item"
                          >
                            Single Products
                          </Link>
                          {/* <Link
                            to="/admin/customizedproduct"
                            className="dropdown-item"
                          >
                            Customized Products (Old)
                          </Link> */}
                          <Link
                            to="/admin/customized-product"
                            className="dropdown-item"
                          >
                            Customized Products
                          </Link>
                          {/* <Link
                            to="/admin/dot-product"
                            className="dropdown-item"
                          >
                            Product Bundle (Old)
                          </Link> */}
                          <Link
                            to="/admin/dot-product-new"
                            className="dropdown-item"
                          >
                            Product Dot Bundle
                          </Link>
                          {/* <Link
                            to="/admin/dotcustomized"
                            className="dropdown-item"
                          >
                            Customized Product Bundle (Old)
                          </Link> */}
                          <Link
                            to="/admin/dot-customized-product"
                            className="dropdown-item"
                          >
                            Customized Dot Bundle
                          </Link>
                          <Link
                            to="/admin/customized-combo-product"
                            className="dropdown-item"
                          >
                            Customized Combo
                          </Link>
                        </div>
                      </li>
                    }

                    {/* CMS */}

                    {
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          // to="/admin/rto"
                          id="topnav-emailtemplates"
                          role="button"
                          style={{ paddingTop: "25px" }}
                        >
                          <AiOutlineHome className="me-2" />
                          CMS
                        </Link>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="topnav-emailtemplates"
                        >
                          <Link to="/admin/project" className="dropdown-item">
                            Project
                          </Link>
                          <Link
                            to="/admin/projectcategory"
                            className="dropdown-item"
                          >
                            Project Category
                          </Link>

                          <Link to="/admin/slider" className="dropdown-item">
                            Slider
                          </Link>

                          <Link
                            to="/admin/header-image"
                            className="dropdown-item"
                          >
                            Header Image
                          </Link>
                          <Link to="/admin/review" className="dropdown-item">
                            Review
                          </Link>
                          <Link to="/admin/enquiry" className="dropdown-item">
                            Enquiry
                          </Link>
                          <Link to="/admin/catalogue" className="dropdown-item">
                            Catalogue
                          </Link>
                          <Link to="/admin/queries" className="dropdown-item">
                            Quotation Request
                          </Link>
                          <Link to="/admin/blog" className="dropdown-item">
                            Blog
                          </Link>
                          <Link
                            to="/admin/experience"
                            className="dropdown-item"
                          >
                            Experience
                          </Link>
                          <Link to="/admin/about-us" className="dropdown-item">
                            Aboutus
                          </Link>
                          <Link
                            to="/admin/exibhitions"
                            className="dropdown-item"
                          >
                            Exibhitions
                          </Link>
                          <Link
                            to="/admin/partner-with-us"
                            className="dropdown-item"
                          >
                            Client Images
                          </Link>
                          <Link
                            to="/admin/feel-free-to-contact-us"
                            className="dropdown-item"
                          >
                            Feel Free To Contact Us
                          </Link>
                        </div>
                      </li>
                    }

                    {
                      <li className="nav-item dropdown">
                        <Link
                          className="nav-link dropdown-toggle arrow-none"
                          // to="/admin/rto"
                          id="topnav-emailtemplates"
                          role="button"
                          style={{ paddingTop: "25px" }}
                        >
                          <AiOutlineHome className="me-2" />
                          Order
                        </Link>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="topnav-emailtemplates"
                        >
                          <Link to="/admin/order" className="dropdown-item">
                            Orders
                          </Link>
                          {/* <Link
                            to="/admin/order/status"
                            className="dropdown-item"
                          >
                            Order Status
                          </Link> */}
                        </div>
                      </li>
                    }

                    {/* {
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="/admin/order"
                          style={{ paddingTop: "25px" }}
                        >
                          <AiOutlineHome className="me-2" />
                          Orders
                        </Link>
                      </li>
                    } */}

                    {
                      <li className="nav-item">
                        <Link
                          onClick={() => handleLogout()}
                          className="nav-link"
                          style={{ paddingTop: "25px" }}
                        >
                          <AiOutlineHome className="me-2" />
                          Logout
                        </Link>
                      </li>
                    }

                    {/* <li className="nav-item dropdown mega-dropdown">
                    <a className="nav-link dropdown-toggle arrow-none" href="#" id="topnav-uielement" role="button">
                      <i className="ti-package me-2"></i>UI Elements
                    </a>

                    <div className="dropdown-menu mega-dropdown-menu px-2 dropdown-menu-start dropdown-mega-menu-xl"
                      aria-labelledby="topnav-uielement">
                      <div className="row">
                        <div className="col-lg-4">
                          <div>
                            <a href="ui-alerts.html" className="dropdown-item">Alerts</a>
                            <a href="ui-buttons.html" className="dropdown-item">Buttons</a>
                            <a href="ui-cards.html" className="dropdown-item">Cards</a>
                            <a href="ui-carousel.html" className="dropdown-item">Carousel</a>
                            <a href="ui-dropdowns.html" className="dropdown-item">Dropdowns</a>
                            <a href="ui-grid.html" className="dropdown-item">Grid</a>
                            <a href="ui-images.html" className="dropdown-item">Images</a>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div>
                            <a href="ui-lightbox.html" className="dropdown-item">Lightbox</a>
                            <a href="ui-modals.html" className="dropdown-item">Modals</a>
                            <a href="ui-rangeslider.html" className="dropdown-item">Range Slider</a>
                            <a href="ui-session-timeout.html" className="dropdown-item">Session Timeout</a>
                            <a href="ui-progressbars.html" className="dropdown-item">Progress Bars</a>
                            <a href="ui-sweet-alert.html" className="dropdown-item">SweetAlert 2</a>
                            <a href="ui-tabs-accordions.html" className="dropdown-item">Tabs & Accordions</a>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div>
                            <a href="ui-typography.html" className="dropdown-item">Typography</a>
                            <a href="ui-video.html" className="dropdown-item">Video</a>
                            <a href="ui-general.html" className="dropdown-item">General</a>
                            <a href="ui-colors.html" className="dropdown-item">Colors</a>
                            <a href="ui-rating.html" className="dropdown-item">Rating</a>
                          </div>
                        </div>
                      </div>

                    </div>
                  </li> */}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
