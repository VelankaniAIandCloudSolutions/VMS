// pages/welcome.js

import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import BasicModal from "@/components/Modal";
import ScheduleVisitForm from "@/components/ScheduleVisitForm";
import { useRouter } from "next/router";
import Tooltip from "@mui/material/Tooltip";
import LoginIcon from "@mui/icons-material/Login";
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
            <Tooltip title="Sign In">
              <Button
                variant="outlined"
                color="primary"
                onClick={goToSignIn}
                startIcon={<LoginIcon />} // Display the SignInIcon as the start icon
                sx={{ "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }} // Darken the background on hover
              >
                Sign In
              </Button>
            </Tooltip>
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

// with background iamge

// import React from "react";
// import { Container, Box, Typography, Button } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import Image from "next/image";
// import { makeStyles } from "@mui/styles";
// import BasicModal from "@/components/Modal";
// import ScheduleVisitForm from "@/components/ScheduleVisitForm";
// import { useRouter } from "next/router";
// import axios from "axios";

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

// // Define styles using makeStyles for background and overlay
// const useStyles = makeStyles((theme) => ({
//   background: {
//     backgroundImage: `url('/velankani_background.jpeg')`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//     filter: "brightness(0.5)", // Adjust the brightness of the background image
//   },
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity (fourth value) as needed
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//   },
// }));

// // Async function to fetch initial props server-side
// export async function getServerSideProps() {
//   try {
//     const response = await axios.get(
//       "http://localhost:3000/api/invitations/create-visit"
//     );

//     const visitTypes = response.data.visitTypes;
//     const users = response.data.users;
//     const locations = response.data.locations;

//     return {
//       props: {
//         visitTypes,
//         users,
//         locations,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return {
//       props: {
//         visitTypes: [],
//         users: [],
//         locations: [],
//       },
//     };
//   }
// }

// const Welcome = ({ visitTypes, users, locations }) => {
//   const classes = useStyles();
//   const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const router = useRouter();

//   const handleOpenCreateModal = () => setCreateModalOpen(true);
//   const handleCloseCreateModal = () => setCreateModalOpen(false);

//   const goToSignIn = () => {
//     router.push("/signin");
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       {/* Background and Overlay */}
//       <div className={classes.background}></div>
//       <div className={classes.overlay}></div>

//       <Container component="main" maxWidth="s">
//         <Box
//           sx={{
//             marginTop: theme.spacing(8), // Use theme.spacing for consistent spacing
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             position: "relative", // Ensure relative positioning for overlay and text
//             zIndex: 1, // Ensure content is above background
//             color: theme.palette.common.white, // Accessing common color from theme.palette
//             textAlign: "center",
//             paddingTop: theme.spacing(8),
//             paddingBottom: theme.spacing(8),
//           }}
//         >
//           {/* Sign In Button */}
//           <Box
//             sx={{
//               position: "absolute",
//               top: 0,
//               right: 0,
//               margin: theme.spacing(2),
//             }}
//           >
//             <Button variant="outlined" color="primary" onClick={goToSignIn}>
//               Sign In
//             </Button>
//           </Box>

//           {/* Logo */}
//           <img
//             src="/velankani_logo.jpg"
//             alt="Velankani Tech Park Logo"
//             style={{
//               marginBottom: theme.spacing(2),
//               width: "200px",
//               height: "auto",
//             }}
//           />

//           {/* Title and Subtitle */}
//           <Typography component="h1" variant="h4" gutterBottom>
//             Welcome to Velankani Tech Park
//           </Typography>
//           <Typography variant="subtitle1" color="textSecondary" gutterBottom>
//             Discover a world of innovation and collaboration.
//           </Typography>

//           {/* Schedule a Meeting Button */}
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: theme.spacing(2) }}
//             onClick={handleOpenCreateModal}
//           >
//             Schedule a Meeting
//           </Button>
//         </Box>

//         {/* Modal for Scheduling Visit */}
//         <Box>
//           <BasicModal
//             open={isCreateModalOpen}
//             handleClose={handleCloseCreateModal}
//             title="Schedule Visit"
//           >
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
