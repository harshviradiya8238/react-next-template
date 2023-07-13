// import React, { useState } from "react";
// import Stepper from "react-stepper-horizontal";
import LoanForm from "../common/LoanForm";
import LoanDetailForm from "../common/LoanDetailForm";
import UploadDoc from "../common/UploadDoc";

// // import './App.css';

// function UserDetails() {
//   return <LoanForm />;
// }

// function LoanDetail() {
//   return <LoanDetailForm />;
// }

// function UploadDocument() {
//   return <UploadDoc />;
// }

// function Confirmation() {
//   return <h2>Application Submited </h2>;
// }
// function ApplyForLoan() {
//   const [activeStep, setActiveStep] = useState(0);

// const steps = [
//   { title: "Basic Details" },
//   { title: "Loan Details" },
//   { title: "Document Details" },
//   { title: "Application confirmation" },
// ];

//   function getSectionComponent() {

//     const [formData, setFormData] = useState({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       address: '',
//       city: '',
//       country: ''
//     });

//     switch (activeStep) {
//       case 0:
//         return <UserDetails />;
//       case 1:
//         return <LoanDetail />;
//       case 2:
//         return <UploadDocument />;
//       case 3:
//         return <Confirmation />;
//       default:
//         return null;
//     }
//   }

//   return (
//     <section className="apply-for-loan business-loan" id="business-loan-form">
//       <div className="overlay pt-120">
//         <div className="container wow fadeInUp">
//           <div className="row justify-content-center">
//             {/* <div className="col-lg-8">
//               <div className="section-header text-center">
//                 <h2 className="title">
//                   Apply for a loan today.
//                 </h2>
//                 <p>
//                   Get business loans approved within days with transparent
//                   lending criteria and transparent processes.
//                 </p>
//               </div>
//             </div> */}
//           </div>
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <div className="form-content">
//                 <div className="section-header text-center">
//                   <h2 className="title">Apply for a loan</h2>
//                   <p>
//                     Please fill the form below. We will get in touch with you
//                     within 1-2 business days, to request all necessary details
//                   </p>
//                 </div>
//                 {/* Loan form  */}

//                 <div style={{ marginTop: "100px" }}>
//                   <Stepper steps={steps} activeStep={activeStep} />
//                   <div style={{ padding: "20px" }}>
//                     {getSectionComponent()}
//                     <div className="d-flex">
//                       {activeStep !== 0 && activeStep !== steps.length && (
//                         <div
//                           className="btn-area text-center m-4"
//                           onClick={() => setActiveStep(activeStep - 1)}
//                         >
//                           <button className="cmn-btn ">Previous</button>
//                         </div>
//                       )}
//                       {activeStep !== steps.length - 1 && (
//                         <div
//                           className="btn-area text-center m-4"
//                           onClick={() => setActiveStep(activeStep + 1)}
//                         >
//                           <button className="cmn-btn">Next</button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ApplyForLoan;

// Copy code
import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stepper from "react-stepper-horizontal";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
function ApplyForLoan() {
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
    { title: "Basic Details" },
    { title: "Loan Details" },
    { title: "Document Details" },
    { title: "Application confirmation" },
  ];

  const [docFiles, setdocFiles] = useState([]);
  const [sendOtp, setVerifyOtp] = useState(false);
  const [eligiblity, setEligiblity] = useState(false);
  const [phoneValue, setPhoneValue] = useState();
  const [startDate, setStartDate] = useState(new Date());

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

  const handleSendOtp = () => {
    setVerifyOtp(true);
  };
  const handleCheckEligiblity = () => {
    setEligiblity(true);
  };

  const handleNext = (setFieldValue, values) => {
    console.log(values.activeStep);
    setFieldValue("activeStep", values.activeStep + 1);
  };

  const handlePrevious = (setFieldValue, values) => {
    if (values.activeStep === 1) setVerifyOtp(false);

    setFieldValue("activeStep", values.activeStep - 1);
  };

  const handleSubmit = (values) => {
    // Handle form submission
    console.log(values);
  };

  const [selectedOption, setSelectedOption] = useState("business");
  const [selectedPurpose, setSelectedPurpose] = useState("education");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // setSelectedPurpose(e.target.value);
  };
  const handleOptionChangePurpose = (e) => {
    setSelectedPurpose(e.target.value);
    // setSelectedPurpose(e.target.value);
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
    <section className="apply-for-loan business-loan" id="business-loan-form">
      <div className="overlay pt-120">
        <div className="container wow fadeInUp">
          <div className="row justify-content-center">
            {/* <div className="col-lg-8">
              <div className="section-header text-center">
                <h2 className="title">
                  Apply for a loan today.
                </h2>
                <p>
                  Get business loans approved within days with transparent
                  lending criteria and transparent processes.
                </p>
              </div>
            </div> */}
          </div>
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
                          <div>
                            {/* <h2>Basic Details</h2> */}

                            {/* {values.step1.phone?.length === 10 && (
                              <div className="col-6">
                                <div className="single-input">
                                  <label>Name:</label>
                                  <Field type="text" name="step1.name" />
                                  <ErrorMessage
                                    name="step1.name"
                                    component="div"
                                    style={{ color: "red" }}
                                  />
                                </div>
                              </div>
                            )} */}

                            {sendOtp ? (
                              <div className="row">
                                <div className="col-6">
                                  <div className="single-input">
                                    <label>Mobile OTP:</label>
                                    <Field
                                      name="step1.otp"
                                      placeholder="xxxxxx"
                                    />
                                    <ErrorMessage
                                      name="step1.otp"
                                      component="div"
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="single-input">
                                    <label>Email OTP:</label>
                                    <Field
                                      name="step1.otp"
                                      placeholder="xxxxxx"
                                    />
                                    <ErrorMessage
                                      name="step1.otp"
                                      component="div"
                                      style={{ color: "red" }}
                                    />
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
                                    type="button"
                                    className="cmn-btn"
                                    onClick={() => setVerifyOtp(false)}
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  >
                                    Previous
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleNext(setFieldValue, values)
                                    }
                                    style={{ width: "auto" }}
                                    className="cmn-btn"
                                    // disabled={
                                    //   !values.step1 ||
                                    //   !values.step1.name ||
                                    //   !values.step1.email ||
                                    //   !values.step1.state
                                    // }
                                  >
                                    Verify OTP
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="row">
                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Name:</label>
                                      <Field
                                        type="text"
                                        name="step1.name"
                                        placeholder="John Test"
                                      />
                                      <ErrorMessage
                                        name="step1.name"
                                        component="div"
                                        style={{ color: "red" }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Email:</label>
                                      <Field
                                        type="email"
                                        name="step1.email"
                                        placeholder="johntest@gmail.com"
                                      />
                                      <ErrorMessage
                                        name="step1.email"
                                        component="div"
                                        style={{ color: "red" }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Contact No:</label>
                                      {/* <Field
                                          name="step1.phone"
                                          placeholder="+91 9999999999"
                                        /> */}

                                      <PhoneInput
                                        international
                                        defaultCountry="IN"
                                        placeholder="+91 9999999999"
                                        value={phoneValue}
                                        onChange={setPhoneValue}
                                      />
                                      <ErrorMessage
                                        name="step1.phone"
                                        component="div"
                                        style={{ color: "red" }}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Date Of Birth</label>
                                      <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                      />
                                      {/* <Field
                                          type="text"
                                          name="step1.state"
                                          placeholder="Gujarat"
                                        /> */}
                                      <ErrorMessage
                                        name="step1.state"
                                        component="div"
                                        style={{ color: "red" }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <button
                                    className="cmn-btn"
                                    onClick={handleSendOtp}
                                  >
                                    Next
                                  </button>
                                </div>
                              </>
                            )}

                            {/* <button
                              type="button"
                              onClick={() => handleNext(setFieldValue, values)}
                              className="cmn-btn"
                              disabled={
                                !values.step1 ||
                                !values.step1.name ||
                                !values.step1.email ||
                                !values.step1.state
                              }
                            >
                              Next
                            </button> */}
                          </div>
                        )}
                        {values.activeStep === 1 && (
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
                                        <th scope="col">Rate of Interest</th>
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
                                        type="text"
                                        placeholder="Loan Amount"
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
                                      <label>Loan Tenure</label>

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
                                      <label>Purpose Of Loan</label>
                                      <select
                                        className="selectDrop form-select"
                                        aria-label="Default select example"
                                        name="step2.loanType"
                                        value={selectedPurpose}
                                        onChange={handleOptionChangePurpose}
                                      >
                                        <option value="education" selected>
                                          Education
                                        </option>
                                        <option value="home">Home</option>
                                      </select>
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
                                    type="button"
                                    className="cmn-btn"
                                    style={{ marginRight: "10px" }}
                                    onClick={() =>
                                      handlePrevious(setFieldValue, values)
                                    }
                                  >
                                    Previous
                                  </button>

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
                        {values.activeStep === 2 && (
                          <div
                            style={{
                              padding: "20px 0px",
                            }}
                          >
                            {/* <h2>Step 3</h2> */}
                            {/* <div>
                              <label>Address:</label>
                              <Field type="text" name="step3.address" />
                              <ErrorMessage
                                name="step3.address"
                                component="div"
                              />
                            </div>
                            <div>
                              <label>City:</label>
                              <Field type="text" name="step3.city" />
                              <ErrorMessage name="step3.city" component="div" />
                            </div>
                            <div>
                              <label>Country:</label>
                              <Field type="text" name="step3.country" />
                              <ErrorMessage
                                name="step3.country"
                                component="div"
                              />
                            </div> */}

                            <div class="row">
                              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                <h4>3 year ITR /Form 16</h4>
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
                                              onClick={() =>
                                                handleRemoveFile(index)
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
                                      ))}
                                  </div>
                                )}
                              </div>

                              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                <h4>Light Bill</h4>
                                <div class="input-box">
                                  <input
                                    type="file"
                                    class="upload-box"
                                    name="files[]"
                                    multiple
                                  />
                                  {/* <i class="fa-solid fa-xmark"></i> */}
                                </div>
                              </div>

                              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                <h4> Bank Statement</h4>
                                <div class="input-box">
                                  <input
                                    type="file"
                                    class="upload-box"
                                    name="files[]"
                                    multiple
                                  />
                                  {/* <i class="fa-solid fa-xmark"></i> */}
                                </div>
                              </div>
                              {selectedOption === "business" && (
                                <>
                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> GST Certificate </h4>

                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>
                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> Business Proof</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>
                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> Balance Sheet- P&L</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>

                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> GST Certificate 3B Last 12 month</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>

                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> Master File OF property</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>
                                </>
                              )}

                              {selectedOption === "personal" && (
                                <>
                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> 6 month Salary Slip</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>
                                </>
                              )}

                              {selectedOption === "home" && (
                                <>
                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> 6 month Salary Slip</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>

                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> Master File OF property</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>
                                </>
                              )}

                              {selectedOption === "car" && (
                                <>
                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> Business Proof /Salary Slip</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>

                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4> Car Quotation</h4>
                                    <div class="input-box">
                                      <input
                                        type="file"
                                        class="upload-box"
                                        name="files[]"
                                        multiple
                                      />
                                      {/* <i class="fa-solid fa-xmark"></i> */}
                                    </div>
                                  </div>
                                </>
                              )}

                              <div class="row">
                                {/* <div class="my-4 col-lg-6 col-md-6 col-sm-12"> */}
                                {documentFields.map((field, index) => (
                                  <div
                                    key={index}
                                    class="my-4 col-lg-6 col-md-6 col-sm-12"
                                  >
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
                                      <label
                                        onClick={() => toggleEditLabel(index)}
                                      >
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
                                        onChange={(event) =>
                                          handleValueChange(index, event)
                                        }
                                        // class="input-box"
                                      />
                                    </div>
                                  </div>
                                ))}
                                {/* </div> */}
                              </div>

                              <div
                                class="my-4 col-lg-6 col-md-6 col-sm-12"
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
                                className="cmn-btn"
                                style={{ marginRight: "10px" }}
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
                        {values.activeStep === 3 && (
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

export default ApplyForLoan;
