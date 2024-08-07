import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
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
import VisitsDataGrid from "@/components/invitations"; // Correct the import path if necessary
import axiosInstance from "@/utils/axiosConfig"; // Correct the import path if necessary
import useSWR from "swr";
import Spinner from "@/components/spinner";

const CreateInviteButton = styled(Button)({
  marginLeft: "auto",
});

const breadcrumbs = [
  <NextLink href="/" key="1" passHref>
    <Link underline="hover" color="inherit">
      Home
    </Link>
  </NextLink>,
  <Typography key="2" color="textPrimary">
    Dashboard
  </Typography>,
];

const fetcher = async (url) => {
  try {
    const response = await axiosInstance.get(
      "/api/adminDashboard/visitCounts/"
    );

    const allVisits = await axiosInstance.get("/api/invitations/all");

    const visitCounts = response.data.visitCounts;
    const initialVisits = allVisits.data.visits;

    return {
      props: {
        visitCounts,
        initialVisits,
      },
    };
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

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

export default function Dashboard() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: visitCountsData, error: visitCountsError } = useSWR(
    "/api/adminDashboard/visitCounts/",
    fetcher
  );

  const { data: initialVisitsData, error: initialVisitsError } = useSWR(
    "/api/invitations/all",
    fetcher
  );

  const { data: session, status } = useSession();

  const initialVisits = initialVisitsData?.visits || [];
  const visitCounts = visitCountsData?.visitCounts || [];

  const [updatedVisit, setUpdatedVisit] = useState(initialVisits);

  useEffect(() => {
    if (initialVisitsData) {
      setUpdatedVisit(initialVisitsData.visits);
    }
  }, [initialVisitsData]);

  useEffect(() => {
    if (status === "loading") {
      return; // Wait for session status to be determined
    }
    if (status === "unauthenticated") {
      router.push("/signin"); // Redirect to sign-in page if not authenticated
    }
  }, [status, router]);

  const handleUpdatedVisits = (updatedVisits) => {
    setUpdatedVisit(updatedVisits);
  };

  if (
    (!initialVisitsData && !initialVisitsError) ||
    (!visitCountsData && !visitCountsError)
  ) {
    return <Spinner />;
  }

  if (visitCountsError) {
    console.error("Error fetching visit counts data:", visitCountsError);
    return <div>Error fetching visit counts data.</div>;
  }

  if (initialVisitsError) {
    console.error("Error fetching initial visits data:", initialVisitsError);
    return <div>Error fetching initial visits data.</div>;
  }
  // const handleOpenCreateModal = () => setCreateModalOpen(true);
  // const handleCloseCreateModal = () => setCreateModalOpen(false);

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
              Dashboard
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
        <VisitsDataGrid
          visits={updatedVisit}
          session={session}
          onUpdatedVisits={handleUpdatedVisits}
        />
      </Card>
      <ToastContainer />
    </Layout>
  );
}
