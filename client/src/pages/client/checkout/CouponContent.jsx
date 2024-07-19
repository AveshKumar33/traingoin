import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./CouponContent.css";

const CouponContent = ({ coupons, price }) => {
  const [calDiscount, setCalDiscount] = useState(0);
  const calculateFlat = (couponAmmount, minAmmount) => {
    if (minAmmount >= couponAmmount) {
      const total = price - couponAmmount;
      const finalDiscount = Math.floor(total);
      setCalDiscount(finalDiscount);
    }
  };
  const calculatePercentage = (percentage, maxDiscountAmmount) => {
    const discountAmmount = Math.floor((price * percentage) / 100);
    const finalDiscount = Math.min(discountAmmount, maxDiscountAmmount);

    const total = price - finalDiscount;
    setCalDiscount(total);
  };

  return (
    <>
      <div className="container" style={{ padding: "30px" }}>
        <p
          style={{
            textAlign: "center",
            fontSize: "20px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Available Coupons
        </p>
        <table className="table-striped">
          <tbody>
            {coupons &&
              coupons.length > 0 &&
              coupons.map((item, index) => (
                <tr>
                  <td item xs={9}>
                    {item.CouponType === "Flat" ? (
                      <Typography variant="body1">
                        {`Flat ₹ ${
                          item.CouponAmount
                        }  discount on minimum purchase ₹ ${
                          item.Min_Order_value_in_Flat
                        } valid upto ${item.ExpireDate.slice(0, 10)}`}
                      </Typography>
                    ) : (
                      <Typography variant="body1">
                        {`Upto ${item.CouponPercentage} % discount,max upto ₹ ${
                          item.MaxDiscount
                        } valid upto ${item.ExpireDate.slice(0, 10)}`}
                      </Typography>
                    )}
                  </td>
                  <td item xs={3}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#fff",
                        cursor: "pointer",
                        backgroundColor: "#475B52",
                        padding: "5px 10px 5px 10px",
                        borderRadius: "5px",
                        zoom: "80%",
                      }}
                      onClick={() => {
                        item.CouponType === "Flat"
                          ? calculateFlat(
                              item.CouponAmount,
                              item.Min_Order_value_in_Flat
                            )
                          : calculatePercentage(
                              item.CouponPercentage,
                              item.MaxDiscount
                            );
                      }}
                    >
                      Apply
                    </Typography>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* <Box sx={{ marginTop: 2 }}>
      {coupons &&
        coupons.length > 0 &&
        coupons.map((item, index) => (
          <Grid
            container
            key={index}
            spacing={2}
            alignItems="center"
            sx={{
              padding: 2,
            }}
          >
            <Grid item xs={9}>
              {item.CouponType === "Flat" ? (
                <Typography variant="body1">
                  {`Flat ₹ ${
                    item.CouponAmount
                  }  discount on minimum purchase ₹ ${
                    item.Min_Order_value_in_Flat
                  } valid upto ${item.ExpireDate.slice(0, 10)}`}
                </Typography>
              ) : (
                <Typography variant="body1">
                  {`Upto ${item.CouponPercentage} % discount,max upto ₹ ${
                    item.MaxDiscount
                  } valid upto ${item.ExpireDate.slice(0, 10)}`}
                </Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography
                variant="body2"
                sx={{ color: "red", cursor: "pointer" }}
                onClick={() => {
                  item.CouponType === "Flat"
                    ? calculateFlat(
                        item.CouponAmount,
                        item.Min_Order_value_in_Flat
                      )
                    : calculatePercentage(
                        item.CouponPercentage,
                        item.MaxDiscount
                      );
                }}
              >
                Apply
              </Typography>
            </Grid>
          </Grid>
        ))}
    </Box> */}
    </>
  );
};

export default CouponContent;
