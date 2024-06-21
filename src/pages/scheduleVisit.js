// pages/scheduleVisit.js

import React from "react";
import { Container, Card, CardContent, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScheduleVisitForm from "../components/ScheduleVisitForm";
import axios from "axios"; // Adjust the import path as needed
import Image from "next/image";

const theme = createTheme();

const ScheduleVisit = ({ visitTypes }) => {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mt: 6 }}>
        <Image
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
            <ScheduleVisitForm visitTypes={visitTypes} />
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export async function getServerSideProps() {
  try {
    console.log("api called");
    const response = await axios.get(
      "http://localhost:3000/api/invitations/create-visit"
    );
    // Adjust the URL as needed

    const visitTypes = response.data;

    return {
      props: {
        visitTypes,
      },
    };
  } catch (error) {
    console.error("Error fetching visit types:", error);
    return {
      props: {
        visitTypes: [], // Return an empty array or handle error case
      },
    };
  }
}

export default ScheduleVisit;
