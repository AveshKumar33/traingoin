import React from "react";
import "./blogcard.css";
import { REACT_APP_URL } from "../../../config";
import { Link } from "react-router-dom";
import { colors } from "@mui/material";

const Blogcard = ({ blog }) => {
  return (
    <>
      <div
        className="col-lg-6 d-flex justify-content-end"
        style={{ paddingRight: "2px", marginBottom: "20px" }}
        key={blog._id}
      >
        <div
          className="col-lg-11 custom-col1 completedprojectsheading1 blogcarddtyle"
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.5)), url(${`${REACT_APP_URL}/images/blog/${blog?.FeaturedImage}`})`,
            borderRadius: "10px",
            backgroundPosition:"center",
            backgroundSize:"cover"
          }}
        >
          <h4 style={{ textAlign: "center" }}>
            {blog?.heading}
            <br></br>
            <br></br>
            <p
              style={{
                fontSize: "18px",
                letterSpacing: "1px",
                textAlign: "justify",
              }}
            >
              <span
                style={{
                  textAlign: "justify !important",
                  fontSize: "13.7px",
                  fontWeight: "100",
                  textTransform: "capitalize",
                  color:"#fff !important",
                }}
                dangerouslySetInnerHTML={{
                  __html: (blog?.content).slice(0, 200).trim(),
                }}
                className="productdescription"
              />
            </p>
          
            <Link to={`/single-blog/${blog?._id}`} style={{zoom:"80%"}}>
              <button
                style={{
                  padding: "8px 20px 8px 20px",
                  backgroundColor: "#fff",
                  color: "#475B52",
                  borderRadius: "5px",
                  right: "0",
                  textTransform: "capitalize",
                  border: "none",
                }}
              >
                Read More...
              </button>
            </Link>
          </h4>
        </div>
      </div>
    </>
  );
};

export default Blogcard;
