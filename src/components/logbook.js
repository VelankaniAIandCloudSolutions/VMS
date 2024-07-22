// FilteredVisitsDataGrid.js

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosConfig";
import CircularProgress from "@mui/material/CircularProgress";
const FilteredVisitsDataGrid = ({
  filteredVisits,

  onUpdatedVisits,
  session,
}) => {
  const [loading, setLoading] = useState(false);
  const initialVisits = filteredVisits.filter(
    (row) => row?.host_id === session?.user?.user_id
  );

  const formatTime12hr = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const calculateDurationInMinutes = (checkinTime, checkoutTime) => {
    if (checkinTime && checkoutTime) {
      const duration =
        (new Date(checkoutTime) - new Date(checkinTime)) / (1000 * 60); // convert to minutes
      return duration.toFixed(2) + " minutes";
    }
    return "N/A";
  };

  // const handleCheckIn = async (visitId) => {
  //   setLoading(true);
  //   try {
  //     const currentDateTime = new Date();
  //     const formattedCheckInTime = formatDateToMySQL(currentDateTime);
  //     const response = await axiosInstance.put(`/api/logbook/${visitId}`, {
  //       checkin_time: formattedCheckInTime,
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       setLoading(false);
  //     }
  //     onUpdatedVisits(response.data.visits);
  //     toast.success("Checked-In Successfully. ", {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   } catch (error) {
  //     toast.error("Error Checking-In . ", {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });

  //     console.error("Error updating check-in:", error);
  //   }
  // };

  // const handleCheckOut = async (visitId) => {
  //   try {
  //     const currentDateTime = new Date();
  //     const formattedCheckInTime = formatDateToMySQL(currentDateTime);

  //     const response = await axiosInstance.put(`/api/logbook/${visitId}`, {
  //       checkout_time: formattedCheckInTime,
  //     });
  //     onUpdatedVisits(response.data.visits);
  //     toast.success("Checked-Out Successfully. ", {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   } catch (error) {
  //     toast.error("Error in Checking-Out . ", {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     console.error("Error updating check-out:", error);
  //   }
  // };

  const handleCheckIn = async (visitId) => {
    setLoading(true);
    try {
      const currentDateTime = new Date();
      const formattedCheckInTime = formatDateToMySQL(currentDateTime);
      const response = await axiosInstance.put(`/api/logbook/${visitId}`, {
        checkin_time: formattedCheckInTime,
      });

      if (response.status === 200 || response.status === 201) {
        onUpdatedVisits(response.data.visits);
        toast.success("Checked-In Successfully. ", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error Checking-In . ", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error updating check-in:", error);
    }
    setLoading(false);
  };

  const handleCheckOut = async (visitId) => {
    setLoading(true);
    try {
      const currentDateTime = new Date();
      const formattedCheckOutTime = formatDateToMySQL(currentDateTime);

      const response = await axiosInstance.put(`/api/logbook/${visitId}`, {
        checkout_time: formattedCheckOutTime,
      });
      onUpdatedVisits(response.data.visits);
      toast.success("Checked-Out Successfully. ", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      setLoading(false);
      toast.error("Error in Checking-Out . ", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error updating check-out:", error);
    }
    setLoading(false);
  };

  const formatDateToMySQL = (datetime) => {
    const pad = (n) => (n < 10 ? "0" + n : n);

    const year = datetime.getFullYear();
    const month = pad(datetime.getMonth() + 1);
    const day = pad(datetime.getDate());
    const hours = pad(datetime.getHours());
    const minutes = pad(datetime.getMinutes());
    const seconds = pad(datetime.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const columns = [
    {
      field: "Visitor",
      headerName: "Visitor",
      width: 200,
      valueGetter: (params) => `${params.first_name} ${params.last_name}`,
    },
    {
      field: "Host",
      headerName: "Host",
      width: 200,
      valueGetter: (params) => `${params.first_name} ${params.last_name}`,
    },
    {
      field: "confirmation_id",
      headerName: "Confirmation ID",
      width: 120,
      sortable: false,
    },
    {
      field: "checkin_time",
      headerName: "Check in",
      width: 160,
      renderCell: (params) => {
        if (params.row.checkin_time) {
          const checkInTime = formatTime12hr(params.row.checkin_time);
          return checkInTime;
        } else {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCheckIn(params.row.visit_id)}
            >
              Check in
            </Button>
          );
        }
      },
    },
    {
      field: "checkout_time",
      headerName: "Check out",
      width: 160,
      renderCell: (params) => {
        if (params.row.checkout_time) {
          const checkOutTime = formatTime12hr(params.row.checkout_time);
          return checkOutTime;
        } else {
          return (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleCheckOut(params.row.visit_id)}
              disabled={!params.row.checkin_time}
            >
              Check Out
            </Button>
          );
        }
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 120,
      renderCell: (params) => {
        const checkinTime = params.row.checkin_time;
        const checkoutTime = params.row.checkout_time;
        return calculateDurationInMinutes(checkinTime, checkoutTime);
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          className="custom-datagrid"
          rows={
            session?.user?.role === "admin" ? filteredVisits : initialVisits
          }
          columns={columns}
          getRowId={(row) => row.visit_id}
          pageSize={5}
        />
      )}
    </Box>
  );
};

export default FilteredVisitsDataGrid;
