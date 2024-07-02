import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Button,
  Card,
  Typography,
  Link,
  Breadcrumbs,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import PlusIcon from "@mui/icons-material/Add";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { styled } from "@mui/system";
import axios from "axios";
import Modal from "@/components/Modal";
import ScheduleVisitForm from "@/components/ScheduleVisitForm";
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";

const theme = createTheme();

export async function getServerSideProps() {
  try {
    console.log("API call inside getServerSideProps");
    const response = await axios.get(
      "http://localhost:3000/api/invitations/all"
    );
    const response_visit = await axios.get(
      "http://localhost:3000/api/invitations/create-visit"
    );

    const visit = response.data.visits;

    const users = response_visit.data.users;
    const locations = response_visit.data.locations;

    console.log(visit);

    return {
      props: {
        visit,
        users,
        locations,
      },
    };
  } catch (error) {
    console.error("Error fetching visit types:", error);
    return {
      props: {
        visit: [],
        users: [],
      },
    };
  }
}
const breadcrumbs = [
  <NextLink href="/" key="1" passHref>
    <Link underline="hover" color="inherit">
      Home
    </Link>
  </NextLink>,
  <Typography key="2" color="textPrimary">
    LogBook
  </Typography>,
];

const Logbook = ({ visit, users, locations }) => {
  const [date, setDate] = useState(dayjs());
  const [updatedVisit, setUpdatedVisit] = useState(visit);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  console.log("visits", visit);
  console.log("locations", users);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const filteredVisits = updatedVisit.filter((row) => {
    const visitDate = new Date(row.visit_date_time);
    const selectedDate = date ? new Date(date) : null;

    if (selectedDate && !isSameDay(visitDate, selectedDate)) {
      return false;
    }
    if (filter === "Expected") {
      return !row.checkin_time;
    } else if (filter === "Checked in") {
      return row.checkin_time && !row.checkout_time;
    } else if (filter === "Checked out") {
      return row.checkin_time && row.checkout_time;
    }
    return true;
  });

  const CustomListItem = styled(ListItem)({
    paddingTop: 0,
    paddingBottom: 0,
  });

  const CustomFormControlLabel = styled(FormControlLabel)({
    margin: 0,
  });

  const formatTime12hr = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
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
      setUpdatedVisit(response.data.visits);
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
      setUpdatedVisit(response.data.visits);
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

  const calculateDurationInMinutes = (checkinTime, checkoutTime) => {
    if (checkinTime && checkoutTime) {
      const duration =
        (new Date(checkoutTime) - new Date(checkinTime)) / (1000 * 60); // convert to minutes
      return duration.toFixed(2) + " minutes";
    }
    return "N/A";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Card
          variant="outlined"
          sx={{ px: isMobile ? 2 : 4, py: isMobile ? 2 : 4 }}
        >
          <Container>
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
                  LogBook
                </Typography>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ justifyContent: isMobile ? "center" : "flex-start" }}
                >
                  {breadcrumbs}
                </Breadcrumbs>
              </Box>
            </Box>
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              className="mt-2"
              spacing={2}
            >
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlusIcon />}
                  onClick={handleOpenModal}
                >
                  Create Invite
                </Button>
              </Grid>
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={(newDate) => handleDateChange(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Search"
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} className="mt-3">
              <Grid item xs={3}>
                <h3>Filters</h3>
                <List dense>
                  <CustomListItem>
                    <CustomFormControlLabel
                      control={
                        <Checkbox
                          checked={filter === "All"}
                          onChange={handleFilterChange}
                          value="All"
                        />
                      }
                      label="All"
                    />
                  </CustomListItem>
                  <CustomListItem>
                    <CustomFormControlLabel
                      control={
                        <Checkbox
                          checked={filter === "Expected"}
                          onChange={handleFilterChange}
                          value="Expected"
                        />
                      }
                      label="Expected"
                    />
                  </CustomListItem>
                  <CustomListItem>
                    <CustomFormControlLabel
                      control={
                        <Checkbox
                          checked={filter === "Checked in"}
                          onChange={handleFilterChange}
                          value="Checked in"
                        />
                      }
                      label="Checked in"
                    />
                  </CustomListItem>
                  <CustomListItem>
                    <CustomFormControlLabel
                      control={
                        <Checkbox
                          checked={filter === "Checked out"}
                          onChange={handleFilterChange}
                          value="Checked out"
                        />
                      }
                      label="Checked out"
                    />
                  </CustomListItem>
                </List>
              </Grid>

              <Grid item xs={9}>
                <DataGrid
                  className="custom-datagrid"
                  rows={filteredVisits}
                  columns={columns}
                  getRowId={(row) => row.visit_id}
                  pageSize={5}
                />
              </Grid>
            </Grid>
          </Container>

          <Modal
            open={isModalOpen}
            handleClose={handleCloseModal}
            title="Schedule a Visit"
          >
            <Container>
              <ScheduleVisitForm
                visitTypes={visit}
                users={users}
                locations={locations}
                handleCloseModal={handleCloseModal}
              />
            </Container>
          </Modal>
        </Card>
      </ThemeProvider>
    </Layout>
  );
};

export default Logbook;
