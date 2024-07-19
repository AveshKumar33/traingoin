import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { axiosInstance } from "../../../../../../config";
import { toastError } from "../../../../../../utils/reactToastify";

import { uiActon } from "../../../../../../redux/slices/ui-slice";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import Title from "../Title";

function RequestProduct() {
  const disapatch = useDispatch();

  const [architectData, setArchitectData] = useState([]);
  useEffect(() => {
    async function getArchitectData() {
      try {
        const { data } = await axiosInstance.get("/api/raiseAQuery/architect", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        if (data?.success) {
          setArchitectData(data?.data);
        }
      } catch (error) {
        console.log(error);
        toastError(error?.response?.data?.message);
      }
    }
    getArchitectData();
  }, []);

  useEffect(() => {
    disapatch(uiActon.title("Request Product"));
  }, [disapatch]);

  function formateDate(date) {
    const utcDate = new Date(date);
    const indianLocaleTimeString = utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    return indianLocaleTimeString;
  }

  return (
    <Grid style={{ width: "100%", marginLeft: "20px" }}>
      <Card>
        <CardHeader
          subheader="Request For Price Application"
          title="Request For Price"
        />
        {/* <Title>Request For Price Application</Title> */}
        <Divider />
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Message</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {architectData &&
                architectData?.length > 0 &&
                architectData?.map((architect, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formateDate(architect?.createdAt)}</TableCell>
                    <TableCell>{architect?.Name}</TableCell>
                    <TableCell>{architect?.Email}</TableCell>
                    <TableCell>{architect?.MobNumber}</TableCell>
                    <TableCell>{architect?.Message}</TableCell>
                    <TableCell align="right">
                      {architect?.customizedProductId?.isCustomizedProduct ? (
                        <Link
                          target="_blank"
                          className="btn btn-success"
                          variant="contained"
                          size="small"
                          color="success"
                          to={`/customized-product/${architect?.customizedProductId?.Collection[0]?.url}/${architect?.customizedProductId?.Urlhandle}?rfp_id=${architect?._id}`}
                        >
                          View
                        </Link>
                      ) : (
                        <span key={index}>
                          <Link
                            target="_blank"
                            className="btn btn-success"
                            variant="contained"
                            size="small"
                            color="warning"
                            to={`/product/${architect?.singleProductId?.Collection[0]?.url}/${architect?.singleProductId?.Urlhandle}?rfp_id=${architect?._id}`}
                          >
                            View
                          </Link>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        {/* <div className="main_content_iner">
        <div className="container-fluid p-0">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="white_card card_height_100 mb_30">
                <div className="white_card_header">
                  <div className="box_header m-0">
                    <div className="main-title">
                      <h3 className="m-0">Queries</h3>
                    </div>
                  </div>
                </div>
                <div className="white_card_body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Sr. No.</th>
                          <th scope="col">Created Date</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">MobNumber</th>
                          <th scope="col">Message</th>
                          <th scope="col" style={{ width: "15%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {architectData &&
                          architectData?.length > 0 &&
                          architectData?.map((architect, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{formateDate(architect?.createdAt)}</td>
                              <td>{architect?.Name}</td>
                              <td>{architect?.Email}</td>
                              <td>{architect?.MobNumber}</td>
                              <td>{architect?.Message}</td>
                              <td>
                                {architect?.customizedProductId
                                  ?.isCustomizedProduct ? (
                                  <span key={index}>
                                    <Link
                                      to={`/customized-product/${architect?.customizedProductId?.Collection[0]?.url}/${architect?.customizedProductId?.Urlhandle}?rfp_id=${architect?._id}`}
                                      style={{
                                        backgroundColor: "#198754",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        color: "#fff",
                                      }}
                                    >
                                      View
                                    </Link>
                                  </span>
                                ) : (
                                  <span key={index}>
                                    <Link
                                      to={`/product/${architect?.singleProductId?.Collection[0]?.url}/${architect?.singleProductId?.Urlhandle}?rfp_id=${architect?._id}`}
                                      style={{
                                        backgroundColor: "#198754",
                                        padding: "4px",
                                        borderRadius: "3px",
                                        color: "#fff",
                                      }}
                                    >
                                      View
                                    </Link>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      </Card>
    </Grid>
  );
}

export default RequestProduct;
