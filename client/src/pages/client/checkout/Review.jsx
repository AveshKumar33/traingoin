import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import Modal from "../../../components/modal/Modal";
import CouponContent from "./CouponContent";

import { featchAvailableCoupons } from "../../../redux/slices/couponSlice";

// const addresses = ["1 MUI Drive", "Reactville", "Anytown", "99999", "USA"];
// const payments = [
//   { name: "Card type:", detail: "Visa" },
//   { name: "Card holder:", detail: "Mr. John Smith" },
//   { name: "Card number:", detail: "xxxx-xxxx-xxxx-1234" },
//   { name: "Expiry date:", detail: "04/2024" },
// ];

export default function Review({ products, price, formData, paymentType }) {
  const dispatch = useDispatch();

  const { loading: couponLoading, availableCoupons } = useSelector(
    (state) => state.coupons
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleApplyCoupons = () => {
    if (!coupons.length) {
      dispatch(featchAvailableCoupons());
    }else{
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (
      couponLoading === "fulfilled" &&
      availableCoupons &&
      availableCoupons?.length
    ) {
      setCoupons(availableCoupons);
      setModalOpen(true);
    }
  }, [couponLoading, availableCoupons]);

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <Box>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="" secondary="" />
            <Typography
              variant="body2"
              style={{ cursor: "pointer" }}
              onClick={handleApplyCoupons}
            >
              Apply Coupons
            </Typography>
          </ListItem>
          <Modal
            show={isModalOpen}
            handleClose={handleClose}
            width="50%"
            height="auto"
            left="50%"
          >
            <CouponContent coupons={coupons} price={price} />
          </Modal>
        </Box>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText
            primary="Products"
            secondary={`${products?.length} selected`}
          />
          <Typography variant="body2">₹{price}</Typography>
        </ListItem>
        {/* <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography variant="body2">$9.99</Typography>
        </ListItem> */}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ₹{price}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          <Typography
            gutterBottom
          >{`${formData?.firstName} ${formData?.lastName}`}</Typography>
          <Typography color="text.secondary" gutterBottom>
            {formData?.addressLine1} {formData?.addressLine2}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          <Grid container>
            {/* {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: "100%", mb: 1 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {payment.name}
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))} */}
            <Typography variant="body1" color="text.secondary">
              {paymentType}
            </Typography>
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}
