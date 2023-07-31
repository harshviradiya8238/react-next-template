import Link from "next/link";

export default function DashBoardDefault() {
  return (
    <>
      <div>
        <div class="loan-content-body">
          <div class="container">
            <div class="card-setion">
              <div class="card" style={{ backgroundColor: "#CCDBFD" }}>
                <div class="img-box">
                  <img src="/images/aplication.png" alt="" />
                </div>
                <h3>Total Loan Application</h3>
                <p class="text-end">10</p>
              </div>

              <div class="card" style={{ backgroundColor: "#C7F9CC" }}>
                <div class="img-box ">
                  <img src="/images/loan-approval.png" alt="" />
                </div>
                <h3>Total Approved Loan</h3>
                <p class="text-end">03</p>
              </div>

              <div class="card" style={{ backgroundColor: "#CCEEFC" }}>
                <div class="img-box">
                  <img src="/images/pending.png" alt="" />
                </div>
                <h3>Total Pending Loan</h3>
                <p class="text-end">03</p>
              </div>

              <div class="card" style={{ backgroundColor: "#BEE3DB" }}>
                <div class="img-box">
                  <img src="/images/loan.png" alt="" />
                </div>
                <h3>Total Amount Of Loan</h3>
                <p class="text-end">₹ 5,00,000</p>
              </div>

              <div class="card" style={{ backgroundColor: "#98e7ff" }}>
                <div class="img-box">
                  <img src="/images/cashbak.png" alt="" />
                </div>
                <h3>Cashback</h3>
                <p class="text-end mt-4">₹ 2500</p>
              </div>

              <div class="card" style={{ backgroundColor: "#ABBCEE" }}>
                <div class="img-box">
                  <img src="/images/refer.png" alt="" />
                </div>
                <h3>Refer & Earn</h3>
                <p class="text-end mt-4">₹ 3900</p>
              </div>
            </div>

            <div class="loan-section-table">
              <h3 class="text-head">
                <span> Loan Application status </span>
              </h3>
              <div class="table-responsive">
                <table class="table align-td-middle table-card">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Application Number</th>
                      <th>Bank/NBFC</th>
                      <th>Amount (₹)</th>
                      <th>Status</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>vfok65c8 </td>
                      <td> SBI </td>
                      <td>₹ 500000.00</td>
                      <td>
                        <span class="all-btn Pending-btn">Pending</span>
                      </td>
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
                      <td>vfok65c9</td>
                      <td>Bajaj</td>
                      <td>₹ 400000.00</td>
                      <td>
                        <span class="all-btn Accepted-btn">Accepted</span>{" "}
                      </td>
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
                      <td>bcvsk45c7</td>
                      <td>HDFC</td>
                      <td>₹ 300000.00</td>
                      <td>
                        <span class="all-btn Process-btn"> In progress</span>{" "}
                      </td>
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
                      <td>4</td>
                      <td>bvvk4re4</td>
                      <td>HDFC</td>
                      <td>₹ 200000.00</td>
                      <td>
                        <span class="all-btn Approved-btn">Approved</span>{" "}
                      </td>
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
                      <td>5</td>
                      <td>bvvk4re4</td>
                      <td>Bajaj</td>
                      <td>₹ 100000.00</td>
                      <td>
                        <span class="all-btn Rejected-btn">Rejected </span>{" "}
                      </td>
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
              {/* <div class="btn-section-dashbard">
                <button class="view-btn-dashbard">View More</button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
