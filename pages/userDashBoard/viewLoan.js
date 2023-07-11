import React, { useState, useRef } from "react";

function ViewLoan() {
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
    <div className="  wrapper">
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
                    value="Jignesh Patel"
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
                    value="jigneshp123@gmail.com"
                    required
                    disabled
                  />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                  <label for="phone">Phone Number</label>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    value="9237781246"
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
                    value="Pending"
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
                    value="500000"
                    disabled
                  />
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                  <div class="single-input">
                    <label for="name">Loan Type</label>
                    <select
                      class="selectDrop form-select"
                      aria-label="Default select example"

                      // disabled
                    >
                      <option>Business Loan</option>
                      <option value="1">Personal Loan</option>
                      <option value="2">Home Loan</option>
                      <option value="3">Car Loan</option>
                    </select>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                  <div class="single-input">
                    <label for="term">Loan Tenure</label>
                    <input
                      type="text"
                      id="term"
                      placeholder=" 12 months"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div class="btn-section">
                <button class="profile-btn me-3">Edit</button>
                <button class="profile-btn">Save</button>
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
            <form action="" class="form">
              <div class="row">
                <div class="my-5 col-lg-6 col-md-6 col-sm-12">
                  <h4>Business proof</h4>
                  <div class="input-box ">
                    <input
                      type="file"
                      multiple
                      ref={aRef}
                      class="upload-box"
                      name="step3.business"
                      onChange={handlePanFileChange}
                    />
                  </div>
                  {docFiles.length > 0 && (
                    <div>
                      <h4>Selected files:</h4>
                      {docFiles &&
                        docFiles?.map((file, index) => (
                          <div key={index}>
                            <div className="selectfile">
                              <p>{file?.name}</p>
                              <i
                                class="fa-solid fa-xmark"
                                onClick={() => handleRemoveFile(index)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </div>

                            <div
                              class="progress"
                              role="progressbar"
                              aria-label="Basic example"
                              aria-valuenow="100"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{ height: "6px" }}
                            >
                              <div
                                class="progress-bar"
                                style={{ width: "100%" }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div class="my-5 col-lg-6 col-md-6 col-sm-12">
                  <h4> GST Certificate </h4>

                  <div class="input-box">
                    <input
                      type="file"
                      class="upload-box"
                      name="files[]"
                      multiple
                    />
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                </div>

                {/* <div class="my-5 col-lg-6 col-md-6 col-sm-12">
                                <h4>PAN Card</h4>
                                <div class="input-box">
                                  <input
                                    type="file"
                                    class="upload-box"
                                    name="files[]"
                                    multiple
                                  />
                                  <i class="fa-solid fa-xmark"></i>
                                </div>
                              </div>

                              <div class="my-5 col-lg-6 col-md-6 col-sm-12">
                                <h4>Adhar card</h4>
                                <div class="input-box">
                                  <input
                                    type="file"
                                    class="upload-box"
                                    name="files[]"
                                    multiple
                                  />
                                  <i class="fa-solid fa-xmark"></i>
                                </div>
                              </div> */}

                <div class="my-5 col-lg-6 col-md-6 col-sm-12">
                  <h4>Light Bill</h4>
                  <div class="input-box">
                    <input
                      type="file"
                      class="upload-box"
                      name="files[]"
                      multiple
                    />
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                </div>

                <div class="my-5 col-lg-6 col-md-6 col-sm-12">
                  <h4>3 year ITR</h4>
                  <div class="input-box">
                    <input
                      type="file"
                      class="upload-box"
                      name="files[]"
                      multiple
                    />
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                </div>

                <div class="row">
                  <div class="my-5 col-lg-6 col-md-6 col-sm-12">
                    <h4> Bank Statement</h4>
                    <div class="input-box">
                      <input
                        type="file"
                        class="upload-box"
                        name="files[]"
                        multiple
                      />
                      <i class="fa-solid fa-xmark"></i>
                    </div>
                  </div>

                  {documentFields.map((field, index) => (
                    <div key={index} class="my-5 col-lg-6 col-md-6 col-sm-12">
                      {field.editLabel ? (
                        <div className="field-container">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(event) =>
                              handleLabelChange(index, event)
                            }
                            placeholder="Other Document"
                          />
                          <i
                            class="fa-solid fa-pen-to-square"
                            style={{
                              color: "green",
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            onClick={() => toggleEditLabel(index)}
                          />
                          <i
                            style={{
                              color: "red",
                              cursor: "pointer",
                              marginRight: "10px",
                            }}
                            class="fa-solid fa-trash"
                            onClick={() => deleteField(index)}
                          />
                        </div>
                      ) : (
                        <label onClick={() => toggleEditLabel(index)}>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <h4 style={{ marginRight: "10px" }}>
                              {" "}
                              {field.label}
                            </h4>
                            <i
                              class="fa-solid fa-pen-to-square"
                              style={{
                                color: "green",
                                cursor: "pointer",
                                marginRight: "10px",
                              }}
                            />
                            <i
                              style={{
                                color: "red",
                                cursor: "pointer",
                                marginRight: "10px",
                              }}
                              class="fa-solid fa-trash"
                              onClick={() => deleteField(index)}
                            />
                          </div>
                        </label>
                      )}
                      <div class="input-box">
                        <input
                          type="file"
                          value={field.value}
                          class="upload-box"
                          onChange={(event) => handleValueChange(index, event)}
                          // class="input-box"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  class="my-5 col-lg-6 col-md-6 col-sm-12"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    type="button"
                    className="cmn-btn"
                    onClick={addDynamicField}
                  >
                    + Other Documents
                  </button>
                </div>
              </div>
              <div class="btn-section">
                <button class="profile-btn me-3">Edit</button>
                <button class="profile-btn">Save</button>
              </div>
            </form>
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
                  <table class="table ">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th> Name</th>
                        <th>Status</th>
                        <th>Comment</th>
                        <th>Remarks</th>
                        <th>Submit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          6/27/2023 <br /> 3:20:10 PM{" "}
                        </td>
                        <td> Sattar Patel </td>
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
                          <button class="table-btn btn ">Sumbit</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          6/26/2023 <br /> 1:49:50 PM{" "}
                        </td>
                        <td> Sattar Patel </td>
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
                          6/25/2023 <br /> 7:20:10 PM{" "}
                        </td>
                        <td> Sattar Patel </td>
                        <td>
                          <span class="all-btn Re-Active-btn">Re-Activate</span>
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
                          <button class="table-btn btn ">Sumbit</button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          6/25/2023 <br /> 3:20:10 PM{" "}
                        </td>
                        <td> Sattar Patel </td>
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
                          <button class="table-btn btn ">Sumbit</button>
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
