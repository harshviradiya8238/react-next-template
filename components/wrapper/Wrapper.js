import React from "react";
import Navbar from "../userDashBoardComponent/dashboardNavbar/navbar";

function Wrapper({ data }) {
  return (
    <>
      <div className="wrapper">
        <Navbar />
        {data}
      </div>
    </>
  );
}

export default Wrapper;
