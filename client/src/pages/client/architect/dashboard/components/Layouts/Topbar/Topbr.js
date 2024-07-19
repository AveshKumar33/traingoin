import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Material components
import { Badge, IconButton, Popover } from "@mui/material";

// Material icons
// import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../../../../../../redux/slices/authSlice";

// Custom components
import NotificationList from "./NotifictionList/notification";
import notifications from "../../../data/notifications";
// import instance from "../../../../../util/axios/config";
// import { authActions } from "../../../../../redux/auth-slice";

// Component styles
import classes from "./styles.module.css";

const Topbar = () => {
  const [notification, setNotification] = useState({
    notifications: [],
    notificationsLimit: 4,
    notificationsCount: 0,
    notificationsEl: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const getNotifications = async (limit = 6) => {
      try {
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              notifications: notifications.slice(0, limit),
              notificationsCount: notifications.length,
            });
          }, 700);
        });

        if (isMounted) {
          setNotification((prevState) => ({
            ...prevState,
            notifications: response.notifications,
            notificationsCount: response.notificationsCount,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const logoutHandler = async () => {
    const answer = window.confirm("Are you sure ?");
    if (answer) {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/");
    }
  };

  const handleShowNotifications = (event) => {
    setNotification((prevState) => ({
      ...prevState,
      notificationsEl: event.currentTarget,
    }));
  };

  const handleCloseNotifications = () => {
    setNotification((prevState) => ({
      ...prevState,
      notificationsEl: null,
    }));
  };

  const showNotifications = Boolean(notification.notificationsEl);

  return (
    <>
      <div className={classes.root}>
        {/* <IconButton
          color="inherit"
          className={classes.notificationsButton}
          onClick={handleShowNotifications}
        >
          <Badge
            badgeContent={notification.notificationsCount}
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton> */}
        <IconButton
          color="inherit"
          className={classes.signOutButton}
          onClick={logoutHandler}
        >
          <LogoutIcon />
        </IconButton>
      </div>
      <Popover
        anchorEl={notification.notificationsEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handleCloseNotifications}
        open={showNotifications}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <NotificationList
          notifications={notification.notifications}
          onSelect={handleCloseNotifications}
        />
      </Popover>
    </>
  );
};
export default Topbar;
