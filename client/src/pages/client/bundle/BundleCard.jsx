import React from "react";
import "./bundlecard.css";
import { Link } from "react-router-dom";
import { REACT_APP_URL } from "../../../config";

const BundleCard = ({ p }) => {
  return (
    <>
      <div className="container">
        <div className="card dark">
          <img
            loading="lazy"
            src={`${REACT_APP_URL}/images/productbundle/${p.bundleImage[0]}`}
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <div className="text-section">
              <h5 className="card-title">{p.BundleName}</h5>
              <p className="card-text">
                Some quick example text to build on the card's content.
              </p>
            </div>
            <div className="cta-section">
              <div>
                ₹{" "}
                {p.products.reduce((acc, item) => item.OriginalPrice + acc, 0)}
              </div>
              <Link to={`/bundle/${p._id}`}>Buy Now</Link>
              {/* <a href="#" className="btn btn-light">
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BundleCard;
