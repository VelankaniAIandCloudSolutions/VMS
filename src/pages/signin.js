import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
const theme = createTheme();

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();
  // const loading = status === "loading";
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    console.log("Submitting login form with email:", email);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Sign-in result:", result);

      if (result.error) {
        console.error("Sign-in error:", result.error);
        toast.error(result.error, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.log("Signed in successfully!");
        toast.success("Signed In Successfully!!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        console.log("Redirecting to invitations page");
        router.push("/invitations");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      toast.error("Failed to log in. Please try again later.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Set isLoading to false after the try/catch block
    setIsLoading(false);
  };

  if (status === "loading" || isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (session) {
    console.log("session", session);
    router.push("/invitations"); // Redirect if already logged in
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <img
        src="/velankani_logo.png" // Replace with your logo path
        alt="Velankani Tech Park Logo"
        style={{
          position: "absolute",
          top: -10,
          left: 0,
          width: "150px",
          height: "auto",
          zIndex: 1, // Ensure logo is above the Card content
        }} // Adjust size as needed
      />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
