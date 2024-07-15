import * as React from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "@/utils/axiosConfig";

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

const DataGridAllInvitationsStatusChange = ({
  visits,
  setVisits,
  filterStatus,
  setFilterStatus,
}) => {
  const handleApprove = (visitId) => {
    axiosInstance
      .put(`/api/invitations/${visitId}`, {
        status: "Approved",
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
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
        } else {
          throw new Error(
            `Failed to approve visit ${visitId}. Status: ${response.status}`
          );
        }
      })
      .catch((error) => {
        console.error(`Error approving visit ${visitId}:`, error);
        toast.error(`Error approving visit: ${error.response.data.error}`, {
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
    axiosInstance
      .put(`/api/invitations/${visitId}`, {
        status: "Declined",
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
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
        } else {
          throw new Error(
            `Failed to reject visit ${visitId}. Status: ${response.status}`
          );
        }
      })
      .catch((error) => {
        console.error(`Error rejecting visit ${visitId}:`, error);
        toast.error(`Error declining visit: ${error.response.data.error}`, {
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
              onClick={() => handleReject(params.row.visit_id)}
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
    <DataGrid
      rows={visits}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      disableSelectionOnClick
      autoHeight
      getRowId={(row) => row.visit_id}
      columnVisibilityModel={{
        visit_id: false,
      }}
      density="comfortable"
      components={{
        Toolbar: () => (
          <CustomToolbar
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        ),
      }}
    />
  );
};

export default DataGridAllInvitationsStatusChange;
