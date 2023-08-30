import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Preloader from "../../../components/preloader/Preloader";

function ViewLoan() {
  const router = useRouter();
  const { id } = router.query;
  const [loanData, setLoanData] = useState("");
  const [documentData, setDocumentData] = useState("");
  const [commentData, setCommentData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("logintoken");

    const GetLoanById = async (token) => {
      // const token = localStorage.getItem("logintoken");
      try {
        const response = await axios.get(
          `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetById?id=${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
        const response = await axios.get(
          `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetDocumentByLoanApplicationId?loanApplicationId=${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response;

        setDocumentData(data.value);
      } catch (error) {
        console.log(error);
        // Notification("error", error?.response?.data[0]?.errorMessage);
      }
    };
    const GetCommentById = async (token) => {
      // const token = localStorage.getItem("logintoken");
      try {
        const response = await axios.get(
          `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetLoanApplicationHistory?loanApplicationId=${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  }, [id]);

  const [docFiles, setdocFiles] = useState([]);

  const aRef = useRef(null);
  const handlePanFileChange = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    setdocFiles([...docFiles, ...fileArray]);
  };

  const handleRemoveFile = (index) => {
    setdocFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      if (updatedFiles.length === 1) aRef.current.value = null;
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };
  const [documentFields, setDocumentFields] = useState([]);

  const addDynamicField = () => {
    setDocumentFields((prevFields) => [
      ...prevFields,
      { label: "", value: "", editLabel: true },
    ]);
  };

  const handleLabelChange = (index, event) => {
    const updatedFields = [...documentFields];
    updatedFields[index].label = event.target.value;
    setDocumentFields(updatedFields);
  };

  const handleValueChange = (index, event) => {
    const updatedFields = [...documentFields];
    updatedFields[index].value = event.target.value;
    setDocumentFields(updatedFields);
  };

  const toggleEditLabel = (index) => {
    const updatedFields = [...documentFields];
    updatedFields[index].editLabel = !updatedFields[index].editLabel;
    setDocumentFields(updatedFields);
  };

  const deleteField = (index) => {
    const updatedFields = [...documentFields];
    updatedFields.splice(index, 1);
    setDocumentFields(updatedFields);
  };

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
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
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
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
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
                  <div class="col-lg-6 col-md-3 col-sm-12 m-basics">
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
                  <div class="col-lg-6 col-md-3 col-sm-12 m-basics">
                    <label for="phone">Contact No</label>
                    <div className="mobile-number-input">
                      <img src="/images/india_2.png" className="indiaFlag" />
                      <span className="country-code">+91</span>
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
                  <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
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
                  <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                    <label for="loan-status">Loan Status</label>
                    <input
                      type="loan-status"
                      id="loan-status"
                      name="loan-status"
                      value={loanData?.status}
                      required
                      disabled
                    />
                  </div>
                  <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                    <label for="Loan-Amount">Loan Amount</label>
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
                      <label for="term">Loan Tenure</label>
                      <input
                        type="text"
                        value={loanData?.tenure}
                        id="term"
                        placeholder="1 Year"
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
                                <th scope="col">Rate of interest</th>
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
                                          <td>{elm?.interestRate}</td>
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
                  <h5>Comment History</h5>
                  <div class="loan-section-table">
                    <div class="table-responsive">
                      <table class="table ">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Comment</th>
                            <th>Remarks</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <span class="all-btn Accepted-btn">New</span>
                            </td>
                            <td>Light Bill not found</td>
                            <td>
                              {/* {loanData?.status === "Incomplete" ||
                              loanData?.status === "Query" ? (
                                <input
                                  type="text"
                                  placeholder="Enter your comment "
                                />
                              ) : ( */}
                              <span className="remark">
                                GST Certificate has been received
                              </span>
                              {/* )} */}
                            </td>
                            <td>
                              {" "}
                              <i class="fa-regular fa-eye" />
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <span class="all-btn Re-Active-btn">
                                ReActivate
                              </span>
                            </td>
                            <td>GST Certificate not match</td>
                            <td>
                              <span className="remark">
                                Light Bill not found
                              </span>
                            </td>
                            <td>
                              {" "}
                              <i class="fa-regular fa-eye" />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span class="all-btn Process-btn">Re-submit</span>
                            </td>
                            <td>GST Certificate not found</td>
                            <td>
                              <span className="remark">
                                GST Certificate has been received
                              </span>
                            </td>
                            <td>
                              {" "}
                              <i class="fa-regular fa-eye" />
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

              {/* <div class="btn-section">
                <button class="profile-btn me-3">Edit</button>
                <button class="profile-btn">Save</button>
              </div> */}
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
                {documentData && documentData.length
                  ? documentData.map((elm, index) => {
                      return (
                        <>
                          <div class="row">
                            <div
                              class="my-4 col-lg-12 col-md-12 col-sm-12"
                              key={index}
                            >
                              <h4 style={{ marginLeft: "0px" }}>
                                {elm?.otherDocumentName}
                              </h4>

                              <span
                                className="document_hyper_link"
                                onClick={() =>
                                  window.open(elm?.documentURL, "_blank")
                                }
                              >
                                {elm?.documentURL}
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })
                  : "No Document Uploaded"}
              </>
            </div>
            {/* <form action="" class="form">
              <div class="row">
                {documentOption?.length > 0 &&
                  documentOption.map((data, index) => {
                    return (
                      <>
                        <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                          <div key={index}>
                            <h4>{data?.name}</h4>
                            <div class="input-box ">
                              <input
                                type="file"
                                multiple
                                ref={aRef}
                                class="upload-box"
                                onChange={(e) =>
                                  handlePanFileChange(data?.name, e, data?.id)
                                }
                              />
                            </div>
                          </div>
                          {docFiles[data?.name]?.length > 0 && (
                            <div>
                              <h4>Selected files:</h4>
                              {docFiles[data?.name] &&
                                docFiles[data?.name]?.map((file, index) => (
                                  <div key={index}>
                                    <div className="selectfile">
                                      <p>{file?.name}</p>

                                      <i
                                        class="fa-solid fa-xmark"
                                        onClick={() =>
                                          handleRemoveFile(data?.name, index)
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      ></i>
                                    </div>
                                    {file && <PreviewComponent file={file} />}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })}
              </div>
            </form> */}
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
