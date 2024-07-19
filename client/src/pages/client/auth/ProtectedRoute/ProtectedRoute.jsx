import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../../../redux/slices/authSlice";
// import Preloader from "../../../../components/preloader/Preloader";
import { axiosInstance } from "../../../../config";
import { toastError } from "../../../../utils/reactToastify";

const ProtectedRoute = () => {
  // const [userDetails, setUserDetails] = useState({});
  const { userdetails } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (localStorage.getItem("token")) {
          const { data } = await axiosInstance.get("api/user/profile/me", {
            headers: {
              token: localStorage.getItem("token"),
            },
          });

          if (data?.success) {
            // setUserDetails(data?.data);
          }
        } else {
          dispatch(logout());
          navigate("/login");
        }
      } catch (error) {
        toastError(error?.response?.data?.message);
        if (
          !error?.response?.data?.success &&
          error?.response?.data?.message === "Token Is Invalid"
        ) {
          localStorage.removeItem("token");
          const answer = window.confirm("Dear User your Token has expired !");
          if (answer) {
            navigate("/login");
          }
        }
      }
      return;
    };

    fetchData();
  }, [navigate, dispatch]);

  // if (loading) {
  //   return (
  //     <>
  //       <Preloader />
  //       {/* <h1>Loading</h1> */}
  //     </>
  //   );
  // }

  // if (userdetails && Object.keys(userdetails).length > 0) {
  //   const { userRole } = userdetails;
  //   const filteredData = userRole.map((role) => role?.name);

  //   if (["admin"].some((role) => !filteredData.includes(role))) {
  //     return (
  //       <div className="unauthorized">
  //         <h1>Unauthorized :</h1>
  //         <span>
  //           <NavLink to="/login">Login</NavLink> to gain access
  //         </span>
  //       </div>
  //     );
  //   }
  // }

  return <Outlet />;
};

export default ProtectedRoute;
