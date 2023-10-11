import axios from "axios";
import jwtDecode from "jwt-decode";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Pagination } from "react-bootstrap";

import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import Preloader from "../../components/preloader/Preloader";
import PaginationTable from "../../components/paginaton_table/PaginationTable";
import API from "../../helper/API.Js";

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
    let filteredArr = loanApplication || [];

    try {
      // If searchValue is provided, filter by it
      if (searchValue) {
        let regex = new RegExp(searchValue.replace(/[\|\\]/g, ""), "i"); // Assuming you meant to replace with an empty string
        filteredArr = filteredArr.filter((elem) => {
          return (
            regex.test(elem.applicationNumberForLoan) ||
            regex.test(elem.loanTypeName)
          );
        });
      }

      // If status is provided, filter by it
      if (status) {
        filteredArr = filteredArr.filter((elem) => elem.status === status);
      }

      return filteredArr;
    } catch (e) {
      console.log(e.message);
      return loanApplication; // Return the original array in case of an error
    }
  }
  var filteredList = useMemo(searchFunction, [
    status,
    searchValue,
    loanApplication,
  ]);

  // const itemsPerPage = 10;
  // const [currentPage, setCurrentPage] = useState(1);
  // const totalItems = filteredList?.length;
  // const totalPages = Math.ceil(totalItems / itemsPerPage);

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentItems = filteredList?.slice(startIndex, endIndex);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = filteredList?.length || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredList?.slice(startIndex, endIndex) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div class="loan-content-body">
      <Preloader />
      <div class="container">
        <div class="loan-section-table">
          <h3 class="text-head">
            <span>Loan Application</span>
          </h3>

          <div class="d-flex justify-content-end">
            <div class="col-lg-3 col-sm-6 col-4 mr-10">
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
                <option value="Reject">Rejected</option>
                <option value="Approve">Approved</option>
              </Form.Select>
            </div>
            <div class="col-lg-3 col-sm-6 col-8">
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
            <Table
              striped
              class="table align-td-middle table-card my_loan_tabel"
            >
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Application Number</th>
                  <th>Loan Amount (INR)</th>
                  <th>Loan Tenure(Year)</th>
                  <th>Loan Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems && currentItems.length
                  ? currentItems.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{startIndex + index + 1}</td>
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
                            class={`all-btn ${data?.status === "Pending"
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
                              : data?.status === "Reject"
                                ? "Rejected"
                                : data?.status}
                          </span>
                        </td>

                        <td>
                          <Link
                            href={`/userDashBoard/viewLoan/${data?.id}`}
                            className="cmn-btn p-0 border-0 mr-2 bg-transparent"
                          >
                            <i class="fa-regular fa-eye" />
                          </Link>
                          {data?.status_Key == 3 || data?.status_Key == 1 ? (
                            <Link
                              href={`/userDashBoard/editLoan/${data?.id}`}
                              className="cmn-btn p-0 border-0 ms-4 bg-transparent"
                            >
                              <i
                                class="fa-solid fa-pen-to-square"
                                style={{ color: "red" }}
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
                <div className="text-center">
                  <h4>No Data Found</h4>
                </div>
              )}
            </>
          </div>
          {totalItems > itemsPerPage && (
            <PaginationTable
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Myloan;
