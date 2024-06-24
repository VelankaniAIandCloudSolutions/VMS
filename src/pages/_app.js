import "@/styles/globals.css";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    let theme = localStorage.getItem("theme") || "light";
    setTheme(theme);
  }, []);
  if (!theme) {
    return; // `theme` is null in the first render
  }
  return (
    <SessionProvider session={session}>
      <AppCacheProvider {...pageProps}>
        <Component {...pageProps} />
        <ToastContainer />
      </AppCacheProvider>
    </SessionProvider>
  );
}
