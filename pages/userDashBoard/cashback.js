import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";

function Cashback() {
  const [cashBack, setCashBack] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {
          const userData = jwtDecode(token);
          const response = await axios.get(
            `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetLoanApplicationCashBackByUserId?userId=${userData?.UserDetails?.Id}`,
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
  return (
    <div class="loan-content-body ">
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
            <table class="table align-td-middle table-card">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Application Number</th>
                  <th>Bank/NBFC</th>
                  <th>Application Date </th>
                  <th>Loan Amount (₹)</th>
                  <th>Cashback Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {cashBack && cashBack.length
                  ? cashBack.map((elem, index) => {
                      return (
                        <>
                          <tr>
                            <td>{index + 1}</td>
                            <td>{elem?.applicationNumbr}</td>
                            <td>Bajaj</td>
                            <td>{elem?.createdon}</td>
                            <td>₹ {elem?.loanAmount}</td>
                            <td>₹ 1200.00</td>
                          </tr>
                        </>
                      );
                    })
                  : ""}
              </tbody>
            </table>
            <>
              {!cashBack.length && (
                <div style={{ textAlign: "center" }}>
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
