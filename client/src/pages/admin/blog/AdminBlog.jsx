import React, { useState, useEffect } from "react";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import { REACT_APP_URL } from "../../../config";

import SideBar from "../../../components/sidebar/SideBar";
import { Link } from "react-router-dom";
import {
  AiFillDelete,
  AiOutlineFileAdd,
  AiTwotoneDelete,
} from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import parse from "html-react-parser";

const AdminBlog = () => {
  const [blog, setblog] = useState([]);
  const [del, setdel] = useState(false);
  const [modalone, setmodalone] = useState(false);
  const [productimg, setproductimg] = useState();
  const [productid, setproductid] = useState();
  const [loader, setloader] = useState(false);

  const getblog = async () => {
    try {
      const { data } = await axiosInstance.get("/api/blog");
      if (data.success) {
        setblog(data.blog);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    getblog();
  }, []);

  const deleteblog = async (id, e) => {
    e.preventDefault();
    try {
      const answer = window.confirm("Are You Sure !");
      if (answer) {
        await axiosInstance.delete(`/api/blog/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        alert("deleted permanently");
      }
      getblog();
      setdel(!del);
    } catch (error) {
      console.log("error", error.response.data.message);
    }
  };

  const addimge = async (e) => {
    e.preventDefault();
    try {
      if (!productimg) {
        return alert("Please Select Image ");
      } else {
        if (productimg.size >= 2000000) {
          return alert("Image Size should be less Than 2MB");
        }
      }
      setloader(true);
      const productdata = new FormData();
      productdata.append("blogimg", productimg);
      await axiosInstance.post(
        `/api/blog/add-image/${productid}`,
        productdata,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setloader(false);

      alert("Image Added Successfully");
      setdel(!del);
      setmodalone(false);
      getblog();
    } catch (error) {
      setloader(false);
      console.log(error);
    }
  };

  const deleteimage = async (imgs, id) => {
    try {
      const answer = window.confirm("Are You Sure !");
      if (answer) {
        await axiosInstance.delete(`/api/blog/remove-image/${id}/${imgs}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        alert("deleted permanently");
      }
      getblog();
      setdel(!del);
    } catch (error) {
      console.log("error", error);
    }
    // alert(imgs)
    // console.log("img",imgs)
  };

  const openmodel = (data) => {
    setproductid(data?._id);
    setmodalone(true);
  };

  return (
    <>
      {modalone && (
        <>
          <div
            className="modal fade d-block"
            style={{ opacity: "1" }}
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Image
                  </h5>
                </div>
                <div className="modal-body py-5">
                  <form>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Image:
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="recipient-name"
                          onChange={(e) => setproductimg(e.target.files[0])}
                          placeholder="Enter IFSC Code"
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm close"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          setmodalone(false);
                        }}
                      >
                        Close
                      </button>
                      {loader ? (
                        <>
                          <button className="btn btn-primary btn-sm disabled">
                            Uploading Please Wait...
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                            onClick={addimge}
                          >
                            Submit
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <SideBar />
      {/* <section className="main_content dashboard_part large_header_bg"> */}
      <section className="">
        <Header />
        <div className="main_content_iner">
          <div className="container-fluid p-0">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="white_card card_height_100 mb_30">
                  <div className="white_card_header">
                    <div className="box_header m-0">
                      <div className="main-title">
                        <h3 className="m-0">Blog</h3>
                      </div>
                      <Link
                        className="btn btn-outline-primary mb-3"
                        to="/admin/add-blog"
                      >
                        Add Blog
                      </Link>
                    </div>
                  </div>
                  <div className="white_card_body">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Sr. No.</th>
                            <th scope="col">Heading</th>
                            <th scope="col">Content</th>
                            <th scope="col">keywords</th>
                            <th scope="col">description</th>
                            <th scope="col">author</th>
                            <th scope="col">Featured Image</th>
                            <th scope="col" colSpan="3">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {blog &&
                            blog.map((u, no) => (
                              <tr key={u?._id}>
                                <th scope="row">{no + 1}</th>
                                <td>{u.heading}</td>
                                <td>{parse(u?.content.slice(0, 20))}</td>
                                <td>{u.keywords}</td>
                                <td>{u.description}</td>
                                <td>{u.author}</td>
                                <td>
                                  <div style={{ display: "flex", gap: 10 }}>
                                    {u?.FeaturedImage ? (
                                      <div>
                                        <img
                                          src={`${REACT_APP_URL}/images/blog/${u?.FeaturedImage}`}
                                          alt=""
                                          height={100}
                                          width={100}
                                          loading="lazy"
                                        />
                                        <AiTwotoneDelete
                                          size={30}
                                          onClick={() =>
                                            deleteimage(
                                              u?.FeaturedImage,
                                              u?._id
                                            )
                                          }
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignitems: "center",
                                        }}
                                      >
                                        <AiOutlineFileAdd
                                          className="text-center"
                                          size={30}
                                          onClick={() => openmodel(u)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </td>

                                <td colSpan="3">
                                  <Link
                                    className="btn bg-dark text-white mx-2"
                                    to={`/admin/edit-blog/${u?._id}`}
                                  >
                                    {" "}
                                    <FiEdit2 />{" "}
                                  </Link>
                                  <button
                                    className="btn bg-dark text-white"
                                    onClick={(e) => deleteblog(u?._id, e)}
                                  >
                                    <AiFillDelete />
                                  </button>
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
        </div>
        <Footer />
      </section>

      {/* {
        modalone && <>
          <div className="modal fade d-block" style={{ opacity: '1' }} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Add Image</h5>
                </div>
                <div className="modal-body py-5">
                  <form>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label for="recipient-name" className="col-form-label">Image:</label>
                        <input type="file" className="form-control" id="recipient-name" onChange={e => setproductimg(e.target.files[0])} placeholder="Enter IFSC Code" />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary btn-sm close" data-bs-dismiss="modal" onClick={() => { setmodalone(false) }}>Close</button>
                      {
                        loader ? <>
                        <button className="btn btn-primary btn-sm disabled" >Uploading Please Wait...</button>
                        </>:<>
                        
                        <button type="submit" className="btn btn-primary btn-sm" onClick={addimge}>Submit</button>
                        </>
                      }
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </>
      }


      <section className="push " style={{ position: 'relative', transition: ' margin-left .5s' }}>
        <div className=" py-4 " style={{ position: 'relative', transition: ' margin-left .5s', backgroundColor: 'black' }}>
          <div className="container text-white">
            
          </div>
        </div>
        <div className=" p-5 container">
          <div>
            <Link className="btn bg-dark text-white " to="/admin/add-blog">Add Blog</Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Heading</th>
                <th scope="col">Content</th>
                <th scope="col">keywords</th>
                <th scope="col">description</th>
                <th scope="col">author</th>
                <th scope="col">Featured Image</th>
                <th scope="col" colspan="3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                blog && blog.map((u, no) => (
                  <>
                    <tr>
                      <th scope="row">{no + 1}</th>
                      <td>{u.heading}</td>
                      <td>{parse(u.content.slice(0, 20))}</td>
                      <td>{u.keywords}</td>
                      <td>{u.description}</td>
                      <td>{u.author}</td>
                      <td>
                        <div style={{ display: "flex", gap: 10 }}>
                          {u.FeaturedImage ? <div >
                            <img src={`${process.env.REACT_APP_URL}/images/Blog/${u?.FeaturedImage}`} alt="" height={100} width={100} loading="lazy"/>
                            <AiTwotoneDelete size={30} onClick={() => deleteimage(u?.FeaturedImage, u?._id)} />
                          </div> :
                            <div style={{ display: "flex", justifyContent: "center", alignitems: "center" }}>
                              <AiOutlineFileAdd className="text-center" size={30} onClick={() => openmodel(u)} />
                            </div>
                          }
                         
                        </div>
                      </td>

                      <td scope="col" colspan="3">
                        <Link className="btn bg-dark text-white mx-2" to={`/admin/edit-blog/${u._id}`} > <FiEdit2 /> </Link>
                        <button className="btn bg-dark text-white" onClick={(e) => deleteblog(u._id, e)}><AiFillDelete /></button>

                      </td>
                    </tr>
                  </>

                ))
              }

            </tbody>
          </table>
        </div>
      </section> */}
    </>
  );
};

export default AdminBlog;
