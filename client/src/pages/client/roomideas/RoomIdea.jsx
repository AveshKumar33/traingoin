import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import FilterStickySidebar from "../../../components/stickysidebar/FilterStickySidebar";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCollectionFilters } from "../../../redux/slices/newCollectionFilterSlice";
import Preloader from "../../../components/preloader/Preloader";
import "./RoomIdea.css";
import { REACT_APP_URL } from "../../../config";
import { searchCollectionFilter } from "../../../redux/slices/CollectionFilterSlice";
import UserFilterTag from "./UserFilterTag";
import DotProductCardRoomIdea from "./DotProductCardRoomIdea";
import DotCustomizeProductCardRoomIdea from "./DotCustomizeProductCardRoomIdea";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";
import { fetchWishlistForProductList } from "../../../redux/slices/newWishlistSlice";
import {
  isCustomizedDotProductInWishlist,
  isSingleDotProductInWishlist,
} from "../../../utils/isInWishlist/isSingleProduct";

const selec = [];

const RoomIdea = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  // const location = useLocation();

  const { CollectionFilters } = useSelector(
    (state) => state.newCollectionFilter
  );
  const {
    filterProductsByCollectionFilter,
    loading: dotProductLoading,
  } = useSelector((state) => state.CollectionFilter);

  const { whishlistdata } = useSelector((state) => state.whishlist);

  const { wishlistProducts } = useSelector((state) => state.wishlist);

  const { userdetails } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [tagsValue, setTagsValue] = useState([]);
  const [Tags, setTags] = useState({});
  const [mounted, setMounted] = useState(false);
  const [FiltersData, setFiltersData] = useState();
  const [searchFilterData, setSearchFilterData] = useState([]);
  const [clearChildState, setClearChildState] = useState(false);
  const [headerImage, setHeaderImage] = useState({});
  const [wishlistData, setWishlistData] = useState({
    singleDotProducts: [],
    customizedDotProducts: [],
  });

  useEffect(() => {
    if (
      dotProductLoading === "fulfilled" &&
      filterProductsByCollectionFilter?.length > 0
    ) {
      setProducts((prevState) => [
        ...prevState,
        ...filterProductsByCollectionFilter,
      ]);
    }
  }, [dotProductLoading, filterProductsByCollectionFilter]);

  /**fetch new collection filter  */
  useEffect(() => {
    dispatch(fetchCollectionFilters());
  }, [dispatch]);

  const handleInfiniteScroll = useCallback(async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 280 >=
        document.documentElement.scrollHeight
      ) {
        setPage(page + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    if (dotProductLoading === "fulfilled" && CollectionFilters?.length > 0) {
      setFiltersData(CollectionFilters);
    }
  }, [dotProductLoading, CollectionFilters]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMounted(true); // Set mounted to true after initial render
  }, []);

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/Buy From Elevation`
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
    if (userdetails && Object.keys(userdetails).length > 0) {
      dispatch(fetchWishlistForProductList());
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (
      wishlistProducts &&
      userdetails &&
      Object.keys(userdetails).length > 0
    ) {
      const singleDotProducts = [];
      const customizedDotProducts = [];

      for (let product of wishlistProducts) {
        if (product?.singleDotProductId) {
          singleDotProducts.push(product);
        } else if (product?.customizeDotProductId) {
          customizedDotProducts.push(product);
        }
      }
      setWishlistData({ singleDotProducts, customizedDotProducts });
    } else if (
      whishlistdata?.length > 0 &&
      Object.keys(userdetails).length === 0
    ) {
      const singleDotProducts = [];
      const customizedDotProducts = [];

      for (let product of whishlistdata) {
        if (product?.singleDotProductId) {
          singleDotProducts.push(product);
        } else if (product?.customizedDotProductId) {
          customizedDotProducts.push(product);
        }
      }
      setWishlistData({ singleDotProducts, customizedDotProducts });
    }
  }, [wishlistProducts, userdetails, whishlistdata]);

  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  // fetch all products
  useEffect(() => {
    const fetchProd = async () => {
      try {
        await dispatch(
          searchCollectionFilter({
            Tags: searchFilterData,
            limit: 5,
            page: page,
          })
        ).unwrap();
      } catch (error) {
        console.log(error);
      }
    };
    if (mounted) {
      fetchProd();
    }
  }, [dispatch, searchFilterData, page, mounted]);

  // useEffect(() => {
  //   let arr = [];
  //   if (Object.keys(Tags).length > 0) {
  //     const tagArrays = Object.values(Tags);
  //     arr = tagArrays.flat();
  //     // arr.forEach((id, index) => {
  //     //   queryParams.append('objectId', id);
  //     // });

  //     // Navigate to the new URL with the updated query parameters
  //     // navigate({ search: queryParams.toString() });
  //     // setSearchFilterData([...arr]);
  //   } else {
  //     // setSearchFilterData([]);
  //     // setPage(1)
  //   }
  // }, [Tags, navigate]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);

    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [handleInfiniteScroll]);

  const AddTagData = (key, value) => {
    // for (const [key, value] of Object.entries(filters)) {
    //   queryParams.set(key, value);
    // }
    //  navigate({ search: queryParams.toString() });
    if (value.length > 0) {
      const arr = value.map((data) => data.value);
      setTags((pre) => {
        return {
          ...pre,
          [key]: arr,
        };
      });
    } else if (value.length === 0) {
      const tag = Tags;
      delete tag[key];
      setTags({ ...tag });
    }
    // setChange((pre) => `${pre}` + "A");
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    const tagArrays = Object.values(Tags);
    const arr = tagArrays.flat();

    if (arr?.length > 0) {
      arr.forEach((id) => {
        queryParams.append("objectId", id);
      });

      navigate({ search: queryParams.toString() });
      setPage(1);
      setProducts([]);
      setSearchFilterData([...arr]);
    }
  };

  const clearSearch = () => {
    if (searchFilterData?.length !== 0) {
      setClearChildState(true);
      setPage(1);
      setProducts([]);
      setSearchFilterData([]);
      setTags({});
      setTimeout(() => {
        setClearChildState(false);
      }, 0);
    }
  };

  // useEffect(() => {
  //   const queryParams = new URLSearchParams(window.location.search);

  //   // Get all the values for the 'objectId' parameter
  //   const objectIdValues = queryParams.getAll("objectId");

  // }, [location.search]);

  return (
    <>
      {FiltersData && FiltersData.length > 0 && (
        <FilterStickySidebar
          FiltersData={FiltersData}
          AddTagData={AddTagData}
          tagsValue={tagsValue}
          setTagsValue={setTagsValue}
          setProducts={setProducts}
          setPage={setPage}
          selec={selec}
          clearChildState={clearChildState}
          setSearchFilterData={setSearchFilterData}
          setClearChildState={setClearChildState}
          Tags={Tags}
          searchFilterData={searchFilterData}
          setTags={setTags}
        />
      )}
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
        ></div>
      <div className="row RoomIdeaMarginTop">
        <div className="col-lg-12">
          {FiltersData &&
            FiltersData.length > 0 &&
            FiltersData.map((ele, index) => (
              <div
                className="col-lg-3 FilterStyle"
                key={index}
                style={{ float: "left" }}
              >
                <UserFilterTag
                  data={ele}
                  AddTagData={AddTagData}
                  tagsValue={tagsValue}
                  setTagsValue={setTagsValue}
                  setProducts={setProducts}
                  setPage={setPage}
                  selec={selec}
                  clearChildState={clearChildState}
                />
              </div>
            ))}
          <div
            className="col-lg-3"
            style={{ float: "left", paddingTop: "28px" }}
          >
            <button
              className="btn btn-primary m-1"
              type="button"
              onClick={handleSearch}
              style={{ backgroundColor: "#475B52", border: "none" }}
            >
              Search
            </button>
            <button
              className="btn btn-warning m-1"
              type="button"
              onClick={clearSearch}
              style={{ border: "none" }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <br></br>
      {/* <div className="col-lg-12"> */}
      <div className="row" style={{ marginBottom: "10px" }}>
        {dotProductLoading === "test" ? (
          <Preloader />
        ) : (
          // <div className="row px-2">
          <React.Fragment>
            {products &&
              products?.length > 0 &&
              products?.map((p, index) =>
                p?.type === "singleDotProduct" ? (
                  <div
                    key={index}
                    className="col-lg-6"
                    style={{ float: "left" }}
                  >
                    <DotProductCardRoomIdea
                      key={p._id}
                      dotproduct={p}
                      wishlistData={wishlistData?.singleDotProducts || []}
                      isProductInWishlist={isSingleDotProductInWishlist}
                      isWishlist={false}
                    />
                  </div>
                ) : (
                  <div
                    className="col-lg-6"
                    style={{ float: "left" }}
                    key={index}
                  >
                    <DotCustomizeProductCardRoomIdea
                      key={p._id}
                      dotproduct={p}
                      wishlistData={wishlistData?.customizedDotProducts || []}
                      isProductInWishlist={isCustomizedDotProductInWishlist}
                      isWishlist={false}
                    />
                  </div>
                )
              )}
            {/* </div> */}
          </React.Fragment>
        )}
        {/* </div> */}
      </div>

      <MainFooter />
    </>
  );
};
export const DotProductCard = ({ dotproduct, index, total, removeProduct }) => {
  return (
    <div className={index === 0 ? "carousel-item active" : "carousel-item"}>
      <Link to={`/room-idea/${dotproduct._id}`}>
        <div
          style={{
            borderRadius: "5%",
            boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
          }}
        >
          <div
            className="col-lg-6"
            style={{
              float: "left",
              height: "60vh",
              padding: "5px 0px 40px 40px",
              textAlign: "justify",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="col-lg-9" style={{ float: "left" }}>
                <p style={{ fontSize: "18px", marginRight: "10px" }}>{`${
                  index + 1
                }/${total}`}</p>
              </div>
              <div className="col-lg-3" style={{ float: "left" }}>
                <button
                  type="button"
                  className="btn btn-transparent mr-2"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide="prev"
                  style={{ marginTop: "-12px" }}
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                    style={{ height: "1rem", width: "1rem" }}
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  type="button"
                  className="btn btn-transparent"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide="next"
                  style={{ marginTop: "-12px" }}
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                    style={{ height: "1rem", width: "1rem" }}
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <br />
            <h4
              style={{
                color: "#475B52",
                letterSpacing: "1px",
                fontWeight: "600",
                textTransform: "uppercase",
                fontSize: "21px",
              }}
            >
              {dotproduct?.name}
            </h4>
            {/* <br></br> */}
            <p
              style={{ fontSize: "16px", color: "#000", letterSpacing: "1px" }}
            >
              {dotproduct?.Description}
            </p>
          </div>
          <div
            className="col-lg-6 ImageContainer"
            style={{ float: "left", padding: "0px 0px 0px 50px" }}
          >
            <img
              loading="lazy"
              src={`${REACT_APP_URL}/images/dotimage/${dotproduct?.dotProductImageIds[0]?.image}`}
              style={{
                width: "100%",
                maxHeight: "80vh",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
              }}
              alt={dotproduct.name}
            />
            {dotproduct?.dots?.map((p, i) => (
              <>
                <div
                  className="Dot fa fa-circle text-danger-glow blink"
                  key={p._id}
                  style={{ left: `${p.positionX}%`, top: `${p.positionY}%` }}
                ></div>
                <span
                  className="blink"
                  style={{
                    left: `${p.positionX + 4}%`,
                    top: `${p.positionY + 1}%`,
                    position: "absolute",
                    backgroundColor: "#3e6554",
                    padding: "2px 10px 2px 10px",
                    borderRadius: "3px",
                    border: "1px solid #fff",
                    textDecoration: "none",
                  }}
                >
                  <Link to={`/product/${p?.productId?.Urlhandle}`}>
                    <p
                      style={{
                        color: "#fff",
                        marginBottom: "0",
                        borderBottom: "none",
                      }}
                    >
                      {p?.productId?.ProductName.slice(0, 10)}
                    </p>
                  </Link>
                </span>
              </>
            ))}
          </div>
        </div>
        <br />
      </Link>
    </div>
  );
};

export const DotProductcard = ({ dotproduct, removeProduct }) => {
  return (
    <>
      <div className="col-md-6 ">
        <Link to={`/room-idea/${dotproduct._id}`}>
          <div style={{}}>
            <div
              className="ImageContainer"
              style={{ position: "relative", display: "inline-block" }}
            >
              <img
                loading="lazy"
                src={`${REACT_APP_URL}/images/dotimage/${dotproduct.ProductImage}`}
                className="card-img-top RoomIdeaImageStyle"
                alt={dotproduct.name}
              />

              {dotproduct.dots.map((p, i) => {
                return (
                  <>
                    <div
                      className="Dot fa fa-circle text-danger-glow blink"
                      key={p._id}
                      style={{
                        left: `${p.positionX}%`,
                        top: `${p.positionY}%`,
                      }}
                    ></div>
                    <span
                      className="blink"
                      style={{
                        left: `${p.positionX + 4}%`,
                        top: `${p.positionY + 1}%`,
                        position: "absolute",
                        backgroundColor: "#3e6554",
                        padding: "2px 10px 2px 10px",
                        borderRadius: "3px",
                        border: "1px solid #fff",
                      }}
                    >
                      <Link to={`/product/${p?.productId?.Urlhandle}`}>
                        <p style={{ color: "#fff" }}>
                          {p?.productId?.ProductName.slice(0, 10)}
                        </p>
                      </Link>
                    </span>
                  </>
                );
              })}
            </div>

            <Link to={`/room-idea/${dotproduct._id}`}>
              <p className="create-Rating-button cursor-pointer">
                {" "}
                {dotproduct.name}
              </p>
            </Link>

            {removeProduct && (
              <>
                <button
                  onClick={() => removeProduct(dotproduct._id)}
                  className="btn btn-primary"
                >
                  Remove Product
                </button>
              </>
            )}
          </div>
          <br></br>
        </Link>
      </div>
    </>
  );
};

export default RoomIdea;
