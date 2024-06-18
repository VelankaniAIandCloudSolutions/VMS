// pages/scheduleVisitConfirmation.js

import React from "react";
import { Container, Card, CardContent, Typography, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const visitDetails = {
  name: "John Doe",
  email: "john.doe@example.com",
  date: "2024-06-20",
  time: "10:00 AM",
  purpose: "Business Meeting",
  confirmationId: "123456",
  status: "Pending Approval",
};

const ScheduleVisitConfirmation = () => {
  const { name, email, date, time, purpose, confirmationId, status } =
    visitDetails;

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
              Visit Request Confirmation
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Your visit request has been submitted and is pending approval.
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Confirmation ID: {confirmationId}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Status: {status}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">Name: {name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">Email: {email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">Date: {date}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">Time: {time}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">Purpose: {purpose}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ScheduleVisitConfirmation;
