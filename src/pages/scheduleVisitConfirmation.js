// pages/scheduleVisitConfirmation.js

import React from "react";
import { Container, Card, CardContent, Typography, Grid } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const theme = createTheme();

export async function getServerSideProps(context) {
  const { visitId } = context.query;

  try {
    // Fetch visit details from API using axios

    console.log("Fetching visit details for visitId:", visitId);
    const response = await axios.get(
      `http://localhost:3000/api/invitations/${visitId}`
    );

    console.log("Visit Details:", response.data);

    // Return visit details as props
    return {
      props: {
        visitDetails: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching visit details:", error);

    // Handle error case
    return {
      props: {
        visitDetails: [], // Return null or handle error accordingly
      },
    };
  }
}

// const visitDetails = {
//   name: "John Doe",
//   email: "john.doe@example.com",
//   date: "2024-06-20",
//   time: "10:00 AM",
//   purpose: "Business Meeting",
//   confirmationId: "123456",
//   status: "Pending Approval",
// };

const ScheduleVisitConfirmation = ({ visitDetails }) => {
  // const { name, email, date, time, purpose, confirmationId, status } =
  //   visitDetails;

  // const { confirmation_id } = visitDetails;

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
                  Confirmation ID: {visitDetails.confirmation_id}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Status: {visitDetails.status}{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Name:{visitDetails.visitor.first_name}{" "}
                  {visitDetails.visitor.last_name}{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Email: {visitDetails.visitor.email}{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Date: {visitDetails.visit_date}{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Time: {visitDetails.visit_time}
                  {""}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Location: {visitDetails.location.location_name}{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Visit type: {visitDetails.visit_type.visit_type}
                  {""}
                </Typography>
              </Grid>{" "}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Purpose: {visitDetails.purpose}{" "}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  Host: {visitDetails.host.first_name}{" "}
                  {visitDetails.host.last_name} {""}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ScheduleVisitConfirmation;
