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
import axiosInstance from "@/utils/axiosConfig";
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations/create-visit`
    );
    const visitTypes = response.data.visitTypes;
    const users = response.data.users;
    const locations = response.data.locations;

    // Fetch visits
    const visitsResponse = await axiosInstance.get("/api/invitations/all");
    const initialVisits = visitsResponse.data.visits;

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
      </Card>
    </Layout>
  );
}
