import React from "react";
import { Link } from "react-router-dom";
import BackgroundImageRight from "../../assets/Image/BackgroundImageRight.png";

function formateDate(date) {
  const utcDate = new Date(date);
  const indianLocaleTimeString = utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  return indianLocaleTimeString;
}

const OrderList = ({ allOrders, isAdmin = false }) => {
  return (
    <div
      className="row"
      style={{
        backgroundImage: `url(${BackgroundImageRight})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        clear:"both"
      }}
    >
      <div
        className="container"
        style={{ width: "1200px", paddingTop: "50px" }}
      >
        <table className="table table-spriped">
          <thead>
            <tr>
              <th
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Order Id
              </th>
              <th
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Name
              </th>
              <th
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Mobile No.
              </th>
              <th
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Address
              </th>
              <th
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Pin Code
              </th>
              <th
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Order Time
              </th>
              <th
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Amount
              </th>
              <th
                style={{
                  textAlign: "right",
                  fontSize: "16px",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Status
              </th>
              <th
                style={{
                  fontSize: "16px",
                  textAlign: "center",
                  color: "#fff",
                  backgroundColor: "#475B52",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {allOrders &&
              allOrders.length > 0 &&
              allOrders.map((user) => (
                <tr key={user?._id}>
                  <td style={{ fontSize: "15px" }}>{user?.orderId}</td>
                  <td style={{ fontSize: "15px" }}>
                    {user?.firstName} {user?.lastName}
                  </td>
                  <td style={{ fontSize: "15px" }}>{user?.phoneNumber}</td>
                  <td style={{ fontSize: "15px" }}>
                    {`${user?.city}
                      ${user?.state}`}
                  </td>
                  <td style={{ fontSize: "15px" }}>{user?.pinCode}</td>
                  <td style={{ fontSize: "15px" }}>
                    {formateDate(user?.createdAt)}
                  </td>
                  <td style={{ fontSize: "15px" }}>{user?.amount}</td>
                  <td
                    style={{
                      textAlign: "right",
                    }}
                  >
                    {"status"}
                  </td>
                  <td>
                    <center>
                      <Link
                        to={
                          isAdmin
                            ? `/admin/order/${user?._id}`
                            : `/orders/${user?._id}`
                        }
                      >
                        <button
                          style={{
                            backgroundColor: "#475B52",
                            color: "#fff",
                            border: "none",
                            padding: "7px 15px 7px 15px",
                            zoom: "70%",
                          }}
                        >
                          View Details
                        </button>
                      </Link>
                    </center>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
