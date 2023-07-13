import Link from "next/link";
import React from "react";

function ApprovedLoan() {
  return (
    <div class="loan-content-body wrapper">
      <div class="container">
        <div class="loan-section-table">
          <div class="row">
            <div class="col-md-12  ">
              <h3 class="text-head">
                <span> Total Approved Loan </span>
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
                      <th>No.</th>
                      <th>Application Number</th>
                      <th>Application Date</th>

                      <th>Loan Type</th>
                      <th>Amount (₹)</th>

                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>bvvk4re4</td>
                      <td>20 May,2023</td>
                      <td>Personal Loan</td>
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

                    <tr>
                      <td>2</td>
                      <td>bvvk4re4</td>
                      <td>20 May,2023</td>

                      <td>Car Loan</td>
                      <td>₹ 550000.00</td>

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
                      <td>bvvkadfk</td>
                      <td>20 May,2023</td>

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
      </div>
    </div>
  );
}

export default ApprovedLoan;
