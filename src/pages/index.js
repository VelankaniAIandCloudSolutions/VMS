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

import axiosInstance from "@/utils/axiosConfig";

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get("/api/get-data");
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError("An error occurred while fetching data.");
  //     }
  //   };

  //   fetchData();
  // }, []);

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const { visitTypes, users, locations } = data;

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Home Page
      </Typography>
      <Typography paragraph>This is the content of your home page.</Typography>
      {/* <Typography variant="body1">Data from API:</Typography> */}

      {/* <div>
        <h2>Visit Types</h2>
        <ul>
          {visitTypes.map((type) => (
            <li key={type.id}>{type.type_name}</li> // Assuming visitTypes have id and name properties
          ))}
        </ul>
      </div>
      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.frist_name}</li> // Assuming users have id and name properties
          ))}
        </ul>
      </div>
      <div>
        <h2>Locations</h2>
        <ul>
          {locations.map((location) => (
            <li key={location.id}>{location.location_name}</li> // Assuming locations have id and name properties
          ))}
        </ul>
      </div> */}
    </>
  );
};

export default Home;
