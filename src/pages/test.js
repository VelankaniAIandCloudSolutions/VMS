// pages/index.js

import React, { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/test");
      const data = await response.json();
      setMessage(data.message);
    }

    fetchData();
  }, []);

  return <div>{message}</div>;
}
