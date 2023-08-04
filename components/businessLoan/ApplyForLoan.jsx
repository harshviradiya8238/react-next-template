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
import { useDispatch } from "react-redux";
import { sendOTP } from "../../store/actions/userAction";
// import BootstrapTable from "react-bootstrap-table-next";
// import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import Notification from "../utils/Notification";

// Define the validation schema
const validationSchema = Yup.object().shape({
  step1: Yup.object().shape({
    lastName: Yup.string().required("lastName is required"),

    firstName: Yup.string().required("firstName is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string().required("Contact No is required"),
    state: Yup.string().required("State is required"),
  }),
  stepVerify: Yup.object().shape({
    mobileotp: Yup.string().required("Mobile otp is required"),
    emailotp: Yup.string().required("Email otp is required"),
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

const data = [
  { id: 1, bankName: "HDFC Bank	", intrest: "12%" },
  { id: 2, bankName: "Axis Bank	", intrest: "14%" },
  { id: 3, bankName: "ICICI Bank	", intrest: "14%" },
];

const columns = [
  { dataField: "id", text: "ID" },
  { dataField: "bankName", text: "Bank Name" },
  { dataField: "intrest", text: "Rate of Intrest" },
];

const selectRow = {
  mode: "checkbox",
  clickToSelect: true,
  bgColor: "#f8f9fa",
};

function ApplyForLoan() {
  const dispatch = useDispatch();

  const [state, setSatate] = useState({
    step1: { firstName: "", lastName: "", email: "", phone: "" },
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

  const [sendOtp, setVerifyOtp] = useState(false);
  const [eligiblity, setEligiblity] = useState(false);
  const [phoneValue, setPhoneValue] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [apiData, setapiData] = useState({});
  const [loanTypeOption, setLoanTypeOption] = useState([]);

  // const handleGetAllType = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://loan-bazar-dev.azurewebsites.net/api/LoanType/GetAll"
  //     );
  //     const { data } = response;
  //     setLoanTypeOption(data.value);
  //   } catch (error) {
  //     Notification("error", error?.response?.data[0]?.errorMessage);
  //   }
  // };

  const aRef = useRef(null);

  const handleSendOtp = async (data, value) => {
    try {
      const response = await axios.post(
        "https://loancrmtrn.azurewebsites.net/api/User/Create",
        {
          firstName: value.step1.firstName,
          lastName: value.step1.lastName,
          email: value.step1.email,
          phoneNumber: Number(phoneValue),
        }
      );

      const { data } = response;
      if (data?.success) {
        Notification("success", "OTP Sent SuccessFully");
        setVerifyOtp(true);
        setapiData(value);
      }
    } catch (error) {
      Notification("error", error?.response?.data[0]?.errorMessage);
      // console.log(error);
    }
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

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // setSelectedPurpose(e.target.value);
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

  return (
    <section className="apply-for-loan business-loan" id="business-loan-form">
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
                          <div>
                            {sendOtp ? (
                              <div className="row">
                                <div className="col-6">
                                  <div className="single-input">
                                    <label>Mobile OTP:</label>
                                    <Field
                                      name="stepVerify.mobileotp"
                                      placeholder="xxxxxx"
                                      type={"number"}
                                    />
                                    <ErrorMessage
                                      name="stepVerify.mobileotp"
                                      component="div"
                                      style={{ color: "red" }}
                                    />
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="single-input">
                                    <label>Email OTP:</label>
                                    <Field
                                      name="stepVerify.emailotp"
                                      type={"number"}
                                      placeholder="xxxxxx"
                                    />
                                    <ErrorMessage
                                      name="stepVerify.emailotp"
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
                                    onClick={async () => {
                                      try {
                                        const response = await axios.post(
                                          "https://loancrmtrn.azurewebsites.net/api/User/VerifyOTP",
                                          {
                                            sendEmail: true,
                                            email: apiData.step1.email,
                                            phoneNumber: Number(phoneValue),
                                            mobileOTP: "123456",
                                            emailOTP:
                                              values.stepVerify.emailotp.toString(),
                                          }
                                        );
                                        console.log(response);
                                        const { data } = response;
                                        if (data?.success) {
                                          Notification(
                                            "success",
                                            "OTP Verify SuccessFully and Password Send on Your Email"
                                          );
                                          localStorage.setItem(
                                            "token",
                                            data?.value?.token
                                          );

                                          setVerifyOtp(true);
                                          handleNext(setFieldValue, values);
                                          // handleGetAllType();
                                        }
                                      } catch (error) {
                                        console.log(error);
                                        Notification(
                                          "error",
                                          error?.response?.data[0]?.errorMessage
                                        );
                                        // console.log(error);
                                      }
                                    }}
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
                                      <label>First Name:</label>
                                      <Field
                                        type="text"
                                        name="step1.firstName"
                                        placeholder="John Test"
                                      />
                                      <ErrorMessage
                                        name="step1.firstName"
                                        component="div"
                                        style={{ color: "red" }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Last Name:</label>
                                      <Field
                                        type="text"
                                        name="step1.lastName"
                                        placeholder="John Test"
                                      />
                                      <ErrorMessage
                                        name="step1.lastName"
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

                                      <PhoneInput
                                        name="step1.phone"
                                        international
                                        defaultCountry="IN"
                                        placeholder="+91 9999999999"
                                        value={phoneValue}
                                        onChange={setPhoneValue}
                                      />
                                      {/* <ErrorMessage
                                        name="step1.phone"
                                        component="input"
                                        style={{ color: "red" }}
                                      /> */}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <button
                                    className="cmn-btn"
                                    onClick={() => {
                                      handleSendOtp(setFieldValue, values);
                                    }}
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
                            {eligiblity ? (
                              <>
                                <div className="tableBootstrap">
                                  {/* <BootstrapTable
                                    keyField="id"
                                    data={data}
                                    columns={columns}
                                    selectRow={selectRow}
                                  /> */}
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
                              </>
                            ) : (
                              <>
                                <div className="row">
                                  <div className="col-6">
                                    <div className="single-input">
                                      <label>Loan Amount (INR)</label>
                                      <Field
                                        type={"number"}
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
                                        {}

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
                                        name="step2.state"
                                        // name="step2.loanTerm"
                                        placeholder="1 Year"
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
                                            {console.log(file?.name)}
                                            <p>{file?.name}</p>
                                            <i
                                              class="fa-solid fa-xmark"
                                              onClick={() =>
                                                handleRemoveFile(
                                                  "itrFile",
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
                              <div>
                                <div class="row">
                                  {docFiles.otherDocuments.map(
                                    (field, fieldIndex) => (
                                      <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                        <div key={fieldIndex}>
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
                                              placeholder="Enter label for this field"
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
                                    Add Field
                                  </button>
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
