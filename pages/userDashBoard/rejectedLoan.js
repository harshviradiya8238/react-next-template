import Link from "next/link";
import React from "react";

function RejectedLoan() {
  return (
    <div class="loan-content-body wrapper">
      <div class="container">
        <div class="loan-section-table">
          <h3 class="text-head">
            <span>Total Rejected Loan </span>
          </h3>
          <div class="d-flex justify-content-end">
            <div class="col-lg-3 col-sm-12 ">
              <form class="form">
                <div>
                  <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  class="input"
                  placeholder="Search for product"
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
                  <th>No.</th>
                  <th>Application Number</th>
                  <th>Application Date</th>

                  <th>Loan Type</th>
                  <th>Reason</th>
                  <th>Amount (₹)</th>

                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>vfok65c9</td>
                  <td>04 July, 2023</td>
                  <td>Car Loan </td>
                  <td>Text</td>
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
                      <i class="fa-regular fa-eye"></i>
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>vfok65c9</td>
                  <td>01 July, 2023</td>
                  <td>Home Loan</td>
                  <td>Text</td>
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
                      <i class="fa-regular fa-eye"></i>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>bcvsk45c7</td>
                  <td>02 June, 2023</td>
                  <td>Business Loan</td>
                  <td>Text</td>
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
                      <i class="fa-regular fa-eye"></i>
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>bvvk4re4</td>
                  <td>03 June, 2023</td>

                  <td>HDFC</td>
                  <td>Text</td>
                  <td>₹ 200000.00</td>

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

export default RejectedLoan;
