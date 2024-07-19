import React, { useEffect, useState } from "react";

// Material components
import { Typography } from "@mui/material";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Paper from "@mui/material/Paper";
import { architectCountById } from "../../../../../../redux/slices/raiseAQuerySlice";

// Component styles
import theme from "../theme/index";
import classes from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";

const Client = () => {
  const { userdetails } = useSelector((state) => state.auth);
  const { reqForPriseCount, loading } = useSelector(
    (state) => state.raiseQuery
  );
  console.log("Loading user details from", reqForPriseCount);
  const dispatch = useDispatch();
  const [RFPCount, setRFPCount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    if (userdetails?._id) {
      dispatch(architectCountById(userdetails?._id));
    }
  }, [userdetails?._id]);
  useEffect(() => {
    if (loading === "fulfilled") {
      setRFPCount(reqForPriseCount.count);
      setPercentage(reqForPriseCount.percentage);
    }
  }, [loading]);

  return (
    <Paper sx={{ p: 3 }}>
      <div className={classes.content}>
        <div className={classes.details}>
          <Typography
            style={{ color: theme.palette.text.secondary }}
            className={classes.title}
            variant="body2"
          >
            CLIENT COUNTS
          </Typography>
          <Typography sx={{ mt: 2 }} className={classes.value} variant="h4">
            {RFPCount}
          </Typography>
        </div>
        <div
          style={{ backgroundColor: theme.palette.success.dark }}
          className={classes.iconWrapper}
        >
          <SupervisorAccountIcon
            style={{ color: theme.palette.common.white }}
            className={classes.icon}
          />
        </div>
      </div>
      {percentage >= 0 ? (
        <div style={{ marginTop: "10px" }} className={classes.footer}>
          <Typography
            style={{ color: theme.palette.success.dark }}
            className={classes.difference}
            variant="body2"
          >
            <ArrowUpwardIcon />
            {percentage}%
          </Typography>
          <Typography style={{ marginLeft: "3px" }} variant="caption">
            Since last years
          </Typography>
        </div>
      ) : (
        <div style={{ marginTop: "10px" }} className={classes.footer}>
          <Typography
            style={{ color: theme.palette.danger.dark }}
            className={classes.difference}
            variant="body2"
          >
            <ArrowDownwardIcon />
            {percentage}%
          </Typography>
          <Typography style={{ marginLeft: "3px" }} variant="caption">
            Since last years
          </Typography>
        </div>
      )}
    </Paper>
  );
};

export default Client;
