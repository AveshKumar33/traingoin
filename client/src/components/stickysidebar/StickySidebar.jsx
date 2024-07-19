import React, { useState, useEffect } from "react";
import "./stickysidebar.css";
// import CartSidebar from "../cartSidebar/CartSidebar";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CartIcon from "../Carticon/CartIcon";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { fetchWishlistForProductList } from "../../redux/slices/newWishlistSlice";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebook, faLinkedin, faPinterest, faYoutube, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const StickySidebar = () => {
  const { userdetails } = useSelector((state) => state.auth);
  // const { cartdata, quantity } = useSelector((state) => state.cart);
  const { quantity: whislistqunatity } = useSelector(
    (state) => state.whishlist
  );

  const { wishlistProducts } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();

  // const [managecart, setmanagecart] = useState(false);
  const [wishlistProduct, setWishlistProducts] = useState([]);

  useEffect(() => {
    if (userdetails && Object.keys(userdetails).length > 0) {
      dispatch(fetchWishlistForProductList());
    }
  }, [userdetails, dispatch]);

  useEffect(() => {
    if (wishlistProducts?.length > 0) {
      setWishlistProducts(wishlistProducts);
    }
  }, [wishlistProducts]);

  const navigate = useNavigate();

  return (
    <>
      <div className="sticky-container" id="Floating">
        <ul className="sticky FloatingulClass">
          <li
            className="Hoverclass"
            onClick={() => navigate("/cart")}
            title="Cart"
          >
            <CartIcon />
          </li>

          <li
            className="Hoverclass"
            title="Wishlist"
            style={{ borderTop: "1px solid #fff", paddingTop: "7px" }}
            onClick={() => navigate("/whishlist")}
          >
            <FaHeart style={{ paddingLeft: 8, fontSize: "27px" }} />
            {/* <span
              style={{
                backgroundColor: "#EFEFEF",
                borderRadius: "50%",
                padding: "1px 4px 1px 4px",
                fontSize: 8,
                marginLeft: "-5px",
                marginTop: "-3px",
                color: "#324040",
                position: "absolute",
              }}
            >
              {userdetails && Object.keys(userdetails).length > 0
                ? wishlistProduct?.length
                : whislistqunatity}
            </span> */}
          </li>
        </ul>
      </div>
      <div className="fixed-bottom HideInDesktop">
        <div className="fixed-bottom1">
          <Link to="tel:+918755999395" target="_blank">
            Call Us
          </Link>
        </div>
        <div className="fixed-bottom1">
          <Link to="https://wa.me/918755999395" target="_blank">
            Enquiry
          </Link>
        </div>
        <div className="fixed-bottom1">
          <Link
            to="https://www.google.com/maps/search/?api=1&query=Hennur%2C+Kuvempu+Layout%2C+Kothanpur%2C+Bengaluru%2C+Karnataka%2C+560077%2C+India"
            target="_blank"
          >
            Location
          </Link>
        </div>
      </div>
    </>
  );
};

export default StickySidebar;
