import React, { useEffect } from "react";
import "./ProductCalculation.css";
import Tooltip from "../../../../utils/Tooltip/Tooltip";
import { AiFillInfoCircle } from "react-icons/ai";
import { CustomizedFinialAmount } from "../../../../utils/usefullFunction";

const ProductCalculation = ({
  product,
  setP_Height,
  setP_Width,
  P_Width,
  P_Height,
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

  useEffect(() => {
    if (product) {
      let width = DefaultWidth || MinWidth || MaxWidth ? DefaultWidth : 0;
      let Height = DefaultHeight || MinHeight || MaxHeight ? DefaultHeight : 0;
      setP_Width(width);
      setP_Height(Height);
    }
  }, [
    product,
    setP_Width,
    setP_Height,
    DefaultWidth,
    MinWidth,
    MaxWidth,
    DefaultHeight,
    MinHeight,
    MaxHeight,
  ]);

  return (
    <div className="border refercard ProductCalculation-card card  rounded-lg px-2.5 pt-3.5 pb-1.5 w-full mt-3">
      <div className="Select-quantity-heading">
        <h5 className="text-white">Select quantity</h5>
        <div className="Select-quantity-heading-img-icon align-items-center ">
          <Tooltip content={<SizeGide />} direction="left">
            <AiFillInfoCircle className="cursor-pointer " />
            <span className="text-white cursor-pointer">Size Guide</span>
          </Tooltip>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 mt-2.5">
        {DefaultWidth || MinWidth || MaxWidth ? (
          <div className="minInput-width">
            <label htmlFor="size" className=" text-white">
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
            <label htmlFor="box" className="text-xs3 font-normal text-white">
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
            <p type="button" style={{ color: "#06ff40" }}>{`*${
              DefaultHeight || MinHeight || MaxHeight ? "Width" : "Length"
            } should not we greater then ${MaxWidth}`}</p>
          ) : (
            <></>
          )}

          {P_Width < MinWidth ? (
            <p type="button" style={{ color: "#06ff40" }}>{`*${
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
              style={{ color: "#06ff40" }}
            >{`*Height should not we greater then ${MaxHeight}`}</p>
          ) : (
            <></>
          )}

          {P_Height < MinHeight ? (
            <p
              type="button"
              style={{ color: "#06ff40" }}
            >{`*Height should not we less then ${MinHeight}`}</p>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}

      <div className="CalculateNowDiv">
        <p className="text-white"> How much do I need?</p>

        <h5 type="button" className="CalculateNow">
          Calculate Now
        </h5>
      </div>

      {/* <p className="text-white">Min Number of pieces to buy : 2000</p> */}
      <p className="text-white">
        {`Total Coverage Area : ${
          DefaultWidth || MinWidth || MaxWidth
            ? `${P_Width * P_Height} ${
                DefaultHeight || MinHeight || MaxHeight ? "Sq.ft" : "Width"
              }`
            : `${P_Width * P_Height} ${
                DefaultHeight || MinHeight || MaxHeight ? "Length" : ""
              }`
        }`}
      </p>

      <div className="mt-2">
        <p className="text-white">Total Payable Amount</p>
        <p className="text-white">
          ₹
          <span className="text-lg">
            {CustomizedFinialAmount(calculateTotalCustomizedProduct, product)}
          </span>
        </p>
      </div>
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
