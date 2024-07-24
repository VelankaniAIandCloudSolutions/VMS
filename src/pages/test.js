// pages/index.js

// import React, { useEffect, useState } from "react";

// export default function Home() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     async function fetchData() {
//       const response = await fetch("/api/test");
//       const data = await response.json();
//       setMessage(data.message);
//     }

//     fetchData();
//   }, []);

//   return <div>{message}</div>;
// }
import axiosInstance from "@/utils/axiosConfig";
import useSWR from "swr";
import React from "react";

// Define a fetcher function using Axios

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function Home() {
  // Use SWR to fetch data
  const { data, error } = useSWR("/api/get-data", fetcher);

  // Display the data or handle loading/error states
  if (error) return <div>Error fetching data</div>;
  if (!data) return <div>Loading...</div>;

  const { visitTypes, users, locations } = data;

  return (
    <div>
      <h2>Visit Types</h2>
      <ul>
        {visitTypes.map((type) => (
          <li key={type.id}>{type.type_name}</li>
        ))}
      </ul>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.first_name}</li>
        ))}
      </ul>
      <h2>Locations</h2>
      <ul>
        {locations.map((location) => (
          <li key={location.id}>{location.location_name}</li>
        ))}
      </ul>
    </div>
  );
}
