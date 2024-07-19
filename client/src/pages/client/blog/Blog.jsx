import React, { useEffect, useRef, useState, useCallback } from "react";
import MainHeader from "../../../components/mainheader/MainHeaderNew";
import StickySidebar from "../../../components/stickysidebar/StickySidebar";
import MainFooter from "../../../components/mainfooter/MainFooter";
import { axiosInstance, REACT_APP_URL } from "../../../config";
import Blogcard from "../blog/Blogcard";
import { toastError } from "../../../utils/reactToastify";

const Blog = () => {
  const [blog, setblog] = useState([]);
  const [page, setpages] = useState(1);
  const [loading, setloading] = useState(false);
  const [headerImage, setHeaderImage] = useState({});

  const scorllToRef = useRef();

  const getblog = async () => {
    try {
      setloading(true);
      const { data } = await axiosInstance.get("/api/blog");
      setblog(data.blog);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("error", error.response.data.message);
    }
  };

  useEffect(() => {
    getblog();
  }, []);

  const setselecedpage = (page) => {
    if (page < 1 || page > Math.ceil(blog.length / 10)) {
      return;
    }
    setpages(page);
    scorllToRef.current.scrollIntoView();
  };

  const fetchRootCollection = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/header-image/title/Blog`);

      if (data?.success) {
        setHeaderImage(data?.data);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toastError(error?.response?.data?.message);
      } else {
        toastError(error?.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchRootCollection();
  }, [fetchRootCollection]);

  return (
    <>
      <StickySidebar />
      <MainHeader isImageAvailable={headerImage?.pngImage ? true : false} />
      <div
        className="div"
        style={{
          height: headerImage?.pngImage ? "60vh" : "11vh",
          overflow: "hidden",
          position: "relative",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${REACT_APP_URL}/images/header/${headerImage?.pngImage})`,
          backgroundSize: "cover",
        }}
      ></div>
      <div
        className="container-fluid"
        style={{ marginTop: "20px", paddingLeft: "0px" }}
        ref={scorllToRef}
      >
        <div className="row mb-2">
          {loading ? (
            <div
              className="row d-flex justify-content-center position-relative top-50 mt-5 "
              style={{ height: "100vh" }}
            >
              <div className="col-md-8 text center position-absolute top-40 start-50">
                <div class="spinner-border text-dark " role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          ) : blog.length === 0 ? (
            <>
              <div className="row d-flex justify-content-center mt-5">
                <div className="col-md-8 text-center">
                  <h4>No Blog Available</h4>
                </div>
              </div>
            </>
          ) : (
            blog &&
            blog.slice(page * 10 - 10, page * 10).map((b) => (
              <>
                {/* <NewBlogCard/> */}
                <Blogcard blog={b} />
              </>
            ))
          )}
          {blog.length > 0 && (
            <div
              className="row justify-content-center"
              style={{ padding: "0px" }}
            >
              <div className="col-md-12 text-center" style={{ padding: "0px" }}>
                <nav
                  aria-label="Page navigation example"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ul class="pagination">
                    <li class="page-item">
                      <button
                        class="page-link"
                        aria-label="Previous"
                        onClick={() => setselecedpage(page - 1)}
                      >
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                      </button>
                    </li>
                    {[...Array(Math.ceil(blog.length / 10))].map((_, i) => (
                      <>
                        <li
                          key={i}
                          className={
                            page === i + 1 ? "page-item active" : "page-item "
                          }
                        >
                          <button
                            class="page-link"
                            onClick={() => setselecedpage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      </>
                    ))}

                    <li class="page-item">
                      <button
                        class="page-link"
                        aria-label="Next"
                        onClick={() => setselecedpage(page + 1)}
                      >
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default Blog;
