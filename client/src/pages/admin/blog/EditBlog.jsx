import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Footer from "../../../components/footer/Footer";
import Header from "../../../components/header/Header";
import SideBar from "../../../components/sidebar/SideBar";
import JoditEditor from "jodit-react";
// import { AiFillCopy, AiTwotoneDelete } from "react-icons/ai";

const EditBlog = () => {
  const navigate = useNavigate();

  const [apicall, setapicall] = useState({
    loading: false,
    error: false,
  });
  const [productimg, setproductimg] = useState();
  const [del, setdel] = useState(false);
  const [gallery, setgallery] = useState([]);

  const { loading, error } = apicall;

  const { id } = useParams();

  const [blog, setblog] = useState({});
  const [content, setContent] = useState("");

  const onChange = (e) => {
    setblog({ ...blog, [e.target.name]: e.target.value });
  };

  const { heading, description, keywords, author, url } = blog;

  useEffect(() => {
    getgallaryimg();
  }, [del]);

  const getblog = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/blog/${id}`);
      if (data?.success) {
        const { content, ...others } = data?.blog;
        setblog(others);
        setContent(content);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, [id]);

  useEffect(() => {
    getblog();
  }, [getblog]);

  const getgallaryimg = async () => {
    try {
      const { data } = await axiosInstance.get("/api/gallery");
      // console.log("data",data.gallery)

      if (data.success) {
        setgallery(data.gallery);
      }
    } catch (error) {
      console.log("err", error.response.data.message);
    }
  };

  const handleBlogSubmit = async (e) => {
    try {
      e.preventDefault();
      setapicall({ ...apicall, loading: true });

      const { data } = await axiosInstance.put(`/api/blog/${id}`, {
        heading,
        content,
        description,
        keywords,
        author,
        url,
      });

      if (data.success) {
        setapicall({ ...apicall, loading: false });
        navigate("/admin/blog");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const addimge = async (e) => {
    e.preventDefault();
    if (!productimg) {
      return alert("Please Select Image ");
    } else {
      if (productimg.size >= 2000000) {
        return alert("Image Size should be less Than 2MB");
      }
    }
    setapicall({ ...apicall, loading: true });
    try {
      const productdata = new FormData();
      productdata.append("blogimg", productimg);
      const { data } = await axiosInstance.post(`/api/gallery`, productdata, {
        headers: {
          token: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setapicall({ ...apicall, loading: false });
        alert(data.message);
      }
      alert("Image Added Successfully");
      setdel(!del);
    } catch (error) {
      setapicall({ ...apicall, loading: false });
      console.log(error);
    }
  };

  const deleteimage = async (id) => {
    // console.log("imgs",imgs,id)
    try {
      const answer = window.confirm("Are You Sure !");
      if (answer) {
        const { data } = await axiosInstance.delete(`/api/gallery/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        alert("deleted permanently");
      }
      setdel(!del);
    } catch (error) {
      console.log("error", error);
    }
  };

  const config = {
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  return (
    <>
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
                      {/* <Link className="btn btn-outline-primary mb-3" to="/admin/add-blog">Add Blog</Link> */}
                    </div>
                  </div>
                  <div className="white_card_body">
                    <form onSubmit={handleBlogSubmit}>
                      <div className="mb-1">
                        <label for="exampleInputEmail1" className="form-label">
                          Heading
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          value={heading || ""}
                          name="heading"
                          onChange={onChange}
                          aria-describedby="emailHelp"
                        />
                      </div>
                      <div className="mb-1">
                        <label for="exampleInputEmail1" className="form-label">
                          Content
                        </label>
                        <JoditEditor
                          // ref={editor}
                          value={content || ""}
                          config={config}
                          tabIndex={1} // tabIndex of textarea
                          onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                          onChange={(newContent) => {}}
                        />
                      </div>

                      <div className="mb-1">
                        <label for="exampleInputEmail1" className="form-label">
                          Description
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          value={description || ""}
                          name="description"
                          onChange={onChange}
                          aria-describedby="emailHelp"
                        />
                      </div>
                      <div className="mb-1">
                        <label for="exampleInputEmail1" className="form-label">
                          Keywords
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          value={keywords || ""}
                          name="keywords"
                          onChange={onChange}
                          aria-describedby="emailHelp"
                        />
                      </div>
                      <div className="mb-1">
                        <label for="exampleInputEmail1" className="form-label">
                          Author
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          name="author"
                          value={author || ""}
                          onChange={onChange}
                          aria-describedby="emailHelp"
                        />
                      </div>
                      <div className="mb-1">
                        <label for="exampleInputEmail1" className="form-label">
                          Url
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          name="url"
                          value={url || ""}
                          onChange={onChange}
                          aria-describedby="emailHelp"
                        />
                      </div>

                      {loading ? (
                        <>
                          <button
                            type="submit"
                            className="btn mybtn bg-dark text-white mt-2 disabled"
                          >
                            <div className="spinner-border" role="status"></div>
                          </button>
                        </>
                      ) : (
                        <button
                          type="submit"
                          className="btn mybtn bg-dark text-white mt-2"
                        >
                          Submit
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>

      {/* <SideBar />

      <section className="push " style={{ position: 'relative', transition: ' margin-left .5s' }}>
        <div className=" py-4 " style={{ position: 'relative', transition: ' margin-left .5s', backgroundColor: 'black' }}>
          <div className="container text-white">
            <h2>RSF</h2>
          </div>
        </div>
        <div className="container ">
          <div className="text-center">
            <h2>Edit Blog</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">

              <div className="row">
                <div className="col-md-6">
                  <div className="col-md-12">
                    <input type="file" class="form-control" id="recipient-name" onChange={e => setproductimg(e.target.files[0])} />
                  </div>
                  <div className="col-md-12 text-center mt-3  ">
                    {
                      loading ? <button type="submit" class="btn btn-primary btn-sm" >Uploading Wait</button> : <button type="submit" className="btn btn-primary btn-sm" onClick={addimge}>Submit</button>
                    }

                  </div>
                </div>
                <div className="col-md-6">
                  <div style={{ display: "flex", gap: 10 }}>
                    {
                      gallery && gallery.slice(0, 5).map((g) => (
                        <>
                          <div >
                           
                            <img src={`${process.env.REACT_APP_URL}/images/Blog/${g?.imgName}`} alt="" height={100} width={100} loading="lazy" />
                            <div style={{ display: "flex", justifyContent: "space-around" }}>
                              <AiFillCopy size={30} color="#EE393E" onClick={() => navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/images/Blog/${g?.imgName}`)} />
                              <AiTwotoneDelete size={30} color="#EE393E" onClick={() => deleteimage(g?._id)} />
                            </div>

                          </div>


                        </>
                      )

                      )
                    }

                  </div>

                </div>
              </div>


              <form onSubmit={handleBlogSubmit}>
                <div class="mb-1">
                  <label for="exampleInputEmail1" className="form-label">Heading</label>
                  <input type="text" className="form-control" id="exampleInputEmail1" value={heading} name='heading' onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-1">
                  <label for="exampleInputEmail1" className="form-label">Content</label>
                  <JoditEditor
                    // ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={newContent => { }}
                  />
                </div>

                <div className="mb-1">
                  <label for="exampleInputEmail1" className="form-label">Description</label>
                  <input type="text" className="form-control" id="exampleInputEmail1" value={description} name='description' onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-1">
                  <label for="exampleInputEmail1" className="form-label">Keywords</label>
                  <input type="text" className="form-control" id="exampleInputEmail1" value={keywords} name='keywords' onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-1">
                  <label for="exampleInputEmail1" className="form-label">Author</label>
                  <input type="text" className="form-control" id="exampleInputEmail1" name='author' value={author} onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-1">
                  <label for="exampleInputEmail1" className="form-label">Url</label>
                  <input type="text" className="form-control" id="exampleInputEmail1" name='url' value={url} onChange={onChange} aria-describedby="emailHelp" />
                </div>

                {
                  loading ? <>
                    <button type="submit" className="btn mybtn bg-dark text-white mt-2 disabled">
                      <div className="spinner-border" role="status">
                      </div>
                    </button>
                  </> : <button type="submit" className="btn mybtn bg-dark text-white mt-2">Submit</button>
                }


                
              </form>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default EditBlog;
