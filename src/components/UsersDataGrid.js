// components/UsersDataGrid.js

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";

const UsersDataGrid = ({ users, onEditUser, onDeleteUser }) => {
  const columns = [
    { field: "user_id", headerName: "ID", width: 90 },
    { field: "first_name", headerName: "First Name", width: 150 },
    { field: "last_name", headerName: "Last Name", width: 150 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      valueGetter: (params) => {
        return params?.role_name || "";
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone_number", headerName: "Phone Number", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit User" placement="top">
            <IconButton
              style={{ color: "gray", marginRight: 2, marginTop: 2 }}
              aria-label="edit"
              onClick={() => handleEdit(params?.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User" placement="top">
            <IconButton
              style={{ color: "gray", marginRight: 2, marginTop: 2 }}
              aria-label="delete"
              onClick={() => handleDelete(params.row.user_id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const handleEdit = (selectedUser) => {
    console.log("Edit user:", selectedUser);
    onEditUser(selectedUser); // Pass selected user to parent component for editing
  };

  const handleDelete = (userId) => {
    console.log("Delete user with ID:", userId);
    onDeleteUser(userId); // Pass user ID to parent component for deletion
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        checkboxSelection
        getRowId={(row) => row.user_id}
        columnVisibilityModel={{
          user_id: false,
        }}
      />
    </div>
  );
};

export default UsersDataGrid;
