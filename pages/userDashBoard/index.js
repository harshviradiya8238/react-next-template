import axios from "axios";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import Preloader from "../../components/preloader/Preloader";
import PaginationTable from "../../components/paginaton_table/PaginationTable";
import { Table } from "react-bootstrap";
import API from "../../helper/API";

export default function DashBoardDefault() {
  const [loanApplication, setLoanApplication] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("logintoken");

    const GetAllApplication = async (token) => {
      // const token = localStorage.getItem("logintoken");
      try {
        const userData = jwtDecode(token);
        const response = await API.get(
          `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetAllLoanOfUser?userId=${userData?.UserDetails?.Id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response;
        // const sortedEntries = Array.from(data.value).reverse();

        setLoanApplication(data.value);
      } catch (error) {
        console.log(error);
        // Notification("error", error?.response?.data[0]?.errorMessage);
      }
    };

    GetAllApplication(token);
  }, [0]);

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = loanApplication?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = loanApplication?.slice(startIndex, endIndex);

  return (
    <>
      <Preloader />
      <div>
        <div class="loan-content-body">
          <div class="container">
            <div class="card-setion">
              <div class="card total_loan_application">
                <div class="img-box">
                  <img src="/images/aplication.png" alt="" />
                </div>
                <h3>Total Loan Application</h3>
                <p class="text-end">0</p>
              </div>

              <div class="card total_Approved_application">
                <div class="img-box ">
                  <img src="/images/loan-approval.png" alt="" />
                </div>
                <h3>Total Approved Loan</h3>
                <p class="text-end">0</p>
              </div>

              <div class="card total_pending_application">
                <div class="img-box">
                  <img src="/images/pending.png" alt="" />
                </div>
                <h3>Total Pending Loan</h3>
                <p class="text-end">0</p>
              </div>

              <div class="card total_amount_Loan">
                <div class="img-box">
                  <img src="/images/loan.png" alt="" />
                </div>
                <h3>Total Amount Of Loan</h3>
                <p class="text-end">₹ 0</p>
              </div>

              <div class="card total_cashback">
                <div class="img-box">
                  <img src="/images/cashbak.png" alt="" />
                </div>
                <h3>Cashback</h3>
                <p class="text-end ">₹ 0</p>
              </div>

              <div class="card total_refer_earn">
                <div class="img-box">
                  <img src="/images/refer.png" alt="" />
                </div>
                <h3>Refer & Earn</h3>
                <p class="text-end ">₹ 0</p>
              </div>
            </div>

            <div class="loan-section-table">
              <h3 class="text-head">
                <span> Latest Loan Request </span>
              </h3>
              <div class=" table-container">
                <Table
                  striped
                  class="table align-td-middle table-card custom-table"
                >
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Application Number</th>
                      <th>Loan Amount (INR) </th>
                      <th>Loan Tenure (Year) </th>
                      <th>Loan Type </th>

                      <th>Status</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems &&
                      currentItems.map((data, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {data?.applicationNumberForLoan
                                  ? data?.applicationNumberForLoan?.toUpperCase()
                                  : data?.applicationNumber}
                              </td>
                              <td>{data?.amount}</td>

                              <td>{data?.tenure ? data?.tenure : 0}</td>
                              <td>
                                {data?.loanTypeName
                                  ? data?.loanTypeName.charAt(0).toUpperCase() +
                                    data?.loanTypeName.slice(1).toLowerCase()
                                  : "Home Loan"}
                              </td>
                              <td>
                                <span
                                  class={`all-btn ${
                                    data?.status === "Pending"
                                      ? "Pending-btn"
                                      : data?.status === "Query"
                                      ? "qyery-btn"
                                      : data?.status === "Reject"
                                      ? "Rejected-btn"
                                      : data?.status === "Approve"
                                      ? "Approved-btn"
                                      : data?.status === "Incomplete"
                                      ? "Process-btn"
                                      : ""
                                  }`}
                                >
                                  {data?.status === "Approve"
                                    ? "Approved"
                                    : data?.status}
                                </span>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </Table>
                <>
                  {!currentItems.length && (
                    <div>
                      <h4>No Data Found</h4>
                    </div>
                  )}
                </>
              </div>

              {currentItems && currentItems.length ? (
                <div className="text-end mb-2 ">
                  <Link href="/userDashBoard/myloan">
                    <button className="fs-5 profile-btn">View More</button>
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
