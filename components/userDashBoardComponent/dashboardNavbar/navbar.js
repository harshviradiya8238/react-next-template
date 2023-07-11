import React, { useState } from "react";
import LogoutModal from "../../logoutModal/LogoutModal";

function Navbar() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div>
      <nav class="navbarDashBoard navbar-expand-md  sticky-top">
        <div class="container">
          <div class="col-3 d-flex justify-content-between d-block d-md-none ">
            <div class="btn px-1 py-0 open-btn me-2">
              <i class="fa-solid fa-bars-staggered"></i>
            </div>
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
                    </div>{" "}
                    User
                  </div>
                  <ul class="dropdown-menu ">
                    {/* <li>
                      <a class="dropdown-item" href="Profile.html">
                        View profile
                      </a>
                    </li> */}
                    <li onClick={() => setShowLogout(true)}>
                      <a class="dropdown-item" href="#">
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
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
            <LogoutModal show={showLogout} close={() => setShowLogout(false)} />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
