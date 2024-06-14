// components/ScheduleVisitForm.js

import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const ScheduleVisitForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    purpose: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="date"
          label="Date"
          name="date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.date}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="time"
          label="Time"
          name="time"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          value={formData.time}
          onChange={handleChange}
        />
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
