import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { verifyToken } from "../../../../redux/slices/authSlice";
import Preloader from "../../../../components/preloader/Preloader";

const UserProtectedRoute = () => {
  const { loading, user, error, userdetails } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(verifyToken());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  if (loading === "pending") {
    return (
      <>
        <Preloader />
        {/* <h1>Loading</h1> */}
      </>
    );
  }

  if (loading === "fulfilled" && !userdetails) {
    return (
      <div className="unauthorized">
        <h1>Unauthorized :(</h1>
        <span>
          <NavLink to="/login">Login</NavLink> to gain access
        </span>
      </div>
    );
  }

  return <Outlet />;
};

export default UserProtectedRoute;
