import React, { useState } from "react";
// import "../../public/dashBoardCss/css/style.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar({ toggleSidebar, isOpen }) {
  //   const [activeItem, setActiveItem] = useState("dashboard");

  //   const handleItemClick = (item) => {
  //     setActiveItem(item);
  //   };
  const router = useRouter();

  const { pathname } = router;
  console.log(pathname);
  console.log(isOpen);
  return (
    <>
      <div
        class={`sidebar sticky-top  ${isOpen ? "side_nav" : "side_nav_close"}`}
      >
        <div class="header-box ">
          <h1 class="fs-4">
            <span class="img-box">
              {" "}
              <img src="/images/logoDashBoard.png" alt="" />
            </span>
            <span class="text-white">Loan Bazaar</span>{" "}
          </h1>
          <div
            style={{ color: "white", margin: "10px", cursor: "pointer" }}
            onClick={toggleSidebar}
          >
            <i class="fa-solid fa-arrow-left"></i>
          </div>
          <div class="btn d-md-none close-btn px-1 py-0 ">
            {/* <i class="fa-solid fa-xmark"></i> */}
          </div>
        </div>
        <ul class="ul-section  top ">
          <li
            className={`${pathname === "/userDashBoard" ? "active" : "normal"}`}
            // onClick={() => handleItemClick("dashboard")}
          >
            <Link href="/userDashBoard">
              {" "}
              <i class="fa-solid fa-gauge"></i>
              {/* <i class="bx bx-notepad"></i> */}
              <span class="text">Dashboard</span>
            </Link>
          </li>

          <li
            className={` ${
              pathname.includes("loanApplication") ? "active" : ""
            }`}
          >
            <Link href="/userDashBoard/loanApplication">
              <i class="fa-solid fa-plus"></i>
              <span class="text">New Loan Request</span>
            </Link>
            <a href="#" class="link-box"></a>
          </li>

          <li
            className={` ${pathname.includes("myloan") ? "active" : ""}`}
            // className={` ${activeItem === "myloan" ? "active" : ""}`}
            // onClick={() => handleItemClick("myloan")}
          >
            {" "}
            <Link href="/userDashBoard/myloan">
              <i class="fa-solid fa-note-sticky"></i>
              <span class="text">My Loan</span>
            </Link>
          </li>

          <li className={`${pathname.includes("cashback") ? "active" : ""}`}>
            <Link href="/userDashBoard/cashback">
              <i class="fa-solid fa-sack-dollar"></i>
              <span class="text">Cashback</span>
            </Link>
          </li>
          <li className={` ${pathname.includes("earn") ? "active" : ""}`}>
            {/* <Link href="/userDashBoard/earn"> */}
            <i class="fa-solid fa-gift"></i>
            <span class="text">Refer & Earn</span>
            {/* </Link> */}
          </li>
          <li className={` ${pathname.includes("profile") ? "active" : ""}`}>
            <Link href="/userDashBoard/profile">
              <i class="fa-solid fa-user"></i>
              <span class="text">Profile</span>
            </Link>
          </li>
          {/* <li
            className={` ${
              pathname.includes("loanApplication") ? "active" : ""
            }`}
          >
            <Link href="/userDashBoard/loanApplication">
              <i class="fa-solid fa-plus"></i>
              <span class="text">New Loan Request</span>
            </Link>
            <a href="#" class="link-box"></a>
          </li> */}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
