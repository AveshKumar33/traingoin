import React, { useState } from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import { DotProductCard } from "./feelAtHome/DotProductCard";
import { DotProductModalCard } from "./feelAtHome/DotProductModalCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "80vh",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};

export const FeelAtHomeProducts = ({ product }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const total = product?.length;
  return (
    <>
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
          <Box sx={style}>
            {product &&
              product.map((p, i) => {
                return (
                  <div key={i} className="col-lg-6" style={{ float: "left" }}>
                    <DotProductModalCard product={p} />;
                  </div>
                );
              })}
          </Box>
        </Fade>
      </Modal>

      {product &&
        product.map((p, i) => {
          return (
            <DotProductCard
              key={p?._id}
              product={p}
              index={i}
              total={total}
              handleOpen={handleOpen}
              isModal={false}
            />
          );
        })}
    </>
  );
};
