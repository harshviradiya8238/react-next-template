import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stepper from "react-stepper-horizontal";

// Define the validation schema
const validationSchema = Yup.object().shape({
  step1: Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string().required("Contact No is required"),
    state: Yup.string().required("State is required"),
  }),
  step2: Yup.object().shape({
    pan: Yup.string().required("pan is required"),
    loanType: Yup.string().required("LoanType is required"),
    loanAmount: Yup.string().required("LoanAmount is required"),
    loanTerm: Yup.string().required("LoanTenure is required"),
  }),
  step3: Yup.object().shape({
    businessProof: Yup.string().required("Address is required"),
    gst: Yup.string().required("City is required"),
    panCard: Yup.string().required("Country is required"),
  }),
});

function LoanApplication() {
  const [state, setSatate] = useState({
    step1: { name: "", email: "" },
    step2: { pan: "", loanType: "", loanAmount: "", loanTerm: "", state: "" },
    step3: {
      businessProof: [],
      gst: [],
      panCard: [],
      adharCard: [],
      lightBill: [],
      itr: [],
      bankStatement: [],
    },
    activeStep: 0,
  });

  const stepsmain = [
    { title: "Loan Details" },
    { title: "Document Details" },
    { title: "Application confirmation" },
  ];

  const [eligiblity, setEligiblity] = useState(false);
  const [selectedOption, setSelectedOption] = useState("business");

  const aRef = useRef(null);

  const handleCheckEligiblity = () => {
    setEligiblity(true);
  };

  const handleNext = (setFieldValue, values) => {
    console.log(values.activeStep);
    setFieldValue("activeStep", values.activeStep + 1);
  };

  const handlePrevious = (setFieldValue, values) => {
    setFieldValue("activeStep", values.activeStep - 1);
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const [docFiles, setdocFiles] = useState({
    itrFile: [],
    bankStatements: [],
    otherDocuments: [],
  });

  const handleFieldChange = (index, field, value) => {
    setdocFiles((prevState) => {
      const otherDocuments = [...prevState.otherDocuments];
      otherDocuments[index][field] = value;
      return {
        ...prevState,
        otherDocuments,
      };
    });
  };

  const addOtherDocumentField = () => {
    if (docFiles.otherDocuments.length < 5) {
      setdocFiles((prevState) => ({
        ...prevState,
        otherDocuments: [
          ...prevState.otherDocuments,
          { label: "", files: [], editable: true },
        ],
      }));
    }
  };

  const handlePanFileChange = (fieldType, event) => {
    const selectedFiles = [...event.target.files];
    const updatedFiles = selectedFiles.slice(0, 3);
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: updatedFiles,
    }));
  };

  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
  };

  const handleOtherDocumentFileChange = (index, event) => {
    const selectedFiles = [...event.target.files];
    const updatedFiles = selectedFiles.slice(0, 3);
    handleFieldChange(index, "files", updatedFiles);
  };

  const handleRemoveOtherDocumentFile = (index, fileIndex) => {
    setdocFiles((prevState) => {
      const otherDocuments = [...prevState.otherDocuments];
      otherDocuments[index].files.splice(fileIndex, 1);
      return {
        ...prevState,
        otherDocuments,
      };
    });
  };

  const handleToggleEdit = (index) => {
    setdocFiles((prevState) => {
      const otherDocuments = [...prevState.otherDocuments];
      otherDocuments[index].editable = !otherDocuments[index].editable;
      return {
        ...prevState,
        otherDocuments,
      };
    });
  };

  const handleDeleteField = (index) => {
    setdocFiles((prevState) => {
      const otherDocuments = [...prevState.otherDocuments];
      otherDocuments.splice(index, 1);
      return {
        ...prevState,
        otherDocuments,
      };
    });
  };
  // const handleFilePreview = (file) => {
  //   // return URL.createObjectURL(file.target.files[0]);
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       resolve(event.target.result);
  //     };
  //     reader.onerror = (event) => {
  //       reject(event.target.error);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };
  return (
    <section className="apply-for-loan business-loan" id="business-loan-form ">
      <div className="overlay pt-120">
        <div className="container wow fadeInUp">
          <div className="row justify-content-center"></div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="form-content">
                <div className="section-header text-center">
                  <h2 className="title">Apply for a loan</h2>
                  <p>
                    Please fill the form below. We will get in touch with you
                    within 1-2 business days, to request all necessary details
                  </p>
                </div>
                {/* Loan form  */}

                <div style={{ marginTop: "100px" }}>
                  <Formik
                    initialValues={state}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, values, setFieldValue }) => (
                      <Form>
                        <Stepper
                          steps={stepsmain}
                          activeStep={values.activeStep}
                        />
                        {values.activeStep === 0 && (
                          <div
                            style={{
                              padding: "20px 0px",
                            }}
                          >
                            {/* <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "20px 0px",
                              }}
                            >
                              <h3>Step 2</h3>
                            </div> */}

                            {eligiblity ? (
                              <>
                                <div class="table-section">
                                  <table class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">Select</th>
                                        <th scope="col">Bank Name</th>
                                        <th scope="col">Rate of interest</th>
                                        <th scope="col">EMI</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th>
                                          <label class="checkbox">
                                            <input type="checkbox" />
                                            <div class="checkbox-circle">
                                              <svg
                                                viewBox="0 0 52 52"
                                                class="checkmark"
                                              >
                                                <circle
                                                  fill="none"
                                                  r="25"
                                                  cy="26"
                                                  cx="26"
                                                  class="checkmark-circle"
                                                ></circle>
                                                <path
                                                  d="M16 26l9.2 8.4 17.4-21.4"
                                                  class="checkmark-kick"
                                                ></path>
                                              </svg>
                                            </div>
                                          </label>
                                        </th>
                                        <td>HDFC Bank</td>
                                        <td>12%</td>
                                        <td>₹ 2000</td>
                                      </tr>
                                      <tr>
                                        <th>
                                          <label class="checkbox">
                                            <input type="checkbox" />
                                            <div class="checkbox-circle">
                                              <svg
                                                viewBox="0 0 52 52"
                                                class="checkmark"
                                              >
                                                <circle
                                                  fill="none"
                                                  r="25"
                                                  cy="26"
                                                  cx="26"
                                                  class="checkmark-circle"
                                                ></circle>
                                                <path
                                                  d="M16 26l9.2 8.4 17.4-21.4"
                                                  class="checkmark-kick"
                                                ></path>
                                              </svg>
                                            </div>
                                          </label>
                                        </th>
                                        <td>Axis Bank</td>
                                        <td>14%</td>
                                        <td>₹ 1500</td>
                                      </tr>
                                      <tr>
                                        <th>
                                          <label class="checkbox">
                                            <input type="checkbox" />
                                            <div class="checkbox-circle">
                                              <svg
                                                viewBox="0 0 52 52"
                                                class="checkmark"
                                              >
                                                <circle
                                                  fill="none"
                                                  r="25"
                                                  cy="26"
                                                  cx="26"
                                                  class="checkmark-circle"
                                                ></circle>
                                                <path
                                                  d="M16 26l9.2 8.4 17.4-21.4"
                                                  class="checkmark-kick"
                                                ></path>
                                              </svg>
                                            </div>
                                          </label>
                                        </th>
                                        <td>ICICI Bank</td>
                                        <td>14%</td>
                                        <td>₹ 2500</td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      className="cmn-btn"
                                      style={{ marginRight: "10px" }}
                                      onClick={() => setEligiblity(false)}
                                    >
                                      Previous
                                    </button>
                                    <button
                                      type="button"
                                      className="cmn-btn"
                                      onClick={() =>
                                        handleNext(setFieldValue, values)
                                      }
                                      // disabled={
                                      //   !values.step2 ||
                                      //   !values.step2.loanAmount ||
                                      //   !values.step2.loanType ||
                                      //   !values.step2.state ||
                                      //   !values.step2.loanTerm
                                      // }
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="row">
                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Loan Amount (INR)</label>
                                      <Field
                                        type={"number"}
                                        placeholder="Loan Amount (INR)"
                                        name="step2.loanAmount"
                                      />
                                      <ErrorMessage
                                        name="step2.loanAmount"
                                        component="div"
                                        style={{ color: "red" }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Loan Type</label>
                                      <select
                                        className="selectDrop form-select"
                                        aria-label="Default select example"
                                        name="step2.loanType"
                                        value={selectedOption}
                                        onChange={handleOptionChange}
                                      >
                                        <option value="business" selected>
                                          Business Loan
                                        </option>
                                        <option value="personal">
                                          Personal Loan
                                        </option>
                                        <option value="home">Home Loan</option>
                                        <option value="car">Car Loan</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Loan Tenure (Year)</label>

                                      <Field
                                        type="text"
                                        name="step2.loanTerm"
                                        placeholder="1 Year"
                                      />
                                      <ErrorMessage
                                        name="step2.loanTerm"
                                        component="div"
                                        style={{ color: "red" }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>State</label>

                                      <Field
                                        type="text"
                                        // value=""
                                        name="step2.state"
                                        // placeholder="1 Year"
                                      />
                                      {/* <ErrorMessage
                                        name="step2.loanTerm"
                                        component="div"
                                        style={{ color: "red" }}
                                      /> */}
                                    </div>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                  }}
                                >
                                  <button
                                    onClick={handleCheckEligiblity}
                                    className="cmn-btn"
                                  >
                                    Next
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        {values.activeStep === 1 && (
                          <div
                            style={{
                              padding: "20px 0px",
                            }}
                          >
                            <div class="row">
                              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                <h4>3 year ITR /Form 16</h4>
                                <div class="input-box ">
                                  <input
                                    type="file"
                                    multiple
                                    ref={aRef}
                                    class="upload-box"
                                    onChange={(e) =>
                                      handlePanFileChange("itrFile", e)
                                    }
                                  />
                                </div>
                                {docFiles?.itrFile?.length > 0 && (
                                  <div>
                                    <h4>Selected files:</h4>
                                    {docFiles &&
                                      docFiles?.itrFile?.map((file, index) => (
                                        <div key={index}>
                                          <div className="selectfile">
                                            <p>{file?.name}</p>

                                            <i
                                              class="fa-solid fa-xmark"
                                              onClick={() =>
                                                handleRemoveFile(
                                                  "itrFile",
                                                  index
                                                )
                                              }
                                              style={{
                                                cursor: "pointer",
                                              }}
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
                                              style={{
                                                width: "100%",
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>

                              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                <h4>Bank Statement</h4>
                                <div class="input-box ">
                                  <input
                                    type="file"
                                    multiple
                                    ref={aRef}
                                    class="upload-box"
                                    onChange={(e) =>
                                      handlePanFileChange("bankStatements", e)
                                    }
                                  />
                                </div>
                                {docFiles?.bankStatements?.length > 0 && (
                                  <div>
                                    <h4>Selected files:</h4>
                                    {docFiles &&
                                      docFiles?.bankStatements?.map(
                                        (file, index) => (
                                          <div key={index}>
                                            <div className="selectfile">
                                              <p>{file?.name}</p>
                                              <i
                                                class="fa-solid fa-xmark"
                                                onClick={() =>
                                                  handleRemoveFile(
                                                    "bankStatements",
                                                    index
                                                  )
                                                }
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
                                        )
                                      )}
                                  </div>
                                )}
                              </div>
                              {/* <div>
                                <div class="row">
                                  {docFiles.otherDocuments.map(
                                    (field, fieldIndex) => (
                                      <div
                                        key={fieldIndex}
                                        class="my-4 col-lg-6 col-md-6 col-sm-12"
                                      >
                                        <div>
                                          {field.editable ? (
                                            <input
                                              type="text"
                                              value={field.label}
                                              onChange={(e) =>
                                                handleFieldChange(
                                                  fieldIndex,
                                                  "label",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="Upload Document"
                                            />
                                          ) : (
                                            <h4>{field.label}</h4>
                                          )}
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {field && field.editable ? (
                                              <button
                                                style={{ margin: "10px" }}
                                                onClick={() =>
                                                  handleToggleEdit(fieldIndex)
                                                }
                                              >
                                                Save
                                              </button>
                                            ) : (
                                              <button
                                                style={{
                                                  width: "40px",
                                                  border: "none",
                                                }}
                                                onClick={() =>
                                                  handleToggleEdit(fieldIndex)
                                                }
                                              >
                                                <i
                                                  class="fa-solid fa-pen-to-square"
                                                  style={{
                                                    color: "green",
                                                    cursor: "pointer",
                                                  }}
                                                />
                                              </button>
                                            )}
                                            <i
                                              style={{
                                                color: "red",
                                                cursor: "pointer",
                                                marginRight: "10px",
                                              }}
                                              class="fa-solid fa-trash"
                                              onClick={() =>
                                                handleDeleteField(fieldIndex)
                                              }
                                            />
                                          </div>
                                          <div className="input-box">
                                            <input
                                              type="file"
                                              multiple
                                              class="upload-box"
                                              onChange={(e) =>
                                                handleOtherDocumentFileChange(
                                                  fieldIndex,
                                                  e
                                                )
                                              }
                                            />
                                          </div>
                                          {field?.files?.length > 0 && (
                                            <div>
                                              <h4>Selected files:</h4>
                                              {field?.files?.map(
                                                (file, fileIndex) => (
                                                  <div key={fileIndex}>
                                                    <div className="selectfile">
                                                      <p>{file?.name}</p>
                                                      <i
                                                        class="fa-solid fa-xmark"
                                                        onClick={() =>
                                                          handleRemoveOtherDocumentFile(
                                                            fieldIndex,
                                                            fileIndex
                                                          )
                                                        }
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
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
                                                        style={{
                                                          width: "100%",
                                                        }}
                                                      ></div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>

                                <div
                                  class="my-4 col-lg-6 col-md-6 col-sm-12"
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <button onClick={addOtherDocumentField}>
                                    other
                                  </button>
                                </div>
                              </div> */}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              {/* <button
                                type="submit"
                                className="cmn-btn"
                                style={{ marginRight: "10px" }}
                              >
                                Submit
                              </button> */}
                              <button
                                type="button"
                                style={{ marginRight: "10px" }}
                                className="cmn-btn"
                                onClick={() =>
                                  handlePrevious(setFieldValue, values)
                                }
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                className="cmn-btn"
                                onClick={() =>
                                  handleNext(setFieldValue, values)
                                }
                                // disabled={
                                //   !values.step2 ||
                                //   !values.step2.loanAmount ||
                                //   !values.step2.loanType ||
                                //   !values.step2.state ||
                                //   !values.step2.loanTerm
                                // }
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                        {values.activeStep === 2 && (
                          <div class="main-container d-flex container-fluid p-0">
                            <div class="loan-aplication-approver-section">
                              {/* <h1 class="text-center">Loan Bazar</h1> */}
                              <div class="img-box">
                                <img src="/images/t.jpg" alt="" />
                              </div>
                              {/* <h3 class="thank-you-head">THANK YOU</h3> */}
                              <p>
                                We have recevied your <b> Home Loan </b>{" "}
                                application
                              </p>
                              <div class="my-4">
                                <span class="app-no">
                                  Application No. <span>vfok65c9</span>{" "}
                                </span>
                              </div>
                              <p>
                                From here onwards our loan expert will get in
                                touch with you within 24 hours to take this
                                application forward
                              </p>
                              <p>
                                We thank you for choosing Loan Bazaar for your
                                financial needs and would be keen to serve you
                                in the future as well.
                              </p>
                              <p class="in-case">
                                In case of any queries, feel free to reach out
                                to us on below mentioned details
                              </p>
                              <div class="d-flex  justify-content-evenly">
                                <div>
                                  <p class="free-us">Toll Free</p>
                                  <p class="number-email">1800 - 208 - 8877</p>
                                </div>
                                <div>
                                  <p class="free-us"> Write to Us </p>
                                  <p class="number-email">
                                    {" "}
                                    info@loanbazar.com{" "}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoanApplication;
