import React from "react";

// Material components
import { Typography } from "@mui/material";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
// import MoneyIcon from "@mui/icons-material/Money";
import Paper from "@mui/material/Paper";

// Component styles
import theme from "../theme/index";
import classes from "./styles.module.css";

const ComplianceAndRegulation = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <div className={classes.content}>
        <div className={classes.details}>
          <Typography
            style={{ color: theme.palette.text.secondary }}
            className={classes.title}
            variant="body2"
          >
            COMPLIANCE AND REGULATION
          </Typography>
          <Typography sx={{ mt: 2 }} className={classes.value} variant="h4">
            30
          </Typography>
        </div>
        <div
          style={{ backgroundColor: theme.palette.success.dark }}
          className={classes.iconWrapper}
        >
          <AssuredWorkloadIcon
            style={{ color: theme.palette.common.white }}
            className={classes.icon}
          />
        </div>
      </div>
      <div style={{ marginTop: "10px" }} className={classes.footer}>
        <Typography
          style={{ color: theme.palette.success.dark }}
          className={classes.difference}
          variant="body2"
        >
          <ArrowUpwardIcon />
          12%
        </Typography>
        <Typography style={{ marginLeft: "3px" }} variant="caption">
          Since last month
        </Typography>
      </div>
    </Paper>
  );
};

export default ComplianceAndRegulation;
