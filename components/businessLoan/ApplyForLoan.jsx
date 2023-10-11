import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stepper from "react-stepper-horizontal";
import "react-phone-number-input/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import Notification from "../utils/Notification";
import Link from "next/link";
import NavBar from "../navBar/NavBar";
import API from "../../helper/API.js.Js";

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
    loanTerm: Yup.number().lessThan(20, "Value must be less than 20"),
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

function ApplyForLoan() {
  const [selectedRow, setSelectedRow] = useState(null);

  const [state, setSatate] = useState({
    step1: { firstName: "", lastName: "", email: "", phone: "", refer: "" },
    stepVerify: { mobileotp: "", emailotp: "" },
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

  const stepsmain = [
    { title: "Basic Details" },
    { title: "Loan Details" },
    { title: "Document Details" },
    { title: "Application confirmation" },
  ];
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [sendOtp, setVerifyOtp] = useState(false);

  const [eligiblity, setEligiblity] = useState(false);
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
  const [loanTerm, setLoanTerm] = useState("");
  const [errorLoanTerm, setErrorLoanTerm] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [isLoanCreat, setIsLoanCreat] = useState(false);
  const [userLoginData, setUserLoginData] = useState("");

  useEffect(() => {
    const CurrentStep = Number(localStorage.getItem("currentStep")) || 0;
    setSatate((oldState) => {
      return { ...oldState, activeStep: CurrentStep };
    });

    const GetAll = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        const response = await axios.get(
          "https://loancrmtrn.azurewebsites.net/api/LoanType/GetAll",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response;

        setLoanTypeOption(data?.value?.gridRecords);
      } catch (error) {
        console.log(error);
        // Notification("error", error?.response?.data[0]?.errorMessage);
      }
    };
    const GetAllState = async () => {
      try {
        const response = await API.get("/State/GetAll");
        const { data } = response;
        SetCountryStateOption(data.value);
      } catch (error) {
        console.log(error);
      }
    };
    GetAll();
    GetAllState();
  }, []);

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
    if (/^\d*\.?\d*$/.test(target.value) || target.value === "") {
      setLoanAmount(target.value);
    }
    setLoanAmountError("");
    // setSelectOptionName(target.name);
  };
  const handlehangeLoanTerm = ({ target }) => {
    const inputValue = target.value;
    if (
      inputValue === "" ||
      (0 <= parseInt(inputValue) && parseInt(inputValue) <= 20)
    ) {
      setLoanTerm(inputValue);
      setErrorLoanTerm("");
    } else {
      setErrorLoanTerm("please enter loan tenure between 0 to 20");
      setLoanTerm(inputValue);
    }
  };
  const handlePincodeChange = async (event) => {
    const newPincode = event.target.value;
    setPincode(newPincode);

    if (newPincode.length === 6) {
      try {
        const response = await axios.get(
          `https://dev.yowza.international/location/details/${newPincode}`
        );
        const { places, state, country, City } = response.data.data;

        setCity(City);
        setPincodeError("");
      } catch (error) {
        Notification("error", "invalid Pincode");
        console.error("Error fetching data:", error);
        setCity("");
      }
    } else {
      setCity("");
    }
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
    if (event.target.value.length) {
      setCityError("");
    }
  };

  const aRef = useRef(null);

  const handleSendOtp = async (data, value) => {
    if (
      value.step1.firstName &&
      value.step1.lastName &&
      value.step1.email &&
      value.step1.phone &&
      value.step1.phone.toString().length === 10
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
            referrerCode: value.step1.refer,
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
    if (!city) {
      setCityError("Please Enter city");
    }
    if (!pincode) {
      setPincodeError("Please Enter pincode");
    }
    if (!loanAmount || !countryState || !countryState || !city || !pincode) {
      return;
    }

    try {
      const response = await API.post("/LoanApplication/Create", {
        loanTypeId: selectOption,
        amount: loanAmount,
        tenure: Number(loanTerm),
        stateId: Number(countryState),
        city: city,
        postalCode: pincode,
      });
      const { data } = response;

      await Notification("success", data?.value?.message);
      GetBankAndDocumetByLoanTypeId(
        selectOption,
        loanAmount,
        loanTerm,
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

  const updateLoanApplication = async (value, setFieldValue) => {
    if (!selectOption) {
      setErrorLoanType("Please Select Loan Type.");
    }
    if (!countryState) {
      setErrorStateType("Please Select State");
    }
    if (!loanAmount) {
      setLoanAmountError("Please Enter Loan Amount");
    }
    if (!city) {
      setCityError("Please Enter City");
    }
    if (!pincode) {
      setPincodeError("Please Enter pincode");
    }
    if (!loanAmount || !countryState || !countryState || !city || !pincode) {
      return;
    }

    try {
      const response = await API.post(
        "/LoanApplication/UpdateLoanApplication",
        {
          loanApplicationId: loanApplicationId,
          bankIds: selectedRowData,
          loanTypeId: selectOption,
          amount: Number(loanAmount),
          tenure: Number(loanTerm),
          stateId: Number(countryState),
          city: city,
          postalCode: pincode,
          isActive: true,
        }
      );
      const { data } = response;

      await Notification("success", data?.messages[0]?.messageText);
      GetBankAndDocumetByLoanTypeId(
        selectOption,
        loanAmount,
        loanTerm,
        setFieldValue
      );
      setIsLoanCreat(true);
    } catch (error) {
      console.log(error);
      // Notification("error", "Please Enter All Field");

      // Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };

  const [selectedRowData, setSelectedRowData] = useState([]);
  const [docFiles, setdocFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadedOtherDocuemnt, setuploadedOtherDocuemnt] = useState([]);
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
    try {
      const response = await API.post(
        `/LoanApplication/GetBankAndDocumetByLoanTypeId`,
        {
          loanTypeId: id,
          tenure: Number(tenure),
          amount: Loanamount,
        }
      );
      const { data } = response;

      if (data?.value?.bank?.length > 0) {
        setBankOption([...data.value.bank]);
      } else {
        setFieldValue("activeStep", 2);
        setBankOption([]);
      }
      if (data?.value?.document?.length > 0) {
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
    const allUploadEmpty = Object.values(uploadedFiles).every(
      (array) => array.length === 0
    );

    if (allUploadEmpty && uploadedOtherDocuemnt.length == 0) {
      Notification("error", "Please Upload atleast one document ");
      return;
    } else {
      setFieldValue("activeStep", 3);
    }
  };

  const handlePanFileChange = (fieldType, event, id) => {
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
  };
  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
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
  const allowedFileTypes = [".jpg", ".jpeg", ".png", ".pdf"];
  const maxFileSize = 10 * 1024 * 1024;

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (!documentFileName) {
      setErrorMessage("Please enter a document name before selecting a file");
      return;
    }

    let newFileArray = [];
    let unsupportedFileType = false;
    let exceededFileSize = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = "." + file.name.split(".").pop().toLowerCase();

      if (allowedFileTypes.includes(fileType) && file.size <= maxFileSize) {
        newFileArray.push({ name: documentFileName, file });
      } else {
        if (!allowedFileTypes.includes(fileType)) {
          unsupportedFileType = true;
        }
        if (file.size > maxFileSize) {
          exceededFileSize = true;
        }
      }
    }

    if (newFileArray.length > 0) {
      setSelectedFilesArray((prevArray) => [...prevArray, ...newFileArray]);
    }

    if (unsupportedFileType && exceededFileSize) {
      setErrorMessage(
        "Some file types are not supported and some files exceeded the size limit of 10 MB"
      );
    } else if (unsupportedFileType) {
      setErrorMessage("Some file types are not supported");
    } else if (exceededFileSize) {
      setErrorMessage("Some files exceeded the size limit of 10 MB");
    } else {
      setErrorMessage("");
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

  const handleUploadForField = async (id, name) => {
    const files = docFiles[name]; // Assuming docFiles is an object where keys are the document names and values are arrays of File objects
    const formData = new FormData();
    files &&
      files.forEach(async (element, index) => {
        // Here 'files' is the FormData key. It may vary based on your backend requirement.

        formData.append("DocumentTypeId", element.documentTypeId);
        formData.append("Documents", element);
        formData.append("LoanApplicationId", loanApplicationId);
      });

    if (files || files.length) {
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

        Notification("success", "document Upload Successfully ");
        const newDocFiles = { ...docFiles };
        newDocFiles[name] = [];

        setdocFiles(newDocFiles);
        // setFieldValue("activeStep", 2);
        setUploadedFiles((prevState) => ({
          ...prevState,
          [name]: [...(prevState[name] || []), ...files],
        }));
      } catch (error) {
        console.log(error);
        Notification("error", error?.response?.data[0]?.errorMessage);
      }
    } else {
      Notification("error", "Please Upload atleast one document");
    }
  };

  const handleUploadForOtherDocument = async () => {
    if (
      !otherDocumentId ||
      selectedFilesArray.length === 0 ||
      !documentFileName
    ) {
      setErrorMessage("Please enter document name");
      return;
    }

    for (const { name, file } of selectedFilesArray) {
      const formData = new FormData();
      formData.append("LoanApplicationId", loanApplicationId);
      formData.append("DocumentTypeId", otherDocumentId);
      formData.append("Documents", file);
      formData.append("OtherDocumentName", name);

      // Add the ID here

      try {
        const token = localStorage.getItem("logintoken");
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
        // setSelectedFilesArray([]);
        setSelectedFilesArray([]);
        setDocumentFileName("");
        const newUploadedDocs = [
          ...uploadedOtherDocuemnt,
          ...selectedFilesArray,
        ];
        setuploadedOtherDocuemnt(newUploadedDocs);
        // setFieldValue("activeStep", 2);
      } catch (error) {
        console.log(error);
        Notification("error", error?.response?.data[0]?.errorMessage);
      }
    }
  };

  return (
    <section className="apply-for-loan business-loan" id="business-loan-form">
      <NavBar userLoginData={userLoginData} />
      <div className="overlay pt-120">
        <div className="container wow fadeInUp">
          <div className="row justify-content-center"></div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="form-content">
                <div className="section-header text-center">
                  <h2 className="title">Apply for Loan</h2>
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
                    enableReinitialize
                  >
                    {({
                      isSubmitting,
                      values,
                      setFieldValue,
                      setFieldError,
                    }) => (
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
                                        <label>
                                          {" "}
                                          <span className="astrisk_mark">
                                            *
                                          </span>
                                          Mobile OTP:
                                        </label>
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
                                          className="all_error"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>
                                          {" "}
                                          <span className="astrisk_mark">
                                            *
                                          </span>
                                          Email OTP:
                                        </label>
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
                                          className="all_error"
                                        />
                                      </div>
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center">
                                      <button
                                        type="submit"
                                        onClick={async () => {
                                          {
                                            const { mobileotp, emailotp } =
                                              values.stepVerify || {};

                                            // Check if the mobile OTP or email OTP is undefined or empty
                                            if (
                                              typeof mobileotp ===
                                                "undefined" ||
                                              typeof emailotp === "undefined" ||
                                              !mobileotp ||
                                              !emailotp
                                            ) {
                                              if (
                                                typeof mobileotp ===
                                                  "undefined" ||
                                                !mobileotp
                                              ) {
                                                setFieldError(
                                                  "stepVerify.mobileotp",
                                                  "Mobile OTP is required1111111111111111"
                                                );
                                              }
                                              if (
                                                typeof emailotp ===
                                                  "undefined" ||
                                                !emailotp
                                              ) {
                                                setFieldError(
                                                  "stepVerify.emailotp",
                                                  "Email OTP is required"
                                                );
                                              }
                                              return; // Stop further execution if either of the OTPs is undefined or empty
                                            }
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
                                                await window.localStorage.setItem(
                                                  "logintoken",
                                                  tokenData
                                                );
                                                await window.localStorage.setItem(
                                                  "user",
                                                  JSON.stringify(data?.value)
                                                );
                                                await localStorage.setItem(
                                                  "currentStep",
                                                  1
                                                );

                                                setUserLoginData(data?.value);
                                                await setVerifyOtp(true);
                                                await Notification(
                                                  "success",
                                                  "OTP Verify SuccessFully and Password Send on Your Email"
                                                );

                                                await window.location.reload();
                                                await handleNext(
                                                  setFieldValue,
                                                  values
                                                );
                                              }
                                            } catch (error) {
                                              console.log(error);
                                              Notification(
                                                "error",
                                                error?.response?.data[0]
                                                  .errorMessage
                                              );
                                            }
                                          }
                                        }}
                                        className="cmn-btn"
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
                                        <label>
                                          <span className="astrisk_mark">
                                            *
                                          </span>
                                          First Name:
                                        </label>
                                        <Field
                                          type="text"
                                          name="step1.firstName"
                                          placeholder="First Name "
                                        />
                                        <ErrorMessage
                                          name="step1.firstName"
                                          component="div"
                                          className="all_error"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>
                                          {" "}
                                          <span className="astrisk_mark">
                                            *
                                          </span>
                                          Last Name:{" "}
                                        </label>
                                        <Field
                                          type="text"
                                          name="step1.lastName"
                                          placeholder="Last Name"
                                        />
                                        <ErrorMessage
                                          name="step1.lastName"
                                          component="div"
                                          className="all_error"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>
                                          {" "}
                                          <span className="astrisk_mark">
                                            *
                                          </span>
                                          Email:
                                        </label>
                                        <Field
                                          type="email"
                                          name="step1.email"
                                          placeholder="Email"
                                        />
                                        <ErrorMessage
                                          name="step1.email"
                                          component="div"
                                          className="all_error"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>
                                          {" "}
                                          <span className="astrisk_mark">
                                            *
                                          </span>
                                          Contact No:
                                        </label>
                                        <div className="mobile-number-input">
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
                                            placeholder="Contact Number"
                                          />
                                        </div>

                                        <ErrorMessage
                                          name="step1.phone"
                                          component="div"
                                          className="error_phone"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>Referral Code :</label>
                                        <Field
                                          type="text"
                                          name="step1.refer"
                                          placeholder="Referral Code "
                                        />
                                        <ErrorMessage
                                          name="step1.refer"
                                          component="div"
                                          className="all_error"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      className="cmn-btn"
                                      disabled={
                                        !values.step1.firstName ||
                                        !values.step1.lastName ||
                                        !values.step1.email ||
                                        !values.step1.phone ||
                                        (values.step1.phone &&
                                          values.step1.phone.toString()
                                            .length !== 10) ||
                                        buttonDisabled
                                      }
                                      onClick={() => {
                                        handleSendOtp(setFieldValue, values);
                                      }}
                                    >
                                      Next
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                          {values.activeStep === 1 && (
                            <>
                              {bankOption && bankOption.length > 0 ? (
                                <>
                                  <div class="table-section">
                                    <span className="text-head">
                                      {" "}
                                      Choose your Preference
                                    </span>
                                    <table class="table">
                                      <thead>
                                        <tr>
                                          <th scope="col"></th>
                                          <th scope="col">Bank Name</th>
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
                                                </tr>
                                              </>
                                            );
                                          })}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="d-flex justify-content-start align-items-center">
                                    <button
                                      type="button"
                                      className="cmn-btn me-3"
                                      onClick={() => {
                                        setBankOption([]);
                                      }}
                                    >
                                      Previous
                                    </button>
                                    <button
                                      type="button"
                                      className="cmn-btn"
                                      onClick={async () => {
                                        handleNext(setFieldValue, values);
                                        if (selectedRowData.length > 0) {
                                          try {
                                            const response = await API.post(
                                              `/LoanApplication/UpdateLoanApplication`,
                                              {
                                                isActive: true,
                                                loanApplicationId:
                                                  loanApplicationId,
                                                bankIds: selectedRowData,
                                                tenure: Number(loanTerm),
                                                loanTypeId: selectOption,
                                                amount: loanAmount,
                                                stateId: Number(countryState),
                                                city: city,
                                              }
                                            );
                                            const { data } = response;

                                            await Notification(
                                              "success",
                                              "Bank selection Submitted successfully"
                                            );
                                          } catch (error) {
                                            console.log(error);
                                            Notification("error", "error");
                                          }
                                        } else {
                                          handleNext(setFieldValue, values);
                                        }
                                      }}
                                    >
                                      Next
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div class="custom_padding">
                                    <>
                                      <div className="row">
                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>
                                              {" "}
                                              <span className="astrisk_mark">
                                                *
                                              </span>
                                              Loan Amount (INR)
                                            </label>
                                            <Field
                                              type={"text"}
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
                                              <p className="all_error">
                                                {loanAmountError}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>
                                              {" "}
                                              <span className="astrisk_mark">
                                                *
                                              </span>
                                              Loan Type
                                            </label>

                                            <>
                                              {loanTypeOption &&
                                                loanTypeOption.length > 0 && (
                                                  <select
                                                    className="selectDrop form-select"
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
                                            </>
                                            {errorLoanType && (
                                              <p className="all_error">
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
                                              name="loanTerm"
                                              value={loanTerm}
                                              placeholder="1 Year"
                                              onChange={handlehangeLoanTerm}
                                              onKeyPress={(event) => {
                                                var charCode = event.which
                                                  ? event.which
                                                  : event.keyCode;
                                                if (
                                                  String.fromCharCode(
                                                    charCode
                                                  ).match(/[^0-9]/g) ||
                                                  event.target.value.length > 1
                                                ) {
                                                  event.preventDefault();
                                                }
                                              }}
                                            />
                                            {errorLoanTerm && (
                                              <p className="all_error">
                                                {errorLoanTerm}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>
                                              <span className="astrisk_mark">
                                                *
                                              </span>
                                              State
                                            </label>

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
                                              <p className="all_error">
                                                {errorStateType}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>
                                              {" "}
                                              <span className="astrisk_mark">
                                                *
                                              </span>
                                              Pincode
                                            </label>
                                            <Field
                                              type={"text"}
                                              value={pincode}
                                              onChange={handlePincodeChange}
                                              placeholder="Enter Pincode"
                                            />

                                            {pincodeError && (
                                              <p className="all_error">
                                                {pincodeError}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-6">
                                          <div className="single-input">
                                            <label>
                                              {" "}
                                              <span className="astrisk_mark">
                                                *
                                              </span>
                                              City
                                            </label>
                                            <Field
                                              type={"text"}
                                              placeholder="Enter City"
                                              value={city}
                                              onChange={handleCityChange}
                                            />
                                            {cityError && (
                                              <p className="all_error">
                                                {cityError}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="d-flex justify-content-start align-items-center">
                                        <button
                                          onClick={async (e) => {
                                            !isLoanCreat
                                              ? await handleCreateApplication(
                                                  e,
                                                  values,
                                                  setFieldValue
                                                )
                                              : updateLoanApplication(
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
                                <div className="custom_padding">
                                  <div class="row">
                                    {documentOption?.length > 0 &&
                                      documentOption.map((data, index) => {
                                        return (
                                          <>
                                            <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                                              <div key={index}>
                                                <label>
                                                  {data?.name}
                                                  {data?.instructions && (
                                                    <span className="instructions">
                                                      <span>&#40; </span>

                                                      {data?.instructions}
                                                      <span>&#41; </span>
                                                    </span>
                                                  )}
                                                </label>
                                                <div class="input-box-userDashboard ">
                                                  <input
                                                    type="file"
                                                    multiple
                                                    accept=".jpg, .jpeg, .png, .bmp, .pdf"
                                                    ref={aRef}
                                                    class="upload-box-userDashboard"
                                                    onChange={(e) =>
                                                      handlePanFileChange(
                                                        data?.name,
                                                        e,
                                                        data?.id
                                                      )
                                                    }
                                                  />
                                                  <button
                                                    className="upload_btn"
                                                    onClick={() =>
                                                      handleUploadForField(
                                                        data?.id,
                                                        data?.name
                                                      )
                                                    }
                                                  >
                                                    <i class="fa-solid fa-upload"></i>
                                                  </button>
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
                                                            {file && (
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
                                                            )}
                                                            <div>
                                                              <i
                                                                class="delete_button fa-solid fa-xmark"
                                                                onClick={() =>
                                                                  handleRemoveFile(
                                                                    data?.name,
                                                                    index
                                                                  )
                                                                }
                                                              />
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                              )}

                                              {uploadedFiles[data?.name]
                                                ?.length > 0 && (
                                                <div>
                                                  <h4>Uploaded files:</h4>
                                                  {uploadedFiles[
                                                    data?.name
                                                  ]?.map((file, index) => (
                                                    <div key={index}>
                                                      <span
                                                        className="document_hyper_link"
                                                        onClick={() =>
                                                          handlePreviewFile(
                                                            file?.file
                                                          )
                                                        }
                                                      >
                                                        {file?.name}
                                                      </span>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          </>
                                        );
                                      })}

                                    <div>
                                      <div class="row">
                                        <div class="my-4 col-lg-12 col-md-12 col-sm-12">
                                          <label>Other Document</label>
                                          <div className="d-flex align-items-baseline flex-wrap">
                                            <div className="other_doc_input">
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
                                            <div className="d-flex">
                                              <div>
                                                <input
                                                  type="file"
                                                  accept=".jpg, .jpeg, .png, .bmp, .pdf"
                                                  class="upload-box-userDashboard"
                                                  multiple
                                                  onChange={handleFileChange}
                                                />
                                              </div>
                                              <div className="d-flex">
                                                <button
                                                  className="upload_btn"
                                                  onClick={
                                                    handleUploadForOtherDocument
                                                  }
                                                >
                                                  <i class="fa-solid fa-upload"></i>
                                                </button>
                                              </div>
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
                                                      <div className="delete_div">
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
                                                        <i
                                                          class="delete_button fa-solid fa-xmark"
                                                          onClick={() =>
                                                            handleRemoveOtherDocumentFile(
                                                              fileObj.file
                                                            )
                                                          }
                                                        ></i>
                                                      </div>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}

                                          {uploadedOtherDocuemnt?.length >
                                            0 && (
                                            <div>
                                              <h4>Uploaded files:</h4>
                                              {uploadedOtherDocuemnt?.map(
                                                (file, index) => (
                                                  <div key={index}>
                                                    <span
                                                      className="document_hyper_link"
                                                      onClick={() =>
                                                        handlePreviewFile(
                                                          file?.file
                                                        )
                                                      }
                                                    >
                                                      {file?.name}
                                                    </span>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        {/* )
                                      )} */}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="d-flex justify-content-start align-items-center">
                                    <button
                                      type="button"
                                      className="cmn-btn mr-10"
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
                                        handleSubmitUploadDoc(setFieldValue)
                                      }
                                    >
                                      Submit
                                    </button>
                                  </div>

                                  <span className="valid_formate">
                                    * Valid File Formats JPG, JPEG, PNG, PDF{" "}
                                    <br />* Maximum allowed file size is of 10MB{" "}
                                    <br />* After Selecting File, click on
                                    upload button
                                  </span>
                                </div>
                              </>
                            </>
                          )}
                          {values.activeStep === 3 && (
                            <div class="main-container d-flex container-fluid p-0">
                              <div class="loan-aplication-approver-section">
                                <div class="img-box">
                                  <img src="/images/t.jpg" alt="" />
                                </div>
                                <div className="thankYou_button">
                                  <Link
                                    href="/userDashBoard"
                                    className="go_to_dashbaord"
                                  >
                                    Go to My Dashboard
                                  </Link>
                                </div>
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
                                    <span>
                                      {loanApplicationNumber?.toUpperCase()}
                                    </span>{" "}
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
