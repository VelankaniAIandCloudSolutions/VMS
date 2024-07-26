// components/ScheduleVisitForm.js

import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const dayjs = require("dayjs");
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosConfig";
import CircularProgress from "@mui/material";

import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

const ScheduleVisitForm = ({
  visitTypes,
  users,
  locations,
  handleCloseModal,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    visit_date_time: "",
    location_id: "",
    purpose: "",
    visit_type_id: "",
    host_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    console.log("sasasas");
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDateTimeChange = (dateTime) => {
    const formattedDateTime = dateTime?.format("YYYY-MM-DD HH:mm:ss");
    console.log("formdatted date time", formattedDateTime);
    setFormData({
      ...formData,
      visit_date_time: formattedDateTime,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission logic here
  //   console.log(formData);
  // };
  useEffect(() => {
    if (status === "authenticated" && session.user.role === "staff") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        host_id: session?.user?.user_id,
      }));
    }
  }, [status, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); //

    try {
      // const sessionCookie =
      //   Cookies.get("next-auth.session-token") ||
      //   Cookies.get("__Secure-next-auth.session-token");

      // const response = await axiosInstance.post(
      //   "/api/invitations/createVisit",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Cookie: `next-auth.session-token=${sessionCookie}`,
      //     },
      //     withCredentials: true,
      //   }
      // );

      const response = await axiosInstance.post(
        "/api/invitations/createVisit",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("fromData", formData);

      const { visit_id } = response.data.visit;
      if (response?.data?.visit) {
        setLoading(false);
      }

      handleCloseModal();

      console.log("Session Data on Submit:", session);
      console.log("Session Status on Submit:", status);

      if (session) {
        router.push("/invitations");
      } else {
        router.push(`/scheduleVisitConfirmation?visitId=${visit_id}`);
      }

      console.log("Session Data on Submit:", session);

      console.log("Visit created successfully:", response.data.visit);
      toast.success("Visit created successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.reload();
    } catch (error) {
      setLoading(false);
      toast.error(`Error creating visit!!`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Error creating visit:", error.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1, width: "100%" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Choose Date & Time"
                value={formData.dateTime}
                onChange={handleDateTimeChange}
                sx={{
                  mt: 2,
                  width: "100%",
                  ".MuiDialog-paper": {
                    width: "280px",
                    ".MuiPickersToolbar-root": {
                      minHeight: "40px",
                    },
                    ".MuiPickersCalendarHeader-root": {
                      minHeight: "40px",
                    },
                    ".MuiPickersDay-root": {
                      fontSize: "0.75rem",
                    },
                    ".MuiTypography-root": {
                      fontSize: "0.75rem",
                    },
                  },
                }}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="location-label">Location</InputLabel>
              <Select
                labelId="location-label"
                id="location"
                value={formData.location_id}
                onChange={handleChange}
                label="Location"
                name="location_id"
              >
                {locations.map((location) => (
                  <MenuItem
                    key={location.location_id}
                    value={location.location_id}
                  >
                    {location.location_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="purpose"
              label="Purpose of Visit"
              name="purpose"
              autoComplete="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="host-label">Host</InputLabel>
              <Select
                labelId="host-label"
                id="host"
                value={formData.host_id}
                onChange={handleChange}
                label="Host"
                name="host_id"
                disabled={session?.user?.role === "staff"}
              >
                {users.map((host) => (
                  <MenuItem key={host.user_id} value={host.user_id}>
                    {host?.first_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel id="visit-type-label">Visit Type</InputLabel>
              <Select
                labelId="visit-type-label"
                id="visit-type"
                value={formData.visit_type_id}
                onChange={handleChange}
                label="Visit Type"
                name="visit_type_id"
              >
                {visitTypes.map((visitType) => (
                  <MenuItem
                    key={visitType.visit_type_id}
                    value={visitType.visit_type_id}
                  >
                    {visitType?.visit_type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Schedule
        </Button>
      </Box>
    </Box>
  );
};

export default ScheduleVisitForm;

// components/ScheduleVisitForm.js

// import React, { useEffect, useState } from "react";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
// import { useSession } from "next-auth/react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// const dayjs = require("dayjs");
// import { useRouter } from "next/router";

// import axios from "axios";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
// } from "@mui/material";

// const ScheduleVisitForm = ({
//   visitTypes,
//   users,
//   locations,
//   handleCloseModal,
//   onSuccess, // Accepting onSuccess prop
// }) => {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     visit_date_time: "",
//     location_id: "",
//     purpose: "",
//     visit_type_id: "",
//     host_id: "",
//   });

//   const handleChange = (e) => {
//     console.log("sasasas");
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
//   const handleDateTimeChange = (dateTime) => {
//     // Assuming dateTime is a single value containing both date and time
//     const formattedDateTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
//     console.log("formdatted date time", formattedDateTime);
//     setFormData({
//       ...formData,
//       visit_date_time: formattedDateTime,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axiosInstance.post(
//         "/api/invitations/createVisit",
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("formData", formData);

//       const { visit_id } = response.data.visit;
//       handleCloseModal();

//       // Log session data and status before redirecting
//       console.log("Session Data on Submit:", session);
//       console.log("Session Status on Submit:", status);

//       if (session) {
//         router.push("/invitations");
//       } else {
//         router.push(`/scheduleVisitConfirmation?visitId=${visit_id}`);
//       }

//       console.log("Session Data on Submit:", session);

//       console.log("Visit created successfully:", response.data.visit);

//       // Calling onSuccess prop function with the newly created visit
//       if (onSuccess) {
//         onSuccess(response.data.visit);
//       }

//       toast.success("Visit created successfully!", {
//         position: "bottom-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       // Handle further logic after successful API call, such as updating state, redirecting, etc.
//     } catch (error) {
//       toast.error(`Error creating visit!!`, {
//         position: "bottom-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       console.error("Error creating visit:", error.message);
//       // Handle error scenario, such as displaying an error message to the user
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         position: "relative",
//       }}
//     >
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         noValidate
//         sx={{ mt: 1, width: "100%" }}
//       >
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="firstName"
//               label="First Name"
//               name="firstName"
//               autoComplete="given-name"
//               autoFocus
//               value={formData.firstName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="lastName"
//               label="Last Name"
//               name="lastName"
//               autoComplete="family-name"
//               value={formData.lastName}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="phone"
//               label="Phone Number"
//               name="phone"
//               autoComplete="phone"
//               value={formData.phone}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DateTimePicker
//                 label="Choose Date & Time"
//                 value={formData.dateTime}
//                 onChange={handleDateTimeChange}
//                 sx={{ mt: 2, width: "100%" }}
//                 // ampm={false}
//                 viewRenderers={{
//                   hours: renderTimeViewClock,
//                   minutes: renderTimeViewClock,
//                   seconds: renderTimeViewClock,
//                 }}
//               />
//             </LocalizationProvider>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
//               <InputLabel id="location-label">Location</InputLabel>
//               <Select
//                 labelId="location-label"
//                 id="location"
//                 value={formData.location_id}
//                 onChange={handleChange}
//                 label="Location"
//                 name="location_id"
//               >
//                 {locations.map((location) => (
//                   <MenuItem
//                     key={location.location_id}
//                     value={location.location_id}
//                   >
//                     {location.location_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="purpose"
//               label="Purpose of Visit"
//               name="purpose"
//               autoComplete="purpose"
//               value={formData.purpose}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
//               <InputLabel id="host-label">Host</InputLabel>
//               <Select
//                 labelId="host-label"
//                 id="host"
//                 value={formData.host_id}
//                 onChange={handleChange}
//                 label="Host"
//                 name="host_id"
//               >
//                 {users.map((host) => (
//                   <MenuItem key={host.user_id} value={host.user_id}>
//                     {host?.first_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
//               <InputLabel id="visit-type-label">Visit Type</InputLabel>
//               <Select
//                 labelId="visit-type-label"
//                 id="visit-type"
//                 value={formData.visit_type_id}
//                 onChange={handleChange}
//                 label="Visit Type"
//                 name="visit_type_id"
//               >
//                 {visitTypes.map((visitType) => (
//                   <MenuItem
//                     key={visitType.visit_type_id}
//                     value={visitType.visit_type_id}
//                   >
//                     {visitType?.visit_type}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           color="primary"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           Schedule
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ScheduleVisitForm;
