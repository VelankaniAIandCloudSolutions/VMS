import * as React from "react";
import { useState } from "react";

import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { toast } from "react-toastify";
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
const VisitsDataGrid = ({ visits, session, onUpdatedVisits }) => {
  const filteredVisits = visits.filter(
    (row) => row?.host_id === session?.user?.user_id
  );

  const [filterStatus, setFilterStatus] = React.useState("All");

  const handleApprove = (visitId) => {
    axiosInstance
      .put(`/api/invitations/${visitId}`, {
        status: "Approved", // Set status to 'Approved' in the request body
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Update local state to reflect the approved visit
          // const updatedVisits = visits.map((visit) =>
          //   visit.id === visitId ? { ...visit, status: "Approved" } : visit
          // );
          onUpdatedVisits(response.data.visits);
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
    axiosInstance
      .put(`/api/invitations/${visitId}`, {
        status: "Declined", // Set status to 'Declined' in the request body
      })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          // Update local state to reflect the rejected visit
          // const updatedVisits = visits.map((visit) =>
          //   visit.id === visitId ? { ...visit, status: "Declined" } : visit
          // );
          onUpdatedVisits(response.data.visits);
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
      field: "Host",
      headerName: "Host Name",
      width: 200,

      valueGetter: (params) => {
        // console.log("params in Host:", params); // Check what params contains
        return `${params?.first_name || ""} ${params?.last_name || ""}`;
      },
    },
    // { field: "host_id", headerName: "Host ID", width: 150 },
    { field: "purpose", headerName: "Purpose", width: 200 },

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
              // disabled={isAdmin ? false : !isHost}
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
              // disabled={isAdmin ? false : !isHost}
            >
              Reject
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <Box
      sx={{
        display: "grid",
      }}
    >
      {visits.length === 0 ? (
        <CircularProgress color="primary" />
      ) : (
        <DataGrid
          rows={session?.user?.role === "admin" ? visits : filteredVisits}
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
  );
};

export default VisitsDataGrid;
