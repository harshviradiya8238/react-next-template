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
    phone: Yup.string()
      .matches(/^\d{10}$/, "Please enter 10 digits")
      .required("Contact Number is required"),
    // state: Yup.string().required("State is required"),
  }),
  stepVerify: Yup.object().shape({
    mobileotp: Yup.string().required("Mobile OTP is required"),
    emailotp: Yup.string().required("Email OTP is required"),
  }),

  step2: Yup.object().shape({
    loanAmount: Yup.string().required("Loan Amount is required"),
    loanTerm: Yup.string().required("Loan Tenure is required"),
    loanType: Yup.string().required("LoanType is required"),
    State: Yup.string().required("State is required"),
  }),

  step2verify: Yup.object().shape({
    loanAmount: Yup.string().required("Loan Amount is required"),
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
  const [errorLoanType, setErrorLoanType] = useState("");
  const [errorStateType, setErrorStateType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [otherDocumentId, setOtherDocumentId] = useState("");
  const [loanAmountError, setLoanAmountError] = useState("");

  const handleSelectoption = ({ target }) => {
    setSelectOption(target.value);
    setSelectOptionName(target.name);
    setErrorLoanType("");
  };
  const handleSelectStateoption = ({ target }) => {
    SetCountryState(target.value);
    setErrorStateType("");
    // setSelectOptionName(target.name);
  };
  const handleChnageLoanAmount = ({ target }) => {
    setLoanAmount(target.value);
    setLoanAmountError("");
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
      value.step1.phone
    ) {
      setButtonDisabled(true);

      try {
        const response = await axios.post(
          "https://loancrmtrn.azurewebsites.net/api/User/Create",
          {
            firstName: value.step1.firstName,
            lastName: value.step1.lastName,
            email: value.step1.email,
            phoneNumber: Number(value.step1.phone),
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

  const handleCreateApplication = async (e, value, setFieldValue) => {
    e.preventDefault();
    if (!selectOption) {
      setErrorLoanType("Please Select Loan Type.");
    }
    if (!countryState) {
      setErrorStateType("Please Select State");
    }
    if (!loanAmount) {
      setLoanAmountError("Please Enter Loan Amount");
    }
    if (!loanAmount || !countryState || !countryState) {
      return;
    }

    const token = localStorage.getItem("logintoken");

    try {
      const response = await axios.post(
        "https://loancrmtrn.azurewebsites.net/api/LoanApplication/Create",
        {
          loanTypeId: selectOption,
          amount: loanAmount,
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
        loanAmount,
        value.step2.loanTerm,
        setFieldValue
      );

      setLoanAppliactionId(data?.value?.id);
      setLoanAppliactionNumber(data?.value?.applicationNumber);
    } catch (error) {
      console.log(error);
      // Notification("error", "Please Enter All Field");

      // Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };

  const [selectedRowData, setSelectedRowData] = useState([]);
  const [docFiles, setdocFiles] = useState([]);
  const [selectedFilesArray, setSelectedFilesArray] = useState([]);

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
        const filteredData = data?.value?.document.filter(
          (item) => item.name !== "Other"
        );

        setDocumentOption(filteredData);
      }
      setOtherDocumentId(data?.value?.otherDocumentId);
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
  const handlePreviewFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (file?.type === "application/pdf") {
          const previewWindow = window.open("", "_blank");
          const content = `<embed src="${reader.result}" type="application/pdf" width="100%" height="1000px" />`;
          previewWindow.document.write(content);
          previewWindow.document.close();
        } else {
          const previewWindow = window.open("", "_blank");
          const content = `<img src="${reader.result}" alt="Preview" />`;
          previewWindow.document.write(content);
          previewWindow.document.close();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUploadDoc = async (setFieldValue) => {
    var newAraay = [];
    var documentNull = false;
    Object?.keys(docFiles)?.forEach((key) => {
      docFiles[key]?.forEach((item) => {
        item["keyname"] = key;
        newAraay.push(item);
      });
    });
    selectedFilesArray.forEach((element) => {
      element.file["keyname"] = element.name;
      element.file["documentTypeId"] = otherDocumentId;
      newAraay.push(element.file);
    });
    if (newAraay?.length > 0) {
      await newAraay.forEach(async (element) => {
        const formData = new FormData();

        formData.append("LoanApplicationId", loanApplicationId);
        formData.append("DocumentTypeId", element.documentTypeId);
        formData.append(
          "OtherDocumentName",
          element?.keyname ? element?.keyname : "Other"
        );
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
      Notification("error", "Please select atLeast one document ");
    }
  };
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
  const handlePanFileChange = (fieldType, event, id) => {
    // if (
    //   event.target.files[index].type === "application/pdf" ||
    //   event.target.files[index].type.includes("image")
    // ) {
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
    // } else {
    //   return Notification("error", "only Accept PDF and image");
    // }
  };
  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
  };
  const handleOtherDocumentFileChange = (index, event) => {
    if (
      event.target.files[index].type === "application/pdf" ||
      event.target.files[index].type.includes("image")
    ) {
      const selectedFiles = [...event.target.files];
      const updatedFiles = selectedFiles.slice(0, 3);
      handleFieldChange(index, "files", updatedFiles);
    } else {
      return Notification("error", "only Accept PDF and image");
    }
  };
  // const handleRemoveOtherDocumentFile = (index, fileIndex) => {
  //   setdocFiles((prevState) => {
  //     const otherDocuments = [...prevState.otherDocuments];
  //     otherDocuments[index].files.splice(fileIndex, 1);
  //     return {
  //       ...prevState,
  //       otherDocuments,
  //     };
  //   });
  // };
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
  const handleKeyPress = (event) => {
    var charCode = event.which ? event.which : event.keyCode;
    if (
      String.fromCharCode(charCode).match(/[^0-9]/g) ||
      event.target.value.length > 5
    ) {
      event.preventDefault();
    }
  };

  const [documentFileName, setDocumentFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const allowedFileTypes = [".jpg", ".jpeg", ".png", ".bmp", ".pdf"];

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileType = "." + file.name.split(".").pop().toLowerCase();

      if (allowedFileTypes.includes(fileType)) {
        setSelectedFile(file);
        setErrorMessage("");
      } else {
        setSelectedFile(null);
        setErrorMessage("only accept .jpg, .jpeg, .png, .bmp, .pdf files");
      }
    }
  };

  const handleRemoveOtherDocumentFile = (fileToRemove) => {
    const updatedFiles = selectedFilesArray.filter(
      (fileObj) => fileObj.file !== fileToRemove
    );
    setSelectedFilesArray(updatedFiles);
  };

  const handleUpload = () => {
    if (selectedFile && documentFileName) {
      setSelectedFilesArray((prevArray) => [
        ...prevArray,
        { name: documentFileName, file: selectedFile },
      ]);
      setSelectedFile(null);
      setDocumentFileName("");
      setErrorMessage("");
    } else {
      setErrorMessage(
        "Please enter a document name and choose a file to upload"
      );
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
                                                  phoneNumber: Number(
                                                    apiData.step1.phone
                                                  ),
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
                                          placeholder="Enter Your First Name "
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
                                          placeholder="Enter Your Last Name"
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
                                          placeholder="Enter Your Email"
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
                                        <div className="mobile-number-input">
                                          <img
                                            src="/images/india_2.png"
                                            className="indiaFlag"
                                          />
                                          <span className="country-code">
                                            +91
                                          </span>
                                          <Field
                                            type={"number"}
                                            onKeyPress={(event) => {
                                              if (
                                                event.target.value.length > 9
                                              ) {
                                                event.preventDefault();
                                              }
                                            }}
                                            name="step1.phone"
                                            // className="indian-flag"
                                            placeholder="Enter Your Contact Number"
                                          />
                                        </div>

                                        <ErrorMessage
                                          name="step1.phone"
                                          component="div"
                                          className="error_phone"
                                        />
                                        {/* <PhoneInput
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
                                        /> */}
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
                                        // if (selectedRowData.length > 0) {
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
                                            "Bank selection Submitted successfully"
                                          );
                                          // setEligiblity(true);
                                          // setFieldValue("activeStep", values.activeStep + 1);
                                          handleNext(setFieldValue, values);
                                        } catch (error) {
                                          console.log(error);
                                          Notification("error", "error");
                                        }
                                        // } else {
                                        //   Notification(
                                        //     "error",
                                        //     "Please Select Bank "
                                        //   );
                                        // }
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
                                              onKeyPress={(event) => {
                                                if (
                                                  loanAmount.length === 0 &&
                                                  event.key === "0"
                                                ) {
                                                  // Prevent the default behavior (inserting "0")
                                                  event.preventDefault();
                                                }
                                              }}
                                              placeholder="Enter loan amount"
                                              value={loanAmount}
                                              onChange={handleChnageLoanAmount}
                                            />
                                            {loanAmountError && (
                                              <p style={{ color: "red" }}>
                                                {loanAmountError}
                                              </p>
                                            )}
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
                                                      Select Loan Type
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
                                            {errorLoanType && (
                                              <p style={{ color: "red" }}>
                                                {errorLoanType}
                                              </p>
                                            )}
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
                                            {errorStateType && (
                                              <p style={{ color: "red" }}>
                                                {errorStateType}
                                              </p>
                                            )}
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
                                          onClick={async (e) => {
                                            await handleCreateApplication(
                                              e,
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
                                                    accept=".jpg, .jpeg, .png, .bmp, .pdf"
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
                                                          <div className="delete_div">
                                                            <span
                                                              className="document_hyper_link"
                                                              onClick={() =>
                                                                handlePreviewFile(
                                                                  file
                                                                )
                                                              }
                                                            >
                                                              {file?.name}
                                                            </span>

                                                            <button
                                                              class="delete_button"
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
                                                            >
                                                              Delete
                                                            </button>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        );
                                      })}
                                    <div>
                                      <div class="row">
                                        {/* {docFiles.otherDocuments.map(
                                        (field, fieldIndex) => ( */}
                                        <div
                                          // key={fieldIndex}
                                          class="my-4 col-lg-12 col-md-12 col-sm-12"
                                        >
                                          <h4 style={{ marginLeft: "0" }}>
                                            Other Document
                                          </h4>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div>
                                              <input
                                                type="text"
                                                placeholder="Enter document name"
                                                value={documentFileName}
                                                onChange={(event) =>
                                                  setDocumentFileName(
                                                    event.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="input-box">
                                              <input
                                                type="file"
                                                accept=".jpg, .jpeg, .png, .bmp, .pdf"
                                                class="upload-box"
                                                multiple
                                                onChange={handleFileChange}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                display: "flex",
                                                // alignItems: "center",
                                              }}
                                            >
                                              <button
                                                style={{
                                                  margin: "10px",
                                                }}
                                                onClick={handleUpload}
                                              >
                                                Upload
                                              </button>
                                            </div>
                                          </div>
                                          <>
                                            {errorMessage && (
                                              <p className="error">
                                                {errorMessage}
                                              </p>
                                            )}
                                          </>
                                          {selectedFilesArray.length > 0 && (
                                            <div>
                                              <p>Selected Files:</p>
                                              <ul>
                                                {selectedFilesArray.map(
                                                  (fileObj, index) => (
                                                    <li key={index}>
                                                      <div>
                                                        <b>{fileObj.name}</b> -
                                                        <span
                                                          className="document_hyper_link"
                                                          onClick={() =>
                                                            handlePreviewFile(
                                                              fileObj.file
                                                            )
                                                          }
                                                        >
                                                          {fileObj.file.name}
                                                        </span>
                                                        <button
                                                          class="delete_button"
                                                          onClick={() =>
                                                            handleRemoveOtherDocumentFile(
                                                              fileObj.file
                                                            )
                                                          }
                                                        >
                                                          Delete
                                                        </button>
                                                      </div>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                        </div>

                                        {/* <div
                                          class="my-4 col-lg-6 col-md-6 col-sm-12"
                                          style={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                          }}
                                        >
                                          <button
                                            onClick={addOtherDocumentField}
                                          >
                                            other
                                          </button>
                                        </div> */}
                                      </div>

                                      {/* <div
                                        class="my-4 col-lg-6 col-md-6 col-sm-12"
                                        style={{
                                          display: "flex",
                                          justifyContent: "flex-start",
                                        }}
                                      >
                                        <button onClick={addOtherDocumentField}>
                                          other
                                        </button>
                                      </div> */}
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
