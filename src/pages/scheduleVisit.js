// pages/scheduleVisit.js

import React from "react";
import { Container, Card, CardContent, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScheduleVisitForm from "../components/ScheduleVisitForm"; // Adjust the import path as needed

const theme = createTheme();

const ScheduleVisit = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mt: 6 }}>
        <img
          src="/velankani_logo.jpg" // Replace with your logo path
          alt="Velankani Tech Park Logo"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100px",
            height: "auto",
            zIndex: 1, // Ensure logo is above the Card content
          }} // Adjust size as needed
        />
        <Card variant="outlined" sx={{ mt: 6 }}>
          <CardContent>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Schedule a Meeting
            </Typography>
            <ScheduleVisitForm />
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ScheduleVisit;
