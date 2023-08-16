import Link from "next/link";
import React from "react";

function Myloan() {
  return (
    <div class="loan-content-body">
      <div class="container">
        <div class="loan-section-table">
          <h3 class="text-head">
            <span>Total Pending Loan</span>
          </h3>
          <div class="d-flex justify-content-end">
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
          </div>
          <div class="table-responsive">
            <table class="table align-td-middle table-card">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Application Number</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  <th>Loan Type</th>
                  <th>Amount (₹)</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td> vfok65c9 </td>
                  <td>20 Apr,2023</td>

                  <td>
                    {" "}
                    <span class="all-btn Pending-btn">IN PROCESS</span>
                  </td>

                  <td>Business Loan</td>
                  <td>₹ 500000.00</td>

                  <td>
                    <Link
                      href="/userDashBoard/viewLoan"
                      className="cmn-btn"
                      style={{
                        background: "none",
                        padding: "0",
                        border: "none",
                      }}
                    >
                      <i class="fa-regular fa-eye" />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>vfok65c10</td>
                  <td>20 Apr,2023</td>
                  <td>
                    <span class="all-btn qyery-btn">QUERY</span>{" "}
                  </td>

                  <td>Car Loan</td>
                  <td>₹ 400000.00</td>

                  <td>
                    <Link
                      href="/userDashBoard/viewLoan"
                      className="cmn-btn"
                      style={{
                        background: "none",
                        padding: "0",
                        border: "none",
                      }}
                    >
                      <i class="fa-regular fa-eye" />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>vfok65c10</td>
                  <td>20 Apr,2023</td>
                  <td>
                    <span class="all-btn Accepted-btn">RESUBMITTED</span>
                  </td>
                  <td>Personal Loan</td>
                  <td>₹ 300000.00</td>

                  <td>
                    <Link
                      href="/userDashBoard/viewLoan"
                      className="cmn-btn"
                      style={{
                        background: "none",
                        padding: "0",
                        border: "none",
                      }}
                    >
                      <i class="fa-regular fa-eye" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-end">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myloan;
