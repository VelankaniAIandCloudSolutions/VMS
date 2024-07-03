// FilteredVisitsDataGrid.js

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const FilteredVisitsDataGrid = ({ filteredVisits, visit, onUpdatedVisits }) => {
  const [updatedVisit, setUpdatedVisit] = useState(filteredVisits);

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

  const handleCheckIn = async (visitId) => {
    try {
      const currentDateTime = new Date();
      const formattedCheckInTime = formatDateToMySQL(currentDateTime);
      const response = await axios.put(
        `http://localhost:3000/api/logbook/${visitId}`,
        {
          checkin_time: formattedCheckInTime,
        }
      );
      onUpdatedVisits(response.data.visits);
      toast.success("CheckIn Successfully. ", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Error in CheckIn . ", {
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
  };

  const handleCheckOut = async (visitId) => {
    try {
      const currentDateTime = new Date();
      const formattedCheckInTime = formatDateToMySQL(currentDateTime);
      const response = await axios.put(
        `http://localhost:3000/api/logbook/${visitId}`,
        {
          checkout_time: formattedCheckInTime,
        }
      );
      onUpdatedVisits(response.data.visits);
      toast.success("Checkout Successfully. ", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Error in CheckOut . ", {
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
    { field: "confirmation_id", headerName: "ID", width: 120, sortable: false },
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
  console.log("UpdatedVisit", updatedVisit);

  return (
    <DataGrid
      className="custom-datagrid"
      rows={filteredVisits}
      columns={columns}
      getRowId={(row) => row.visit_id}
      pageSize={5}
    />
  );
};

export default FilteredVisitsDataGrid;
