import React, { useEffect, useState } from "react";
import LogoutModal from "../../logoutModal/LogoutModal";
import { useRouter } from "next/router";

function Navbar({ toggleSidebar }) {
  const router = useRouter();

  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    setUserData(
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : ""
    );

    const handlePopstate = (event) => {
      // Check if the user is navigating back to the login page
      if (window.location.pathname === "/login") {
        // Show an alert
        // alert("ioajsodjasod");
        return setShowLogout(true);
      }
    };

    // Add the event listener
    window.addEventListener("popstate", handlePopstate);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [showLogout]);
  return (
    <div>
      <nav class="navbarDashBoard navbar-expand-md  sticky-top">
        <div class="container" style={{ margin: "0", maxWidth: "100%" }}>
          <div class="d-flex justify-content-between align-items-center">
            <div style={{ color: "white", margin: "10px", cursor: "pointer" }}>
              <i class="fa-solid fa-bars-staggered" onClick={toggleSidebar}></i>
            </div>

            <div class="profile-section ">
              <ul class="navbar-nav ms-auto ">
                <li>
                  <div class="dropdown">
                    <div
                      class="dropdown-toggle user-dropdown"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div class="user-icon">
                        <img src="/images/user.png" alt="" />{" "}
                      </div>
                      <span className="me-2">{userData?.firstName}</span>
                      <span>{userData?.lastName}</span>
                    </div>
                    <ul class="dropdown-menu ">
                      {/* <li>
                      <a class="dropdown-item" href="Profile.html">
                        View profile
                      </a>
                    </li> */}
                      <li className="p-10">{userData?.email}</li>
                      <li
                        onClick={() => {
                          setShowLogout(true);
                          // localStorage.clear();
                          // router.push("/login");
                        }}
                      >
                        <a class="dropdown-item" href="#">
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="modal model-card fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            {/* <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <div
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></div>
                </div>
                <div class="modal-body">
                  Are you sure, <br /> you want to logout?
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="Cancel-btn"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="button" class="Logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            </div> */}
            {showLogout && (
              <LogoutModal
                show={showLogout}
                close={() => setShowLogout(false)}
              />
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
