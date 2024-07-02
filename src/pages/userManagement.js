// pages/usersManagement.js

import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Breadcrumbs,
  Box,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import Layout from "../components/Layout";
import BasicModal from "@/components/Modal";
import UsersDataGrid from "@/components/UsersDataGrid";
import UserForm from "@/components/UserForm";
import { getSession } from "next-auth/react";

const CreateInviteButton = styled(Button)({
  marginLeft: "auto",
});

const breadcrumbs = [
  <NextLink href="/" key="1" passHref>
    Home
  </NextLink>,
  <Typography key="2" color="textPrimary">
    Users
  </Typography>,
];

export async function getServerSideProps(context) {
  let session = null;

  try {
    session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }

    const usersResponse = await axios.get(
      "http://localhost:3000/api/users/all"
    );
    const response = await axios.get(
      "http://localhost:3000/api/users/create-user"
    );

    const initialUsers = usersResponse.data.users;
    const roles = response.data.roles;

    const sessionString = JSON.stringify(session);

    return {
      props: {
        initialUsers,
        roles,
        sessionString,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        initialUsers: [],
        roles: [],
        sessionString: null,
      },
    };
  }
}

export default function Users({ roles, initialUsers, sessionString }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  const handleOpenModal = (mode = "add", user = null) => {
    setIsModalOpen(true);
    setModalMode(mode);
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode("add");
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    handleOpenModal("edit", user);
  };

  const handleDeleteUser = async (userId) => {
    try {
      console.log("Deleting user with ID:", userId);
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      // Assuming successful deletion, update UI or refetch users list
      router.reload(); // Refresh page or update state to reflect deletion
    } catch (error) {
      console.error("Error deleting user:", error.message);
      // Handle error scenario, such as displaying an error message to the user
    }
  };

  const handleSaveUser = async (formData) => {
    try {
      let response;
      if (modalMode === "edit" && selectedUser) {
        // Edit existing user
        consoel.log("put api called for editing user");
        response = await axios.put(
          `http://localhost:3000/api/users/${selectedUser.user_id}`,
          formData
        );
      } else {
        // Add new user
        response = await axios.post(
          `http://localhost:3000/api/users/create-user`,
          formData
        );
      }

      if (response.status === 200 || response.status === 201) {
        // Update users state only if the request was successful
        setUsers(response.data.users);
        // Optionally display a success message
        console.log("User saved successfully");
      } else {
        console.error("Unexpected response status:", response.status);
        // Handle unexpected status code, e.g., display an error message to the user
      }

      // Assuming successful save, update UI or refetch users list
      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error.message);
      // Handle error scenario, such as displaying an error message to the user
    }
  };

  const parsedSession = JSON.parse(sessionString);
  const isAdmin = parsedSession?.user?.role === "admin";

  return (
    <Layout>
      <Card
        variant="outlined"
        sx={{ px: isMobile ? 2 : 4, py: isMobile ? 2 : 4 }}
      >
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
              User Management
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                mr: isMobile ? 0 : 2,
                display: isMobile ? "none" : "block",
              }}
            >
              |
            </Typography>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ justifyContent: isMobile ? "center" : "flex-start" }}
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Box>
          <CreateInviteButton
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal("add")}
            sx={{ mt: isMobile ? 2 : 0 }}
          >
            Add User
          </CreateInviteButton>
        </Box>

        <UsersDataGrid
          users={users}
          onEditUser={handleEditUser} // Pass callback to handle editing user
          onDeleteUser={handleDeleteUser} // Pass callback to handle deleting user
        />

        <BasicModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          title="User"
          mode={modalMode} // Pass mode to BasicModal
        >
          <UserForm
            roles={roles}
            mode={modalMode}
            initialValues={selectedUser}
            onSubmit={handleSaveUser} // Pass onSubmit callback to handle save functionality
          />
        </BasicModal>
      </Card>
    </Layout>
  );
}
