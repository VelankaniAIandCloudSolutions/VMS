import * as React from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";

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
const VisitsDataGrid = ({ visits, columns, filterStatus, setFilterStatus }) => {
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
          rows={visits}
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
          // density="strict"
          // autosizeOnMount={true}
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
