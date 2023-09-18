import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { useEffect } from "react";
import Layout from "../components/layout";
import "../styles/globals.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { NotificationContainer } from "react-notifications";

import { wrapper } from "../store";

function App({ Component, pageProps }) {
  // useAutoLogout(25 * 60 * 1000);
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  if (Component.getLayout) {
    return Component.getLayout(
      <>
        <Head>
          <title>Loan App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="favicon.ico" />
        </Head>
        <NotificationContainer className="my-custom-notifications" />
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Loan App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <Layout>
        <NotificationContainer className="my-custom-notifications" />

        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default wrapper.withRedux(App);
