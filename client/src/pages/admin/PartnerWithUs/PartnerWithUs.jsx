import SideBar from "../../../components/sidebar/SideBar";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { REACT_APP_URL, axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";

const PartnerWithus = () => {
  const [partnerWitUs, setPartnerWithUs] = useState([]);
  async function featchAllData() {
    try {
      const { data } = await axiosInstance.get("/api/partner-with-us");
      if (data.success) {
        setPartnerWithUs(data.data);
      }
    } catch (error) {
      toastError(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    featchAllData();
  }, []);

  return (
    <>
      <SideBar />
      <section className="">
        <TopHeader />

        <div className="main_content_iner ">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  {/* <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0"> Partner With Us</h3>
                      </div>
                      <Link
                        to="/admin/add-partner-with-us"
                        className="btn btn-outline-primary mb-3"
                      >
                        Add Client Image
                      </Link>
                    </div>
                  </div> */}
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Client Type </th>
                            <th scope="col">File</th>
                            <th scope="col" style={{ width: "15%" }}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {partnerWitUs &&
                            partnerWitUs.map((p, index) => (
                              <>
                                <tr key={p._id}>
                                  <th scope="row">{index + 1}</th>
                                  <th scope="row">{p.status}</th>
                                  <th scope="row">
                                    {p.status === "contactUsVideo" ? (
                                      <video
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                        src={`${REACT_APP_URL}/images/clientImages/${p.pwusImage}`}
                                        alt="_profile"
                                        controls
                                      />
                                    ) : (
                                      <img
                                        loading="lazy"
                                        src={`${REACT_APP_URL}/images/clientImages/${p.pwusImage}`}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      />
                                    )}
                                  </th>
                                  <td>
                                    <span>
                                      <Link
                                        to={`/admin/Partner-with-us/${p._id}`}
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
        <a title="Go to Top" href="#">
          <i className="ti-angle-up"></i>
        </a>
      </div>
    </>
  );
};

export default PartnerWithus;
