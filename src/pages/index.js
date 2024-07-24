// import * as React from "react";
// // import Layout from "../components/Layout"; // Adjust the import path as per your project structure
// import Typography from "@mui/material/Typography";

// const Home = () => {
//   return (
//     <Layout>
//       <Typography variant="h2" gutterBottom>
//         Home Page
//       </Typography>
//       <Typography paragraph>This is the content of your home page.</Typography>
//     </Layout>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/test");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Home Page
      </Typography>
      <Typography paragraph>This is the content of your home page.</Typography>
      <Typography variant="body1">Message from API: {message}</Typography>
    </>
  );
};

export default Home;
