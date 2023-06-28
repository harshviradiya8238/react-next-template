import Footer from "./footer/Footer";
import NavBar from "./navBar/NavBar";
import Preloader from "./preloader/Preloader";
import Ready from "./ready/Ready";
import ScrollToTop from "./scrollToTop/ScrollToTop";
import { useRouter } from "next/router";
import Sidebar from "./userDashBoardComponent/Sidebar";
import Navbar from "./userDashBoardComponent/dashboardNavbar/navbar";

const Layout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;
  console.log(pathname);
  return (
    <>
      {pathname.includes("userDashBoard") ? (
        <>
          <Navbar />
          <Sidebar />
        </>
      ) : (
        <NavBar />
      )}

      {children}
      {/* <Ready /> */}
      {pathname.includes("userDashBoard") ? "" : <Footer />}
      {/* {pathname.includes("userDashBoard") ? <Sidebar /> : ""} */}
      {/* Scroll To Top */}
      <ScrollToTop />
      {/* Pre Loader */}
      <Preloader />
    </>
  );
};

export default Layout;
