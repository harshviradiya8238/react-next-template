import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stepper from "react-stepper-horizontal";
import axios from "axios";
import Notification from "../../components/utils/Notification";
import Preloader from "../../components/preloader/Preloader";
import Link from "next/link";
import API from "../../helper/API";
import jwtDecode from "jwt-decode";

// Define the validation schema
const validationSchema = Yup.object().shape({
  step1: Yup.object().shape({
    loanAmount: Yup.string().required("Loan Amount is required"),
    loanTerm: Yup.string().required("Loan Tenure is required"),
    loanType: Yup.string().required("Loan Type is required"),
    State: Yup.string().required("State is required"),
  }),
  step3: Yup.object().shape({
    businessProof: Yup.string().required("Address is required"),
    gst: Yup.string().required("City is required"),
    panCard: Yup.string().required("Country is required"),
  }),
});

function LoanApplication() {
  const [state, setSatate] = useState({
    // step1: { name: "", email: "" },
    step1: { pan: "", loanType: "", loanAmount: "", loanTerm: "", state: "" },
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

  useEffect(() => {
    const token = localStorage.getItem("logintoken");

    const GetAll = async (token) => {
      // const token = localStorage.getItem("logintoken");
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
    const fetchData = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {
          const userData = jwtDecode(token);
          const response = await API.get(
            `/User/GetById?userId=${userData?.UserDetails?.Id}`
          );
          const { data } = response;

          if (data?.success) {
            if (
              data?.value?.stateId ||
              data?.value?.zipCode ||
              data?.value?.city
            ) {
              SetCountryState(data?.value?.stateId);
              setPincode(data?.value?.zipCode);
              setCity(data?.value?.city);
            }
          }
          return response;
        }
      } catch (error) {
        console.log(error);
      }
    };

    GetAllState();
    GetAll(token);
    fetchData();
  }, [0]);

  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [countryStateOption, SetCountryStateOption] = useState([]);

  const [selectOption, setSelectOption] = useState("");
  const [bankOption, setBankOption] = useState([]);
  const [documentOption, setDocumentOption] = useState([]);
  const [loanApplicationId, setLoanAppliactionId] = useState("");
  const [loanApplicationNumber, setLoanAppliactionNumber] = useState("");
  const [errorLoanType, setErrorLoanType] = useState("");
  const [errorStateType, setErrorStateType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [otherDocumentId, setOtherDocumentId] = useState("");
  const [loanAmountError, setLoanAmountError] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [selectOptionName, setSelectOptionName] = useState("");
  const [cityError, setCityError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [isLoanCreat, setIsLoanCreat] = useState(false);
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

  const GetBankAndDocumetByLoanTypeId = async (
    id,
    Loanamount,
    tenure,
    setFieldValue
  ) => {
    const token = localStorage.getItem("logintoken");
    try {
      const response = await API.post(
        `/LoanApplication/GetBankAndDocumetByLoanTypeId`,
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
        setFieldValue("activeStep", 1);
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
  const handlePincodeChange = async (event) => {
    const newPincode = event.target.value;
    setPincode(newPincode);

    if (newPincode.length === 6) {
      try {
        const response = await axios.get(
          `https://dev.yowza.international/location/details/${newPincode}`
        );
        const { places, state, country, City } = response.data.data;
        // setCity(places[0]["place name"]);
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
    if (event.target.value.length) {
      setCityError("");
    }
    setCity(event.target.value);
  };

  const [countryState, SetCountryState] = useState("");

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

  const handleCreateApplication = async (value, setFieldValue) => {
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

    const token = localStorage.getItem("logintoken");

    try {
      const response = await API.post("/LoanApplication/Create", {
        loanTypeId: selectOption,
        amount: loanAmount,
        tenure: Number(value.step1.loanTerm),
        stateId: Number(countryState),
        city: city,
        postalCode: pincode,
      });
      const { data } = response;

      await Notification("success", data?.value?.message);
      setIsLoanCreat(true);
      GetBankAndDocumetByLoanTypeId(
        selectOption,
        loanAmount,
        value.step1.loanTerm,
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

    const token = localStorage.getItem("logintoken");

    try {
      const response = await API.post(
        "/LoanApplication/UpdateLoanApplication",
        {
          loanApplicationId: loanApplicationId,
          bankIds: selectedRowData,
          loanTypeId: selectOption,
          amount: Number(loanAmount),
          tenure: Number(value.step1.loanTerm),
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
        value.step1.loanTerm,
        setFieldValue
      );
      setIsLoanCreat(true);
    } catch (error) {
      console.log(error);
      // Notification("error", "Please Enter All Field");

      // Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };

  const stepsmain = [
    { title: "Loan Details" },
    { title: "Document Details" },
    { title: "Application confirmation" },
  ];

  const aRef = useRef(null);

  const handleNext = (setFieldValue, values) => {
    setFieldValue("activeStep", values.activeStep + 1);
  };

  const handlePrevious = (setFieldValue, values) => {
    setFieldValue("activeStep", values.activeStep - 1);
  };

  const handleSubmit = (values) => { };

  const [docFiles, setdocFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadedOtherDocuemnt, setuploadedOtherDocuemnt] = useState([]);
  const [selectedFilesArray, setSelectedFilesArray] = useState([]);
  const [fieldErrorMessages, setFieldErrorMessages] = useState({});

  const handleSubmitUploadDoc = async (setFieldValue) => {
    const allUploadEmpty = Object.values(uploadedFiles).every(
      (array) => array.length === 0
    );

    if (allUploadEmpty && uploadedOtherDocuemnt.length == 0) {
      Notification("error", "Please Upload atleast one document ");
      return;
    } else {
      setFieldValue("activeStep", 2);
    }
  };

  const handlePanFileChange = (fieldType, event, id) => {
    const filesWithMeta = [...event.target.files].map((file) => ({
      file, // Actual file
      documentTypeId: id,
    }));

    const { validFiles, errorMessage } = checkFileErrors(
      filesWithMeta.map((f) => f.file)
    );

    // Store the valid files along with their metadata
    const validFilesWithMeta = validFiles.map((file) => ({
      file,
      documentTypeId: id,
    }));

    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: validFilesWithMeta,
    }));

    setFieldErrorMessages((prevErrors) => ({
      ...prevErrors,
      [fieldType]: errorMessage,
    }));
  };

  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
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

  const [documentFileName, setDocumentFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalUploadedSize, setTotalUploadedSize] = useState(0);
  const allowedFileTypes = [".jpg", ".jpeg", ".png", ".bmp", ".pdf"];
  const maxFileSize = 10 * 1024 * 1024;

  const checkFileErrors = (files) => {
    let validFiles = [];
    let unsupportedFileType = false;
    let exceededIndividualFileSize = false;
    let exceededCumulativeFileSize = false;
    let errorMessage = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = "." + file.name.split(".").pop().toLowerCase();

      if (totalUploadedSize + file.size > maxFileSize) {
        exceededCumulativeFileSize = true;
        continue;
      }

      if (allowedFileTypes.includes(fileType) && file.size <= maxFileSize) {
        validFiles.push(file);
      } else {
        if (!allowedFileTypes.includes(fileType)) {
          unsupportedFileType = true;
        }
        if (file.size > maxFileSize) {
          exceededIndividualFileSize = true;
        }
      }
    }

    if (unsupportedFileType && exceededIndividualFileSize) {
      errorMessage =
        "Some file types are not supported and some files exceeded the individual size limit of 10 MB";
    } else if (unsupportedFileType) {
      errorMessage = "Some file types are not supported";
    } else if (exceededIndividualFileSize) {
      errorMessage = "Some files exceeded the individual size limit of 10 MB";
    } else if (exceededCumulativeFileSize) {
      errorMessage = "The combined size of the selected files exceeds 10 MB";
    }

    return { validFiles, errorMessage };
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (!documentFileName) {
      setErrorMessage("Please enter a document name before selecting a file");
      return;
    }

    const { validFiles, errorMessage } = checkFileErrors(files);

    // Update the cumulative total with the size of valid files
    setTotalUploadedSize(
      (prevSize) =>
        prevSize + validFiles.reduce((acc, file) => acc + file.size, 0)
    );

    // Map through validFiles, add the documentFileName, then add to the state
    const validFilesWithNames = validFiles.map((file) => ({
      name: documentFileName,
      file,
    }));

    // Update your selected files state
    setSelectedFilesArray((prevArray) => [
      ...prevArray,
      ...validFilesWithNames,
    ]);

    // Set error message, if any
    setErrorMessage(errorMessage);
  };

  const handleRemoveOtherDocumentFile = (fileToRemove) => {
    const updatedFiles = selectedFilesArray.filter(
      (fileObj) => fileObj.file !== fileToRemove
    );
    setSelectedFilesArray(updatedFiles);
  };

  const handleUploadForField = async (id, name) => {
    const files = docFiles[name]; // Assuming docFiles is an object where keys are the document names and values are arrays of File objects
    if (!files || !files?.length) {
      Notification("error", "please select atleast one document");
      return;
    }
    const formData = new FormData();

    files &&
      files.forEach(async (element, index) => {
        // Here 'files' is the FormData key. It may vary based on your backend requirement.
        formData.append("DocumentTypeId", element.documentTypeId);
        formData.append("Documents", element?.file);
        formData.append("LoanApplicationId", loanApplicationId);
      });

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
    <section className="apply-for-loan business-loan" id="business-loan-form ">
      <Preloader />

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

                <div>
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
                            <div
                              style={{
                                padding: "20px 0px",
                              }}
                            >
                              {bankOption && bankOption.length > 0 ? (
                                <>
                                  <div class="table-section">
                                    <span className="text-head">
                                      {" "}
                                      Choose your Preference
                                    </span>

                                    {/* <h4> Choose your Preference</h4> */}
                                    <table class="table">
                                      <thead>
                                        <tr>
                                          <th scope="col"></th>
                                          <th scope="col">Bank Name</th>
                                          {/* <th scope="col">Rate of interest</th> */}
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
                                                  {/* <td>{elm?.interestRate}</td> */}
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
                                      className="cmn-btn mr-10"
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
                                        const token =
                                          localStorage.getItem("logintoken");
                                        if (selectedRowData.length > 0) {
                                          try {
                                            const response = await API.post(
                                              `/LoanApplication/UpdateLoanApplication`,
                                              {
                                                isActive: true,
                                                loanApplicationId:
                                                  loanApplicationId,
                                                bankIds: selectedRowData,
                                                tenure: Number(
                                                  values.step1.loanTerm
                                                ),
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

                                            handleNext(setFieldValue, values);
                                          } catch (error) {
                                            console.log(error);
                                            handleNext(setFieldValue, values);
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
                                          type={"number"}
                                          onKeyPress={(event) => {
                                            if (
                                              loanAmount.length === 0 &&
                                              event.key === "0"
                                            ) {
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
                                                onChange={handleSelectoption}
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
                                        {/* <ErrorMessage
                                          name="step2verify.loanType"
                                          component="div"
                                          className="all_error"
                                        /> */}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-6">
                                      <div className="single-input">
                                        <label>Loan Tenure (Year)</label>

                                        <Field
                                          type={"number"}
                                          name="step1.loanTerm"
                                          placeholder="1 Year"
                                        />
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
                                            countryStateOption.length > 0 && (
                                              <select
                                                className="selectDrop form-select"
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
                                      onClick={async () => {
                                        !isLoanCreat
                                          ? await handleCreateApplication(
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
                              )}
                            </div>
                          )}
                          {values.activeStep === 1 && (
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
                                                    className="upload_icon"
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
                                                                      file?.file
                                                                    )
                                                                  }
                                                                >
                                                                  {
                                                                    file?.file
                                                                      ?.name
                                                                  }
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
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                ></i>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                  </div>
                                                )}

                                              {fieldErrorMessages && (
                                                <p className="error">
                                                  {
                                                    fieldErrorMessages[
                                                    data?.name
                                                    ]
                                                  }
                                                </p>
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
                                                          {file?.file?.name}
                                                        </span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                            </div>
                                          </>
                                        );
                                      })}

                                    <div class="row">
                                      <div
                                        // key={fieldIndex}
                                        class="my-4 col-lg-12 col-md-12 col-sm-12"
                                      >
                                        <h4 className="ml-0">Other Document</h4>
                                        <div className="d-flex align-items-center flex-wrap">
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

                                            <div className="input-box-userDashboard ">
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
                                                className="upload_icon"
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

                                        {uploadedOtherDocuemnt?.length > 0 && (
                                          <div>
                                            <h4>Uploaded files:</h4>
                                            {uploadedOtherDocuemnt?.map(
                                              (file, index) => (
                                                <div key={index}>
                                                  <span
                                                    className="document_hyper_link"
                                                    onClick={
                                                      () =>
                                                        handlePreviewFile(
                                                          file?.file
                                                        )

                                                      // window.open(
                                                      //   previewUrl,
                                                      //   "_blank"
                                                      // )
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
                          {values.activeStep === 2 && (
                            <div class="main-container d-flex container-fluid p-0">
                              <div class="loan-aplication-approver-section">
                                {/* <h1 class="text-center">Loan Bazar</h1> */}
                                <div class="img-box">
                                  <img src="/images/t.jpg" alt="" />
                                </div>
                                {/* <h3 class="thank-you-head">THANK YOU</h3> */}
                                <Link
                                  href="/userDashBoard"
                                  className="go_to_dashbaord"
                                  style={{
                                    color: "blue",
                                    borderBottom: "1px solid",
                                    marginBottom: "10px",
                                  }}
                                >
                                  Go to My Dashboard
                                </Link>
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

export default LoanApplication;
