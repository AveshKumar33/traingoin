import logo from "../../assets/img/RALINGOBlack.png";
import { Link, useNavigate } from "react-router-dom";
import { GiRockingChair } from "react-icons/gi";
import {
  AiOutlineDotChart,
  AiOutlineProject,
  AiOutlineTags,
} from "react-icons/ai";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { TfiGallery } from "react-icons/tfi";
import { FaBook, FaUserAlt } from "react-icons/fa";
import { RiCoupon2Fill } from "react-icons/ri";
import { GrBundle, GrCatalog, GrUnorderedList } from "react-icons/gr";
import { CgAlignRight } from "react-icons/cg";
import { MdMessage, MdRateReview } from "react-icons/md";
import {
  BsFillQuestionDiamondFill,
  BsImages,
  BsPersonWorkspace,
  BsSliders,
} from "react-icons/bs";

import "../../index.css";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { BiCategoryAlt } from "react-icons/bi";

const SideBar = () => {
  return <></>;
};

export default SideBar;

const OldSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlelogout = () => {
    let success = window.confirm("Are You Sure to Logout ?");

    if (success) dispatch(logout());

    if (success) window.location.href = "/";
  };

  return (
    <>
      <nav
        className="sidebar vertical-scroll  ps-container ps-theme-default ps-active-y"
        style={{ zIndex: 2 }}
      >
        <div className="logo d-flex justify-content-center">
          <Link to="/">
            <img src={logo} alt style={{ height: "10vh" }} loading="lazy" />
          </Link>
          <div className="sidebar_close_icon d-lg-none">
            <i className="ti-close"></i>
          </div>
        </div>
        <ul id="sidebar_menu">
          {/* <li>
          <Link to="index.html" aria-expanded="false">
            <div className="icon_menu">
              <img src={dashboardsvg} alt />
            </div>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="Customers.html" aria-expanded="false">
            <div className="icon_menu">
              <img src={customersvg} alt />
            </div>
            <span>Customers</span>
          </Link>
        </li>
        <li>
          <Link to="Orders.html" aria-expanded="false">
            <div className="icon_menu">
              <img src={ordersvg} alt />
            </div>
            <span>Orders</span>
          </Link>
        </li> */}
          <li>
            <Link to="/admin/product" aria-expanded="false">
              <div className="icon_menu">
                {/* <img src={ordersvg} alt /> */}
                <GiRockingChair />
              </div>
              <span>Products</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/customizedproduct" aria-expanded="false">
              <div className="icon_menu">
                {/* <img src={ordersvg} alt /> */}
                <BsImages />
              </div>
              <span>Customized Products</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/dot-product" aria-expanded="false">
              <div className="icon_menu">
                <AiOutlineDotChart />
              </div>
              <span>Product Bundle</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/dotcustomized" aria-expanded="false">
              <div className="icon_menu"></div>
              <span>Customized Product Bundle</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/tags" aria-expanded="false">
              <div className="icon_menu">
                {/* <img src={ordersvg} alt /> */}
                <AiOutlineTags />
              </div>
              <span>Tags</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/CollectionFilters" aria-expanded="false">
              <div className="icon_menu">
                {/* <img src={ordersvg} alt /> */}
                <AiOutlineTags />
              </div>
              <span>Collection Filters</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/collection" aria-expanded="false">
              <div className="icon_menu">
                {/* <img src={ordersvg} alt /> */}
                <FiMenu />
              </div>
              <span>Collection</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/queries" aria-expanded="false">
              <div className="icon_menu">
                {/* <img src={ordersvg} alt /> */}
                <MdMessage />
              </div>
              <span>Queries</span>
            </Link>
          </li>

          {/* <li>
          <Link to="/admin/gallery" aria-expanded="false">
            <div className="icon_menu">
              <TfiGallery/>
            </div>
            <span>Gallery</span>
          </Link>
        </li> */}
          <li>
            <Link to="/admin/attribute" aria-expanded="false">
              <div className="icon_menu">
                <CgAlignRight />
              </div>
              <span>Attribute</span>
            </Link>
          </li>
          {/* <li>
          <Link to="/admin/product-bundle" aria-expanded="false">
            <div className="icon_menu">
              <GiBunkBeds/>
            </div>
            <span>Product Bundle</span>
          </Link>
        </li> */}

          <li>
            <Link to="/admin/user" aria-expanded="false">
              <div className="icon_menu">
                <FaUserAlt />
              </div>
              <span>User</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/coupon" aria-expanded="false">
              <div className="icon_menu">
                <RiCoupon2Fill />
              </div>
              <span>Coupon</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/order" aria-expanded="false">
              <div className="icon_menu">
                <GrUnorderedList />
              </div>
              <span>Order</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/projectcategory" aria-expanded="false">
              <div className="icon_menu">
                <BiCategoryAlt />
              </div>
              <span>Project Category</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/project" aria-expanded="false">
              <div className="icon_menu">
                <AiOutlineProject />
              </div>
              <span>Project </span>
            </Link>
          </li>

          <li>
            <Link to="/admin/slider" aria-expanded="false">
              <div className="icon_menu">
                <BsSliders />
              </div>
              <span>Slider </span>
            </Link>
          </li>

          <li>
            <Link to="/admin/review" aria-expanded="false">
              <div className="icon_menu">
                <MdRateReview />
              </div>
              <span>Review</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/enquiry" aria-expanded="false">
              <div className="icon_menu">
                <BsFillQuestionDiamondFill />
              </div>
              <span>Enquiry</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/catalogue" aria-expanded="false">
              <div className="icon_menu">
                <GrCatalog />
              </div>
              <span>Catalogue</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/architect" aria-expanded="false">
              <div className="icon_menu">
                <BsPersonWorkspace />
              </div>
              <span>Architect</span>
            </Link>
          </li>

          <li>
            <Link to="/admin/blog" aria-expanded="false">
              <div className="icon_menu">
                <FaBook />
              </div>
              <span>Blog</span>
            </Link>
          </li>

          <li>
            <Link onClick={handlelogout}>
              <div className="icon_menu">
                <FiLogOut />
              </div>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
