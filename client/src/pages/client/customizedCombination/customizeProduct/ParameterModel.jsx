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
              <ImageListItem key="Subheader" cols={4}>
                <ListSubheader component="div">
                  {parameters[0]?.attributeId?.Name}
                </ListSubheader>
              </ImageListItem>
              {parameters?.map((item) => (
                <ImageListItem
                  key={item?._id}
                  cols={1}
                  sx={{ cursor: "pointer" }}
                  style={
                    selectedVarient?.parameterId?._id === item?._id
                      ? selectedAttStylle
                      : undefined
                  }
                  onClick={() =>
                    handleClick({
                      attributeId: item?.attributeId?._id,
                      parameterId: item?._id,
                    })
                  }
                >
                  <img
                    srcSet={`${REACT_APP_URL}/images/parameter/${item?.profileImage}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${REACT_APP_URL}/images/parameter/${item?.profileImage}?w=248&fit=crop&auto=format`}
                    alt={item?.title}
                    loading="lazy"
                  />
                  {selectedVarient?.parameterId?._id === item?._id && (
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
                    title={item?.name}
                    subtitle={`${
                      Number(valuePrice) - Number(item.price) === 0
                        ? "Same"
                        : Number(valuePrice) - Number(item.price) > 0
                        ? `-${Math.abs(
                            Number(valuePrice) - Number(item.price)
                          )} Rs`
                        : `+${Math.abs(
                            Number(valuePrice) - Number(item.price)
                          )} Rs`
                    } Per/${item?.attributeId?.UOMId?.name}`}
                    // actionIcon={
                    //   <IconButton
                    //     sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                    //     aria-label={`info about ${item?.title}`}
                    //   >
                    //     {/* <InfoIcon /> */}
                    //   </IconButton>
                    // }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default ParameterModel;
