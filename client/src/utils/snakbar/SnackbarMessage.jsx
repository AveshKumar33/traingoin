import React from "react";

import { Snackbar, Alert } from "@mui/material";

const SnackbarMessage = ({ setState, state }) => {
  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <Snackbar
      open={state.open}
      onClose={handleClose}
      TransitionComponent={state.Transition}
      key={state.Transition.name}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={state?.type}
        variant="filled"
        // action={
        //   <Button color="inherit" size="small">
        //     View
        //   </Button>
        // }
        sx={{ bottom: { xs: 90, sm: 0 } }}
      >
        {state?.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarMessage;

// export const SnackbarErrorMessage = ({ setState, state, message }) => {
//   const handleClose = () => {
//     setState({
//       ...state,
//       open: false,
//     });
//   };

//   return (
//     <Snackbar
//       open={state.open}
//       onClose={handleClose}
//       TransitionComponent={state.Transition}
//       key={state.Transition.name}
//       autoHideDuration={3000}
//       anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//     >
//       <Alert
//         onClose={handleClose}
//         severity="error"
//         variant="filled"
//         // action={
//         //   <Button color="inherit" size="small">
//         //     View
//         //   </Button>
//         // }
//         sx={{ bottom: { xs: 90, sm: 0 } }}
//       >
//         {message}
//       </Alert>
//     </Snackbar>
//   );
// };
