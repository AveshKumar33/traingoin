import React, { useCallback, useEffect, useState } from "react";
import {
  addToBundle,
  fetchProductBundleDetails,
  removeToBundle,
  resetBundle,
} from "../../../redux/slices/bundleSlice";
import { REACT_APP_URL } from "../../../config";

import Preloader from "../../../components/preloader/Preloader";
import { useDispatch, useSelector } from "react-redux";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import BundleCard from "./BundleCard";
import { useParams } from "react-router-dom";
// import ProductCard from "../../../components/productcard/ProductCard";
import Modal from "../../../components/modal/Modal";
import { CartItems } from "../../../components/cartSidebar/CartSidebar";
import { addTocart } from "../../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { toastError } from "../../../utils/reactToastify";

const BundleDetails = () => {
  const { id } = useParams();

  const { loading, productBundledetails, bundledata } = useSelector(
    (state) => state.productBundle
  );

  const dispatch = useDispatch();
  const [varient, setvarient] = useState([]);
  const [show, setshow] = useState(false);
  const [attribute, setattribute] = useState([]);
  const [product, setproduct] = useState();

  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/BundleDetails`
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

  useEffect(() => {
    dispatch(fetchProductBundleDetails(id));
  }, [dispatch]);

  const handleModal = (varient, productatttribute, p) => {
    setvarient(varient);
    setattribute(productatttribute);
    setproduct(p);
    setshow(true);
  };

  const handleClose = () => {
    setshow(false);
  };

  const deletecartItems = (item) => {
    // dispatch(removeTocart({ id }));
    dispatch(removeToBundle({ item }));
  };

  const handleBundleToCart = () => {
    productBundledetails.products.forEach((element) => {
      if (bundledata.length > 0) {
        bundledata.forEach((p) => {
          if (element._id === p.id) {
            dispatch(addTocart({ product: p }));
          } else {
            const product = {
              name: element.ProductName,
              quantity: 1,
              price: element.OriginalPrice,
              id: element._id,
              img: element.ProductImage[0],
            };
            dispatch(addTocart({ product: product }));
          }
        });
      } else {
        const product = {
          name: element.ProductName,
          quantity: 1,
          price: element.OriginalPrice,
          id: element._id,
          img: element.ProductImage[0],
        };
        dispatch(addTocart({ product: product }));
      }
    });

    toast(`Bunddle Added to Cart !`);
  };

  if (loading === "pending") {
    return <Preloader />;
  }

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
      </div>
      {/* Modal Creation */}

      <Modal handleClose={handleClose} show={show}>
        <div className="m-2">
          <SelectVarientSection
            attribute={attribute}
            varient={varient}
            product={product}
          />
        </div>
      </Modal>

      <h6>{productBundledetails.BundleName}</h6>

      <div className="container">
        <div className="row">
          <div className="col-md-8">
            {productBundledetails &&
              productBundledetails?.products?.map((p) => (
                <>
                  <div>
                    <img
                      loading="lazy"
                      src={`${REACT_APP_URL}/images/product/${p.ProductImage[0]}`}
                      alt=""
                      className="img-fluid"
                      style={{ height: "100px", width: "100px" }}
                    />
                    <h6>{p.ProductName}</h6>
                    <h6>{p.OriginalPrice}</h6>
                    {p.varient && p.varient.length > 0 && (
                      <button
                        onClick={() => handleModal(p.varient, p.attribute, p)}
                      >
                        Customize
                      </button>
                    )}
                  </div>
                </>
              ))}

            <button onClick={handleBundleToCart}>Add Bundle to Cart</button>
          </div>
          <div className="col-md-4">
            <h1>Customize Product</h1>

            {bundledata.length}

            {bundledata &&
              bundledata.length > 0 &&
              bundledata.map((p) => (
                <CartItems
                  key={p._id}
                  item={p}
                  deletecartItems={deletecartItems}
                />
              ))}
          </div>
        </div>
      </div>

      <MainFooter />
    </>
  );
};

const SelectVarientSection = ({ attribute, varient, product }) => {
  const { bundledata } = useSelector((state) => state.productBundle);

  const dispatch = useDispatch();

  const [varientset, setvarientset] = useState({});

  const [varientproductdetails, setvarientproductdetails] = useState({});

  const [quantity, setquantity] = useState(1);

  useEffect(() => {
    if (attribute) {
      let newobj = {};

      const attributeItemGroup = attribute.map((p) => {
        newobj[p.Name] = p.OptionsValue[0].Name;
      });

      setvarientset(newobj);
      setvarientproductdetails(findObjectFromArray(newobj, varient));
    }
  }, [attribute]);

  function findObjectFromArray(searchObj, arr) {
    // const result = [];
    for (let i = 0; i < arr.length; i++) {
      const currentObj = arr[i];
      let isMatch = true;

      for (const key of Object.keys(searchObj)) {
        if (searchObj[key] !== currentObj[key]) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        return currentObj;
      }
    }

    // return result;
  }

  const handleVarient = (attributeitemName, attributeItemGroup) => {
    setvarientset({
      ...varientset,
      [attributeitemName]: attributeItemGroup,
    });

    let newuseStateobject = varientset;
    newuseStateobject[attributeitemName] = attributeItemGroup;

    const result = findObjectFromArray(newuseStateobject, varient);
    setvarientproductdetails(result);
  };

  const handlequantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setquantity(quantity - 1);
    } else {
      setquantity(quantity + 1);
    }
  };

  const handleAddToBundle = (name, price, id, img) => {
    // toast("")

    let newobj = {};

    if (varientproductdetails) {
      newobj = { ...varientset };
    }

    // alert(JSON.stringify(newobj));

    if (varientproductdetails) {
      newobj["price"] = varientproductdetails.OriginalPrice * quantity;
    }

    // alert(JSON.stringify(newobj))
    const product = {
      name,
      quantity,
      id,
      img:
        varientproductdetails.images.length > 0
          ? varientproductdetails.images[0]
          : img,

      //Product details with category
      ...newobj,
    };
    dispatch(addToBundle({ product: product }));

    // setmanagecart(true);
  };

  return (
    <>
      {attribute &&
        attribute.map((p) => (
          <>
            <div key={p._id}>
              <span className="m-3 ">
                <b>{p.PrintName}</b>
              </span>
              {p.OptionsValue.map((option) => (
                <>
                  <span
                    className="me-2"
                    key={option._id}
                    style={{
                      backgroundColor:
                        varientset[p.Name] === option.Name ? "red" : "blue",
                      margin: "3px",
                      padding: "5px",
                    }}
                    onClick={() => handleVarient(p.Name, option.Name)}
                  >
                    {option.Name}
                  </span>
                  <span className="me-2" key={option._id}>
                    <img
                      loading="lazy"
                      src={`${REACT_APP_URL}/images/attribute/${option.Photo}`}
                      alt="img25"
                      style={{ height: "20px", width: "20px" }}
                    />
                  </span>
                </>
              ))}
            </div>
          </>
        ))}
      {/* Select Quantity */}
      <div className="row" style={{ marginTop: 40 }}>
        <div className="col-lg-4 Section3Style">
          <div className="input-group ProductDetailAddtocartStyle">
            <span className="input-group-btn">
              <button
                type="button"
                className="quantity-left-minus btn btn-default btn-number"
                style={{ backgroundColor: "#475B52" }}
                data-field=""
                onClick={() => {
                  handlequantity("dec");
                }}
              >
                <span className="fa fa-minus" style={{ color: "#fff" }} />
              </button>
            </span>
            &nbsp;
            <input
              style={{ textAlign: "center" }}
              type="text"
              id="quantity"
              name="quantity"
              className="form-control input-number"
              value={quantity}
              min={1}
              max={100}
            />
            &nbsp;
            <span className="input-group-btn">
              <button
                type="button"
                className="quantity-right-plus btn btn-default btn-number"
                style={{ backgroundColor: "#475B52" }}
                data-field=""
                onClick={() => {
                  handlequantity("");
                }}
              >
                <span className="fa fa-plus" style={{ color: "#fff" }} />
              </button>
            </span>
          </div>
        </div>
      </div>
      <button
        className="my-3 btn btn-primary"
        onClick={() =>
          handleAddToBundle(
            product?.ProductName,
            product?.OriginalPrice,
            product?._id,

            product?.ProductImage[0]
          )
        }
      >
        Add To Bundle
      </button>{" "}
      <br />
    </>
  );
};

const Bundledata = ({ item }) => {
  return (
    <>
      <h1>{}</h1>
    </>
  );
};

export default BundleDetails;
