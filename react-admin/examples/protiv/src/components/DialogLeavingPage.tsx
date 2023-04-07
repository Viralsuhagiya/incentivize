import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";

export const DialogLeavingPage = ({
  showDialog,
  setShowDialog,
  cancelNavigation,
  confirmNavigation
}) => {
  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <Dialog className='common-diaglog-modal leave-page-modal' fullWidth open={showDialog} onClose={handleDialogClose}>
      <DialogTitle>Leaving Page</DialogTitle>
      <DialogContent>
        <Typography>There are some changes If you proceed your changes will be lost Are you sure you want to proceed?</Typography>
      </DialogContent>
      <DialogActions>
        <Button className='button-textPrimary ra-confirm cancel-ra-confirm' onClick={cancelNavigation}>
          No
        </Button>
        <Button className='button-textPrimary ra-confirm' onClick={confirmNavigation}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
