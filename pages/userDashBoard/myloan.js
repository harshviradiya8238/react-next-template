import axios from "axios";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Pagination } from "react-bootstrap";

import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Preloader from "../../components/preloader/Preloader";
import PaginationTable from "../../components/paginaton_table/PaginationTable";
import API from "../../helper/API.js";

function Myloan() {
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
        // const sortedEntries = Array.from(data.value).reverse();

        setLoanApplication(data.value);
      } catch (error) {
        console.log(error);
        // Notification("error", error?.response?.data[0]?.errorMessage);
      }
    };
    GetAllApplication(token);
  }, [0]);
  const [status, setStatus] = React.useState("");
  const [searchValue, setsearchValue] = React.useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const searchByFilter = (e) => {
    const keyWord = e.target.value;
    setsearchValue(keyWord);
  };

  function getFilteredList() {
    if (!status) {
      return loanApplication;
    }
    return loanApplication.filter((item) => item.status === status);
  }

  function searchFunction() {
    if (searchValue !== "") {
      try {
        let regex = new RegExp(searchValue.replace(/[\|\\]/g), "i");
        let filteredArr =
          loanApplication &&
          loanApplication?.filter((elem) => {
            return regex.test(elem.applicationNumber) || elem.status === status;
          });
        return filteredArr;
      } catch (e) {
        console.log(e.message);
        return loanApplication;
      }
    } else {
      if (!status) {
        return loanApplication;
      }
      let filteredArr =
        loanApplication &&
        loanApplication?.filter((elem) => {
          return elem.status === status;
        });
      return filteredArr;
    }
  }
  var filteredList = useMemo(searchFunction, [
    status,
    searchValue,
    loanApplication,
  ]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filteredList?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList?.slice(startIndex, endIndex);

  return (
    <div class="loan-content-body">
      <Preloader />
      <div class="container">
        <div class="loan-section-table">
          <h3 class="text-head">
            <span>Loan Application</span>
          </h3>

          <div class="d-flex justify-content-end">
            <div class="col-lg-3 col-sm-12 mr-10">
              <Form.Select
                aria-label="Default select example"
                value={status}
                onChange={handleChange}
              >
                <option disabled={true}>Select Status</option>
                <option value="">All</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Pending">Pending</option>
                <option value="Query">Query</option>
                <option value="Reject">Reject</option>
                <option value="Approve">Approve</option>
              </Form.Select>
            </div>
            <div class="col-lg-3 col-sm-12 ">
              <form class="form">
                <div>
                  <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  class="input"
                  placeholder="Search"
                  required=""
                  onChange={searchByFilter}
                  type="text"
                />
                <button class="reset" type="reset">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </form>
            </div>
          </div>
          <div class="table-responsive">
            <Table striped class="table align-td-middle table-card">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Application Number</th>
                  <th>Loan Amount (INR)</th>
                  <th>Loan Tenure(Year)</th>
                  <th>Loan Type</th>
                  <th>Status</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {currentItems && currentItems.length
                  ? currentItems.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {data?.applicationNumberForLoan
                              ? data?.applicationNumberForLoan?.toUpperCase()
                              : data?.applicationNumber}
                          </td>

                          <td>{data?.amount}</td>
                          <td>{data.tenure ? data.tenure : 0}</td>
                          <td>
                            {data?.loanTypeName
                              ? data?.loanTypeName.charAt(0)?.toUpperCase() +
                                data?.loanTypeName.slice(1)?.toLowerCase()
                              : "Home Loan"}
                          </td>
                          <td>
                            {" "}
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
                            {data?.status_Key == 3 || data?.status_Key == 1 ? (
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
                                  // className="all_error"
                                />
                              </Link>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </Table>
            <>
              {!currentItems?.length && (
                <div style={{ textAlign: "center" }}>
                  <h4>No Data Found</h4>
                </div>
              )}
            </>
          </div>
          <PaginationTable
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}

export default Myloan;
