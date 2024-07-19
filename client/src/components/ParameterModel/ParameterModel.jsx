import React from "react";
import { useDispatch } from "react-redux";
import selectedIcom from "../../assets/img/selectedIcon.png";
import { REACT_APP_URL } from "../../config";
import "./ParameterModal.css";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import {
  Backdrop,
  Modal,
  Fade,
  Card,
  CardContent,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
} from "@mui/material";

import { fetchParametersPositionImageDetailsBy } from "../../redux/slices/parameterSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "auto",
  maxHeight: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "10px 10px 20px 10px",
  borderRadius: "5px",
  overflow: "scroll",
};

const selectedAttStylle = {
  border: "3px solid green",
};

const ParameterModel = ({
  parameters,
  setOpen,
  open,
  selectedVarient,
  selectedVarientCombination,
  setCombination,
}) => {
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();

  const handleClick = (ids) => {
    dispatch(
      fetchParametersPositionImageDetailsBy({
        ...ids,
        positionId: selectedVarientCombination.positionId,
      })
    )
      .unwrap()
      .then((res) => {
        if (res.length > 0) {
          const fetchedCombinationData = res[0];
          console.log();
          setCombination((prevCombinations) =>
            prevCombinations.map((combination) =>
              combination?.attributeId?._id ===
              fetchedCombinationData?.attributeId?._id
                ? {
                    ...combination,
                    parameterId: fetchedCombinationData?.parameterId?._id,
                    combinations: res,
                  }
                : combination
            )
          );
          setOpen(false);
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during the asynchronous operation
        console.error(
          "Error during fetchParametersPositionImageDetailsBy:",
          error
        );
      });
  };

  let valuePrice = selectedVarient?.parameterId?.price;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      style={{ maxWidth: "95vw" }}
    >
      <Fade in={open}>
        <Card sx={style}>
          <CardContent>
            {/* Close Button */}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 40,
                top: 10,
                color: "inherit",
                zIndex: "100",
              }}
            >
              <CloseIcon />
            </IconButton>
            {/* <Typography
              cols={2}
              variant="h6"
              gutterBottom
              sx={{ mt: 1, color: "#f45656" }}
            >
              {parameters[0]?.attributeId?.Name}
            </Typography> */}
            <ImageList
              sx={{ width: "auto", maxHeight: "100vh", paddingBottom: "140px" }}
              cols={4}
            >
              {parameters?.map((item) => (
                <React.Fragment key={item?._id}>
                  <ImageListItem key="Subheader" cols={4}>
                    <ListSubheader component="div">
                      <center>
                        <div
                          style={{
                            backgroundColor: "#ddd",
                            padding: "5px 20px 5px 20px",
                            marginBottom: "10px",
                            borderRadius: "10px",
                            marginTop: "20px",
                          }}
                        >
                          <span
                            style={{
                              marginRight: "3px",
                              paddingRight: "3px",
                              fontSize: "18px",
                              fontWeight: "600",
                              textTransform: "uppercase",
                            }}
                          >
                            ATTRIBUTE CATEGORY :{" "}
                            <span style={{ color: "red" }}>
                              {item?.attributeCategoryName}
                            </span>
                          </span>
                          <span style={{ fontSize: "18px", fontWeight: "600" }}>
                            &nbsp; | &nbsp;
                          </span>
                          <span
                            style={{
                              marginRight: "3px",
                              paddingRight: "3px",
                              fontSize: "18px",
                              fontWeight: "600",
                              textTransform: "uppercase",
                            }}
                          >
                            ATTRIBUTE :{" "}
                            <span style={{ color: "red" }}>
                              {item?.attribute?.PrintName}
                            </span>
                          </span>
                        </div>
                      </center>
                    </ListSubheader>
                  </ImageListItem>
                  {item?.parameters?.map((parameter) => (
                    <ImageListItem
                      key={parameter?._id}
                      cols={1}
                      sx={{ cursor: "pointer" }}
                      style={
                        selectedVarient?.parameterId?._id === parameter?._id
                          ? selectedAttStylle
                          : undefined
                      }
                      onClick={() =>
                        handleClick({
                          attributeId: item?.attribute?._id,
                          parameterId: parameter?._id,
                        })
                      }
                    >
                      <img
                        srcSet={`${REACT_APP_URL}/images/parameter/${parameter?.profileImage}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`${REACT_APP_URL}/images/parameter/${parameter?.profileImage}?w=248&fit=crop&auto=format`}
                        alt={item?.title}
                        loading="lazy"
                      />
                      {selectedVarient?.parameterId?._id === parameter?._id && (
                        <img
                          src={selectedIcom}
                          alt="selected Icon"
                          style={{
                            position: "absolute",
                            width: "30px",
                            height: "30px",
                            bottom: "0%",
                            right: "0%",
                          }}
                        />
                      )}
                      <center>
                        <ImageListItemBar
                          title={
                            <span
                              style={{ fontSize: "18px", fontWeight: "600" }}
                            >
                              {parameter?.name}
                            </span>
                          }
                          subtitle={
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "red",
                              }}
                            >{`Rs. ${
                              Number(valuePrice) - Number(parameter.price) === 0
                                ? "Same Price"
                                : Number(valuePrice) - Number(parameter.price) >
                                  0
                                ? `-${Math.abs(
                                    Number(valuePrice) - Number(parameter.price)
                                  )}/ `
                                : `+${Math.abs(
                                    Number(valuePrice) - Number(parameter.price)
                                  )} /`
                            } ${
                              parameter?.UOMName === "Length"
                                ? "Running Feet"
                                : parameter?.UOMName
                            }`}</span>
                          }
                          position="below"
                        />
                      </center>
                    </ImageListItem>
                  ))}
                </React.Fragment>
              ))}
            </ImageList>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default ParameterModel;
