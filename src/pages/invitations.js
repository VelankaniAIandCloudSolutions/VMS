import * as React from "react";
import { makeStyles } from "@mui/styles";
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

const useStyles = makeStyles({
  boldHeader: {
    fontWeight: "bold",
  },
});

const breadcrumbs = [
  <NextLink href="/" key="1" passHref>
    <Link underline="hover" color="inherit">
      Home
    </Link>
  </NextLink>,
  <Typography key="2" color="textPrimary">
    Invitations
  </Typography>,
];

const sampleData = [
  { id: 1, name: "John Doe", date: "2024-06-17", status: "Pending" },
  { id: 2, name: "Jane Smith", date: "2024-06-18", status: "Confirmed" },
  { id: 3, name: "Bob Johnson", date: "2024-06-19", status: "Pending" },
];

// const columns = [
//   { field: "visit_id", headerName: "ID", width: 90 },

//   {
//     field: "visitor_name",
//     headerName: "Visitor Name",
//     width: 200,
//     valueGetter: (params) => {
//       console.log("params.row:", params); // Log params.row to inspect its structure
//       return `${params?.row?.Visitor?.first_name || ""} ${
//         params?.row?.Visitor?.last_name || ""
//       }`;
//     },
//   },

//   // { field: "Visitor.first_name", headerName: "Visitor Name", width: 200 },
//   // { field: "date", headerName: "Visit Date", width: 150 },
//   // { field: "time", headerName: "Visit Time", width: 150 },
//   // { field: "VisitType.visit_type", headerName: "Visit Type", width: 150 },
//   // { field: "location", headerName: "Location", width: 200 },
//   { field: "status", headerName: "Status", width: 150 },

//   {
//     field: "actions",
//     headerName: "Actions",
//     width: 200,
//     renderCell: (params) => (
//       <>
//         <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>
//           Approve
//         </Button>
//         <Button variant="contained" color="error" size="small">
//           Reject
//         </Button>
//       </>
//     ),
//   },
// ];

const columns = [
  { field: "visit_id", headerName: "ID", width: 90 },

  {
    field: "Visitor",
    headerName: "Visitor Name",
    width: 200,

    valueGetter: (params) => {
      console.log("params in Visitor:", params); // Check what params contains
      return `${params?.first_name || ""} ${params?.last_name || ""}`;
    },
  },
  {
    field: "visit_date_time",
    headerName: "Visit Date",
    width: 150,
    renderCell: (params) => {
      console.log("params", params);

      const value = params.value; // Correctly access params.value to get the visit_date_time string
      console.log("value", value);

      if (!value) return ""; // Handle cases where value is undefined or null

      const dateObject = new Date(value);

      if (isNaN(dateObject.getTime())) {
        console.error("Invalid date:", value);
        return "Invalid Date";
      }

      const options = {
        timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

      const dateFormatter = new Intl.DateTimeFormat("en-IN", options);
      const dateParts = dateFormatter.formatToParts(dateObject);

      // Date in DD-MM-YYYY format
      const formattedDate = `${dateParts[0].value}-${dateParts[2].value}-${dateParts[4].value}`;

      return <span>{formattedDate}</span>; // Render formatted date inside a span or any other component
    },
  },

  {
    field: "visit_date_time",
    headerName: "Visit Time",
    width: 150,
    renderCell: (params) => {
      const value = params.value; // Correctly access params.value to get the visit_date_time string

      if (!value) return ""; // Handle cases where value is undefined or null

      const dateObject = new Date(value);

      if (isNaN(dateObject.getTime())) {
        console.error("Invalid date:", value);
        return "Invalid Time";
      }

      const options = {
        timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      };

      const timeFormatter = new Intl.DateTimeFormat("en-IN", options);
      const timeParts = timeFormatter.formatToParts(dateObject);

      // Time in HH:mm AM/PM format
      const formattedTime = `${timeParts[0].value}:${timeParts[2].value} ${timeParts[4].value}`;

      return <span>{formattedTime}</span>; // Render formatted time inside a span or any other component
    },
  },

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
    renderCell: (params) => (
      <>
        <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>
          Approve
        </Button>
        <Button variant="contained" color="error" size="small">
          Reject
        </Button>
      </>
    ),
  },
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
export async function getServerSideProps() {
  try {
    console.log("api called first hand is isndie server side props");
    const response = await axios.get("http://localhost:3000/api/create-visit");
    const visitTypes = response.data.visitTypes;
    const users = response.data.users;
    const locations = response.data.locations;
    // Fetch visits
    const visitsResponse = await axios.get(
      "http://localhost:3000/api/get-invitations"
    );

    console.log("visitResponse", visitsResponse);

    // const visits = visitsResponse.data.visits;
    const visits = visitsResponse.data.visits.map((visit) => ({
      id: visit.visit_id, // Use visit_id as the unique id
      ...visit,
    }));

    console.log(visitTypes, users, locations, visits);

    return {
      props: {
        visitTypes,
        users,
        locations,
        visits,
      },
    };
  } catch (error) {
    console.error("Error fetching visit types:", error);
    return {
      props: {
        visitTypes: [],
        users: [], // Return an empty array or handle error case
      },
    };
  }
}

export default function Invitations({ visitTypes, users, locations, visits }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [isCreateModalOpen, setCreateModalOpen] = React.useState(false);

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);
  const classes = useStyles();

  // const filteredRows = React.useMemo(() => {
  //   if (filterStatus === "All") {
  //     return sampleData;
  //   }
  //   return sampleData.filter((row) => row.status === filterStatus);
  // }, [filterStatus]);

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

        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            // rows={filteredRows}
            rows={visits}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
            components={{
              Toolbar: () => (
                <CustomToolbar
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                />
              ),
            }}
          />
          {/* <div
            className="ag-theme-quartz"
            style={{ height: 400, width: "100%" }}
          >
            <AgGridReact
              rowData={visits}
              columnDefs={columns}
              pagination={true}
              paginationPageSize={5}
              checkboxSelection={true}
              suppressCellSelection={true}
            />
          </div> */}
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
