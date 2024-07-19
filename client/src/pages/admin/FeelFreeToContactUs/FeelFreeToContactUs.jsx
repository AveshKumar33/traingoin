import SideBar from "../../../components/sidebar/SideBar";
import { useEffect, useState } from "react";
import TopHeader from "../../../components/topheader/TopHeader";
import { axiosInstance } from "../../../config";
import { toastError } from "../../../utils/reactToastify";

const FeelFreeToContactUs = () => {
  const [feelFreeToContactUs, setFeelFreeToContactUs] = useState([]);
  async function featchAllData() {
    try {
      const { data } = await axiosInstance.get("/api/feel-free-to-contact-us");
      if (data.success) {
        setFeelFreeToContactUs(data.data);
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
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Name </th>
                            <th scope="col">Email</th>
                            <th scope="col">Mob Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feelFreeToContactUs &&
                            feelFreeToContactUs.map((p, index) => (
                              <tr style={{ width: "18%" }} key={index}>
                                <td scope="row">{index + 1}</td>
                                <td scope="row">{p.name}</td>
                                <td scope="row">{p.email}</td>
                                <td scope="row">{p.mobNumber}</td>
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

export default FeelFreeToContactUs;
