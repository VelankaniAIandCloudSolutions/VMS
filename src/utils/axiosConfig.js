// // utils/axiosConfig.js
// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// });

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://vms.automhr.com",
});

export default axiosInstance;
