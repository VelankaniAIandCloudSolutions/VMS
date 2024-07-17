import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Spinner = ({ size = 40 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Adjust height as needed
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default Spinner;
