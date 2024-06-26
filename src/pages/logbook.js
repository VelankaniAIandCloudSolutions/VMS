import React, { useState } from "react";
import {
  Grid,
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Button,
  Menu,
  MenuItem,
  Card,
  Typography,
  Link,
  Breadcrumbs,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import PlusIcon from "@mui/icons-material/Add";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const theme = createTheme();

function Logbook() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [date, setDate] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    handleClose();
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

  const columns = [
    { field: "visitor", headerName: "Visitor", width: 120 },
    { field: "name", headerName: "Host", width: 120 },
    { field: "id", headerName: "ID", width: 120 },
    { field: "checkin", headerName: "Check in", width: 120 },
    { field: "checkout", headerName: "Check out", width: 120 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "duration", headerName: "Duration", width: 120 },
  ];

  const rows = [
    {
      id: 1,
      name: "John Doe",
      visitor: "Ankit",
      checkin: 9,
      checkout: 10,
      duration: 1,
    },
    {
      id: 2,
      name: "Jane Doe",
      visitor: "Ankit",
      checkin: 9,
      checkout: 10,
      duration: 1,
    },
  ];

  const CreateInviteButton = styled(Button)({
    marginLeft: "auto",
  });

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Card>
          <Container>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              {breadcrumbs}
            </Breadcrumbs>
            <Grid container justifyContent="center" className="mt-2">
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlusIcon />}
              >
                Create Invite
              </Button>
            </Grid>
            <Grid container spacing={2} className="mt-3">
              <Grid item xs={10}>
                <TextField label="Search" variant="outlined" margin="normal" />
              </Grid>
              <Grid item xs={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={(newDate) => handleDateChange(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container spacing={2} className="mt-3">
              <Grid item xs={3}>
                <h3>Filters</h3>
                <List>
                  <ListItem>
                    <FormControlLabel control={<Checkbox />} label="All" />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel control={<Checkbox />} label="Expected" />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Checked in"
                    />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Checked out"
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={9}>
                <DataGrid
                  className="custom-datagrid"
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                />
              </Grid>
            </Grid>
          </Container>
        </Card>
      </ThemeProvider>
    </Layout>
  );
}

export default Logbook;
