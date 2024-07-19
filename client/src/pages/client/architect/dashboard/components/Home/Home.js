import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Orders from "../Orders";
// import AssignmentList from "../AssignmentList/AssignmentList";
import { uiActon } from "../../../../../../redux/slices/ui-slice";

import ComplianceAndRegulation from "../Weights/ComplianceAndRegulation";
import Team from "../Weights/Team";
import Project from "../Weights/Project";
import Client from "../Weights/Client";

import {
  options as clientOption,
  data as clentData,
} from "../Chart/ClientChart";

import { options as ourOption, data as ourData } from "../Chart/OurGrowth";

import { Bar } from "react-chartjs-2";

import Share from "../Share/Share";

const Home = () => {
  const disapatch = useDispatch();

  useEffect(() => {
    disapatch(uiActon.title("Dashboard"));
  }, [disapatch]);

  return (
    <>
      {/* <Grid item xs={12} md={6} lg={3}>
        <ComplianceAndRegulation />
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={3}>
        <Team />
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={3}>
        <Project />
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={3}>
        <Client />
      </Grid>{" "} */}
      {/* Growth Chart*/}
      {/* <Grid item xs={12} md={12} lg={6}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Bar options={ourOption} data={ourData} />
        </Paper>
      </Grid> */}
      {/* Student Chart*/}
      {/* <Grid item xs={12} md={12} lg={6}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Bar options={clientOption} data={clentData} />
        </Paper>
      </Grid> */}
      {/* <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <AssignmentList />
        </Paper>
      </Grid> */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Orders />
        </Paper>
      </Grid>
      <Share />
    </>
  );
};

export default Home;
