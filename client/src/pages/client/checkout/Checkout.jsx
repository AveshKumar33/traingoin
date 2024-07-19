import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../../assets/img/RALINGOBlack.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import "./checkout.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import AddressForm from "./AddressForm";
import getCheckoutTheme from "./getCheckoutTheme";
import Info from "./Info";
import InfoMobile from "./InfoMobile";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
// import ToggleColorMode from "./ToggleColorMode";

import Preloader from "../../../components/preloader/Preloader";

import SnackbarMessage from "../../../utils/snakbar/SnackbarMessage";

import { Slide, Fade } from "@mui/material";

import { createOrder } from "../../../redux/slices/orderSlice";

// import { axiosInstance } from "../../../config";

import { resetCart } from "../../../redux/slices/cartSlice";
import { axiosInstance } from "../../../config";

function SlideTransition(props) {
  return (
    <Slide {...props} direction="up" vertical="bottom" horizontal="center" />
  );
}

const steps = ["Shipping address", "Payment details", "Review your order"];

const validateForm = (data) => {
  const requiredFields = [
    "firstName",
    "lastName",
    "addressLine1",
    "city",
    "state",
    "pinCode",
    "phoneNumber",
    "country",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return false; // Return false if any required field is empty
    }
  }

  return true; // All required fields are filled
};

export default function Checkout() {
  // const [mode, setMode] = React.useState("light");
  const checkoutTheme = createTheme(getCheckoutTheme("light"));
  const [activeStep, setActiveStep] = React.useState(2);
  const [paymentType, setPaymentType] = React.useState("payLater");
  const { createdOrder, loading } = useSelector((state) => state.orders);
  const { userdetails } = useSelector((state) => state.auth);
  const { checkoutItem, productPrice } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    country: "",
  });

  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
    type: "",
    message: "",
  });

  useEffect(() => {}, [dispatch]);

  // const toggleColorMode = () => {
  //   setMode((prev) => (prev === "dark" ? "light" : "dark"));
  // };

  let totalPrice = 0;

  if (productPrice && Object.keys(productPrice).length > 0) {
    for (let key in productPrice) {
      totalPrice += productPrice[key];
    }
  }
  async function emptyUserCart(userId) {
    try {
      await axiosInstance.delete(`/api/cart/products/${userId}`);
    } catch (error) {
      console.log("error", error);
    }
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            setFormData={setFormData}
            formData={formData}
            setError={setError}
          />
        );
      case 1:
        return (
          <PaymentForm
            setPaymentType={setPaymentType}
            paymentType={paymentType}
          />
        );
      case 2:
        return (
          <Review
            products={checkoutItem}
            price={totalPrice}
            formData={formData}
            paymentType={paymentType}
          />
        );
      default:
        throw new Error("Unknown step");
    }
  }

  const handleNext = async () => {
    try {
      let hasErrors = false;

      for (const formerror in error) {
        if (error[formerror] !== "") {
          hasErrors = true;
        }
      }

      if (!hasErrors && validateForm(formData)) {
        setActiveStep(activeStep + 1);
      } else {
        setState({
          open: true,
          Transition: SlideTransition,
          type: "error",
          message: "Please enter you valid details!",
        });
      }

      if (activeStep === steps.length - 1) {
        dispatch(
          createOrder({
            ...formData,
            amount: totalPrice,
            userDetails: userdetails?._id,
            productPrice,
          })
        );
        dispatch(resetCart());
        /** all cart item wiil be delete of a perticular user */
        await emptyUserCart(userdetails?._id);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={checkoutTheme}>
      <SnackbarMessage setState={setState} state={state} />
      {/* <CssBaseline /> */}
      <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              height: 50,
            }}
          >
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              component="a"
              href="/cart"
              sx={{ ml: "-8px" }}
              style={{ color: "#475B52" }}
            >
              Back to Cart
            </Button>
            <Link to="/">
              <img
                src={logo}
                alt="_logo"
                style={{ height: "9vh", marginLeft: "40px" }}
                loading="lazy"
              />
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Info
              totalPrice={`₹${totalPrice}`}
              products={checkoutItem}
              productPrice={productPrice}
            />
          </Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                component="a"
                href="/cart"
                sx={{ alignSelf: "start" }}
                style={{ color: "#475B52" }}
              >
                Back to Cart
              </Button>
              <Link to="/">
                <img
                  src={logo}
                  alt="_logo"
                  style={{ height: "7vh", marginLeft: "20px" }}
                  loading="lazy"
                />
              </Link>
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
                height: 50,
              }}
            >
              {/* <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} /> */}
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: "100%",
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-of-type": { pl: 0 },
                      ":last-child": { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                ":last-child": { pb: 2 },
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">{`₹${totalPrice}`}</Typography>
              </div>
              <InfoMobile
                totalPrice={`₹${totalPrice}`}
                products={checkoutItem}
                productPrice={productPrice}
              />
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ":first-of-type": { pl: 0 },
                    ":last-child": { pr: 0 },
                    "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{
                      ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length ? (
              <>
                {loading === "pending" ? (
                  <Preloader />
                ) : (
                  <Stack spacing={2} useFlexGap>
                    <center>
                      <Typography variant="h1" style={{ fontSize: "200px" }}>
                        📦
                      </Typography>
                      <br></br>
                      <Typography variant="h5">
                        Thank you for your order!
                      </Typography>
                      <br></br>
                      <Typography variant="body1" color="text.secondary">
                        Your order number is
                        <strong>&nbsp;#{createdOrder?.orderId}</strong>.
                      </Typography>
                      <br></br>
                      <Button
                        variant="contained"
                        href="/orders"
                        sx={{
                          alignSelf: "start",
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        Go to My Orders
                      </Button>
                    </center>
                  </Stack>
                )}
              </>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "60px",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: "flex", sm: "none" },
                      }}
                      style={{
                        backgroundColor: "#475B52 !important",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    sx={{
                      width: { xs: "100%", sm: "fit-content" },
                    }}
                  >
                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
