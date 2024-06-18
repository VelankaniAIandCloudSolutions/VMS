import * as React from "react";
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
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import Layout from "../components/Layout"; // Adjust the import path as per your project structure
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    Invitations
  </Typography>,
];

const sampleData = [
  { id: 1, name: "John Doe", date: "2024-06-17", status: "Pending" },
  { id: 2, name: "Jane Smith", date: "2024-06-18", status: "Confirmed" },
  { id: 3, name: "Bob Johnson", date: "2024-06-19", status: "Pending" },
];

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 150, editable: true },
  { field: "date", headerName: "Date", width: 150, editable: true },
  { field: "status", headerName: "Status", width: 150, editable: true },
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
        0
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

export default function Invitations() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [filterStatus, setFilterStatus] = React.useState("All");

  const filteredRows = React.useMemo(() => {
    if (filterStatus === "All") {
      return sampleData;
    }
    return sampleData.filter((row) => row.status === filterStatus);
  }, [filterStatus]);

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
            sx={{ mt: isMobile ? 2 : 0 }}
          >
            Create Invite
          </CreateInviteButton>
        </Box>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
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
        </Box>
      </Card>
    </Layout>
  );
}
