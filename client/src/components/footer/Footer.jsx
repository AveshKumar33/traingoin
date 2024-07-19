import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer_part">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="footer_iner text-center">
            <p>
              Designed &amp; Developed By{" "}
              <Link to="http://marwariplus.com/">Marwari Software</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Footer