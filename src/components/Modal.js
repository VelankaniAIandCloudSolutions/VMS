// components/BasicModal.js

// import React from "react";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "auto",
//   height: "auto", // Set width as a percentage for responsiveness
//   maxWidth: 600, // Set max width in pixels
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
// };

// export default function BasicModal({
//   open,
//   handleClose,
//   children,
//   title,
//   mode,
// }) {
//   const isEditMode = mode === "edit";
//   const modalTitle = mode
//     ? isEditMode
//       ? `Edit ${title}`
//       : `Add ${title}`
//     : title;

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={style}>
//         <Typography
//           id="modal-modal-title"
//           variant="h5"
//           component="h2"
//           sx={{
//             mb: 2,
//             fontWeight: "bold",
//             textAlign: "center",
//             color: "primary.main",
//             position: "relative",
//             "&::after": {
//               content: '""',
//               display: "block",
//               width: "50%",
//               height: "2px",
//               backgroundColor: "primary.main",
//               margin: "8px auto 0",
//             },
//           }}
//         >
//           {modalTitle}
//         </Typography>
//         <Box>{children}</Box>
//       </Box>
//     </Modal>
//   );
// }

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Responsive width
  maxWidth: 600, // Maximum width
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  open,
  handleClose,
  children,
  title,
  mode,
}) {
  const isEditMode = mode === "edit";
  const modalTitle = mode
    ? isEditMode
      ? `Edit ${title}`
      : `Add ${title}`
    : title;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          width: { xs: "90%", sm: "80%", md: "60%" },
        }}
      >
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
            fontSize: { xs: "h6.fontSize", sm: "h5.fontSize" },
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
          {modalTitle}
        </Typography>
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "70vh",
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
