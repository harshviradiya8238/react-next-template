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
import React, { useState, useRef, useEffect } from "react";
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
    lastName: Yup.string().required("Last Name is required"),

    firstName: Yup.string().required("First Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    // phone: Yup.string().required("Contact No is required"),
    // state: Yup.string().required("State is required"),
  }),
  stepVerify: Yup.object().shape({
    mobileotp: Yup.string().required("Mobile otp is required"),
    emailotp: Yup.string().required("Email otp is required"),
  }),

  step2: Yup.object().shape({
    loanAmount: Yup.string().required("LoanAmount is required"),
    loanTerm: Yup.string().required("LoanTenure is required"),
    loanType: Yup.string().required("LoanType is required"),
    State: Yup.string().required("State is required"),
  }),

  step2verify: Yup.object().shape({
    loanAmount: Yup.string().required("LoanAmount is required"),
    loanTerm: Yup.string().required("LoanTenure is required"),
    loanType: Yup.string().required("LoanType is required"),
    State: Yup.string().required("State is required"),
  }),
  step3: Yup.object().shape({
    businessProof: Yup.string().required("Address is required"),
    gst: Yup.string().required("City is required"),
    panCard: Yup.string().required("Country is required"),
  }),
});

const data = [
  { id: 1, name: "HDFC Bank	", intrest: "12%", amount: "4000" },
  { id: 2, name: "Axis Bank	", intrest: "14%", amount: "5000" },
  { id: 3, name: "ICICI Bank	", intrest: "14%", amount: "3500" },
];

const columns = [
  { dataField: "id", text: "ID" },
  { dataField: "name", text: "Bank Name" },
  { dataField: "intrest", text: "Rate of Intrest" },
];

function ApplyForLoan() {
  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState(null);

  const [state, setSatate] = useState({
    step1: { firstName: "", lastName: "", email: "", phone: "" },
    step2: { loanType: "", loanAmount: "", loanTerm: "", state: "" },
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
  const selectRow = {
    // mode: "checkbox",
    clickToSelect: true,
    bgColor: "#f8f9fa",
    mode: "radio", // Single row selection mode
    clickToSelect: true,
    selected: selectedRow, // Set the selected row ID
  };

  const stepsmain = [
    { title: "Basic Details" },
    { title: "Loan Details" },
    { title: "Document Details" },
    { title: "Application confirmation" },
  ];
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [sendOtp, setVerifyOtp] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [eligiblity, setEligiblity] = useState(false);
  const [phoneValue, setPhoneValue] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [apiData, setapiData] = useState({});
  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [countryStateOption, SetCountryStateOption] = useState("");
  const [countryState, SetCountryState] = useState("");
  const [selectOption, setSelectOption] = useState("");
  const [bankOption, setBankOption] = useState([]);
  const [documentOption, setDocumentOption] = useState([]);
  const [selectOptionName, setSelectOptionName] = useState("");
  const [loanApplicationId, setLoanAppliactionId] = useState("");
  const [loanApplicationNumber, setLoanAppliactionNumber] = useState("");

  const [previewURL, setPreviewURL] = useState(null);
  const [fileType, setFileType] = useState("");

  const handleSelectoption = ({ target }) => {
    setSelectOption(target.value);
    setSelectOptionName(target.name);
  };
  const handleSelectStateoption = ({ target }) => {
    SetCountryState(target.value);
    // setSelectOptionName(target.name);
  };

  const GetAll = async (tokenD) => {
    // const token = localStorage.getItem("logintoken");
    try {
      const response = await axios.get(
        "https://loancrmtrn.azurewebsites.net/api/LoanType/GetAll",
        {
          headers: {
            Authorization: `Bearer ${tokenD}`,
          },
        }
      );
      const { data } = response;

      setLoanTypeOption(data.value);
    } catch (error) {
      console.log(error);
      // Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };
  const GetAllState = async () => {
    try {
      const response = await axios.get(
        "https://loancrmtrn.azurewebsites.net/api/State/GetAll"
      );
      const { data } = response;
      SetCountryStateOption(data.value);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllType = async () => {};

  const aRef = useRef(null);

  const handleSendOtp = async (data, value) => {
    if (
      value.step1.firstName &&
      value.step1.lastName &&
      value.step1.email &&
      phoneValue
    ) {
      setButtonDisabled(true);

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
          await Notification("success", "OTP Sent SuccessFully");

          setVerifyOtp(true);
          setButtonDisabled(false);
          setapiData(value);
        }
      } catch (error) {
        setButtonDisabled(false);
        Notification("error", error?.response?.data[0]?.errorMessage);
      }
    }
  };

  const handleCreateApplication = async (value, setFieldValue) => {
    const token = localStorage.getItem("logintoken");

    try {
      const response = await axios.post(
        "https://loancrmtrn.azurewebsites.net/api/LoanApplication/Create",
        {
          loanTypeId: selectOption,
          amount: value.step2.loanAmount,
          tenure: Number(value.step2.loanTerm),
          stateId: Number(countryState),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;

      await Notification("success", data?.value?.message);
      GetBankAndDocumetByLoanTypeId(
        selectOption,
        value.step2.loanAmount,
        value.step2.loanTerm,
        setFieldValue
      );

      setLoanAppliactionId(data?.value?.id);
      setLoanAppliactionNumber(data?.value?.applicationNumber);
    } catch (error) {
      console.log(error);
      Notification("error", "Please Enter All Field");

      // Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };

  const [selectedRowData, setSelectedRowData] = useState([]);

  const handleCheckboxChange = (event, rowData) => {
    if (event.target.checked) {
      setSelectedRowData((prevSelectedRowData) => [
        ...prevSelectedRowData,
        rowData.id,
      ]);
    } else {
      setSelectedRowData((prevSelectedRowData) =>
        prevSelectedRowData.filter((row) => row !== rowData.id)
      );
    }
  };

  const GetBankAndDocumetByLoanTypeId = async (
    id,
    Loanamount,
    tenure,
    setFieldValue
  ) => {
    const token = localStorage.getItem("logintoken");
    try {
      const response = await axios.post(
        `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetBankAndDocumetByLoanTypeId`,
        {
          loanTypeId: id,
          tenure: Number(tenure),
          amount: Loanamount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;

      // await Notification("success", data?.value?.message);
      // setEligiblity(true);

      if (data?.value?.bank?.length > 0) {
        setBankOption([...data.value.bank]);

        // setEligiblity(true);
      } else {
        setFieldValue("activeStep", 2);
        setBankOption([]);
        // setSatate({ ...state, activeStep: 2 });
      }
      if (data?.value?.document?.length > 0) {
        const inputArray = data.value.document;

        // const uniqueObjects = inputArray.reduce(
        //   (accumulator, currentObject) => {
        //     if (!accumulator[currentObject.id]) {
        //       accumulator[currentObject.id] = currentObject;
        //     }
        //     return accumulator;
        //   },
        //   {}
        // );

        // const uniqueArray = Object.values(uniqueObjects);

        setDocumentOption(inputArray);
      }
    } catch (error) {
      console.log(error);
      Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };
  const handleCheckEligiblity = () => {
    setEligiblity(true);
  };

  const handleNext = async (setFieldValue, values) => {
    setFieldValue("activeStep", values.activeStep + 1);
  };

  const handlePrevious = (setFieldValue, values) => {
    if (values.activeStep === 1) {
      setButtonDisabled(false);

      setVerifyOtp(false);
    }
    setFieldValue("activeStep", values.activeStep - 1);
  };

  const handleSubmit = (values) => {
    // Handle form submission
  };

  const [selectedOption, setSelectedOption] = useState("business");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    // setSelectedPurpose(e.target.value);
  };

  const [docFiles, setdocFiles] = useState([]);

  const handleFilePreview = (file) => {
    // return URL.createObjectURL(file.target.files[0]);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        reject(event.target.error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitUploadDoc = async (setFieldValue) => {
    var newAraay = [];
    // console.log("docFiles=-", docFiles);
    Object?.keys(docFiles)?.forEach((key) => {
      // console.log(docFiles[key], "-=-=-=");
      docFiles[key]?.forEach((item) => {
        newAraay.push(item);
      });
    });
    if (newAraay.length > 0) {
      // newAraay
      newAraay.forEach(async (element) => {
        const formData = new FormData();
        formData.append("LoanApplicationId", loanApplicationId);
        formData.append("DocumentTypeId", element.documentTypeId);
        formData.append("Documents", element);

        const token = localStorage.getItem("logintoken");

        try {
          const response = await axios.post(
            "https://loancrmtrn.azurewebsites.net/api/LoanApplication/UploadLoanDocument",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // const { data } = response;
          Notification("success", "document Upload Successfully ");

          setFieldValue("activeStep", 3);
        } catch (error) {
          console.log(error);
          Notification("error", error?.response?.data[0]?.errorMessage);
        }
      });
    } else {
    }
  };

  // const handleFieldChange = (index, field, value) => {
  //   setdocFiles((prevState) => {
  //     const otherDocuments = [...prevState.otherDocuments];
  //     otherDocuments[index][field] = value;
  //     return {
  //       ...prevState,
  //       otherDocuments,
  //     };
  //   });
  // };

  // const addOtherDocumentField = () => {
  //   if (docFiles.otherDocuments.length < 5) {
  //     setdocFiles((prevState) => ({
  //       ...prevState,
  //       otherDocuments: [
  //         ...prevState.otherDocuments,
  //         { label: "", files: [], editable: true },
  //       ],
  //     }));
  //   }
  // };

  const handlePanFileChange = (fieldType, event, id) => {
    console.log(fieldType, "0-0-");
    // const file = event.target.files[0];
    // if (file) {
    //   // setSelectedFile(file);
    //   setFileType(file.type);
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     setPreviewURL(e.target.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
    // const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    // if (!allowedTypes.includes(event.target.files.type)) {
    //   setUploadError("only accept this");
    // } else {
    if (event.target.files.length) {
      for (let index = 0; index < event.target.files.length; index++) {
        event.target.files[index].documentTypeId = id;
      }
    } else {
      event.target.files[0].documentTypeId = id;
    }
    var selectedFiles = [...event?.target?.files];

    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: selectedFiles,
    }));
    // }
  };

  const PreviewComponent = ({ file }) => {
    if (file.type.includes("image")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="File Preview"
          style={{ maxWidth: "100%", height: "100px" }}
        />
      );
    } else if (file.type === "application/pdf") {
      return (
        <>
          <embed
            src={URL.createObjectURL(file)}
            type="application/pdf"
            width="100%"
            height="100px"
          />
          {/* <h6>{URL.createObjectURL(file)}</h6> */}
        </>
      );
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
  };

  // const handleOtherDocumentFileChange = (index, event) => {
  //   const selectedFiles = [...event.target.files];
  //   const updatedFiles = selectedFiles.slice(0, 3);
  //   handleFieldChange(index, "files", updatedFiles);
  // };

  // const handleRemoveOtherDocumentFile = (index, fileIndex) => {
  //   setdocFiles((prevState) => {
  //     const otherDocuments = [...prevState.otherDocuments];
  //     otherDocuments[index].files.filter((_, i) => i !== fileIndex);
  //     return {
  //       ...prevState,
  //       otherDocuments,
  //     };
  //   });
  // };

  // const handleToggleEdit = (index) => {
  //   setdocFiles((prevState) => {
  //     const otherDocuments = [...prevState.otherDocuments];
  //     otherDocuments[index].editable = !otherDocuments[index].editable;
  //     return {
  //       ...prevState,
  //       otherDocuments,
  //     };
  //   });
  // };

  // const handleDeleteField = (index) => {
  //   setdocFiles((prevState) => {
  //     const otherDocuments = [...prevState.otherDocuments];
  //     otherDocuments.splice(index, 1);
  //     return {
  //       ...prevState,
  //       otherDocuments,
  //     };
  //   });
  // };
  const handleKeyPress = (event) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (
      String.fromCharCode(charCode).match(/[^0-9]/g) ||
      event.target.value.length > 5
    ) {
      event.preventDefault();
    }
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

                <div className="stepper-main">
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
                        <div className="stepper-field-form">
                          {values.activeStep === 0 && (
                            <div>
                              {sendOtp ? (
                                <>
                                  {/* <div>sfsdf</div> */}
                                  <div className="row">
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>Mobile OTP:</label>
                                        <Field
                                          name="stepVerify.mobileotp"
                                          placeholder="Enter Mobile OTP "
                                          type={"number"}
                                          onKeyPress={(event) => {
                                            handleKeyPress(event);
                                          }}
                                          onInput={(event) => {
                                            if (event.target.value.length > 7) {
                                              event.preventDefault();
                                            }
                                          }}
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
                                          placeholder="Enter Email OTP"
                                          onKeyPress={(event) => {
                                            handleKeyPress(event);
                                          }}
                                          onInput={(event) => {
                                            if (event.target.value.length > 7) {
                                              event.preventDefault();
                                            }
                                          }}
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
                                          {
                                            try {
                                              const response = await axios.post(
                                                "https://loancrmtrn.azurewebsites.net/api/User/VerifyOTP",
                                                {
                                                  sendEmail: true,
                                                  email: apiData.step1.email,
                                                  phoneNumber:
                                                    Number(phoneValue),
                                                  mobileOTP:
                                                    values.stepVerify.mobileotp.toString(),
                                                  emailOTP:
                                                    values.stepVerify.emailotp.toString(),
                                                }
                                              );

                                              const { data } = response;
                                              if (data?.success) {
                                                const tokenData =
                                                  data?.value?.token;
                                                await localStorage.setItem(
                                                  "logintoken",
                                                  tokenData
                                                );
                                                await setVerifyOtp(true);
                                                await Notification(
                                                  "success",
                                                  "OTP Verify SuccessFully and Password Send on Your Email"
                                                );
                                                await GetAllState();
                                                await GetAll(tokenData);
                                                await handleNext(
                                                  setFieldValue,
                                                  values
                                                );
                                                // handleGetAllType();
                                              }
                                            } catch (error) {
                                              console.log(error);
                                              Notification(
                                                "error",
                                                error?.response?.data[0]
                                                  .errorMessage
                                              );
                                              // console.log(error);
                                            }
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
                                </>
                              ) : (
                                <>
                                  <div className="row">
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>First Name:</label>
                                        <Field
                                          type="text"
                                          name="step1.firstName"
                                          placeholder="Enter your First Name "
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
                                          placeholder="Enter your Last Name"
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
                                          placeholder="Enter your Email"
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
                                          onKeyPress={(event) => {
                                            if (
                                              event.target.value.length > 18
                                            ) {
                                              event.preventDefault();
                                            }
                                          }}
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
                                      disabled={buttonDisabled}
                                      onClick={() => {
                                        console.log("jjoo");

                                        handleSendOtp(setFieldValue, values);
                                      }}
                                    >
                                      {buttonDisabled
                                        ? "Processing..."
                                        : "Next"}
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
                            <>
                              {bankOption && bankOption.length > 0 ? (
                                <>
                                  <div class="table-section">
                                    <table class="table">
                                      <thead>
                                        <tr>
                                          <th scope="col">Select</th>
                                          <th scope="col">Bank Name</th>
                                          <th scope="col">Rate of interest</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {bankOption &&
                                          bankOption.map((elm, index) => {
                                            return (
                                              <>
                                                <tr key={index}>
                                                  <th>
                                                    <label class="checkbox">
                                                      <input
                                                        type="checkbox"
                                                        checked={selectedRowData.includes(
                                                          elm.id
                                                        )}
                                                        onChange={(e) =>
                                                          handleCheckboxChange(
                                                            e,
                                                            elm
                                                          )
                                                        }
                                                      />
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
                                                  <td>{elm?.name}</td>
                                                  <td>{elm?.interestRate}</td>
                                                </tr>
                                              </>
                                            );
                                          })}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* <button
                                      type="button"
                                      className="cmn-btn"
                                      style={{ marginRight: "10px" }}
                                      onClick={() => {
                                        // handlePrevious(setFieldValue, values);
                                        // setFieldValue("activeStep", 1);
                                        setBankOption([]);
                                        setEligiblity(false);
                                      }}
                                    >
                                      Previous
                                    </button> */}
                                    <button
                                      type="button"
                                      className="cmn-btn"
                                      onClick={async () => {
                                        const token =
                                          localStorage.getItem("logintoken");
                                        if (selectedRowData.length > 0) {
                                          try {
                                            const response = await axios.post(
                                              `https://loancrmtrn.azurewebsites.net/api/LoanApplication/UpdateLoanApplication`,
                                              {
                                                loanApplicationId:
                                                  loanApplicationId,
                                                bankIds: selectedRowData,
                                                loanTypeId: selectOption,
                                              },
                                              {
                                                headers: {
                                                  Authorization: `Bearer ${token}`,
                                                },
                                              }
                                            );
                                            const { data } = response;

                                            await Notification(
                                              "success",
                                              data?.messages[0]?.messageText
                                            );
                                            // setEligiblity(true);
                                            // setFieldValue("activeStep", values.activeStep + 1);
                                            handleNext(setFieldValue, values);
                                          } catch (error) {
                                            console.log(error);
                                            Notification("error", "catch erro");
                                          }
                                        } else {
                                          Notification(
                                            "error",
                                            "Please Select Bank "
                                          );
                                        }
                                      }}
                                    >
                                      Next
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    style={{
                                      padding: "20px 0px",
                                    }}
                                  >
                                    <>
                                      <div className="row">
                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>Loan Amount (INR)</label>
                                            <Field
                                              type={"number"}
                                              placeholder="Enter loan amount"
                                              name="step2.loanAmount"
                                            />
                                            {/* <ErrorMessage
                                              name="step2verify.loanAmount"
                                              component="div"
                                              style={{ color: "red" }}
                                            /> */}
                                          </div>
                                        </div>

                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>Loan Type</label>

                                            <>
                                              {loanTypeOption &&
                                                loanTypeOption.length > 0 && (
                                                  <select
                                                    className="selectDrop form-select"
                                                    // aria-label="Default select example"
                                                    // placeholder="select Loan Type"
                                                    // name="step2verify.loanType"
                                                    value={selectOption}
                                                    onChange={
                                                      handleSelectoption
                                                    }
                                                  >
                                                    <option
                                                      disabled={true}
                                                      value=""
                                                    >
                                                      select Loan Type
                                                    </option>
                                                    {loanTypeOption.map(
                                                      (data, index) => (
                                                        <>
                                                          <option
                                                            value={data?.id}
                                                            key={index}
                                                          >
                                                            {data?.name}
                                                          </option>
                                                        </>
                                                      )
                                                    )}
                                                  </select>
                                                )}
                                              {/* <ErrorMessage
                                                name="step2verify.loanType"
                                                component="div"
                                                style={{ color: "red" }}
                                              /> */}
                                            </>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>Loan Tenure (Year)</label>

                                            <Field
                                              type="number"
                                              name="step2.loanTerm"
                                              placeholder="1 Year"
                                              // onKeyPress={(event) => {
                                              //   if (
                                              //     event.target.value.length > 1
                                              //   ) {
                                              //     event.preventDefault();
                                              //   }
                                              //   // handleKeyPress(event);
                                              // }}
                                            />
                                            {/* <ErrorMessage
                                              name="step2verify.loanTerm"
                                              component="div"
                                              style={{ color: "red" }}
                                            /> */}
                                          </div>
                                        </div>
                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>State</label>

                                            {/* <Field
                                        type="text"
                                        name="step2.state"
                                        // name="step2.loanTerm"
                                        placeholder="1 Year"
                                      /> */}
                                            {/* <ErrorMessage
                                        name="step2.loanTerm"
                                        component="div"
                                        style={{ color: "red" }}
                                      /> */}

                                            <>
                                              {countryStateOption &&
                                                countryStateOption.length >
                                                  0 && (
                                                  <select
                                                    className="selectDrop form-select"
                                                    // aria-label="Default select example"
                                                    value={countryState}
                                                    onChange={
                                                      handleSelectStateoption
                                                    }
                                                  >
                                                    <option
                                                      disabled={true}
                                                      value=""
                                                    >
                                                      Select State
                                                    </option>
                                                    {countryStateOption.map(
                                                      (data, index) => (
                                                        <option
                                                          value={data?.id}
                                                          key={index}
                                                        >
                                                          {data?.name}
                                                        </option>
                                                      )
                                                    )}
                                                  </select>
                                                )}
                                            </>
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
                                          type="button"
                                          className="cmn-btn"
                                          style={{ marginRight: "10px" }}
                                          onClick={() =>
                                            handlePrevious(
                                              setFieldValue,
                                              values
                                            )
                                          }
                                        >
                                          Previous
                                        </button> */}

                                        <button
                                          onClick={async () => {
                                            await handleCreateApplication(
                                              values,
                                              setFieldValue
                                            );
                                          }}
                                          className="cmn-btn"
                                        >
                                          Next
                                        </button>
                                      </div>
                                    </>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          {values.activeStep === 2 && (
                            <>
                              <>
                                <div
                                  style={{
                                    padding: "20px 0px",
                                  }}
                                >
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
                                                    accept=".pdf, image/*"
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
                                                                cursor:
                                                                  "pointer",
                                                              }}
                                                            ></i>
                                                          </div>

                                                          {file && (
                                                            <PreviewComponent
                                                              file={file}
                                                            />
                                                          )}
                                                          {/* {fileType.includes(
                                                          "image"
                                                        ) ? (
                                                          <img
                                                            src={previewURL}
                                                            alt="File Preview"
                                                            style={{
                                                              maxWidth: "100%",
                                                            }}
                                                          />
                                                        ) : (
                                                            title="File Preview"
                                                            src={previewURL}
                                                            style={{
                                                              width: "100%",
                                                              height: "100px",
                                                            }}
                                                          />
                                                        )} */}
                                                          {/* <img
                                                          src={await handleFilePreview(
                                                            file
                                                          )}
                                                          // alt={`Preview ${file.name}`}
                                                          style={{
                                                            maxWidth: "100px",
                                                          }}
                                                        /> */}

                                                          {/* <div
                                                          class="progress"
                                                          role="progressbar"
                                                          aria-label="Basic example"
                                                          aria-valuenow="100"
                                                          aria-valuemin="0"
                                                          aria-valuemax="100"
                                                          style={{
                                                            height: "6px",
                                                          }}
                                                        >
                                                          <div
                                                            class="progress-bar"
                                                            style={{
                                                              width: "100%",
                                                            }}
                                                          ></div>
                                                        </div> */}
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        );
                                      })}

                                    {/* <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4>Bank Statement</h4>
                                    <div class="input-box ">
                                      <input
                                        type="file"
                                        multiple
                                        ref={aRef}
                                        class="upload-box"
                                        onChange={(e) =>
                                          handlePanFileChange(
                                            "bankStatements",
                                            e
                                          )
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
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  ></i>
                                                </div>

                                                <div
                                                  key={index}
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

                                  <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                    <h4>Other Document</h4>
                                    <div class="input-box ">
                                      <input
                                        type="file"
                                        multiple
                                        ref={aRef}
                                        class="upload-box"
                                        onChange={(e) =>
                                          handlePanFileChange(
                                            "otherDocument",
                                            e
                                          )
                                        }
                                      />
                                    </div>
                                    {docFiles?.otherDocument?.length > 0 && (
                                      <div>
                                        <h4>Selected files:</h4>
                                        {docFiles &&
                                          docFiles?.otherDocument?.map(
                                            (file, index) => (
                                              <div key={index}>
                                                <div className="selectfile">
                                                  <p>{file?.name}</p>
                                                  <i
                                                    class="fa-solid fa-xmark"
                                                    onClick={() =>
                                                      handleRemoveFile(
                                                        "otherDocument",
                                                        index
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  ></i>
                                                </div>

                                                <div
                                                  key={index}
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
                                  </div> */}
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
                                                    style={{
                                                      margin: "10px",
                                                    }}
                                                    onClick={() =>
                                                      handleToggleEdit(
                                                        fieldIndex
                                                      )
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
                                                      handleToggleEdit(
                                                        fieldIndex
                                                      )
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
                                                    handleDeleteField(
                                                      fieldIndex
                                                    )
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
                                                          style={{
                                                            height: "6px",
                                                          }}
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
                                      type="button"
                                      className="cmn-btn"
                                      style={{ marginRight: "10px" }}
                                      onClick={() =>
                                        handlePrevious(setFieldValue, values)
                                      }
                                    >
                                      Previous
                                    </button> */}
                                    <button
                                      type="button"
                                      className="cmn-btn"
                                      onClick={() =>
                                        handleSubmitUploadDoc(setFieldValue)
                                      }
                                      // onClick={() =>
                                      //   handleNext(setFieldValue, values)
                                      // }
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
                              </>
                            </>
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
                                  We have recevied your{" "}
                                  <b>
                                    {" "}
                                    {selectOptionName
                                      ? selectOptionName
                                      : ""}{" "}
                                  </b>{" "}
                                  application
                                </p>
                                <div class="my-4">
                                  <span class="app-no">
                                    Application No.{" "}
                                    <span>{loanApplicationNumber}</span>{" "}
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
                                    <p class="number-email">
                                      1800 - 208 - 8877
                                    </p>
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
                        </div>
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
