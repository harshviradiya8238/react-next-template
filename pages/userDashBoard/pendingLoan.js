import React from "react";

function PendingLoan() {
  return (
    <div class="loan-content-body wrapper">
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
                  <th>Sr No.</th>
                  <th>Application Number</th>
                  <th>Bank/NBFC</th>
                  <th>Amount (₹)</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td> vfok65c9 </td>
                  <td>HDFC</td>
                  <td>₹ 500000.00</td>

                  <td>
                    <i class="fa-regular fa-eye"></i>
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>vfok65c10</td>
                  <td>Bajaj</td>
                  <td>₹ 400000.00</td>

                  <td>
                    <i class="fa-regular fa-eye"></i>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>vfok65c10</td>
                  <td>HDFC</td>
                  <td>₹ 300000.00</td>

                  <td>
                    <i class="fa-regular fa-eye"></i>
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

export default PendingLoan;
