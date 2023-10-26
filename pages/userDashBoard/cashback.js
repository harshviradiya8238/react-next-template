import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import Preloader from "../../components/preloader/Preloader";
import API from "../../helper/API";
import Link from "next/link";

function Cashback() {
  const [cashBack, setCashBack] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {
          const userData = jwtDecode(token);
          const response = await API.get(
            `/LoanApplication/GetLoanApplicationCashBackByUserId?userId=${userData?.UserDetails?.Id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { data } = response;
          if (data?.success) {
            setCashBack(data.value);
          }
          return response;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  function formatDateToDDMMYYYY(dateStr) {
    const date = new Date(dateStr);
    const formattedDate = [
      String(date.getDate()).padStart(2, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      date.getFullYear(),
    ].join("-");

    return formattedDate;
  }

  return (
    <div class="loan-content-body ">
      <Preloader />
      <div class="container">
        <div class="loan-section-table">
          <h3 class="text-head">
            <span class="cashback">Cashback</span>
          </h3>
          {/* <div class="d-flex justify-content-end">
            <div class="col-lg-3 col-sm-12 ">
              <form class="form">
                <div>
                  <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  class="input"
                  placeholder="Search"
                  required=""
                  type="text"
                />
                <button class="reset" type="reset">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </form>
            </div>
          </div> */}
          <div class="table-responsive">
            <table class="table align-td-middle table-card table-cashback">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Loan Application Number</th>
                  {/* <th>Loan Type</th> */}
                  <th>Loan Amount (INR)</th>
                  <th>Cashback Amount (₹)</th>
                  <th>Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {cashBack && cashBack.gridRecords?.length
                  ? cashBack.gridRecords?.map((elem, index) => {
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            <Link
                              href={`/userDashBoard/viewLoan/${elem?.loanApplicationId}`}
                              className="document_hyper_link p-0 border-0 mr-2"
                            >
                              {elem?.applicationNumbr?.toUpperCase()}
                            </Link>
                          </td>
                          {/* <td>Personal loan</td> */}
                          <td>{elem?.loanAmount}</td>
                          <td>{elem?.cashBackAmount}</td>
                          <td>{formatDateToDDMMYYYY(elem?.createdon)}</td>
                          {/* <td>{elem?.createdon}</td> */}
                        </tr>
                      </>
                    );
                  })
                  : ""}
              </tbody>
            </table>
            <>
              {!cashBack?.gridRecords?.length && (
                <div className="text-center">
                  <h4>No Data Found</h4>
                </div>
              )}
            </>
          </div>
          <div class="text-end">
            {cashBack.length ? (
              <div class="pagination">
                <a href="#">&laquo;</a>
                <a href="#" class="active">
                  1
                </a>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#">4</a>
                <a href="#">&raquo;</a>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cashback;
