import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Preloader from "../../../components/preloader/Preloader";
import API from "../../../helper/API.Js";
import PaginationTable from "../../../components/paginaton_table/PaginationTable";

function ViewLoan() {
  const router = useRouter();
  const { id } = router.query;
  const [loanData, setLoanData] = useState("");
  const [documentData, setDocumentData] = useState("");
  const [commentData, setCommentData] = useState("");

  useEffect(() => {
    const { id } = router.query;
    try {
      if (id) {
        const token = localStorage.getItem("logintoken");

        const GetLoanById = async (token) => {
          try {
            const response = await API.get(`/LoanApplication/GetById?id=${id}`);
            const { data } = response;

            setLoanData(data.value);
          } catch (error) {
            console.log(error);
            // Notification("error", error?.response?.data[0]?.errorMessage);
          }
        };
        const GetDocumentById = async (token) => {
          // const token = localStorage.getItem("logintoken");
          try {
            const response = await API.get(
              `/LoanApplication/GetDocumentByLoanApplicationId?loanApplicationId=${id}`
            );
            const { data } = response;
            const originalArray = data.value;

            setDocumentData(originalArray.reverse());
          } catch (error) {
            console.log(error);
          }
        };
        const GetCommentById = async (token) => {
          try {
            const response = await API.get(
              `/LoanApplication/GetQueryByLoanApplicationId?id=${id}`
            );
            const { data } = response;

            setCommentData(data.value);
          } catch (error) {
            console.log(error);
            // Notification("error", error?.response?.data[0]?.errorMessage);
          }
        };

        GetLoanById(token);
        GetDocumentById(token);
        GetCommentById(token);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);


  return (
    <div>
      <Preloader />
      <div class="profile-page-section">
        <div>
          <div class="nav nav-tabs " id="nav-tab" role="tablist">
            <div
              class="nav-link  active"
              id="nav-profile-b-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="true"
            >
              Loan Details
            </div>
            <div
              class="nav-link"
              id="nav-kyc-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-kyc"
              type="button"
              role="tab"
              aria-controls="nav-kyc"
              aria-selected="false"
            >
              Document Details
            </div>
          </div>
        </div>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-b-tab"
            tabindex="0"
          >
            <form action="" class="form">
              <div>
                <div class="row">
                  <div className="d-flex justify-content-end">
                    {/* <span className="mr-10">Loan Status - </span> */}
                    <h4
                      class={`title_text ${loanData?.status === "Pending"
                        ? "Pending-text"
                        : loanData?.status === "Query"
                          ? "qyery-text"
                          : loanData?.status === "Reject"
                            ? "Rejected-text"
                            : loanData?.status === "Approve"
                              ? "Approved-text"
                              : loanData?.status === "Incomplete"
                                ? "Process-text"
                                : ""
                        }`}
                    >
                      {loanData?.status === "Approve"
                        ? "Approved"
                        : loanData?.status === "Reject"
                          ? "Rejected"
                          : loanData?.status?.toUpperCase()}
                    </h4>
                  </div>

                  <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                    <div class="single-input">
                      <label for="term">Loan Application Number</label>
                      <input
                        type="text"
                        value={loanData?.applicationNumberForLoan?.toUpperCase()}
                        id="applicationNumberForLoan"
                        // placeholder="0"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                    <div class="single-input">
                      <label>Loan Type</label>
                      <input
                        // type="number"
                        // id="Loan-Amount"
                        value={loanData?.loanTypeName}
                        //   name="BusinessLoan"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                    <label for="Loan-Amount">Loan Amount (INR)</label>
                    <input
                      type="number"
                      id="Loan-Amount"
                      name="begin"
                      value={loanData?.amount}
                      disabled
                    />
                  </div>

                  <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                    <div class="single-input">
                      <label for="term">Loan Tenure (Year)</label>
                      <input
                        type="text"
                        value={loanData?.tenure}
                        id="term"
                        placeholder="0"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                    <label for="first-name">Name</label>
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      value={`${loanData?.user?.firstName} ${loanData?.user?.lastName}`}
                      required
                      disabled
                    />
                  </div>

                  <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                    <label for="email">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={loanData?.user?.email}
                      required
                      disabled
                    />
                  </div>
                  <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                    <label for="phone">Contact No.</label>
                    <div className="mobile-number-input">
                      {/* <img src="/images/india_2.png" className="indiaFlag" />
                      <span className="country-code">+91</span> */}
                      <input
                        type="number"
                        id="phone"
                        name="phone"
                        value={loanData?.user?.phoneNumber}
                        required
                        disabled
                      />
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                    <div class="single-input">
                      <label for="state">Pincode</label>
                      <input
                        type="text"
                        id="postalCode"
                        placeholder="394101"
                        value={loanData?.postalCode}
                        required=""
                        disabled
                      />
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                    <div class="single-input">
                      <label for="state">City</label>
                      <input
                        type="text"
                        id="city"
                        placeholder="Gujarat"
                        value={loanData?.city}
                        required=""
                        disabled
                      />
                    </div>
                  </div>
                  <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                    <div class="single-input">
                      <label for="state">State</label>
                      <input
                        type="text"
                        id="state"
                        placeholder="Gujarat"
                        value={loanData?.state}
                        required=""
                        disabled
                      />
                    </div>
                  </div>
                </div>
                {loanData?.bankDetailForLoans?.length ? (
                  <div class="row preferred_bank">
                    <div className="col-lg-6 col-md-6 col-sm-12 m-basics ">
                      <div class="table-section">
                        <>
                          <h5> Preferred bank</h5>
                          <table class="table mt-4 preferred_bank_table">
                            <thead>
                              <tr>
                                <th scope="col">Sr.No</th>

                                <th scope="col">Bank Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loanData &&
                                loanData?.bankDetailForLoans?.length &&
                                loanData?.bankDetailForLoans.map(
                                  (elm, index) => {
                                    return (
                                      <>
                                        <tr key={index}>
                                          <td>{index + 1}</td>
                                          <td>{elm?.bankName}</td>
                                        </tr>
                                      </>
                                    );
                                  }
                                )}
                            </tbody>
                          </table>
                        </>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div class="loan-content-body">
                  <h5>Query History</h5>
                  <div class="loan-section-table">
                    <div class="table-responsive">
                      <table class="table ">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Comment</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentData &&
                            // commentData.length &&
                            commentData.map((elm, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <span
                                      class={` ${elm?.status === "Pending"
                                        ? "Rejected-text"
                                        : elm?.status === "Query"
                                          ? "qyery-text"
                                          : elm?.status === "Reject"
                                            ? "Rejected-text"
                                            : elm?.status === "Approved"
                                              ? "Approved-text"
                                              : elm?.status === "Submitted"
                                                ? "Process-text"
                                                : ""
                                        }`}
                                    >
                                      {elm?.status === "Reject"
                                        ? "Rejected"
                                        : elm?.status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td>


                                    {elm?.comment}

                                    {elm.documentList.length > 0 && (
                                      <ul>
                                        {elm.documentList.length > 0 &&
                                          elm.documentList.filter((ele, i) => ele.documentSource === "User").map(
                                            (detail, i) => (
                                              <>
                                                <h6 class="text-head text-head-query">
                                                  Attached  Documents :
                                                </h6>
                                                {/* <li key={i}>{detail.otherDocumentName}-</li> */}
                                                <div key={i}>
                                                  <a
                                                    href={
                                                      detail.documentURL
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="document_hyper_link"
                                                  >
                                                    {detail.documentName}
                                                  </a>
                                                </div>

                                              </>
                                            )
                                          )}
                                      </ul>
                                    )}
                                  </td>
                                  <td>
                                    {/* {loanData?.status === "Incomplete" ||
                              loanData?.status === "Query" ? (
                                <input
                                  type="text"
                                  placeholder="Enter your comment "
                                />
                              ) : ( */}
                                    {elm.remark && (
                                      <span className="remark">
                                        {elm.remark}
                                        {/* GST Certificate has been received */}
                                      </span>
                                    )}
                                    <div className="query_row_remark  justify-content-start">
                                      {elm.documentList.length ? (
                                        <ul>
                                          {elm.documentList.length > 0 &&
                                            elm.documentList.filter((ele, i) => ele.documentSource === "Admin").map(
                                              (detail, i) => (
                                                <>
                                                  <h5 class="text-head text-head-query">
                                                    Uploaded Documents
                                                  </h5>
                                                  <div style={{ display: "flex" }}>

                                                    <span className="view_doc" key={i}>{detail.otherDocumentName}-{" "}</span>
                                                    <div key={i}>
                                                      <a
                                                        href={detail.documentURL}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="document_hyper_link"
                                                      >
                                                        {detail.documentName}
                                                      </a>
                                                    </div>
                                                  </div>
                                                </>

                                              )
                                            )}
                                        </ul>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    {/* )} */}
                                  </td>
                                  {/* <td>
                                    {" "}
                                    <i class="fa-regular fa-eye" />
                                  </td> */}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                      <>
                        {!commentData?.length && (
                          <div className="text-center">
                            <h4>No Data Found</h4>
                          </div>
                        )}
                      </>
                    </div>

                    {/* {totalItems > itemsPerPage && (
                      <PaginationTable
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    )} */}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div
            class="tab-pane fade kyc-details"
            id="nav-kyc"
            role="tabpanel"
            aria-labelledby="nav-kyc-tab"
            tabindex="0"
          >
            <div class="form">
              <>
                {documentData &&
                  documentData.map((item, index) => (
                    <div key={index}>
                      <h4 class="text-head text-head-query">
                        {item.documentName === "Other"
                          ? "Other Documents"
                          : item.documentName}
                      </h4>

                      <ul>
                        {item.documentDetail.length > 0 ? (
                          item.documentDetail.map((detail, i) => (
                            <div key={index}>
                              {item.documentName === "Other" && (
                                <>
                                  <span className="view_doc">
                                    {detail.otherDocumentName} -{" "}
                                  </span>
                                </>
                              )}
                              <a
                                href={detail.documentURL}
                                target="_blank"
                                rel="noreferrer"
                                className="document_hyper_link"
                              >
                                {detail.documentName}
                              </a>
                            </div>
                            // <li key={i}>-{detail.documentName}</li>
                          ))
                        ) : (
                          <li>-No document uploaded</li>
                        )}
                      </ul>
                    </div>
                  ))}
              </>
            </div>
          </div>
        </div>

        <div
          class="modal model-card fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <div
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></div>
              </div>
              <div class="modal-body">
                Are you sure, <br /> you want to logout?
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="Cancel-btn"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" class="Logout-btn">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLoan;
