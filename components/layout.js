import Footer from "./footer/Footer";
import NavBar from "./navBar/NavBar";
import Preloader from "./preloader/Preloader";
import Ready from "./ready/Ready";
import ScrollToTop from "./scrollToTop/ScrollToTop";
import { useRouter } from "next/router";
import Sidebar from "./userDashBoardComponent/Sidebar";
import Navbar from "./userDashBoardComponent/dashboardNavbar/navbar";
import { useState } from "react";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  // useEffect(() => {
  //   const handleBeforePopState = (event) => {
  //     if (event.state && event.state.route === "/userDashboard") {
  //       router.replace("/userDashboard", undefined, { shallow: true });
  //       // event.preventDefault();
  //     }
  //   };

  //   window.addEventListener("beforepopstate", handleBeforePopState);

  //   return () => {
  //     window.removeEventListener("beforepopstate", handleBeforePopState);
  //   };
  // }, [router]);
  return (
    <>
      {pathname.includes("userDashBoard") ? (
        <>
          <Navbar toggleSidebar={toggleSidebar} />

          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </>
      ) : (
        <NavBar />
      )}
      <div
        className={
          pathname.includes("userDashBoard") && isOpen === true
            ? "wrapper"
            : "wrapper_close"
        }
      >
        <NotificationContainer className="my-custom-notifications" />

        {children}
      </div>
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
