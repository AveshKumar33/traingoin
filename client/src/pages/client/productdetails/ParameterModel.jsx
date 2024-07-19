import React from "react";
import { REACT_APP_URL } from "../../../config";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "80vw",
  maxHeight: "80vh",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "10px",
  borderRadius: "5px",
  p: 4,
  overflow: "scroll",
};

const selectedAttStylle = {
  border: "3px solid green",
};

const ParameterModel = ({
  parameters,
  setOpen,
  open,
  combinationData,
  setCombinationData,
  selectedParameter,
}) => {
  const handleClose = () => setOpen(false);

  const handleClick = (parameter) => {
    const updatedArray = combinationData.map((item) =>
      item.attributeId === parameter.attributeId
        ? { ...parameter, productId: item.productId }
        : item
    );
    setCombinationData(updatedArray);
  };

  let valuePrice = selectedParameter?.price;

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
            {parameters &&
              parameters?.length > 0 &&
              parameters?.map((parameter) => (
                <React.Fragment key={parameter?.attributeCategoryId}>
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
                              {parameter?.attributeCategoryName}
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
                              {parameter?.attribute?.PrintName}
                            </span>
                          </span>
                        </div>
                      </center>
                    </ListSubheader>
                  </ImageListItem>
                  <ImageList sx={{ width: "auto" }} cols={4}>
                    {parameter?.parameters?.map((item) => (
                      <ImageListItem
                        key={item?._id}
                        sx={{ cursor: "pointer" }}
                        style={
                          selectedParameter?._id.toString() ===
                          item?._id.toString()
                            ? selectedAttStylle
                            : undefined
                        }
                        onClick={() =>
                          handleClick({
                            attributeId: parameters[0]?.attribute?._id,
                            parameterId: item?._id,
                          })
                        }
                      >
                        <img
                          srcSet={`${REACT_APP_URL}/images/parameter/${item?.profileImage}?w=300&fit=crop&auto=format&dpr=2 2x`}
                          src={`${REACT_APP_URL}/images/parameter/${item?.profileImage}?w=3000&fit=crop&auto=format`}
                          alt={item?.title}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          position="below"
                          title={
                            <span
                              style={{ fontSize: "18px", fontWeight: "600" }}
                            >
                              {item?.name}
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
                              Number(valuePrice) - Number(item.price) === 0
                                ? "Same Price"
                                : Number(valuePrice) - Number(item.price) > 0
                                ? `-${Math.abs(
                                    Number(valuePrice) - Number(item.price)
                                  )} `
                                : `+${Math.abs(
                                    Number(valuePrice) - Number(item.price)
                                  )}`
                            }`}</span>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </React.Fragment>
              ))}
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default ParameterModel;
