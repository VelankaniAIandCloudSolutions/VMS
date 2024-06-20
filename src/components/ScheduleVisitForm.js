// components/ScheduleVisitForm.js

import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";

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
} from "@mui/material";

const ScheduleVisitForm = ({ visitTypes, users }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    purpose: "",
    visit_type_id: "",
    host_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(name, value);
    console.log(formData);
  };
  const handleDateTimeChange = (dateTime) => {
    // Assuming dateTime is a single value containing both date and time
    setFormData({
      ...formData,

      dateTime: dateTime,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
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
        sx={{ mt: 3, width: "100%" }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="fullName"
          label="Full Name"
          name="fullName"
          autoComplete="name"
          autoFocus
          value={formData.fullName}
          onChange={handleChange}
        />
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Choose Date & Time"
            // value={formData.dateTime} // Assuming this DateTimePicker provides combined date and time
            onChange={handleDateTimeChange}
            sx={{ mt: 2, width: "100%" }}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
        </LocalizationProvider>

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
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
          <InputLabel id="host-label">Host</InputLabel>
          <Select
            labelId="host-label"
            id="host"
            value={formData.host_id}
            onChange={handleChange}
            label="Host"
            name="host_id"
          >
            {users.map((host) => (
              <MenuItem key={host.id} value={host.id}>
                {host.first_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
