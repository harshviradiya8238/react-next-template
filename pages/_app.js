import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import { useEffect } from "react";
import Layout from "../components/layout";
import "../styles/globals.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { wrapper } from "../store";

function App({ Component, pageProps }) {
  console.log(Component, pageProps);
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
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default wrapper.withRedux(App);
