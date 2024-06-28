import * as React from "react";
import { makeStyles } from "@mui/system";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

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
const CreateInviteButton = styled(Button)({
  marginLeft: "auto",
});

const breadcrumbs = [
  <NextLink href="/" key="1" passHref>
    Home
  </NextLink>,
  <Typography key="2" color="textPrimary">
    Invitations
  </Typography>,
];

function CustomToolbar({ filterStatus, setFilterStatus }) {
  return (
    <GridToolbarContainer>
      <Box sx={{ p: 1, display: "flex", gap: 2 }}>
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
        </TextField>
      </Box>
    </GridToolbarContainer>
  );
}
export async function getServerSideProps(context) {
  console.log("sasasasas");
  const session = await getSession(context);
  console.log("session in server side props", session);

  if (!session) {
    // User is not authenticated, redirect to sign-in page
    console.log("noooo");

    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  try {
    console.log("api called first hand is isndie server side props");
    const response = await axios.get(
      "http://localhost:3000/api/invitations/create-visit"
    );
    const visitTypes = response.data.visitTypes;
    const users = response.data.users;
    const locations = response.data.locations;
    // Fetch visits
    const visitsResponse = await axios.get(
      "http://localhost:3000/api/invitations/all"
    );

    console.log("visitResponssasasasasasase", visitsResponse.data);

    // const visits = visitsResponse.data.visits;
    // const initialVisits = visitsResponse.data.visits.map((visit) => ({
    //   id: visit.visit_id, // Use visit_id as the unique id
    //   ...visit,
    // }));

    const initialVisits = visitsResponse.data.visits;

    // console.log(visitTypes, users, locations, initialVisits);

    return {
      props: {
        visitTypes,
        users,
        locations,
        initialVisits,
        session,
      },
    };
  } catch (error) {
    console.error("Error fetching visit types:", error);
    return {
      props: {
        visitTypes: [],
        users: [],
        locations: [],
        initialVisits: [], // Return an empty array or handle error case
      },
    };
  }
}

export default function Invitations({
  visitTypes,
  users,
  locations,
  initialVisits,
  session,
}) {
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);
  const [visits, setVisits] = useState(initialVisits);

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const handleApprove = (visitId) => {
    axios
      .put(`http://localhost:3000/api/invitations/${visitId}`, {
        status: "Approved", // Set status to 'Approved' in the request body
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Update local state to reflect the approved visit
          // const updatedVisits = visits.map((visit) =>
          //   visit.id === visitId ? { ...visit, status: "Approved" } : visit
          // );
          setVisits(response.data.visits);
          toast.success("Visit approved successfully!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          // // Wait a brief moment before showing email notification
          // setTimeout(() => {
          //   // Notify about email sent
          //   toast.info("The visitor has been notified of the status update.", {
          //     position: "bottom-right",
          //     autoClose: 3000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "light",
          //   });
          // }, 4000); // Adjust timing as needed
          // console.log(`Visit ${visitId} approved successfully`);
          // Optionally update the UI or fetch data again
        } else {
          throw new Error(
            `Failed to approve visit ${visitId}. Status: ${response.status}`
          );
        }
      })
      .catch((error) => {
        // Handle error
        console.error(`Error approving visit ${visitId}:`, error);
        toast.error(`Error approving visit as ${error.response.data.error}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleReject = (visitId) => {
    axios
      .put(`http://localhost:3000/api/invitations/${visitId}`, {
        status: "Declined", // Set status to 'Declined' in the request body
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Update local state to reflect the rejected visit
          // const updatedVisits = visits.map((visit) =>
          //   visit.id === visitId ? { ...visit, status: "Declined" } : visit
          // );
          setVisits(response.data.visits);
          toast.success("Visit declined successfully!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // setTimeout(() => {
          //   // Notify about email sent
          //   toast.info("The visitor has been notified of the status update.", {
          //     position: "bottom-right",
          //     autoClose: 3000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "light",
          //   });
          // }, 4000); // Adjust timing as needed

          console.log(`Visit ${visitId} rejected successfully`);
          // Optionally update the UI or fetch data again
        } else {
          throw new Error(
            `Failed to reject visit ${visitId}. Status: ${response.status}`
          );
        }
      })
      .catch((error) => {
        // Handle error
        console.error(`Error rejecting visit ${visitId}:`, error);
        toast.error(`Error declining visit as ${error.response.data.error}`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const columns = [
    { field: "visit_id", headerName: "ID", width: 90 },

    {
      field: "Visitor",
      headerName: "Visitor Name",
      width: 200,

      valueGetter: (params) => {
        // console.log("params in Visitor:", params); // Check what params contains
        return `${params?.first_name || ""} ${params?.last_name || ""}`;
      },
    },
    { field: "visit_date", headerName: "Visit Date", width: 150 },
    { field: "visit_time", headerName: "Visit Time", width: 150 },

    {
      field: "Location",
      headerName: "Location",
      width: 200,
      valueGetter: (params) => {
        return params?.location_name || "";
      },
    },

    {
      field: "VisitType",
      headerName: "Visit Type",
      width: 200,
      valueGetter: (params) => {
        return params?.visit_type || "";
      },
    },

    { field: "status", headerName: "Status", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1 }}
              onClick={() => handleApprove(params.row.visit_id)}
              disabled={params?.row?.status === "Approved"}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                handleReject(params.row.visit_id);
              }}
              disabled={params?.row?.status === "Declined"}
            >
              Reject
            </Button>
          </>
        );
      },
    },
  ];

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

        <Box
          sx={{
            display: "grid",
          }}
        >
          {visits.length === 0 ? (
            <CircularProgress color="primary" />
          ) : (
            <DataGrid
              rows={visits}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // checkboxSelection
              disableSelectionOnClick
              autoHeight
              getRowId={(row) => row.visit_id}
              columnVisibilityModel={{
                visit_id: false,
              }}
              density="strict"
              // autosizeOnMount={true}
              components={{
                Toolbar: () => (
                  <CustomToolbar
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                  />
                ),
              }}
            />
          )}
        </Box>

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
          />
        </BasicModal>
      </Card>
    </Layout>
  );
}

// import * as React from "react";
// import { makeStyles } from "@mui/system";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { getSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import { CircularProgress } from "@mui/material";
// import {
//   Container,
//   Typography,
//   Button,
//   Breadcrumbs,
//   Link,
//   Box,
//   Card,
//   Grid,
// } from "@mui/material";
// import { styled, useTheme } from "@mui/material/styles";
// import NextLink from "next/link";
// import Layout from "../components/Layout"; // Adjust the import path as per your project structure
// import useMediaQuery from "@mui/material/useMediaQuery";
// import BasicModal from "@/components/Modal";
// import ScheduleVisitForm from "@/components/ScheduleVisitForm";
// import DataGridAllInvitationsStatusChange from "@/components/DataGridAllInvitationsStatusChange";
// import axios from "axios";

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

// export async function getServerSideProps(context) {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/signin",
//         permanent: false,
//       },
//     };
//   }

//   try {
//     const response = await axios.get(
//       "http://localhost:3000/api/invitations/create-visit"
//     );
//     const visitTypes = response.data.visitTypes;
//     const users = response.data.users;
//     const locations = response.data.locations;

//     const visitsResponse = await axios.get(
//       "http://localhost:3000/api/invitations/all"
//     );
//     const initialVisits = visitsResponse.data.visits;

//     return {
//       props: {
//         visitTypes,
//         users,
//         locations,
//         initialVisits,
//         session,
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
//       },
//     };
//   }
// }

// export default function Invitations({
//   visitTypes,
//   users,
//   locations,
//   initialVisits,
//   session,
// }) {
//   const router = useRouter();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [isCreateModalOpen, setCreateModalOpen] = useState(false);
//   const [visits, setVisits] = useState(initialVisits);

//   const handleOpenCreateModal = () => setCreateModalOpen(true);
//   const handleCloseCreateModal = () => setCreateModalOpen(false);

//   const filteredVisits =
//     filterStatus === "All"
//       ? visits
//       : visits.filter((visit) => visit.status === filterStatus);

//   return (
//     <Layout>
//       <Container maxWidth="lg">
//         <Breadcrumbs aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
//         <Typography variant="h4" gutterBottom>
//           Invitations
//         </Typography>
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//           <CreateInviteButton
//             variant="contained"
//             color="primary"
//             onClick={handleOpenCreateModal}
//           >
//             Create Invite
//           </CreateInviteButton>
//         </Box>
//         <Card>
//           <Box sx={{ height: 600, width: "100%" }}>
//             <DataGridAllInvitationsStatusChange
//               visits={filteredVisits}
//               setVisits={setVisits}
//               filterStatus={filterStatus}
//               setFilterStatus={setFilterStatus}
//             />
//           </Box>
//         </Card>
//         <BasicModal
//           open={isCreateModalOpen}
//           onClose={handleCloseCreateModal}
//           aria-labelledby="create-visit-form"
//         >
//           <ScheduleVisitForm
//             visitTypes={visitTypes}
//             users={users}
//             locations={locations}
//             onClose={handleCloseCreateModal}
//             session={session}
//             onSuccess={(newVisit) => {
//               setVisits((prevVisits) => [...prevVisits, newVisit]);
//               toast.success("Visit created successfully!", {
//                 position: "bottom-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//                 theme: "light",
//               });
//             }}
//           />
//         </BasicModal>
//       </Container>
//     </Layout>
//   );
// }
