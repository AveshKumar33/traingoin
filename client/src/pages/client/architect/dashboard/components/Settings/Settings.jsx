import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import NotificationSetting from "./NotifivationSettings";
import Password from "./PasswordSetting";
import { uiActon } from "../../../../../../redux/slices/ui-slice";

const Settings = () => {
  const disapatch = useDispatch();

  useEffect(() => {
    disapatch(uiActon.title("Settings"));
  }, [disapatch]);

  return (
    <>
      {/* <NotificationSetting /> */}
      <Password />
    </>
  );
};

export default Settings;
