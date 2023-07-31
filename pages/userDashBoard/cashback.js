import React from "react";

function Cashback() {
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
                <tr>
                  <td>1</td>
                  <td>vfok65c9</td>
                  <td>Bajaj</td>
                  <td>28 June,2022</td>
                  <td>₹ 400000.00</td>
                  <td>₹ 700.00</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>vfok65c10</td>
                  <td>Bajaj</td>
                  <td>18 June,2022</td>
                  <td>₹ 650000.00</td>
                  <td>₹ 1200.00</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>vfok65c11</td>
                  <td>Bajaj</td>
                  <td>10 June,2022</td>
                  <td>₹ 700000.00</td>
                  <td>₹ 600.00</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>vfok65c12</td>
                  <td>Bajaj</td>
                  <td>29 March,2022</td>
                  <td>₹ 500000.00</td>
                  <td>₹ 800.00</td>
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

export default Cashback;
