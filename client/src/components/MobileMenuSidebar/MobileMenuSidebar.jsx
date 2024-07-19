import React, { useEffect, useState } from "react";
import logo from "../../assets/img/RALINGOBlack.png";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus } from "../../redux/slices/menuSlice";
import { logout } from "../../redux/slices/authSlice";
import BackgroundImageLightLeft from "../../assets/Image/BackgroundImageLightLeft.png";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
const MobileMenuSidebar = ({ toggleMobileMenu }) => {
  const { loading, menus } = useSelector((state) => state.menu);
  const { loading: Authuserloader, userdetails } = useSelector(
    (state) => state.auth
  );

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMenus());
  }, []);

  const handleLogout = () => {
    const answer = window.confirm("Are you sure ?");
    if (answer) {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showItem1SubMenu, setShowItem1SubMenu] = useState({});

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
    // Reset all item submenus when main submenu is toggled
    setShowItem1SubMenu({});
  };

  const toggleItem1SubMenu = (index) => {
    setShowItem1SubMenu((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  return (
    <>
      {" "}
      <div
        id="MobileMenuSidebar"
        className="sidebarHome"
        style={{
          backgroundImage: `url(${BackgroundImageLightLeft})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span
          className="closebtn btn"
          onClick={() => toggleMobileMenu(false)}
          style={{ fontSize: 30, right: 10, marginLeft: 300 }}
        >
          ×
        </span>
        <div>
          <Link to="/">
            <img
              src={logo}
              style={{
                height: "10vh",
                marginLeft: "-175px",
                marginTop: "-55px",
              }}
              loading="lazy"
            />
          </Link>
          {/* <br />
          <p
            style={{
              marginLeft: 40,
              fontSize: 14,
              fontWeight: 500,
              textAlign: "left",
              width: "80%",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
            }}
          >
            Opposite Shanti Nagar Gate no. 1, Bhopa Road, Uttar Pradesh (251001)
          </p> */}
        </div>
        <div
          className="container-fluid"
          style={{
            padding: "10px 0px 40px 0px",
            textAlign: "left",
          }}
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
                zoom: "70%",
              }}
            >
              IMPORTANT LINKS
            </span>
          </center>
          <br></br>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Home
          </Link>
          <Link
            to="/room-ideas"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Buy From Elevation
          </Link>
          {userdetails &&
            userdetails.userRole?.find((role) => role?.name === "admin") && (
              <Link
                to="/customized-combination"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  fontFamily: "Macondo, cursive",
                  color: "#212529",
                }}
                className="MobileMenuSidebarLink"
              >
                <MdOutlineKeyboardDoubleArrowRight
                  style={{
                    color: "#475B52",
                    fontWeight: "800",
                    fontSize: "20px",
                  }}
                />
                &nbsp; Customized Elevation
              </Link>
            )}
          {/* <Link
            to="#"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Shop
          </Link> */}
          <div>
            <div
              onClick={toggleSubMenu}
              style={{
                textDecoration: "none",
                cursor: "pointer",
                letterSpacing: "1px",
                fontFamily: "Macondo, cursive",
                color: "#212529",
              }}
              className="MobileMenuSidebarLink"
            >
              {showSubMenu ? (
                <MdOutlineKeyboardDoubleArrowDown
                  style={{
                    color: "#475B52",
                    fontWeight: "800",
                    fontSize: "20px",
                  }}
                />
              ) : (
                <MdOutlineKeyboardDoubleArrowRight
                  style={{
                    color: "#475B52",
                    fontWeight: "800",
                    fontSize: "20px",
                  }}
                />
              )}
              &nbsp; Shop
            </div>
            {showSubMenu &&
              menus &&
              menus.map((menu, index) => (
                <div key={index} style={{ paddingLeft: "70px" }}>
                  <div
                    onClick={() => toggleItem1SubMenu(index)}
                    style={{
                      textTransform: "capitalize",
                      textDecoration: "none",
                      cursor: "pointer",
                      letterSpacing: "1px",
                      fontFamily: "Macondo, cursive",
                      color: "#212529",
                    }}
                  >
                    {showItem1SubMenu[index] ? (
                      <MdOutlineKeyboardArrowDown />
                    ) : (
                      <MdOutlineKeyboardArrowRight />
                    )}
                    &nbsp; {menu?.P?.title}
                  </div>
                  {showItem1SubMenu[index] && (
                    <div style={{ marginLeft: "20px" }}>
                      {menu.Child &&
                        menu.Child.map((c, index) => (
                          <React.Fragment key={index}>
                            <Link
                              to={`/collection/${c?.url}`}
                              style={{
                                textDecoration: "none",
                                cursor: "pointer",
                                letterSpacing: "1px",
                                fontFamily: "Macondo, cursive",
                                color: "#212529",
                              }}
                            >
                              <MdOutlineKeyboardArrowRight /> {c.title}
                            </Link>
                            <br></br>
                          </React.Fragment>
                        ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
          <Link
            to="/blog"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Blog
          </Link>
          <Link
            to="/AboutUs"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; About Railingo
          </Link>
          <Link
            to="/ExperienceCenters"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Locate Us
          </Link>

          <Link
            to="/CompletedProject"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Completed Projects
          </Link>

          <Link
            to="/PartnerWithUs"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Partner With Us
          </Link>

          <Link
            to="/Exibhitions"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Exibhitions
          </Link>
          <Link
            to="/Contact"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Contact Now
          </Link>

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
                zoom: "75%",
              }}
            >
              USER ACCOUNT
            </span>
          </center>
          <br></br>
          {userdetails && Object.keys(userdetails)?.length !== 0 ? (
            <Link
              to="#"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                letterSpacing: "1px",
                fontFamily: "Macondo, cursive",
                color: "#212529",
              }}
              className="MobileMenuSidebarLink"
            >
              <MdOutlineKeyboardDoubleArrowRight
                style={{
                  color: "#475B52",
                  fontWeight: "800",
                  fontSize: "20px",
                }}
              />
              &nbsp; Hi {userdetails.Name.slice(0, 4)}..
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                letterSpacing: "1px",
                fontFamily: "Macondo, cursive",
                color: "#212529",
              }}
              className="MobileMenuSidebarLink"
            >
              <MdOutlineKeyboardDoubleArrowRight
                style={{
                  color: "#475B52",
                  fontWeight: "800",
                  fontSize: "20px",
                }}
              />
              &nbsp; Login Now
            </Link>
          )}
          {userdetails &&
          userdetails?.userRole?.find((role) => role?.name === "Architect") ? (
            <>
              <Link
                to="/architect/dashboard"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  letterSpacing: "1px",
                  fontFamily: "Macondo, cursive",
                  color: "#212529",
                }}
                className="MobileMenuSidebarLink"
              >
                <MdOutlineKeyboardDoubleArrowRight
                  style={{
                    color: "#475B52",
                    fontWeight: "800",
                    fontSize: "20px",
                  }}
                />
                &nbsp; Dash Board
              </Link>
            </>
          ) : (
            <></>
          )}
          {userdetails && Object.keys(userdetails)?.length !== 0 && (
            <Link
              onClick={() => navigate("/profile")}
              style={{
                textDecoration: "none",
                cursor: "pointer",
                letterSpacing: "1px",
                fontFamily: "Macondo, cursive",
                color: "#212529",
              }}
              className="MobileMenuSidebarLink"
            >
              <MdOutlineKeyboardDoubleArrowRight
                style={{
                  color: "#475B52",
                  fontWeight: "800",
                  fontSize: "20px",
                }}
              />
              &nbsp; Your Profile
            </Link>
          )}
          <Link
            to="#"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Your Orders
          </Link>
          <div
            onClick={() => navigate("/whishlist")}
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Your Wishlist
          </div>
          <Link
            to="/track-order"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              letterSpacing: "1px",
              fontFamily: "Macondo, cursive",
              color: "#212529",
            }}
            className="MobileMenuSidebarLink"
          >
            <MdOutlineKeyboardDoubleArrowRight
              style={{ color: "#475B52", fontWeight: "800", fontSize: "20px" }}
            />
            &nbsp; Track your Order
          </Link>
          {userdetails && Object.keys(userdetails)?.length !== 0 && (
            <Link
              onClick={handleLogout}
              style={{
                textDecoration: "none",
                cursor: "pointer",
                letterSpacing: "1px",
                fontFamily: "Macondo, cursive",
                color: "#212529",
              }}
              className="MobileMenuSidebarLink"
            >
              <MdOutlineKeyboardDoubleArrowRight
                style={{
                  color: "#475B52",
                  fontWeight: "800",
                  fontSize: "20px",
                }}
              />
              &nbsp; Sign Out
            </Link>
          )}
          {menus &&
            menus.map((menu) => {
              return <DynamicMenuMobile key={menu._id} menu={menu} />;
            })}
        </div>
      </div>
    </>
  );
};

const DynamicMenuMobile = ({ menu }) => {
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuVisible(!isSubMenuVisible);
  };

  return (
    <>
      <Link to={`/collection/${menu?.url}`} className="MobileMenuSidebarLink">
        {menu?.title && (
          <>
            {menu?.title}

            {menu.childCollections && menu.childCollections.length > 0 && (
              <>
                <span onClick={toggleSubMenu}>»</span>
              </>
            )}
          </>
        )}
      </Link>
      {isSubMenuVisible && (
        <div style={{ paddingLeft: 15 }}>
          {menu.childCollections &&
            menu.childCollections.length > 0 &&
            menu.childCollections.map((p) => (
              <>
                <DynamicMenuMobile key={p._id} menu={p} />
              </>
            ))}
        </div>
      )}
    </>
  );
};

export default MobileMenuSidebar;
