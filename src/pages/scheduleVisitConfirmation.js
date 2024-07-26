// // pages/scheduleVisitConfirmation.js

// import React from "react";
// import { Container, Card, CardContent, Typography, Grid } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Image from "next/image";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";

// const theme = createTheme();

// export async function getServerSideProps(context) {
//   const { visitId } = context.query;

//   try {
//     // Fetch visit details from API using axios

//     console.log("Fetching visit details for visitId:", visitId);
//     const response = await axiosInstance.get(
//       `/api/invitations/${visitId}`
//     );

//     console.log("Visit Details:", response.data);

//     // Return visit details as props
//     return {
//       props: {
//         visitDetails: response.data,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching visit details:", error);

//     // Handle error case
//     return {
//       props: {
//         visitDetails: [], // Return null or handle error accordingly
//       },
//     };
//   }
// }

// // const visitDetails = {
// //   name: "John Doe",
// //   email: "john.doe@example.com",
// //   date: "2024-06-20",
// //   time: "10:00 AM",
// //   purpose: "Business Meeting",
// //   confirmationId: "123456",
// //   status: "Pending Approval",
// // };

// const ScheduleVisitConfirmation = ({ visitDetails }) => {
//   // const { name, email, date, time, purpose, confirmationId, status } =
//   //   visitDetails;

//   // const { confirmation_id } = visitDetails;

//   return (
//     <ThemeProvider theme={theme}>
//       <Container component="main" maxWidth="sm" sx={{ mt: 6 }}>
//         <img
//           src="/velankani_logo.jpg" // Replace with your logo path
//           alt="Velankani Tech Park Logo"
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100px",
//             height: "auto",
//             zIndex: 1, // Ensure logo is above the Card content
//           }} // Adjust size as needed
//         />
//         <Card variant="outlined" sx={{ mt: 6 }}>
//           <CardContent>
//             <Typography component="h1" variant="h5" align="center" gutterBottom>
//               Visit Request Confirmation
//             </Typography>
//             <Typography
//               variant="body1"
//               align="center"
//               color="textSecondary"
//               gutterBottom
//             >
//               Your visit request has been submitted and is pending approval.
//             </Typography>
//             <Grid container spacing={2} sx={{ mt: 2 }}>
//               <Grid item xs={12}>
//                 <Typography variant="h6">
//                   Confirmation ID: {visitDetails.confirmation_id}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography variant="h6">
//                   Status: {visitDetails.status}{" "}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Name:{visitDetails.visitor.first_name}{" "}
//                   {visitDetails.visitor.last_name}{" "}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Email: {visitDetails.visitor.email}{" "}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Date: {visitDetails.visit_date}{" "}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Time: {visitDetails.visit_time}
//                   {""}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Location: {visitDetails.location.location_name}{" "}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Visit type: {visitDetails.visit_type.visit_type}
//                   {""}
//                 </Typography>
//               </Grid>{" "}
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Purpose: {visitDetails.purpose}{" "}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="body1">
//                   Host: {visitDetails.host.first_name}{" "}
//                   {visitDetails.host.last_name} {""}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </CardContent>
//         </Card>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default ScheduleVisitConfirmation;

import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import axios from "axios";
import axiosInstance from "@/utils/axiosConfig";
import useSWR from "swr";
import { useRouter } from "next/router";

const theme = createTheme({
  palette: {
    primary: {
      main: "#388e3c",
    },
    secondary: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f5f5",
    },
    text: {
      primary: "#333",
      secondary: "#666",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
  },
});

export async function getServerSideProps(context) {
  const { visitId } = context.query;

  try {
    const response = await axiosInstance.get(`/api/invitations/${visitId}`);

    return {
      props: {
        visitDetails: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching visit details:", error);

    return {
      props: {
        visitDetails: [],
      },
    };
  }
}
// const fetcher = async (url) => {
//   try {
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch data");
//   }
// };

const ScheduleVisitConfirmation = ({ visitDetails }) => {
  const router = useRouter();
  // const { visitId } = router.query;
  // const { data, error } = useSWR(
  //   visitId ? `/api/invitations/${visitId}` : null, // Only fetch if visitId is available
  //   fetcher
  // );

  // console.log("sasasas", data);

  // const visitDetails = data;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.white", minHeight: "100vh", py: 8 }}>
        <Container component="main" maxWidth="sm">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Image
              src="/velankani_logo.jpg"
              alt="Velankani Tech Park Logo"
              width={100}
              height={100}
            />
          </Box>
          <Card variant="outlined" sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography
                component="h1"
                variant="h5"
                align="center"
                gutterBottom
              >
                Visit Request Confirmation
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                gutterBottom
                sx={{ mt: 2 }}
              >
                Your visit request has been submitted and is pending approval.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Confirmation ID:</strong>{" "}
                    {visitDetails?.confirmation_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Status:</strong> {visitDetails?.status}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Name:</strong> {visitDetails?.visitor?.first_name}{" "}
                    {visitDetails?.visitor?.last_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Email:</strong> {visitDetails?.visitor.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Date:</strong> {visitDetails?.visit_date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Time:</strong> {visitDetails?.visit_time}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Location:</strong>{" "}
                    {visitDetails?.location?.location_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Visit Type:</strong>{" "}
                    {visitDetails?.visit_type?.visit_type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Purpose:</strong> {visitDetails?.purpose}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Host:</strong> {visitDetails?.host?.first_name}{" "}
                    {visitDetails?.host?.last_name}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ScheduleVisitConfirmation;
