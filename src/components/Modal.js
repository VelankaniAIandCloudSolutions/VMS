import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "auto", // Set width as a percentage for responsiveness
//   maxWidth: 600, // Set max width in pixels
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto", // Set width as a percentage for responsiveness
  maxWidth: 600, // Set max width in pixels
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, handleClose, children, title }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            color: "primary.main",
            position: "relative",
            "&::after": {
              content: '""',
              display: "block",
              width: "50%",
              height: "2px",
              backgroundColor: "primary.main",
              margin: "8px auto 0",
            },
          }}
        >
          {title}
        </Typography>
        <Box>{children}</Box>
      </Box>
    </Modal>
  );
}
