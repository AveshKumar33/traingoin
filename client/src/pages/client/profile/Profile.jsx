import React, { useCallback, useEffect, useState } from "react";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import HeaderImage from "../../../assets/Image/Slider11.jpg";

import MainFooter from "../../../components/mainfooter/MainFooter";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import Preloader from "../../../components/preloader/Preloader";
import { AiFillEdit } from "react-icons/ai";
import { updateUser } from "../../../redux/slices/userSlice";
import { verifyToken } from "../../../redux/slices/authSlice";
// import { useNavigate } from "react-router-dom";
import UserOrder from "../../../components/userorder/UserOrder";
import { axiosInstance } from "../../../config";
import RazorpayCheckout from "../checkout/RazorpayCheckout";
// import { DynamicAttribute } from "../../../components/cartSidebar/CartSidebar";
import { REACT_APP_URL } from "../../../config";
import BackgroundImageRight from "../../../assets/Image/BackgroundImageRight.png";
import ProductCard from "../../../components/productcard/ProductCard";
import CustomizeProductCard from "../../client/whislist/CustomizedProductCard";
import { getPriceForWishlist } from "../../../utils/varientimge/getPrice";
import CustomizedCombinationCard from "../../client/whislist/CustomizedCombinationCard";
import DotCustomizeProductCardRoomIdea from "../roomideas/DotCustomizeProductCardRoomIdea";
import DotProductCardRoomIdea from "../roomideas/DotProductCardRoomIdea";
import {
  fetchWishlistProducts,
  fetchWishlistDotProducts,
  fetchWishlistCustomizedProducts,
  fetcCustomizedComboProductsForWishlist,
} from "../../../redux/slices/newWishlistSlice";
import { isSingleProductInWishlist } from "../../../utils/isInWishlist/isSingleProduct";
import {
  isCustomizedDotProductInWishlist,
  isSingleDotProductInWishlist,
} from "../../../utils/isInWishlist/isSingleProduct";
import { isCustomizedProductInWishlist } from "../../../utils/isInWishlist/isCustomizedProduct";
import { toastError } from "../../../utils/reactToastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { loading: userLoading, userdetails } = useSelector(
    (state) => state.auth
  );
  // const navigate = useNavigate();
  /** wish list working start here */
  const { whishlistdata } = useSelector((state) => state.whishlist);
  const {
    wishlistProducts,
    loading,
    products,
    wishlistDotProducts,
    dotProducts,
    wishlistCustomizedProducts,
    customizedProducts,
    wishlistCustomizedComboProducts,
    customizedComboForWishlist,
  } = useSelector((state) => state.wishlist);

  const [singleProductWishlist, setSingleProductWishlist] = useState([]);
  const [dotProductWishlist, setDotProductWishlist] = useState([]);
  const [customizeProductWishlist, setCustomizeProductWishlist] = useState([]);
  const [productCombinations, setProductCombinations] = useState([]);
  const [dotProduct, setDotProduct] = useState([]);

  const [
    customizeComboProductWishlist,
    setCustomizeComboProductWishlist,
  ] = useState([]);
  const [customizeComboProduct, setCustomizeComboProduct] = useState([]);
  /** wish list working end here */

  const [formdata, setformdata] = useState({});
  const [userimage, setUserImage] = useState();
  const [handleeditvalue, sethandleEdit] = useState(false);
  const [allorder, setallorder] = useState([]);
  const [loader, setloader] = useState(false);
  const [orderitem, setorderitem] = useState([]);
  const [orderid, setorderid] = useState();
  const [localpaymentstatus, setlocalpaymentstatus] = useState(false);
  const [installmentIndex, setinstallmentIndex] = useState();
  const [handlepopup, sethandlepopup] = useState(false);
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Profile`
      );
      if (data?.success) {
        setHeaderImage(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, []);
  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);
  /** wish list working start here */

  const calculateCustomizedPrice = (
    productDetails,
    combinations,
    priceFor,
    { width, height }
  ) => {
    if (productDetails && combinations?.length > 0) {
      const totalCustomizedPrice =
        productDetails[priceFor] +
        getPriceForWishlist(productDetails, combinations, {
          DefaultWidth: width,
          DefaultHeight: height,
        });

      return totalCustomizedPrice;
    }
    return 0;
  };

  useEffect(() => {
    const isEmptyUserDetails =
      !userdetails || Object.keys(userdetails).length === 0;
    const userId = isEmptyUserDetails ? "unauthenticated" : userdetails._id;

    Promise.all([
      dispatch(
        fetchWishlistProducts({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
      dispatch(
        fetchWishlistDotProducts({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
      dispatch(
        fetchWishlistCustomizedProducts({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
      dispatch(
        fetcCustomizedComboProductsForWishlist({
          product: isEmptyUserDetails ? whishlistdata : [],
          userId,
        })
      ),
    ]);
  }, [dispatch, userdetails, whishlistdata]);

  useEffect(() => {
    if (
      loading === "fulfilled" &&
      userdetails &&
      Object.keys(userdetails)?.length > 0 &&
      products &&
      wishlistProducts &&
      dotProducts &&
      wishlistDotProducts &&
      wishlistCustomizedProducts &&
      customizedProducts &&
      wishlistCustomizedComboProducts &&
      customizedComboForWishlist
    ) {
      setProductCombinations(products);
      setSingleProductWishlist(wishlistProducts);
      setDotProduct(dotProducts);
      setDotProductWishlist(wishlistDotProducts);
      // setCustomizeProducts(customizedProducts);
      setCustomizeProductWishlist(wishlistCustomizedProducts);
      setCustomizeComboProductWishlist(wishlistCustomizedComboProducts);
      setCustomizeComboProduct(customizedComboForWishlist);
    } else if (
      userdetails &&
      Object.keys(userdetails)?.length === 0 &&
      whishlistdata &&
      wishlistProducts &&
      products &&
      dotProducts &&
      wishlistCustomizedProducts &&
      customizedProducts &&
      wishlistCustomizedComboProducts &&
      customizedComboForWishlist
    ) {
      setProductCombinations(products);
      setSingleProductWishlist(wishlistProducts);
      setDotProduct(dotProducts);
      setDotProductWishlist(wishlistDotProducts);
      // setCustomizeProducts(customizedProducts);
      setCustomizeProductWishlist(wishlistCustomizedProducts);
      setCustomizeComboProductWishlist(wishlistCustomizedComboProducts);
      setCustomizeComboProduct(customizedComboForWishlist);
    }
  }, [
    loading,
    userdetails,
    products,
    wishlistProducts,
    whishlistdata,
    dotProducts,
    wishlistDotProducts,
    wishlistCustomizedProducts,
    customizedProducts,
    wishlistCustomizedComboProducts,
    customizedComboForWishlist,
  ]);
  /** wish list working end here */

  const getuserorder = useCallback(async () => {
    try {
      setloader(true);

      const { data } = await axiosInstance.get(
        `/api/order?UserDetails=${userdetails?._id}`
      );
      setallorder(data.data);
      setloader(false);
    } catch (error) {
      alert(error.response.data.message);
      setloader(false);
    }
  }, [userdetails?._id]);

  useEffect(() => {
    if (userLoading === "fulfilled" && userdetails) {
      const { userImage, ...user } = userdetails;
      setformdata(user);
      setUserImage(userImage);
      getuserorder();
    }
    if (localpaymentstatus) {
      getuserorder();
    }
  }, [userLoading, localpaymentstatus, getuserorder, userdetails]);

  const { Name, Email, MobNumber, Password } = formdata;

  const handleFormChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleorderItem = (orderitem, id) => {
    setorderid(id);
    setorderitem(orderitem);
    sethandlepopup(true);
  };

  if (userLoading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  const handleEdit = () => {
    sethandleEdit(!handleeditvalue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userdata = new FormData();
    userdata.append("Name", Name);
    userdata.append("Email", Email);
    userdata.append("MobNumber", MobNumber);
    userdata.append("Password", Password);
    userdata.append("userimg", userimage);

    const updateddata = {
      id: userdetails._id,
      userdata,
    };

    dispatch(updateUser(updateddata));

    setTimeout(() => {
      dispatch(verifyToken());
    }, 100);
  };

  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <div
        className="div"
        style={{
          height: headerImage?.pngImage ? "60vh" : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${headerImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      >
        {/* <h3
          style={{
            textAlign: "center",
            color: "#fff",
            marginTop: "200px",
            textTransform: "uppercase",
            fontSize: "30px",
          }}
        >
          Our Profile
        </h3> */}
      </div>{" "}
      <form onSubmit={handleSubmit}>
        <div
          className="row ProfilePageTopStyle"
          style={{
            backgroundImage: `url(${BackgroundImageRight})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3">
              {userdetails &&
                !userdetails?.userRole?.find(
                  (role) => role?.name === "Architect"
                ) && (
                  <img
                    className="rounded-circle ProfileImagePadding"
                    width="150px"
                    src={`${REACT_APP_URL}/images/user/${userimage}`}
                    alt="_user"
                  />
                )}
              <img
                className="rounded-circle ProfileImagePadding"
                width="150px"
                src={`${REACT_APP_URL}/images/architect/${userdetails?.image}`}
                alt="_architect"
              />
              <br></br>
              <span className="font-weight-bold">{userdetails.Name}</span>
              <span className="text-black-50">{userdetails.Email}</span>
              <span> </span>
            </div>
          </div>
          <div className="col-md-5 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Contact Details</h4>
                {userdetails &&
                  !userdetails?.userRole?.find(
                    (role) => role?.name === "Architect"
                  ) && (
                    <h4 className="text-right">
                      <AiFillEdit onClick={handleEdit} />
                    </h4>
                  )}
              </div>
              <div className="row mt-2">
                <div className="col-md-12" style={{ marginTop: "15px" }}>
                  <label className="labels" style={{ fontSize: "16px" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
                    className="form-control"
                    placeholder="first name"
                    readOnly={!handleeditvalue}
                    name="Name"
                    defaultValue={Name}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12" style={{ marginTop: "15px" }}>
                  <label className="labels" style={{ fontSize: "16px" }}>
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
                    className="form-control"
                    placeholder="enter phone number"
                    defaultValue={MobNumber}
                    readOnly={!handleeditvalue}
                    onChange={handleFormChange}
                    name="MobNumber"
                  />
                </div>

                {handleeditvalue && (
                  <>
                    <div className="col-md-12" style={{ marginTop: "15px" }}>
                      <label className="labels" style={{ fontSize: "16px" }}>
                        Profile Image
                      </label>
                      <input
                        type="file"
                        style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
                        className="form-control"
                        onChange={(e) => setUserImage(e.target.files[0])}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className="col-md-3 border-right ContactDetailsSecond"
            style={{ paddingTop: "50px" }}
          >
            <div className="p-3 py-5">
              {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right"></h4>
              </div> */}

              <div className="row">
                <div className="col-md-12" style={{ marginTop: "15px" }}>
                  <label className="labels" style={{ fontSize: "16px" }}>
                    Email Id
                  </label>
                  <input
                    type="email"
                    style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
                    className="form-control"
                    placeholder="enter email id"
                    defaultValue={Email}
                    name="Email"
                    onChange={handleFormChange}
                    readOnly={!handleeditvalue}
                  />
                </div>

                <div className="col-md-12" style={{ marginTop: "15px" }}>
                  <label className="labels" style={{ fontSize: "16px" }}>
                    Password
                  </label>
                  <input
                    type="text"
                    style={{ borderColor: "#ddd", backgroundColor: "#fff" }}
                    className="form-control"
                    defaultValue={Password}
                    name="Password"
                    readOnly={!handleeditvalue}
                    onChange={handleFormChange}
                  />
                </div>
                {handleeditvalue && (
                  <div className="text-center" style={{ marginTop: "40px" }}>
                    <button
                      type="submit"
                      className="button"
                      style={{ backgroundColor: "#475B52" }}
                    >
                      Save Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <br />

          {allorder && allorder.length > 0 && (
            <>
              <div className="col-md-12">
                <UserOrder
                  allorder={allorder}
                  handleorderItem={handleorderItem}
                />
              </div>

              {handlepopup && (
                <div
                  id="ProfilePageOrderDetailsPopup"
                  className="popup-containerProfile"
                >
                  <div className="popup-contentProfile">
                    <div
                      className="close btn"
                      onClick={() => sethandlepopup(false)}
                      style={{ display: "inline-block" }}
                    >
                      ×
                    </div>

                    <h5>Product Details</h5>
                    <br />

                    <div className="col-md-12 ">
                      {orderitem.map((order) => (
                        <>
                          <div className="table-responsive">
                            <table className="table mt-3">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Product Name</th>
                                  <th>Installment Type</th>
                                  <th>Qty</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td style={{ width: "10%" }}>
                                    <img
                                      className="ProfileProductImage"
                                      src={`${REACT_APP_URL}/images/product/${order.img}`}
                                      alt="_your_order"
                                    />
                                  </td>
                                  <td style={{ width: "30%" }}>
                                    <p className="ProfileProductName">
                                      {" "}
                                      {order.name}
                                    </p>
                                  </td>
                                  <td style={{ width: "40%" }}>
                                    {order.sellingType && (
                                      <span
                                        className=" p-1 rounded"
                                        style={{
                                          backgroundColor: "#475B52",
                                          color: "#fff",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {order.sellingType}
                                      </span>
                                    )}
                                    <br />
                                    <br />
                                    {order.sellingType === "Installment" &&
                                      order.Installment &&
                                      order.Installment.map((p, i) => (
                                        <tr key={p.Name}>
                                          <td style={{ padding: "0px" }}>
                                            <span className="my-5">
                                              {p.Name} - ₹ {p.Amount}-(
                                              {order.quantity}) -{" "}
                                              {Number(p.Amount) *
                                                Number(order.quantity)}
                                              &nbsp;&nbsp;
                                              {p.paymentstatus ? (
                                                <i
                                                  className="fa fa-check"
                                                  style={{ color: "green" }}
                                                ></i>
                                              ) : (
                                                <RazorpayCheckout
                                                  Amount={
                                                    Number(p.Amount) *
                                                    Number(order.quantity)
                                                  }
                                                  orderid={orderid}
                                                  paymentindex={i}
                                                  setlocalpaymentstatus={
                                                    setlocalpaymentstatus
                                                  }
                                                  setinstallmentIndex={
                                                    setinstallmentIndex
                                                  }
                                                />
                                              )}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: 18,
                                      fontWeight: 800,
                                      paddingTop: 30,
                                      color: "#475B52",
                                    }}
                                  >
                                    {order.quantity}
                                  </td>
                                  <td
                                    style={{
                                      fontSize: 18,
                                      fontWeight: 800,
                                      paddingTop: 30,
                                      color: "#475B52",
                                    }}
                                  >
                                    ₹ {order.price}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </form>
      <br></br>
      <div
        className="row "
        style={{ padding: "0px 0px 20px 0px", backgroundColor: "#fff" }}
      >
        <p style={{ color: "#818181", textAlign: "center" }}>Our Products</p>
        <h1 style={{ textAlign: "center", textTransform: "uppercase" }}>
          Whislist Products
        </h1>
        {productCombinations.length === 0 &&
          customizeProductWishlist?.length === 0 &&
          dotProduct?.length === 0 &&
          customizeComboProduct === 0 && (
            <>
              <br></br>
              <br></br>
              <center>
                <h6
                  className="text-center"
                  style={{
                    backgroundColor: "rgb(255,0,0,0.5)",
                    width: "20%",
                    borderRadius: "10px",
                    padding: "12px",
                    marginTop: "20px",
                  }}
                >
                  Whishlist Empty !!!
                </h6>
              </center>
            </>
          )}
        <div className="col-lg-12">
          <div className="row">
            {/* single Product Card */}
            {productCombinations &&
              productCombinations?.length > 0 &&
              productCombinations?.map((combination) => (
                <ProductCard
                  key={combination._id}
                  product={combination?.singleProductId}
                  colnumber={3}
                  customizedproductcardheight={"38vh"}
                  // collectionUrl={collectiondetails?.url}
                  combinationImage={combination?.image}
                  productCombination={combination}
                  wishlistData={singleProductWishlist || []}
                  isProductInWishlist={isSingleProductInWishlist}
                  isWishlist={true}
                  cartData={[]}
                />
              ))}

            {/* customized  Product Card */}
            {customizeProductWishlist &&
              customizeProductWishlist?.length > 0 &&
              customizeProductWishlist.map((combination) => (
                <CustomizeProductCard
                  key={combination?._id}
                  calculateCustomizedPrice={calculateCustomizedPrice}
                  product={combination?.customizeProduct}
                  colnumber={3}
                  collectionUrl=""
                  customizedproductcardheight={"38vh"}
                  productCombination={combination?.customizeProduct}
                  combination={combination}
                  collectionname=""
                  wishlistData={combination || []}
                  isProductInWishlist={isCustomizedProductInWishlist}
                  isWishlist={true}
                />
              ))}
          </div>
          <div className="row">
            {dotProduct &&
              dotProduct?.length > 0 &&
              dotProduct?.map((p, index) =>
                p?.type === "singleDotProduct" ? (
                  <div
                    key={index}
                    className="col-lg-6"
                    style={{
                      float: "left",
                      width: "49%",
                      marginLeft: "2px",
                      marginRight: "2px",
                    }}
                  >
                    <DotProductCardRoomIdea
                      key={p._id}
                      dotproduct={p}
                      wishlistData={dotProductWishlist || []}
                      isProductInWishlist={isSingleDotProductInWishlist}
                      isWishlist={true}
                    />
                  </div>
                ) : (
                  <div
                    className="col-lg-6"
                    style={{
                      float: "left",
                      width: "49%",
                      marginLeft: "2px",
                      marginRight: "2px",
                    }}
                    key={index}
                  >
                    <DotCustomizeProductCardRoomIdea
                      key={p._id}
                      dotproduct={p}
                      wishlistData={dotProductWishlist || []}
                      isProductInWishlist={isCustomizedDotProductInWishlist}
                      isWishlist={true}
                    />
                  </div>
                )
              )}

            {customizeComboProduct &&
              customizeComboProduct?.length > 0 &&
              customizeComboProduct.map((p) => (
                <CustomizedCombinationCard
                  id={p?._id}
                  product={p?.customizedComboId}
                  key={p?._id}
                  selectedCustomizedProduct={p?.customizedComboRectangle}
                  wishlistData={customizeComboProductWishlist}
                />
              ))}
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default Profile;
