import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Stepper from "react-stepper-horizontal";
import axios from "axios";
import Notification from "../../components/utils/Notification";
import Preloader from "../../components/preloader/Preloader";

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

  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [countryStateOption, SetCountryStateOption] = useState([]);
  const [countryState, SetCountryState] = useState("");
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

  const handleSelectoption = ({ target }) => {
    setSelectOption(target.value);
    setErrorLoanType("");

    // setSelectOptionName(target.name);
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

    GetAll(token);
    GetAllState();
  }, [0]);

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
          tenure: Number(value.step1.loanTerm),
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

  const handleSubmit = (values) => {
    console.log(values);
  };

  const [docFiles, setdocFiles] = useState([]);
  const [selectedFilesArray, setSelectedFilesArray] = useState([]);

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
          setFieldValue("activeStep", 2);
        } catch (error) {
          console.log(error);
          Notification("error", error?.response?.data[0]?.errorMessage);
        }
      });
    } else {
      Notification("error", "Please select atleast one document ");
    }

    //====================================================================================old code==========================================
    // Object?.keys(docFiles)?.forEach((key) => {
    //   if (key === "otherDocuments") {
    //     docFiles[key]?.forEach((item) => {
    //       if (item?.files?.length > 0) {
    //         item?.files?.forEach((element) => {
    //           element["keyname"] = item?.label ? item?.label : "Other";
    //           element["documentTypeId"] = otherDocumentId;
    //           newAraay.push(element);
    //         });
    //       } else {
    //         documentNull = true;
    //         Notification("error", "Please select document Else remove field ");

    //         return;
    //       }
    //     });
    //   } else {
    //     docFiles[key]?.forEach((item) => {
    //       item["keyname"] = key;
    //       newAraay.push(item);
    //     });
    //   }
    // });
    // if (documentNull) {
    //   return;
    // }
    // if (!documentNull && newAraay?.length > 0) {
    //   newAraay.forEach(async (element) => {
    //     const formData = new FormData();
    //     console.log(element.documentTypeId, "oioio");
    //     formData.append("LoanApplicationId", loanApplicationId);
    //     formData.append("DocumentTypeId", element.documentTypeId);
    //     formData.append(
    //       "OtherDocumentName",
    //       element?.keyname ? element?.keyname : "Other"
    //     );
    //     formData.append("Documents", element);

    //     const token = localStorage.getItem("logintoken");

    //     try {
    //       const response = await axios.post(
    //         "https://loancrmtrn.azurewebsites.net/api/LoanApplication/UploadLoanDocument",
    //         formData,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //         }
    //       );
    //       // const { data } = response;
    //       Notification("success", "document Upload Successfully ");
    //       setFieldValue("activeStep", 2);
    //     } catch (error) {
    //       console.log(error);
    //       Notification("error", error?.response?.data[0]?.errorMessage);
    //     }
    //   });
    // } else {
    //   Notification("error", "Please select atleast one document ");
    // }
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
        setErrorMessage("File type is not supported");
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
        "Please enter a document name and choose a supported file to upload"
      );
    }
  };

  // const PreviewComponent = ({ file }) => {
  //   console.log(file.type);
  //   if (file.type.includes("image")) {
  //     return (
  //       <img
  //         src={URL.createObjectURL(file)}
  //         alt="File Preview"
  //         style={{ maxWidth: "100%", height: "100px" }}
  //       />
  //     );
  //   } else if (file.type === "application/pdf") {
  //     return (
  //       <>
  //         <embed
  //           src={URL.createObjectURL(file)}
  //           type="application/pdf"
  //           width="100%"
  //           height="100px"
  //         />
  //         {/* <h6>{URL.createObjectURL(file)}</h6> */}
  //       </>
  //     );
  //   } else {
  //     return <p>Preview not available for this file type.</p>;
  //   }
  // };

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

  const handlePreviewClick = (selectedFile) => {
    if (selectedFile) {
      const previewWindow = window.open("", "_blank");
      const previewContent = getFilePreviewContent(selectedFile);

      previewWindow.document.write(previewContent);
    }
  };

  const getFilePreviewContent = (selectedFile) => {
    if (selectedFile.type === "application/pdf") {
      return (
        <>
          <embed
            src={URL.createObjectURL(selectedFile)}
            type="application/pdf"
          />
          {/* <h6>{URL.createObjectURL(file)}</h6> */}
        </>
      );
    } else if (selectedFile.type.includes("image")) {
      return <img src={URL.createObjectURL(selectedFile)} alt="File Preview" />;
    }
    return "";
  };
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
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
                                    <h3> Preferred bank</h3>
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
                                              "Bank selection Submitted successfully"
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
                                          <p style={{ color: "red" }}>
                                            {errorLoanType}
                                          </p>
                                        )}
                                        {/* <ErrorMessage
                                          name="step2verify.loanType"
                                          component="div"
                                          style={{ color: "red" }}
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
                                        <label>State</label>
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
                                                          <div className="selectfile">
                                                            <div className="delete_div">
                                                              {file && (
                                                                // <PreviewComponent
                                                                //   file={file}
                                                                // />
                                                                <span
                                                                  className="document_hyper_link"
                                                                  onClick={
                                                                    () =>
                                                                      handlePreviewFile(
                                                                        file
                                                                      )

                                                                    // window.open(
                                                                    //   previewUrl,
                                                                    //   "_blank"
                                                                    // )
                                                                  }
                                                                >
                                                                  {file?.name}
                                                                </span>
                                                              )}

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
                                                          {/* {file && (
                                                            // <PreviewComponent
                                                            //   file={file}
                                                            // />
                                                            <button
                                                              onClick={
                                                                handlePreviewFile

                                                                // window.open(
                                                                //   previewUrl,
                                                                //   "_blank"
                                                                // )
                                                              }
                                                            >
                                                              Preview
                                                            </button>
                                                          )} */}
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
                                                      <button
                                                        className="delete_button"
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
                                      {/* )
                                      )} */}
                                    </div>
                                    {/* <div className="row">
                                      <div class="my-4 col-lg-6 col-md-6 col-sm-12 ml-4 ms-1">
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
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              </>
                            </>
                            // <div
                            //   style={{
                            //     padding: "20px 0px",
                            //   }}
                            // >
                            //   <div class="row">
                            //     <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                            //       <h4>3 year ITR /Form 16</h4>
                            //       <div class="input-box ">
                            //         <input
                            //           type="file"
                            //           multiple
                            //           ref={aRef}
                            //           class="upload-box"
                            //           onChange={(e) =>
                            //             handlePanFileChange("itrFile", e)
                            //           }
                            //         />
                            //       </div>
                            //       {docFiles?.itrFile?.length > 0 && (
                            //         <div>
                            //           <h4>Selected files:</h4>
                            //           {docFiles &&
                            //             docFiles?.itrFile?.map((file, index) => (
                            //               <div key={index}>
                            //                 <div className="selectfile">
                            //                   <p>{file?.name}</p>

                            //                   <i
                            //                     class="fa-solid fa-xmark"
                            //                     onClick={() =>
                            //                       handleRemoveFile(
                            //                         "itrFile",
                            //                         index
                            //                       )
                            //                     }
                            //                     style={{
                            //                       cursor: "pointer",
                            //                     }}
                            //                   ></i>
                            //                 </div>

                            //                 <div
                            //                   class="progress"
                            //                   role="progressbar"
                            //                   aria-label="Basic example"
                            //                   aria-valuenow="100"
                            //                   aria-valuemin="0"
                            //                   aria-valuemax="100"
                            //                   style={{ height: "6px" }}
                            //                 >
                            //                   <div
                            //                     class="progress-bar"
                            //                     style={{
                            //                       width: "100%",
                            //                     }}
                            //                   ></div>
                            //                 </div>
                            //               </div>
                            //             ))}
                            //         </div>
                            //       )}
                            //     </div>

                            //     <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                            //       <h4>Bank Statement</h4>
                            //       <div class="input-box ">
                            //         <input
                            //           type="file"
                            //           multiple
                            //           ref={aRef}
                            //           class="upload-box"
                            //           onChange={(e) =>
                            //             handlePanFileChange("bankStatements", e)
                            //           }
                            //         />
                            //       </div>
                            //       {docFiles?.bankStatements?.length > 0 && (
                            //         <div>
                            //           <h4>Selected files:</h4>
                            //           {docFiles &&
                            //             docFiles?.bankStatements?.map(
                            //               (file, index) => (
                            //                 <div key={index}>
                            //                   <div className="selectfile">
                            //                     <p>{file?.name}</p>
                            //                     <i
                            //                       class="fa-solid fa-xmark"
                            //                       onClick={() =>
                            //                         handleRemoveFile(
                            //                           "bankStatements",
                            //                           index
                            //                         )
                            //                       }
                            //                       style={{ cursor: "pointer" }}
                            //                     ></i>
                            //                   </div>

                            //                   <div
                            //                     class="progress"
                            //                     role="progressbar"
                            //                     aria-label="Basic example"
                            //                     aria-valuenow="100"
                            //                     aria-valuemin="0"
                            //                     aria-valuemax="100"
                            //                     style={{ height: "6px" }}
                            //                   >
                            //                     <div
                            //                       class="progress-bar"
                            //                       style={{ width: "100%" }}
                            //                     ></div>
                            //                   </div>
                            //                 </div>
                            //               )
                            //             )}
                            //         </div>
                            //       )}
                            //     </div>
                            //     {/* <div>
                            //       <div class="row">
                            //         {docFiles.otherDocuments.map(
                            //           (field, fieldIndex) => (
                            //             <div
                            //               key={fieldIndex}
                            //               class="my-4 col-lg-6 col-md-6 col-sm-12"
                            //             >
                            //               <div>
                            //                 {field.editable ? (
                            //                   <input
                            //                     type="text"
                            //                     value={field.label}
                            //                     onChange={(e) =>
                            //                       handleFieldChange(
                            //                         fieldIndex,
                            //                         "label",
                            //                         e.target.value
                            //                       )
                            //                     }
                            //                     placeholder="Upload Document"
                            //                   />
                            //                 ) : (
                            //                   <h4>{field.label}</h4>
                            //                 )}
                            //                 <div
                            //                   style={{
                            //                     display: "flex",
                            //                     alignItems: "center",
                            //                   }}
                            //                 >
                            //                   {field && field.editable ? (
                            //                     <button
                            //                       style={{ margin: "10px" }}
                            //                       onClick={() =>
                            //                         handleToggleEdit(fieldIndex)
                            //                       }
                            //                     >
                            //                       Save
                            //                     </button>
                            //                   ) : (
                            //                     <button
                            //                       style={{
                            //                         width: "40px",
                            //                         border: "none",
                            //                       }}
                            //                       onClick={() =>
                            //                         handleToggleEdit(fieldIndex)
                            //                       }
                            //                     >
                            //                       <i
                            //                         class="fa-solid fa-pen-to-square"
                            //                         style={{
                            //                           color: "green",
                            //                           cursor: "pointer",
                            //                         }}
                            //                       />
                            //                     </button>
                            //                   )}
                            //                   <i
                            //                     style={{
                            //                       color: "red",
                            //                       cursor: "pointer",
                            //                       marginRight: "10px",
                            //                     }}
                            //                     class="fa-solid fa-trash"
                            //                     onClick={() =>
                            //                       handleDeleteField(fieldIndex)
                            //                     }
                            //                   />
                            //                 </div>
                            //                 <div className="input-box">
                            //                   <input
                            //                     type="file"
                            //                     multiple
                            //                     class="upload-box"
                            //                     onChange={(e) =>
                            //                       handleOtherDocumentFileChange(
                            //                         fieldIndex,
                            //                         e
                            //                       )
                            //                     }
                            //                   />
                            //                 </div>
                            //                 {field?.files?.length > 0 && (
                            //                   <div>
                            //                     <h4>Selected files:</h4>
                            //                     {field?.files?.map(
                            //                       (file, fileIndex) => (
                            //                         <div key={fileIndex}>
                            //                           <div className="selectfile">
                            //                             <p>{file?.name}</p>
                            //                             <i
                            //                               class="fa-solid fa-xmark"
                            //                               onClick={() =>
                            //                                 handleRemoveOtherDocumentFile(
                            //                                   fieldIndex,
                            //                                   fileIndex
                            //                                 )
                            //                               }
                            //                               style={{
                            //                                 cursor: "pointer",
                            //                               }}
                            //                             ></i>
                            //                           </div>

                            //                           <div
                            //                             class="progress"
                            //                             role="progressbar"
                            //                             aria-label="Basic example"
                            //                             aria-valuenow="100"
                            //                             aria-valuemin="0"
                            //                             aria-valuemax="100"
                            //                             style={{ height: "6px" }}
                            //                           >
                            //                             <div
                            //                               class="progress-bar"
                            //                               style={{
                            //                                 width: "100%",
                            //                               }}
                            //                             ></div>
                            //                           </div>
                            //                         </div>
                            //                       )
                            //                     )}
                            //                   </div>
                            //                 )}
                            //               </div>
                            //             </div>
                            //           )
                            //         )}
                            //       </div>

                            //       <div
                            //         class="my-4 col-lg-6 col-md-6 col-sm-12"
                            //         style={{
                            //           display: "flex",
                            //           justifyContent: "flex-start",
                            //         }}
                            //       >
                            //         <button onClick={addOtherDocumentField}>
                            //           other
                            //         </button>
                            //       </div>
                            //     </div> */}
                            //   </div>

                            //   <div
                            //     style={{
                            //       display: "flex",
                            //       justifyContent: "flex-start",
                            //       alignItems: "center",
                            //     }}
                            //   >
                            //     {/* <button
                            //       type="submit"
                            //       className="cmn-btn"
                            //       style={{ marginRight: "10px" }}
                            //     >
                            //       Submit
                            //     </button> */}
                            //     <button
                            //       type="button"
                            //       style={{ marginRight: "10px" }}
                            //       className="cmn-btn"
                            //       onClick={() =>
                            //         handlePrevious(setFieldValue, values)
                            //       }
                            //     >
                            //       Previous
                            //     </button>
                            //     <button
                            //       type="button"
                            //       className="cmn-btn"
                            //       onClick={() =>
                            //         handleNext(setFieldValue, values)
                            //       }
                            //       // disabled={
                            //       //   !values.step1 ||
                            //       //   !values.step2.loanAmount ||
                            //       //   !values.step2.loanType ||
                            //       //   !values.step2.state ||
                            //       //   !values.step2.loanTerm
                            //       // }
                            //     >
                            //       Submit
                            //     </button>
                            //   </div>
                            // </div>
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

export default LoanApplication;
