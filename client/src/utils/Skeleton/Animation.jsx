import React from "react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

export default function Animations() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" sx={{ width: "100%", height: 80 }} />
      <Skeleton
        variant="rectangular"
        sx={{ width: "100%", height: 80 }}
        animation="wave"
      />
      {/* <Skeleton
        variant="rectangular"
        sx={{ width: "100%", height: 80 }}
        animation={false}
      /> */}
    </Stack>
  );
}
