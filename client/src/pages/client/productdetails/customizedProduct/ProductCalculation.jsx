import React, { useEffect } from "react";
import "./ProductCalculation.css";
import Tooltip from "../../../../utils/Tooltip/Tooltip";
import { AiFillInfoCircle } from "react-icons/ai";
import { CustomizedFinialAmount } from "../../../../utils/usefullFunction";
import { Button } from "@mui/material";

const ProductCalculation = ({
  product,
  setP_Height,
  setP_Width,
  P_Width,
  P_Height,
  setShowPrice,
  calculateTotalCustomizedProduct,
}) => {
  const {
    DefaultWidth = 0,
    MinWidth = 0,
    MaxWidth = 0,
    DefaultHeight = 0,
    MinHeight = 0,
    MaxHeight = 0,
  } = product;

  const calculateWidth = (e) => {
    let value = e.target.value;

    setP_Width(value);
  };
  const calculateHeight = (e) => {
    setP_Height(e.target.value);
  };

  // useEffect(() => {
  //   if (product) {
  //     let width = DefaultWidth || MinWidth || MaxWidth ? DefaultWidth : 0;
  //     let Height = DefaultHeight || MinHeight || MaxHeight ? DefaultHeight : 0;
  //     setP_Width(width);
  //     setP_Height(Height);
  //   }
  // }, [
  //   product,
  //   setP_Width,
  //   setP_Height,
  //   DefaultWidth,
  //   MinWidth,
  //   MaxWidth,
  //   DefaultHeight,
  //   MinHeight,
  //   MaxHeight,
  // ]);

  return (
    <div
      style={{ boxShadow: "none", border: "none" }}
      className="refercard ProductCalculation-card card  rounded-lg px-2.5 pt-3.5 pb-1.5 w-full mt-3"
    >
      <span className="close" onClick={() => setShowPrice(false)}>
        &times;
      </span>
      <br></br>
      <div className="Select-quantity-heading">
        <h6
          style={{
            textTransform: "uppercase",
            fontWeight: "600",
            color: "#000",
          }}
        >
          Select quantity
        </h6>
        <div className="Select-quantity-heading-img-icon align-items-center ">
          <Tooltip content={<SizeGide />} direction="left">
            <AiFillInfoCircle className="cursor-pointer " />
            &nbsp;
            <span className="cursor-pointer" style={{ color: "#000" }}>
              Size Guide
            </span>
          </Tooltip>
        </div>
      </div>
      <br></br>
      <div className="d-flex align-items-center gap-2 mt-2.5">
        {DefaultWidth || MinWidth || MaxWidth ? (
          <div className="minInput-width">
            <label htmlFor="size" style={{ color: "#000" }}>
              Width
            </label>
            <input
              type="number"
              min={MinWidth}
              max={MaxWidth}
              className="form-control"
              placeholder="Enter in Sq.ft"
              id="P_Width"
              value={P_Width}
              onChange={calculateWidth}
            />
          </div>
        ) : (
          <></>
        )}

        {DefaultHeight || MinHeight || MaxHeight ? (
          <div className="minInput-width">
            <label
              htmlFor="box"
              className="text-xs3 font-normal"
              style={{ color: "#000" }}
            >
              {DefaultWidth || DefaultWidth || DefaultWidth
                ? "Height"
                : "Length"}
            </label>
            <input
              type="number"
              min={MinHeight}
              max={MaxHeight}
              value={P_Height}
              id="box"
              className="form-control"
              placeholder="Enter no. of boxes"
              onChange={calculateHeight}
              step={1}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {DefaultWidth || MinWidth || MaxWidth ? (
        <>
          {P_Width > MaxWidth ? (
            <p type="button" style={{ color: "red" }}>{`*${
              DefaultHeight || MinHeight || MaxHeight ? "Width" : "Length"
            } should not we greater then ${MaxWidth}`}</p>
          ) : (
            <></>
          )}

          {P_Width < MinWidth ? (
            <p type="button" style={{ color: "red" }}>{`*${
              DefaultHeight || MinHeight || MaxHeight ? "Width" : "Length"
            } should not we less then ${MinWidth}`}</p>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      {DefaultHeight || MinHeight || MaxHeight ? (
        <>
          {P_Height > MaxHeight ? (
            <p
              type="button"
              style={{ color: "red" }}
            >{`*Height should not we greater then ${MaxHeight}`}</p>
          ) : (
            <></>
          )}

          {P_Height < MinHeight ? (
            <p
              type="button"
              style={{ color: "red" }}
            >{`*Height should not we less then ${MinHeight}`}</p>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <div className="CalculateNowDiv">
        <p style={{ color: "#000" }}> How much do I need?</p>

        <p style={{ color: "#000" }}>Calculate Now</p>
      </div>
      {/* <p className="text-white">Min Number of pieces to buy : 2000</p> */}
      <p style={{ fontWeight: "600", color: "#000", fontSize: "15px" }}>
        <span
          style={{
            fontSize: "15px",
            color: "#000",
            textTransform: "uppercase",
          }}
        >
          Total Coverage Area :{" "}
        </span>
        {`${P_Width * P_Height} Sq.ft`}
      </p>

      <p style={{ fontWeight: "600", color: "#000", fontSize: "15px" }}>
        <span
          style={{
            fontSize: "15px",
            color: "#000",
            textTransform: "uppercase",
          }}
        >
          Total Payable Amount :{" "}
        </span>{" "}
        ₹ &nbsp;
        <span className="text-lg" style={{ color: "#000" }}>
          {CustomizedFinialAmount(calculateTotalCustomizedProduct, product)}
        </span>
      </p>
    </div>
  );
};

const SizeGide = () => {
  return (
    <div className="p-2">
      <div className="d-flex gap-2 align-items-center">
        <p className="text-white">Size Guide</p>
        <AiFillInfoCircle />
      </div>
      <p className="text-white">1 Foot = 304.8 mm</p>
      <p className="text-white">1 Foot = 12 Inches</p>
      <p className="text-white">1 inch = 25.4 mm</p>
    </div>
  );
};
export default ProductCalculation;
