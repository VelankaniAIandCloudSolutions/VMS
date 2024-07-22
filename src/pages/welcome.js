// // pages/welcome.js

// import React from "react";
// import { Container, Box, Typography, Button } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

// import useMediaQuery from "@mui/material/useMediaQuery";
// import Image from "next/image";
// import BasicModal from "@/components/Modal";
// import ScheduleVisitForm from "@/components/ScheduleVisitForm";
// import { useRouter } from "next/router";
// import Tooltip from "@mui/material/Tooltip";
// import LoginIcon from "@mui/icons-material/Login";
// import axios from "axios";
// const theme = createTheme();

// export async function getServerSideProps() {
//   try {
//     console.log("api called first hand is isndie server side props");
//     const response = await axiosInstance.get(
//       "/api/invitations/create-visit"
//     );

//     console.log("resposne", response.data);
//     const visitTypes = response.data.visitTypes;
//     const users = response.data.users;
//     const locations = response.data.locations;

//     console.log(visitTypes, users, locations);

//     return {
//       props: {
//         visitTypes,
//         users,
//         locations,
//         // initialVisits,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching visit types:", error);
//     return {
//       props: {
//         visitTypes: [],
//         users: [],
//         locations: [],
//         initialVisits: [],

//         // Return an empty array or handle error case
//       },
//     };
//   }
// }

// const Welcome = ({ visitTypes, users, locations }) => {
//   const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const handleOpenCreateModal = () => setCreateModalOpen(true);
//   const handleCloseCreateModal = () => setCreateModalOpen(false);
//   const router = useRouter();
//   const goToSignIn = () => {
//     router.push("/signin");
//   };
//   return (
//     <ThemeProvider theme={theme}>
//       <Container component="main" maxWidth="s">
//         <Box
//           sx={{
//             marginTop: 8,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             // height: "100vh", // Full viewport height
//           }}
//         >
//           <Box
//             sx={{
//               position: "absolute",
//               top: 0,
//               right: 0,
//               margin: theme.spacing(2),
//             }}
//           >
//             <Tooltip title="Sign In">
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={goToSignIn}
//                 startIcon={<LoginIcon />} // Display the SignInIcon as the start icon
//                 sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }} // Darken the background on hover
//               >
//                 Sign In
//               </Button>
//             </Tooltip>
//           </Box>
//           <img
//             src="/velankani_logo.jpg" // Replace with your logo path
//             alt="Velankani Tech Park Logo"
//             style={{ marginBottom: "20px", width: "200px", height: "auto" }} // Adjust size as needed
//           />
//           <Typography component="h1" variant="h4" align="center" gutterBottom>
//             Welcome to Velankani Tech Park
//           </Typography>
//           <Typography variant="subtitle1" color="textSecondary" gutterBottom>
//             Discover a world of innovation and collaboration.
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: isMobile ? 1 : 3 }}
//             // onClick={() => alert("Schedule a Meeting")}
//             onClick={handleOpenCreateModal}
//           >
//             Schedule a Meeting
//           </Button>
//         </Box>
//         <Box>
//           <BasicModal
//             open={isCreateModalOpen}
//             handleClose={handleCloseCreateModal}
//             title="Schedule Visit"
//           >
//             {/* ScheduleVisitForm component is passed as children */}
//             <ScheduleVisitForm
//               visitTypes={visitTypes}
//               users={users}
//               locations={locations}
//               handleCloseModal={handleCloseCreateModal}
//             />
//           </BasicModal>
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default Welcome;

// with background iamge

// import React from "react";
// import { useEffect } from "react";
// import { Container, Box, Typography, Button, Grid } from "@mui/material";
// import { createTheme, ThemeProvider, styled } from "@mui/material/styles"; // Import styled for MUI v5
// import useMediaQuery from "@mui/material/useMediaQuery";
// import Image from "next/image";
// import BasicModal from "@/components/Modal";
// import ScheduleVisitForm from "@/components/ScheduleVisitForm";
// import { useRouter } from "next/router";
// import axios from "axios";
// import LoginIcon from "@mui/icons-material/Login";
// import axiosInstance from "@/utils/axiosConfig";
// import useSWR from "swr";
// // Create a custom theme with palette and spacing configuration
// const theme = createTheme({
//   palette: {
//     common: {
//       white: "#ffffff", // Define common colors
//       black: "#000000",
//     },
//     primary: {
//       main: "#1976d2", // Adjust primary color as needed
//     },
//     // Add more palette options (secondary, error, etc.) if necessary
//   },
//   spacing: 8, // Define default spacing value (adjust as needed)
// });

// // Define styles using styled for background and overlay in MUI v5
// const Background = styled("div")({
//   backgroundImage: `url('/velankani_background.jpeg')`,
//   backgroundSize: "cover",
//   backgroundPosition: "center",
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   zIndex: -1,
//   filter: "brightness(0.7)", // Adjust the brightness of the background image
// });

// const Overlay = styled("div")({
//   backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity (fourth value) as needed
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   zIndex: -2,
// });

// const Logo = styled("img")({
//   position: "absolute",
//   top: -2, // Use numeric values for spacing adjustments
//   left: -220,
//   width: "220px", // Adjust size as needed
//   height: "auto",
//   filter: "brightness(0.7)",
// });

// const Content = styled("div")(({ theme }) => ({
//   position: "relative",
//   zIndex: 1,
//   color: theme.palette.common.white,
//   textAlign: "center",
//   paddingTop: theme.spacing(8),
//   paddingBottom: theme.spacing(8),
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: theme.spacing(2),
// }));

// const SignInButton = styled(Button)({
//   // backgroundColor: theme.palette.primary.main,
//   // color: theme.palette.common.white,
//   // "&:hover": {
//   //   backgroundColor: theme.palette.primary.dark,
//   // },
// });

// const SlideInRightTypography = styled(Typography)(({ theme }) => ({
//   fontFamily: "Roboto, Arial, sans-serif",
//   animation: "fadeIn 1.5s ease-in-out",
//   "@keyframes fadeIn": {
//     "0%": {
//       opacity: 0,
//     },
//     "100%": {
//       opacity: 1,
//     },
//   },
// }));

// const fetcher = async (url) => {
//   try {
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch data");
//   }
// };

// const Welcome = () => {
//   const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const { data, error } = useSWR("/api/invitations/create-visit", fetcher);

//   const router = useRouter();

//   const handleOpenCreateModal = () => setCreateModalOpen(true);
//   const handleCloseCreateModal = () => setCreateModalOpen(false);

//   const goToSignIn = () => {
//     router.push("/signin");
//   };
//   if (!data && !error) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     console.error("Error fetching data:", error);

//     return <div>Error fetching data.</div>;
//   }

//   const { visitTypes, users, locations } = data;

//   // Print statement for debugging
//   console.log("Data fetched successfully:", data);
//   return (
//     <ThemeProvider theme={theme}>
//       {/* Background and Overlay */}
//       <Background />
//       <Overlay />

//       <Container component="main" maxWidth="md">
//         <Content>
//           {/* Sign In Button */}

//           <Box
//             style={{
//               position: "absolute",
//               top: 10,
//               right: isMobile ? 16 : -200, // Adjust the right position based on screen size
//               // backgroundColor: "#340F07",
//             }}
//           >
//             <SignInButton
//               variant="outline"
//               onClick={goToSignIn}
//               endIcon={<LoginIcon />}
//               // sx={{
//               //   backgroundColor: "rgb(52, 18, 6)",
//               //   "&:hover": {
//               //     backgroundColor: "rgba(52, 18, 6, 0.8)",
//               //   },
//               //   color: "white",
//               // }}
//               sx={{ color: "brown", borderColor: "brown" }}
//             >
//               Sign In
//             </SignInButton>
//           </Box>

//           {/* Logo */}
//           <Logo src="/velankani_logo.png" alt="Velankani Tech Park Logo" />

//           {/* Title and Subtitle */}
//           <Grid item xs={12}>
//             <SlideInRightTypography
//               component="h1"
//               variant={isMobile ? "h5" : "h3"}
//               gutterBottom
//               style={{ marginTop: "35%", color: "whitesmoke" }}
//             >
//               Welcome to Velankani Tech Park
//             </SlideInRightTypography>
//             <SlideInRightTypography
//               variant="subtitle1"
//               style={{ marginTop: "1%" }}
//               gutterBottom
//             >
//               Discover a world of innovation and collaboration.
//             </SlideInRightTypography>
//           </Grid>

//           {/* Schedule a Meeting Button */}
//           <Button
//             variant="outlined"
//             color="success"
//             onClick={handleOpenCreateModal}
//             sx={{ marginTop: "1%", color: "lightgreen", borderColor: "white" }}
//           >
//             Schedule a Meeting
//           </Button>
//         </Content>

//         {/* Modal for Scheduling Visit */}
//         <BasicModal
//           open={isCreateModalOpen}
//           handleClose={handleCloseCreateModal}
//           title="Schedule Visit"
//         >
//           <ScheduleVisitForm
//             visitTypes={visitTypes}
//             users={users}
//             locations={locations}
//             handleCloseModal={handleCloseCreateModal}
//           />
//         </BasicModal>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default Welcome;

import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Grid } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import axios from "axios";
import LoginIcon from "@mui/icons-material/Login";
import BasicModal from "@/components/Modal";
import ScheduleVisitForm from "@/components/ScheduleVisitForm";
import axiosInstance from "@/utils/axiosConfig";

// Create a custom theme with palette and spacing configuration
const theme = createTheme({
  palette: {
    common: {
      white: "#ffffff",
      black: "#000000",
    },
    primary: {
      main: "#1976d2",
    },
  },
  spacing: 8,
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
  filter: "brightness(0.7)",
});

const Overlay = styled("div")({
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -2,
});

const Logo = styled("img")({
  position: "absolute",
  top: -2,
  left: -220,
  width: "220px",
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

const SignInButton = styled(Button)({});

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

const Welcome = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [visitTypes, setVisitTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const goToSignIn = () => {
    router.push("/signin");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/invitations/create-visit"
        );

        console.log("response.data", response.data);
        setVisitTypes(response.data.visitTypes);
        setUsers(response.data.users);
        setLocations(response.data.locations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Background />
      <Overlay />

      <Container component="main" maxWidth="md">
        <Content>
          <Box
            style={{
              position: "absolute",
              top: 10,
              right: isMobile ? 16 : -200,
            }}
          >
            <SignInButton
              variant="outlined"
              onClick={goToSignIn}
              endIcon={<LoginIcon />}
              sx={{ color: "brown", borderColor: "brown" }}
            >
              Sign In
            </SignInButton>
          </Box>

          <Logo src="/velankani_logo.png" alt="Velankani Tech Park Logo" />

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

          <Button
            variant="outlined"
            color="success"
            onClick={handleOpenCreateModal}
            sx={{ marginTop: "1%", color: "lightgreen", borderColor: "white" }}
          >
            Schedule a Meeting
          </Button>
        </Content>

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
