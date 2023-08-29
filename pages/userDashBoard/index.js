import axios from "axios";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import Preloader from "../../components/preloader/Preloader";
import PaginationTable from "../../components/paginaton_table/PaginationTable";
import { Table } from "react-bootstrap";

export default function DashBoardDefault() {
  const [loanApplication, setLoanApplication] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("logintoken");

    const GetAllApplication = async (token) => {
      // const token = localStorage.getItem("logintoken");
      try {
        const userData = jwtDecode(token);
        const response = await axios.get(
          `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetAllLoanOfUser?userId=${userData?.UserDetails?.Id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response;
        const sortedEntries = Array.from(data.value).reverse();

        setLoanApplication(sortedEntries);
      } catch (error) {
        console.log(error);
        // Notification("error", error?.response?.data[0]?.errorMessage);
      }
    };

    GetAllApplication(token);
  }, [0]);

  const itemsPerPage = 5;
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
              <div class=" table-container">
                <Table
                  striped
                  class="table align-td-middle table-card custom-table"
                >
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Application Number</th>
                      <th>Amount (₹) </th>
                      <th>Loan tenure(year) </th>
                      <th>Loan type </th>

                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems && currentItems.length
                      ? currentItems.map((data, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data?.applicationNumber}</td>
                                <td>{data?.amount}</td>

                                <td>{data?.tenure ? data?.tenure : 2}</td>
                                <td>
                                  {data?.loanTypeName
                                    ? data?.loanTypeName
                                        .charAt(0)
                                        .toUpperCase() +
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
                                    {data?.status}
                                  </span>
                                </td>
                                <td>
                                  <div>
                                    <Link
                                      href={`/userDashBoard/viewLoan/${data?.id}`}
                                      className="cmn-btn"
                                      style={{
                                        background: "none",
                                        padding: "0",
                                        border: "none",
                                        marginRight: "10px",
                                      }}
                                    >
                                      <i class="fa-regular fa-eye" />
                                    </Link>
                                    <Link
                                      href={`/userDashBoard/editLoan/${data?.id}`}
                                      className="cmn-btn"
                                      style={{
                                        background: "none",
                                        padding: "0",
                                        border: "none",
                                        marginRight: "10px",
                                      }}
                                    >
                                      <i
                                        class="fa-solid fa-pen-to-square"
                                        style={{ color: "red" }}
                                      />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            </>
                          );
                        })
                      : ""}
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
              {/* <div class="btn-section-dashbard">
                <button class="view-btn-dashbard">View More</button>
              </div> */}
              <PaginationTable
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
