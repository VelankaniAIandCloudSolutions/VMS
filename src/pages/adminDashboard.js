import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "next-auth/react";
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
  Divider,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import Layout from "../components/Layout"; // Adjust the import path as per your project structure
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CloseIcon from "@mui/icons-material/Close";
import PendingIcon from "@mui/icons-material/Pending";
import TodayIcon from "@mui/icons-material/Today";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const CreateInviteButton = styled(Button)({
  marginLeft: "auto",
});

const breadcrumbs = [
  <NextLink href="/" key="1" passHref>
    Home
  </NextLink>,
  <Typography key="2" color="textPrimary">
    Dashboard
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
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.get(
      "http://localhost:3000/api/adminDashboard/visitCounts/"
    );
    // const allVisits = await axios.get(
    //   "http://localhost:3000/api/invitations/all"
    // );

    const visitCounts = response.data.visitCounts;

    return {
      props: {
        session,
        visitCounts,
        // allVisits,
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
        allVisits: [],
      },
    };
  }
}

const CardInfo = ({ count, icon: Icon, label }) => (
  <Card
    variant="outlined"
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      width: 200,
      height: 180,
      margin: 4, // Reduced margin to make cards closer
    }}
  >
    <Typography
      variant="h4"
      component="div"
      sx={{ fontWeight: "600", color: "#555" }}
    >
      {count}
    </Typography>
    {/* <Typography variant="body2" sx={{ color: "#aaa" }}>
      Today
    </Typography> */}

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: "#aaa",
        marginTop: 0.5,
      }}
    >
      <TodayIcon sx={{ fontSize: 18, marginRight: 1 }} />{" "}
      <Typography variant="body2">Today</Typography>
    </Box>
    <Icon sx={{ fontSize: 30, margin: "10px 0", color: "#888" }} />
    <Typography variant="body1" sx={{ color: "#333" }}>
      {label}
    </Typography>
  </Card>
);

export default function adminDashboard({ visitCounts, session }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              Admin Dashboard
            </Typography>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ justifyContent: isMobile ? "center" : "flex-start" }}
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          <CardInfo
            count={visitCounts?.pending_visit_count}
            icon={PendingIcon}
            label="Pending Visits"
          />
          <CardInfo
            count={visitCounts?.approved_visit_count}
            icon={HowToRegIcon}
            label="Accepted Visits"
          />
          <CardInfo
            count={visitCounts?.rejected_visit_count}
            icon={CloseIcon}
            label="Rejected Visits"
          />
          <CardInfo
            count={visitCounts?.completedMeetings}
            icon={EventAvailableIcon}
            label="Completed Meetings"
          />
        </Box>
        {/* <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.6)", mb: 4 }} />{" "} */}
        {/* Increased visibility of the divider */}
        {/* <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Visitation History
          </Typography>
          <DataGrid
            // rows={allVisits}
            columns={[
              { field: "name", headerName: "Name", flex: 1 },
              { field: "id", headerName: "ID", flex: 1 },
              { field: "email", headerName: "Email", flex: 1 },
              { field: "dueDate", headerName: "Due Date", flex: 1 },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </Box> */}
      </Card>
    </Layout>
  );
}
