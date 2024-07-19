import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Preloader from "../../../../components/preloader/Preloader";
import Dashboard from "../../architect/dashboard/components/Dashboard";

const ArchitectProtectedRoute = () => {
  const { loading, userdetails } = useSelector((state) => state.auth);

  if (loading === "pending") {
    return <Preloader />;
  }

  if (
    userdetails &&
    userdetails?.userRole?.find((role) => role?.name === "Architect")
  ) {
    return (
      <Dashboard>
        <Outlet />
      </Dashboard>
    );
  }
  // else {
  //   return <Navigate to="/" />;
  // }
};

export default ArchitectProtectedRoute;
