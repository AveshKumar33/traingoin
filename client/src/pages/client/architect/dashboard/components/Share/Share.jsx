import React, { useState } from "react";

import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import ShareIcon from "@mui/icons-material/Share";

import { REACT_APP_URL } from "../../../../../../config";

const handleShare = async (url) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: `${REACT_APP_URL}/architect/${url}`,
      });
    } else {
      throw new Error("Web Share API not supported");
    }
  } catch (error) {
    console.error("Error sharing:", error);
    // Handle the error or provide fallback behavior
  }
};

const Share = () => {
  const { userdetails } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(`${REACT_APP_URL}/architect/${url}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const actions = [
    { icon: <FileCopyIcon />, name: "Copy", onClick: handleCopy },
    { icon: <ShareIcon />, name: "Share", onClick: handleShare },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "fixed",
          bottom: "calc(30vh - 160px)",
          right: 16,
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={
              copied && action.name === "Copy" ? "Copied" : action.name
            }
            onClick={() => action.onClick(userdetails?.Url)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default Share;
