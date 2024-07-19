import React from "react";
import { useDispatch } from "react-redux";
import selectedIcom from "../../../../assets/img/selectedIcon.png";
import { REACT_APP_URL } from "../../../../config";

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

import { fetchParametersPositionImageDetailsBy } from "../../../../redux/slices/parameterSlice";

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
  overflow: "hidden",
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
          setCombination((prevCombinations) =>
            prevCombinations.map((combination) =>
              combination?.attributeId?._id ===
              fetchedCombinationData?.attributeId?._id
                ? { ...combination, combinations: res }
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
    >
      <Fade in={open}>
        <Card sx={style}>
          <CardContent>
            {/* <Typography
              cols={2}
              variant="h6"
              gutterBottom
              sx={{ mt: 1, color: "#f45656" }}
            >
              {parameters[0]?.attributeId?.Name}
            </Typography> */}
            <ImageList
              sx={{ width: "auto", maxHeight: "75vh", paddingBottom: "10px" }}
              cols={4}
            >
              {parameters?.map((item) => (
                <React.Fragment key={item?._id}>
                  <ImageListItem key="Subheader" cols={4}>
                    <ListSubheader component="div">
                      <span
                        style={{
                          borderRight: "2px solid gray",
                          marginRight: "3px",
                          paddingRight: "3px",
                        }}
                      >
                        Attributte Category : {item?.attributeCategoryName}
                      </span>
                      <span>Attributte : {item?.attribute?.PrintName}</span>
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
                      <ImageListItemBar
                        title={parameter?.name}
                        subtitle={`Rs ${
                          Number(valuePrice) - Number(parameter.price) === 0
                            ? "Same Price"
                            : Number(valuePrice) - Number(parameter.price) > 0
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
                        }`}
                        position="below"
                      />
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
