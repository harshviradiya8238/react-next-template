import React from "react";
import ApplyForLoan from "../components/businessLoan/ApplyForLoan";
import ShortNavbar from "../components/common/ShortNavbar";
import NavBar from "../components/navBar/NavBar";
import Footer from "../components/footer/Footer";

export default function LoanApplication() {
  return (
    <>
      <NavBar />
      <ApplyForLoan />
    </>
  );
}
// LoanApplication.getLayout = function getLayout(page) {
//   return <>{page}</>;
// };
