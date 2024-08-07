// import React, { useState, useEffect } from "react";
// import {
//   Grid,
//   Container,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   List,
//   ListItem,
//   Button,
//   Card,
//   Typography,
//   Link,
//   Breadcrumbs,
//   Box,
//   CircularProgress,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { DataGrid } from "@mui/x-data-grid";
// import PlusIcon from "@mui/icons-material/Add";
// import Layout from "../components/Layout";
// import NextLink from "next/link";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import dayjs from "dayjs";
// import { useTheme } from "@mui/material/styles";

// import { styled } from "@mui/system";
// import axios from "axios";
// import Modal from "@/components/Modal";
// import ScheduleVisitForm from "@/components/ScheduleVisitForm";
// import { toast } from "react-toastify";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import FilteredVisitsDataGrid from "@/components/logbook";
// import { useSession } from "next-auth/react";
// import axiosInstance from "@/utils/axiosConfig";
// import useSWR from "swr";
// import Spinner from "@/components/spinner";
// import { useRouter } from "next/router";

// const theme = createTheme();

// const fetcher = async (url) => {
//   try {
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch data");
//   }
// };

// const breadcrumbs = [
//   <NextLink href="/" key="1" passHref>
//     <Link underline="hover" color="inherit">
//       Home
//     </Link>
//   </NextLink>,
//   <Typography key="2" color="textPrimary">
//     LogBook
//   </Typography>,
// ];

// const Logbook = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [date, setDate] = useState(dayjs());
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filter, setFilter] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const { data: initialVisit, error: initialVisitError } = useSWR(
//     "/api/invitations/all",
//     fetcher
//   );
//   const { data: visitData, error: visitDataError } = useSWR(
//     "/api/get-data",
//     fetcher
//   );

//   // Ensure visit and updatedVisit are initialized properly
//   const visit = initialVisit?.visits || [];
//   const [updatedVisit, setUpdatedVisit] = useState(visit);

//   console.log("Session Data:", session);

//   useEffect(() => {
//     if (initialVisit) {
//       setUpdatedVisit(initialVisit?.visits || []);
//     }
//   }, [initialVisit]);

//   useEffect(() => {
//     if (status === "loading") {
//       return; // Wait for session status to be determined
//     }
//     if (status === "unauthenticated") {
//       router.push("/signin"); // Redirect to sign-in page if not authenticated
//     }
//   }, [status, router]);
//   if (initialVisitError || visitDataError) {
//     console.error("Error fetching data:", initialVisitError || visitDataError);
//     return <div>Error loading data.</div>;
//   }

//   if (!initialVisit || !visitData) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           backgroundColor: "#FFFFFF",
//           color: "#ffffff",
//         }}
//       >
//         <CircularProgress size={60} />
//       </div>
//     );
//   }

//   const { users, locations } = visitData;

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleDateChange = (newDate) => {
//     setDate(newDate);
//   };

//   const handleFilterChange = (event) => {
//     setFilter(event.target.value);
//   };

//   const isSameDay = (date1, date2) => {
//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };

//   const handleUpdatedVisits = (updatedVisits) => {
//     setUpdatedVisit(updatedVisits);
//   };

//   const filteredVisits = updatedVisit.filter((row) => {
//     const visitorName =
//       `${row.Visitor.first_name} ${row.Visitor.last_name}`.toLowerCase();
//     const nameMatch = visitorName.includes(searchQuery.toLowerCase());

//     const visitDate = new Date(row.visit_date_time);
//     const selectedDate = date ? new Date(date) : null;

//     let dateMatch = true;
//     if (selectedDate && !isSameDay(visitDate, selectedDate)) {
//       dateMatch = false;
//     }

//     let statusMatch = true;
//     if (filter === "Expected") {
//       statusMatch = !row.checkin_time;
//     } else if (filter === "Checked in") {
//       statusMatch = row.checkin_time && !row.checkout_time;
//     } else if (filter === "Checked out") {
//       statusMatch = row.checkin_time && row.checkout_time;
//     }

//     return nameMatch && dateMatch && statusMatch;
//   });

//   const CustomListItem = styled(ListItem)({
//     paddingTop: 0,
//     paddingBottom: 0,
//   });

//   const CustomFormControlLabel = styled(FormControlLabel)({
//     margin: 0,
//   });

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   return (
//     <Layout>
//       <Card
//         variant="outlined"
//         sx={{ px: isMobile ? 2 : 4, py: isMobile ? 2 : 4 }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isMobile ? "column" : "row",
//             justifyContent: isMobile ? "center" : "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               alignItems: "center",
//             }}
//           >
//             <Typography
//               variant="h4"
//               component="h1"
//               sx={{
//                 mr: isMobile ? 0 : 2,
//                 textAlign: isMobile ? "center" : "left",
//               }}
//             >
//               LogBook
//             </Typography>
//             <Breadcrumbs
//               aria-label="breadcrumb"
//               sx={{ justifyContent: isMobile ? "center" : "flex-start" }}
//             >
//               {breadcrumbs}
//             </Breadcrumbs>
//           </Box>
//         </Box>
//         <Grid
//           container
//           justifyContent="flex-start"
//           alignItems="flex-start"
//           className="mt-2"
//           spacing={2}
//         >
//           <Grid item xs={6}>
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<PlusIcon />}
//               onClick={handleOpenModal}
//             >
//               Create Invite
//             </Button>
//           </Grid>
//           <Grid item xs={3}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Select Date"
//                 value={date}
//                 onChange={(newDate) => handleDateChange(newDate)}
//                 renderInput={(params) => <TextField {...params} />}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={3}>
//             <TextField
//               label="Search"
//               variant="outlined"
//               sx={{ width: "100%" }}
//               value={searchQuery}
//               onChange={handleSearch}
//             />
//           </Grid>
//         </Grid>

//         <Grid container spacing={2} className="mt-3">
//           <Grid item xs={3}>
//             <h3>Filters</h3>
//             <List dense>
//               <CustomListItem>
//                 <CustomFormControlLabel
//                   control={
//                     <Checkbox
//                       checked={filter === "All"}
//                       onChange={handleFilterChange}
//                       value="All"
//                     />
//                   }
//                   label="All"
//                 />
//               </CustomListItem>
//               <CustomListItem>
//                 <CustomFormControlLabel
//                   control={
//                     <Checkbox
//                       checked={filter === "Expected"}
//                       onChange={handleFilterChange}
//                       value="Expected"
//                     />
//                   }
//                   label="Expected"
//                 />
//               </CustomListItem>
//               <CustomListItem>
//                 <CustomFormControlLabel
//                   control={
//                     <Checkbox
//                       checked={filter === "Checked in"}
//                       onChange={handleFilterChange}
//                       value="Checked in"
//                     />
//                   }
//                   label="Checked in"
//                 />
//               </CustomListItem>
//               <CustomListItem>
//                 <CustomFormControlLabel
//                   control={
//                     <Checkbox
//                       checked={filter === "Checked out"}
//                       onChange={handleFilterChange}
//                       value="Checked out"
//                     />
//                   }
//                   label="Checked out"
//                 />
//               </CustomListItem>
//             </List>
//           </Grid>

//           <Grid item xs={9}>
//             <FilteredVisitsDataGrid
//               filteredVisits={filteredVisits}
//               session={session}
//               onUpdatedVisits={handleUpdatedVisits}
//             />
//           </Grid>
//         </Grid>

//         <Modal
//           open={isModalOpen}
//           handleClose={handleCloseModal}
//           title="Schedule a Visit"
//         >
//           <Container>
//             <ScheduleVisitForm
//               visitTypes={visit}
//               users={users}
//               locations={locations}
//               handleCloseModal={handleCloseModal}
//             />
//           </Container>
//         </Modal>
//       </Card>
//     </Layout>
//   );
// };

// export default Logbook;

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
import FilteredVisitsDataGrid from "@/components/logbook";
import { useSession } from "next-auth/react";
import Spinner from "@/components/spinner";
import axiosInstance from "@/utils/axiosConfig";
import { useRouter } from "next/router";

const theme = createTheme();

export async function getServerSideProps(context) {
  try {
    console.log("API call inside getServerSideProps");

    const response = await axiosInstance.get("api/invitations/all");
    const response_visit = await axiosInstance.get("api/get-data");

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  console.log("Session Data:", session);

  console.log("visits", visit);
  console.log("locations", users);

  useEffect(() => {
    if (status === "loading") {
      return; // Wait for session status to be determined
    }
    if (status === "unauthenticated") {
      router.push("/signin"); // Redirect to sign-in page if not authenticated
    }
  }, [status, router]);
  useEffect(() => {
    if (visit.length > 0 && users.length > 0 && locations.length > 0) {
      setLoading(false);
    }
  }, [visit, users, locations]);

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

  const handleUpdatedVisits = (updatedVisits) => {
    setUpdatedVisit(updatedVisits);
  };

  const filteredVisits = updatedVisit.filter((row) => {
    const visitorName =
      `${row.Visitor.first_name} ${row.Visitor.last_name}`.toLowerCase();
    const nameMatch = visitorName.includes(searchQuery.toLowerCase());

    const visitDate = new Date(row.visit_date_time);
    const selectedDate = date ? new Date(date) : null;

    let dateMatch = true;
    if (selectedDate && !isSameDay(visitDate, selectedDate)) {
      dateMatch = false;
    }

    let statusMatch = true;
    if (filter === "Expected") {
      statusMatch = !row.checkin_time;
    } else if (filter === "Checked in") {
      statusMatch = row.checkin_time && !row.checkout_time;
    } else if (filter === "Checked out") {
      statusMatch = row.checkin_time && row.checkout_time;
    }

    return nameMatch && dateMatch && statusMatch;
  });

  const CustomListItem = styled(ListItem)({
    paddingTop: 0,
    paddingBottom: 0,
  });

  const CustomFormControlLabel = styled(FormControlLabel)({
    margin: 0,
  });

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Layout>
      <Card
        variant="outlined"
        sx={{ px: isMobile ? 2 : 4, py: isMobile ? 2 : 4 }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
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
              alignItems="flex-start"
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
                  value={searchQuery}
                  onChange={handleSearch}
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
                <FilteredVisitsDataGrid
                  filteredVisits={filteredVisits}
                  session={session}
                  onUpdatedVisits={handleUpdatedVisits}
                />
              </Grid>
            </Grid>

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
          </>
        )}
      </Card>
    </Layout>
  );
};

export default Logbook;
