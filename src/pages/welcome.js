// // pages/welcome.js

import React from "react";
import { useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"; // Import styled for MUI v5
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import BasicModal from "@/components/Modal";
import ScheduleVisitForm from "@/components/ScheduleVisitForm";
import { useRouter } from "next/router";
import axios from "axios";
import LoginIcon from "@mui/icons-material/Login";
import axiosInstance from "@/utils/axiosConfig";
import useSWR from "swr";

// Create a custom theme with palette and spacing configuration
const theme = createTheme({
  palette: {
    common: {
      white: "#ffffff", // Define common colors
      black: "#000000",
    },
    primary: {
      main: "#1976d2", // Adjust primary color as needed
    },
    // Add more palette options (secondary, error, etc.) if necessary
  },
  spacing: 8, // Define default spacing value (adjust as needed)
});

// Define styles using styled for background and overlay in MUI v5
const Background = styled("div")({
  backgroundImage: `url('/velankani_background.jpeg')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  filter: "brightness(0.7)", // Adjust the brightness of the background image
});

const Overlay = styled("div")({
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity (fourth value) as needed
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -2,
});

const Logo = styled("img")({
  position: "absolute",
  top: -2, // Use numeric values for spacing adjustments
  left: -220,
  width: "220px", // Adjust size as needed
  height: "auto",
  filter: "brightness(0.7)",
});

const Content = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  color: theme.palette.common.white,
  textAlign: "center",
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const SignInButton = styled(Button)({
  // backgroundColor: theme.palette.primary.main,
  // color: theme.palette.common.white,
  // "&:hover": {
  //   backgroundColor: theme.palette.primary.dark,
  // },
});

const SlideInRightTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "Roboto, Arial, sans-serif",
  animation: "fadeIn 1.5s ease-in-out",
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
}));

const fetcher = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

const Welcome = () => {
  const { data: session, status } = useSession();
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const { data, error } = useSWR("/api/invitations/create-visit", fetcher);
  const { data, error } = useSWR("/api/get-data", fetcher);
  if (data) console.log("Fetched data usign swr:", data);

  const router = useRouter();

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const goToSignIn = () => {
    router.push("/signin");
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/invitations");
    }
  }, [status, router]);
  if (!data && !error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#FFFFFF",
          color: "#ffffff",
        }}
      >
        <CircularProgress size={60} />
      </div>
    );
  }

  if (error) {
    console.error("Error fetching data:", error);

    return <div>Error fetching data.</div>;
  }

  const { visitTypes, users, locations } = data;

  // // Print statement for debugging
  // console.log("Data fetched successfully:", data);
  return (
    <ThemeProvider theme={theme}>
      {/* Background and Overlay */}
      <Background />
      <Overlay />

      <Container component="main" maxWidth="md">
        <Content>
          {/* Sign In Button */}

          <Box
            style={{
              position: "absolute",
              top: 10,
              right: isMobile ? 16 : -200, // Adjust the right position based on screen size
              // backgroundColor: "#340F07",
            }}
          >
            <SignInButton
              variant="outline"
              onClick={goToSignIn}
              endIcon={<LoginIcon />}
              // sx={{
              //   backgroundColor: "rgb(52, 18, 6)",
              //   "&:hover": {
              //     backgroundColor: "rgba(52, 18, 6, 0.8)",
              //   },
              //   color: "white",
              // }}
              sx={{ color: "brown", borderColor: "brown" }}
            >
              Sign In
            </SignInButton>
          </Box>

          {/* Logo */}
          <Logo src="/velankani_logo.png" alt="Velankani Tech Park Logo" />

          {/* Title and Subtitle */}
          <Grid item xs={12}>
            <SlideInRightTypography
              component="h1"
              variant={isMobile ? "h5" : "h3"}
              gutterBottom
              style={{ marginTop: "35%", color: "whitesmoke" }}
            >
              Welcome to Velankani Tech Park
            </SlideInRightTypography>
            <SlideInRightTypography
              variant="subtitle1"
              style={{ marginTop: "1%" }}
              gutterBottom
            >
              Discover a world of innovation and collaboration.
            </SlideInRightTypography>
          </Grid>

          {/* Schedule a Meeting Button */}
          <Button
            variant="outlined"
            color="success"
            onClick={handleOpenCreateModal}
            sx={{ marginTop: "1%", color: "lightgreen", borderColor: "white" }}
          >
            Schedule a Meeting
          </Button>
        </Content>

        {/* Modal for Scheduling Visit */}
        <BasicModal
          open={isCreateModalOpen}
          handleClose={handleCloseCreateModal}
          title="Schedule Visit"
        >
          <ScheduleVisitForm
            visitTypes={visitTypes}
            users={users}
            locations={locations}
            handleCloseModal={handleCloseCreateModal}
          />
        </BasicModal>
      </Container>
    </ThemeProvider>
  );
};

export default Welcome;
