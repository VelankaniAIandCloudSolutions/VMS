import "@/styles/globals.css";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { QrCodeScannerOutlined } from "@mui/icons-material";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log(session);

  // You can fetch additional data here if needed
  return {
    props: {
      session,
    },
  };
}
export default function App({
  Component,
  pageProps: { session, serverSession, ...pageProps },
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
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>VMS</title>
        </Head>
        <Component {...pageProps} />
        <ToastContainer />
      </AppCacheProvider>
    </SessionProvider>
  );
}
