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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import PlusIcon from "@mui/icons-material/Add";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/system";
import axios from "axios";

const theme = createTheme();

export async function getServerSideProps() {
  try {
    console.log("API call inside getServerSideProps");
    const response = await axios.get(
      "http://localhost:3000/api/invitations/all"
    );

    const visit = response.data.visits;

    console.log(visit);

    return {
      props: {
        visit,
      },
    };
  } catch (error) {
    console.error("Error fetching visit types:", error);
    return {
      props: {
        visit: [],
      },
    };
  }
}

const Logbook = ({ visit }) => {
  const [date, setDate] = useState(null);
  console.log("visits", visit);
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const breadcrumbs = [
    <NextLink href="/" key="1" passHref>
      <Link underline="hover" color="inherit">
        Home
      </Link>
    </NextLink>,
    <Typography key="2" color="textPrimary">
      Visitor's LogBook
    </Typography>,
  ];

  const CustomListItem = styled(ListItem)({
    paddingTop: 0,
    paddingBottom: 0,
  });

  const CustomFormControlLabel = styled(FormControlLabel)({
    margin: 0,
  });

  const columns = [
    {
      field: "visitorName",
      headerName: "Visitor",
      width: 200,
      valueGetter: (params) => `${params.first_name} ${params.last_name}`,
    },
    {
      field: "hostName",
      headerName: "Host",
      width: 200,
      valueGetter: (params) =>
        `${params.Host.first_name} ${params.Host.last_name}`,
    },
    { field: "visit_id", headerName: "ID", width: 120, sortable: false },
    { field: "checkin_time", headerName: "Check in", width: 160 },
    { field: "checkout_time", headerName: "Check out", width: 160 },
    {
      field: "VisitorEmail",
      headerName: "Email",
      width: 200,
      valueGetter: (params) => params.Visitor.email,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 120,
      valueGetter: (params) => {
        const checkinTime = new Date(params.checkin_time);
        const checkoutTime = new Date(params.checkout_time);
        const duration = (checkoutTime - checkinTime) / (1000 * 60 * 60); // convert to hours
        return duration.toFixed(2) + " hours";
      },
    },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Card>
          <Container>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              {breadcrumbs}
            </Breadcrumbs>
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
                      control={<Checkbox />}
                      label="All"
                    />
                  </CustomListItem>
                  <CustomListItem>
                    <CustomFormControlLabel
                      control={<Checkbox />}
                      label="Expected"
                    />
                  </CustomListItem>
                  <CustomListItem>
                    <CustomFormControlLabel
                      control={<Checkbox />}
                      label="Checked in"
                    />
                  </CustomListItem>
                  <CustomListItem>
                    <CustomFormControlLabel
                      control={<Checkbox />}
                      label="Checked out"
                    />
                  </CustomListItem>
                </List>
              </Grid>

              <Grid item xs={9}>
                <DataGrid
                  className="custom-datagrid"
                  rows={visit}
                  columns={columns}
                  getRowId={(row) => row.visit_id}
                  pageSize={5}
                />
              </Grid>
            </Grid>
          </Container>
        </Card>
      </ThemeProvider>
    </Layout>
  );
};

export default Logbook;
