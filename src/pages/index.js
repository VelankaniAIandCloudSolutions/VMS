import * as React from "react";
import Layout from "../components/Layout"; // Adjust the import path as per your project structure
import Typography from "@mui/material/Typography";
const Home = () => {
  return (
    <Layout>
      <Typography variant="h2" gutterBottom>
        Home Page
      </Typography>
      <Typography paragraph>This is the content of your home page.</Typography>
    </Layout>
  );
};

export default Home;
