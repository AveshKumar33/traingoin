import SideBar from "../../../components/sidebar/SideBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useEffect } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { deleteOrder, fetchOrders } from "../../../redux/slices/orderSlice";
import Preloader from "../../../components/preloader/Preloader";
// import { PDFViewer } from "@react-pdf/renderer";
// import Invoice from "../../../components/invoice/Invoice";
import { REACT_APP_URL } from "../../../config";

// const invoiceData = {
//   id: "5df3180a09ea16dc4b95f910",
//   invoice_no: "201906-28",
//   balance: "$2,283.74",
//   company: "MANTRIX",
//   email: "susanafuentes@mantrix.com",
//   phone: "+1 (872) 588-3809",
//   address: "922 Campus Road, Drytown, Wisconsin, 1986",
//   trans_date: "2019-09-12",
//   due_date: "2019-10-12",
//   items: [
//     {
//       sno: 1,
//       desc: "ad sunt culpa occaecat qui",
//       qty: 5,
//       rate: 405.89,
//     },
//     {
//       sno: 2,
//       desc: "cillum quis sunt qui aute",
//       qty: 5,
//       rate: 373.11,
//     },
//     {
//       sno: 3,
//       desc: "ea commodo labore culpa irure",
//       qty: 5,
//       rate: 458.61,
//     },
//     {
//       sno: 4,
//       desc: "nisi consequat et adipisicing dolor",
//       qty: 10,
//       rate: 725.24,
//     },
//     {
//       sno: 5,
//       desc: "proident cillum anim elit esse",
//       qty: 4,
//       rate: 141.02,
//     },
//   ],
// };

const Order = () => {
  const { loading, orders } = useSelector((state) => state.orders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading === "pending") {
    return (
      <>
        <Preloader />
      </>
    );
  }

  const handleDeleteClick = (id) => {
    const answer = window.confirm("Are You Sure !");
    if (answer) {
      dispatch(deleteOrder(id));
    }
  };

  return (
    <>
      <SideBar />

      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <TopHeader />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">order</h3>
                      </div>
                      <Link
                        to="/admin/add-order"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add order
                      </Link>
                    </div>
                  </div>

                  <div className="white_card_body">
                    {/* Download Invoice  */}

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">OrderID</th>
                            <th scope="col">Date of Order</th>
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col"> Amount</th>
                            <th scope="col"> Message</th>
                            <th scope="col"> Payment Status</th>
                            <th scope="col"> File</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>

                            {/* <th scope="col">Tags</th> */}

                            {/* <th scope="col">Vendor</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {loading === "fulfilled" &&
                            orders &&
                            orders.map((p, index) => (
                              <>
                                <tr key={p._id}>
                                  <th scope="row">{index + 1}</th>
                                  <th scope="row">#{p.OrderID}</th>
                                  <td>
                                    {p.createdAt
                                      .slice(0, 10)
                                      .split("-")
                                      .reverse()
                                      .join("-")}
                                  </td>
                                  <td>{p.Name}</td>
                                  <td>{p.Phone}</td>
                                  <td>₹ {p.Amount}</td>
                                  <td>{p.Remarks}</td>
                                  <td>{p.paymentStatus}</td>
                                  <td>
                                    {p.orderFiles[0] && (
                                      <Link
                                        to={`${REACT_APP_URL}/images/orders/${p.orderFiles[0]}`}
                                      >
                                        {" "}
                                        Download{" "}
                                      </Link>
                                    )}
                                  </td>

                                  <td>
                                    <span>
                                      <Link
                                        to={`/admin/edit-order/${p._id}`}
                                        style={{
                                          backgroundColor: "#198754",
                                          padding: "7px",
                                          borderRadius: "8px",
                                          color: "#fff",
                                        }}
                                      >
                                        <FiEdit />
                                      </Link>
                                    </span>
                                    &nbsp;
                                    <span
                                      style={{
                                        backgroundColor: "#dc3545",
                                        padding: "7px",
                                        borderRadius: "8px",
                                        color: "#fff",
                                      }}
                                      onClick={() => handleDeleteClick(p._id)}
                                    >
                                      <AiTwotoneDelete />
                                    </span>
                                  </td>
                                </tr>
                              </>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer_part">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer_iner text-center">
                  <p>
                    Designed & Developed By{" "}
                    <a href="http://marwariplus.com/">Marwari Software</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="back-top" style={{ display: "none" }}>
        <div title="Go to Top">
          <i className="ti-angle-up"></i>
        </div>
      </div>
    </>
  );
};

export default Order;
