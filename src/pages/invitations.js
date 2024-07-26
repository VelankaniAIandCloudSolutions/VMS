// import * as React from "react";
// import { makeStyles, width } from "@mui/system";
// import { useState, useEffect } from "react";
// import Alert from "@mui/material/Alert";
// import CheckIcon from "@mui/icons-material/Check";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { getSession, useSession } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { useRouter } from "next/router";
// import { ToastContainer } from "react-toastify";
// import axiosInstance from "@/utils/axiosConfig";

// import {
//   Container,
//   Typography,
//   Button,
//   Breadcrumbs,
//   Link,
//   Box,
//   Card,
//   TextField,
//   MenuItem,
//   Grid,
//   Modal,
//   CircularProgress,
// } from "@mui/material";
// import { styled, useTheme } from "@mui/material/styles";
// import NextLink from "next/link";
// import Layout from "../components/Layout"; // Adjust the import path as per your project structure
// import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
// // import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";

// import useMediaQuery from "@mui/material/useMediaQuery";
// import BasicModal from "@/components/Modal";
// import ScheduleVisitForm from "@/components/ScheduleVisitForm";
// import axios from "axios";
// import VisitsDataGrid from "@/components/invitations";
// import useSWR from "swr";
// import Spinner from "@/components/spinner";

// const CreateInviteButton = styled(Button)({
//   marginLeft: "auto",
// });

// const breadcrumbs = [
//   <NextLink href="/" key="1" passHref>
//     Home
//   </NextLink>,
//   <Typography key="2" color="textPrimary">
//     Invitations
//   </Typography>,
// ];

// const fetcher = async (url) => {
//   try {
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch data");
//   }
// };

// export default function Invitations({}) {
//   const router = useRouter();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);

//   const { data: initialData, error: visitError } = useSWR(
//     "/api/get-data",
//     fetcher
//   );
//   const { data: visitsData, error: visitsError } = useSWR(
//     "/api/invitations/all",
//     fetcher
//   );

//   const initialVisits = visitsData?.visits || [];

//   const { data: session, status } = useSession();
//   console.log("INvitation Session", session);

//   const [updatedVisit, setUpdatedVisit] = useState(initialVisits);

//   useEffect(() => {
//     if (visitsData) {
//       setUpdatedVisit(visitsData.visits);
//     }
//   }, [visitsData]);

//   useEffect(() => {
//     if (status === "loading") {
//       return; // Wait for session status to be determined
//     }
//     if (status === "unauthenticated") {
//       router.push("/signin"); // Redirect to sign-in page if not authenticated
//     }
//   }, [status, router]);

//   const handleOpenCreateModal = () => setCreateModalOpen(true);
//   const handleCloseCreateModal = () => setCreateModalOpen(false);

//   const handleUpdatedVisits = (updatedVisits) => {
//     setUpdatedVisit(updatedVisits);
//   };

//   if (visitError || visitsError) {
//     console.error("Error fetching data:", visitError || visitsError);
//     return <div>Error loading data.</div>;
//   }

//   if (!initialData || !visitsData) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           backgroundColor: "#FFFFFF",
//           color: "#ffffff",
//         }}
//       >
//         <CircularProgress size={60} />
//       </div>
//     );
//   }

//   const { visitTypes, users, locations } = initialData;

//   return (
//     <Layout>
//       <Card
//         variant="outlined"
//         sx={{ px: isMobile ? 2 : 4, py: isMobile ? 2 : 4 }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isMobile ? "column" : "row",
//             justifyContent: isMobile ? "center" : "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               alignItems: "center",
//             }}
//           >
//             <Typography
//               variant="h4"
//               component="h1"
//               sx={{
//                 mr: isMobile ? 0 : 2,
//                 textAlign: isMobile ? "center" : "left",
//               }}
//             >
//               Invitations
//             </Typography>
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{
//                 mr: isMobile ? 0 : 2,
//                 display: isMobile ? "none" : "block",
//               }}
//             >
//               |
//             </Typography>
//             <Breadcrumbs
//               aria-label="breadcrumb"
//               sx={{ justifyContent: isMobile ? "center" : "flex-start" }}
//             >
//               {breadcrumbs}
//             </Breadcrumbs>
//           </Box>
//           <CreateInviteButton
//             variant="contained"
//             color="primary"
//             onClick={handleOpenCreateModal}
//             sx={{ mt: isMobile ? 2 : 0 }}
//           >
//             Create Invite
//           </CreateInviteButton>
//         </Box>

//         <VisitsDataGrid
//           visits={updatedVisit}
//           session={session}
//           onUpdatedVisits={handleUpdatedVisits}
//         />

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
//       </Card>
//     </Layout>
//   );
// }

import * as React from "react";
import { makeStyles, width } from "@mui/system";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

import {
  Container,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Box,
  Card,
  TextField,
  MenuItem,
  Grid,
  Modal,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import Layout from "../components/Layout"; // Adjust the import path as per your project structure
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
// import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import useMediaQuery from "@mui/material/useMediaQuery";
import BasicModal from "@/components/Modal";
import ScheduleVisitForm from "@/components/ScheduleVisitForm";
import axios from "axios";
import VisitsDataGrid from "@/components/invitations";
const CreateInviteButton = styled(Button)({
  marginLeft: "auto",
});
import { useEffect } from "react";
import axiosInstance from "@/utils/axiosConfig";

const breadcrumbs = [
  <NextLink href="/" key="1" passHref>
    Home
  </NextLink>,
  <Typography key="2" color="textPrimary">
    Invitations
  </Typography>,
];

export async function getServerSideProps(context) {
  try {
    console.log("API call inside getServerSideProps");
    const response = await axiosInstance.get("api/get-data");
    const visitTypes = response.data.visitTypes;
    const users = response.data.users;
    const locations = response.data.locations;

    // Fetch visits
    const visitsResponse = await axiosInstance.get("/api/invitations/all");
    const initialVisits = visitsResponse?.data?.visits;
    console.log("initial visits", initialVisits);

    return {
      props: {
        visitTypes,
        users,
        locations,
        initialVisits,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        visitTypes: [],
        users: [],
        locations: [],
        initialVisits: [],
      },
    };
  }
}

export default function Invitations({
  visitTypes,
  users,
  locations,
  initialVisits,
}) {
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [updatedVisit, setUpdatedVisit] = useState(initialVisits);

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const { data: session, status } = useSession();

  console.log("Session call in invitations:", session);

  const handleUpdatedVisits = (updatedVisits) => {
    setUpdatedVisit(updatedVisits);
  };
  const handleCloseModal = () => {
    setCreateModalOpen(false);
  };
  useEffect(() => {
    if (status === "loading") {
      return; // Wait for session status to be determined
    }
    if (status === "unauthenticated") {
      router.push("/signin"); // Redirect to sign-in page if not authenticated
    }
  }, [status, router]);
  return (
    <Layout>
      <Card
        variant="outlined"
        sx={{ px: isMobile ? 2 : 4, py: isMobile ? 2 : 4 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mr: isMobile ? 0 : 2,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              Invitations
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                mr: isMobile ? 0 : 2,
                display: isMobile ? "none" : "block",
              }}
            >
              |
            </Typography>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ justifyContent: isMobile ? "center" : "flex-start" }}
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
          <CreateInviteButton
            variant="contained"
            color="primary"
            onClick={handleOpenCreateModal}
            sx={{ mt: isMobile ? 2 : 0 }}
          >
            Create Invite
          </CreateInviteButton>
        </Box>

        <VisitsDataGrid
          visits={updatedVisit}
          session={session}
          onUpdatedVisits={handleUpdatedVisits}
        />

        <BasicModal
          open={isCreateModalOpen}
          handleClose={handleCloseModal}
          title="Schedule Visit"
        >
          <ScheduleVisitForm
            visitTypes={visitTypes}
            users={users}
            locations={locations}
            handleCloseModal={handleCloseModal}
          />
        </BasicModal>
      </Card>
    </Layout>
  );
}
