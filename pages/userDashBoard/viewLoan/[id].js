import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

function ViewLoan() {
  const router = useRouter();
  const { id } = router.query;
  const [loanData, setLoanData] = useState("");
  console.log(loanData, "-=-=");
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

    GetLoanById(token);
  }, []);

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
            <div
              class="nav-link"
              id="nav-contact-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-contact"
              type="button"
              role="tab"
              aria-controls="nav-contact"
              aria-selected="false"
            >
              Comment
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
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                  <label for="phone">Contact No</label>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    value={loanData?.user?.phoneNumber}
                    required
                    disabled
                  />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
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
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
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

                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                  <label for="Loan-Amount">Loan Amount</label>
                  <input
                    type="number"
                    id="Loan-Amount"
                    name="begin"
                    value={loanData?.amount}
                    disabled
                  />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                  <div class="single-input">
                    <label>Loan Type</label>
                    <input
                      // type="number"
                      // id="Loan-Amount"
                      value={loanData?.loanType}
                      //   name="BusinessLoan"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
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
                                                    handlePanFileChange(
                                                      data?.name,
                                                      e,
                                                      data?.id
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                            {docFiles[data?.name]?.length >
                                              0 && (
                                              <div>
                                                <h4>Selected files:</h4>
                                                {docFiles[data?.name] &&
                                                  docFiles[data?.name]?.map(
                                                    (file, index) => (
                                                      <div key={index}>
                                                        <div className="selectfile">
                                                          <p>{file?.name}</p>

                                                          <i
                                                            class="fa-solid fa-xmark"
                                                            onClick={() =>
                                                              handleRemoveFile(
                                                                data?.name,
                                                                index
                                                              )
                                                            }
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                          ></i>
                                                        </div>
                                                        {file && (
                                                          <PreviewComponent
                                                            file={file}
                                                          />
                                                        )}
                                                
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      );
                                    })}
</div>
            </form> */}
          </div>

          <div
            class="tab-pane fade "
            id="nav-contact"
            role="tabpanel"
            aria-labelledby="nav-contact-tab"
            tabindex="0"
          >
            <div class="loan-content-body">
              <div class="loan-section-table">
                <div class="table-responsive">
                  <table class="table ">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Comment</th>
                        <th>Remarks</th>
                        <th>Submit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span class="all-btn Accepted-btn">New</span>
                        </td>
                        <td>Light Bill not found</td>
                        <td>
                          <input
                            type="text"
                            placeholder="Enter your comment "
                          />
                        </td>
                        <td>
                          {" "}
                          <button class="table-btn btn ">Submit</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="all-btn Approved-btn">Approved</span>
                        </td>
                        <td>GST Certificate has been received</td>
                        <td>
                          <input
                            type="text"
                            placeholder="Enter your comment "
                          />
                        </td>
                        <td>
                          {" "}
                          <button class="table-btn btn">Submit</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="all-btn Re-Active-btn">ReActivate</span>
                        </td>
                        <td>GST Certificate not match</td>
                        <td>
                          <input
                            type="text"
                            placeholder="Enter your comment "
                          />
                        </td>
                        <td>
                          {" "}
                          <button class="table-btn btn ">Submit</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="all-btn Process-btn">Re-submit</span>
                        </td>
                        <td>GST Certificate not found</td>
                        <td>
                          <input
                            type="text"
                            placeholder="Enter your comment "
                          />
                        </td>
                        <td>
                          {" "}
                          <button class="table-btn btn ">Submit</button>
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
