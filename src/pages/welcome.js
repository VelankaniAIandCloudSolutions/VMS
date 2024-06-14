// pages/welcome.js

import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const Welcome = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="s">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // height: "100vh", // Full viewport height
          }}
        >
          <img
            src="/velankani_logo.jpg" // Replace with your logo path
            alt="Velankani Tech Park Logo"
            style={{ marginBottom: "20px", width: "200px", height: "auto" }} // Adjust size as needed
          />
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Welcome to Velankani Tech Park
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => alert("Schedule a Meeting")}
          >
            Schedule a Meeting
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Welcome;
