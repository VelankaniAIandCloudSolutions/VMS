// pages/welcome.js

import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import BasicModal from "@/components/Modal";
import ScheduleVisitForm from "@/components/ScheduleVisitForm";
import { useRouter } from "next/router";
import axios from "axios";
const theme = createTheme();

export async function getServerSideProps() {
  try {
    console.log("api called first hand is isndie server side props");
    const response = await axios.get(
      "http://localhost:3000/api/invitations/create-visit"
    );

    console.log("resposne", response.data);
    const visitTypes = response.data.visitTypes;
    const users = response.data.users;
    const locations = response.data.locations;

    console.log(visitTypes, users, locations);

    return {
      props: {
        visitTypes,
        users,
        locations,
        //
        // initialVisits,
      },
    };
  } catch (error) {
    console.error("Error fetching visit types:", error);
    return {
      props: {
        visitTypes: [],
        users: [],
        locations: [],
        initialVisits: [],

        // Return an empty array or handle error case
      },
    };
  }
}

const Welcome = ({ visitTypes, users, locations }) => {
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const router = useRouter();
  const goToSignIn = () => {
    router.push("/signin");
  };
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
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              margin: theme.spacing(2),
            }}
          >
            <Button variant="outlined" color="primary" onClick={goToSignIn}>
              Sign In
            </Button>
          </Box>
          <img
            src="/velankani_logo.jpg" // Replace with your logo path
            alt="Velankani Tech Park Logo"
            style={{ marginBottom: "20px", width: "200px", height: "auto" }} // Adjust size as needed
          />
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Welcome to Velankani Tech Park
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Discover a world of innovation and collaboration.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: isMobile ? 1 : 3 }}
            // onClick={() => alert("Schedule a Meeting")}
            onClick={handleOpenCreateModal}
          >
            Schedule a Meeting
          </Button>
        </Box>
        <Box>
          <BasicModal
            open={isCreateModalOpen}
            handleClose={handleCloseCreateModal}
            title="Schedule Visit"
          >
            {/* ScheduleVisitForm component is passed as children */}
            <ScheduleVisitForm
              visitTypes={visitTypes}
              users={users}
              locations={locations}
              handleCloseModal={handleCloseCreateModal}
            />
          </BasicModal>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Welcome;
