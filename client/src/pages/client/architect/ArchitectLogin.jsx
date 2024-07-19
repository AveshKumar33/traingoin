import {
  Button,
  Card,
  TextField,
  Typography,
  Grid,
  FormControl,
} from "@mui/material";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import HeaderImage from "../../../assets/Image/Slider11.jpg";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Architectlogin } from "../../../redux/slices/architectSlice";
import { toastError } from "../../../utils/reactToastify";
import { useNavigate } from "react-router-dom";
import { axiosInstance, REACT_APP_URL } from "../../../config";

const ArchitectLogin = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [headerImage, setHeaderImage] = useState({});
  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/header-image/title/ArchitectLogin`
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

  const onSubmit = async (formdata) => {
    try {
      await dispatch(Architectlogin(formdata)).unwrap();
      navigate("/architect/dashboard");
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
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

      <div
        style={{ display: "flex", justifyContent: "center " }}
        className="my-5"
      >
        <Card
          sx={{ width: "30%" }}
          style={{ margin: "", boxShadow: "2px 1px 5px #475B52" }}
        >
          <Typography variant="h6" className="my-2">
            Architect Login
          </Typography>

          <Grid item xs={12} md={12} sm={12} p={3}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email"
                name="Email"
                variant="outlined"
                sx={{ width: "100%" }}
                error={errors.Email ? true : false}
                {...register("Email", {
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              />

              <TextField
                margin="normal"
                name="Password"
                label="Password"
                variant="outlined"
                sx={{ width: "100%" }}
                {...register("Password", { required: true })}
                error={errors.Password ? true : false}
                // helperText={errors.Email && <p >Password is Required</p>}
              />

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#475B52",
                  "&:hover": {
                    backgroundColor: "#FFA726 !important",
                  },
                }}
                type="submit"
              >
                Login
              </Button>
            </form>
          </Grid>
        </Card>
      </div>

      <MainFooter />
    </div>
  );
};

export default ArchitectLogin;
