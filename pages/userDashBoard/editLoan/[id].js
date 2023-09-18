import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../../../components/utils/Notification";
import Link from "next/link";
import API from "../../../helper/API";

function ViewLoan() {
  const router = useRouter();
  const { id } = router.query;

  const [countryStateOption, SetCountryStateOption] = useState("");
  const [countryState, SetCountryState] = useState("");
  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [selectOption, setSelectOption] = useState("");
  const [errorStateType, setErrorStateType] = useState("");
  const [errorLoanType, setErrorLoanType] = useState("");
  const [documentOption, setDocumentOption] = useState([]);
  const [otherDocumentId, setOtherDocumentId] = useState("");
  const [commentData, setCommentData] = useState("");
  const [queryDocuemntListing, setQueryDocuemntListing] = useState("");
  console.log(commentData, "-=-=-");
  const validationSchema = Yup.object().shape({
    loanAmount: Yup.string().required("loan Amount is required"),
    loanTenure: Yup.string().required("loan Tenure is required"),
    postalCode: Yup.string().required("Pincode is required"),
    city: Yup.string().required("City is required"),
  });

  const [basicDetailState, setBasicDetailState] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    state: "",
    postalCode: "",
    city: "",
    loanType: "",
    loanTenure: "",
    loanAmount: "",
    loanStatus: "",
  });

  const handlePincodeChange = async (event) => {
    const newPincode = event.target.value;
    setBasicDetailState((oldState) => {
      return { ...oldState, postalCode: newPincode };
    });

    if (basicDetailState.postalCode.length === 6) {
      try {
        const response = await axios.get(
          `https://dev.yowza.international/location/details/${newPincode}`
        );
        const { places, state, country, City } = response.data.data;
        // setCity(places[0]["place name"]);

        setBasicDetailState((oldState) => {
          return { ...oldState, city: City };
        });
      } catch (error) {
        Notification("error", "invalid Pincode");
        console.error("Error fetching data:", error);
        // setCity("");
      }
    } else {
      console.log("");
      // setCity("");
    }
  };
  const handleCityChange = (event) => {
    setBasicDetailState((oldState) => {
      return { ...oldState, city: event.target.value };
    });
  };

  const handleSelectoption = ({ target }) => {
    setSelectOption(target.value);
    setErrorLoanType("");
  };
  const handleSelectStateoption = ({ target }) => {
    SetCountryState(target.value);
    setErrorStateType("");
  };

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    const GetLoanById = async (token) => {
      // const token = localStorage.getItem("logintoken");
      try {
        const { id } = router.query;

        if (id) {
          const response = await API.get(
            `/LoanApplication/GetById?id=${id}`

            // {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // }
          );
          const { data } = response;
          setBasicDetailState(data.value);
          setSelectOption(data?.value?.loanTypeId);
          SetCountryState(data?.value?.stateId);
          GetBankAndDocumetByLoanTypeId(data?.value?.loanTypeId);
        }
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
    const GetAll = async (token) => {
      // const token = localStorage.getItem("logintoken");
      try {
        const response = await API.get(
          "/LoanType/GetAll"
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
        );
        const { data } = response;

        setLoanTypeOption(data?.value?.gridRecords);
      } catch (error) {
        console.log(error);
        // Notification("error", error?.response?.data[0]?.errorMessage);
      }
    };
    const GetCommentById = async (token) => {
      // const token = localStorage.getItem("logintoken");

      try {
        const { id } = router.query;
        if (id) {
          const response = await axios.get(
            `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetQueryByLoanApplicationId?id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { data } = response;
          setCommentData(data.value);
          setQueryDocuemntListing(data?.value);
        }
      } catch (error) {
        console.log(error);
        // Notification("error", error?.response?.data[0]?.errorMessage);
      }
    };
    GetLoanById(token);
    GetAllState();
    GetAll(token);
    GetCommentById(token);
    // GetBankAndDocumetByLoanTypeId(selectOption);
  }, [id]);

  const GetBankAndDocumetByLoanTypeId = async (selectOption) => {
    const token = localStorage.getItem("logintoken");
    try {
      const response = await API.post(
        `/LoanApplication/GetBankAndDocumetByLoanTypeId`,
        {
          loanTypeId: selectOption,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      const { data } = response;

      // await Notification("success", data?.value?.message);
      // setEligiblity(true);

      // if (data?.value?.bank?.length > 0) {
      //   setBankOption([...data.value.bank]);

      //   // setEligiblity(true);
      // } else {
      //   setFieldValue("activeStep", 1);
      //   setBankOption([]);
      //   // setSatate({ ...state, activeStep: 2 });
      // }
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
  const initialValues = {
    firstName: basicDetailState?.user?.firstName,
    email: basicDetailState?.user?.email,
    phoneNumber: basicDetailState?.user?.phoneNumber,
    loanStatus: basicDetailState?.status,
    loanTenure: basicDetailState?.tenure,
    loanAmount: basicDetailState?.amount,
    city: basicDetailState?.city,
    postalCode: basicDetailState?.postalCode,
  };

  const [docFiles, setdocFiles] = useState([]);
  const [documentFileName, setDocumentFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadedOtherDocuemnt, setuploadedOtherDocuemnt] = useState([]);
  const [selectedFilesArray, setSelectedFilesArray] = useState([]);
  const [loanApplicationId, setLoanAppliactionId] = useState("");

  const allowedFileTypes = [".jpg", ".jpeg", ".png", ".bmp", ".pdf"];
  const maxFileSize = 10 * 1024 * 1024;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && documentFileName) {
      const fileType = "." + file.name.split(".").pop().toLowerCase();
      if (allowedFileTypes.includes(fileType) && file.size <= maxFileSize) {
        setSelectedFilesArray((prevArray) => [
          ...prevArray,
          { name: documentFileName, file },
        ]);
        // setDocumentFileName("");
        setErrorMessage("");
      } else {
        if (!allowedFileTypes.includes(fileType)) {
          setErrorMessage("File type is not supported");
        } else if (file.size > maxFileSize) {
          setErrorMessage("File size exceeds the limit of 10 MB");
        }
      }
    } else {
      setErrorMessage("Please enter a document name before selecting a file");
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

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!selectOption) {
      setErrorLoanType("Please Select Loan Type.");
    }
    if (!countryState) {
      setErrorStateType("Please Select State");
    }

    const token = localStorage.getItem("logintoken");

    try {
      const response = await API.post(
        `/LoanApplication/UpdateLoanApplication`,
        {
          loanApplicationId: id,
          loanTypeId: selectOption,
          stateId: Number(countryState),
          amount: Number(values.loanAmount),
          tenure: Number(values.loanTenure),
          city: values?.city,
          postalCode: values?.postalCode,
          isActive: true,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      const { data } = response;

      setSubmitting(false);
      await Notification("success", "Loan Application Updated SuccessFully");
      router.push("/userDashBoard");
    } catch (error) {
      console.log(error);
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
    console.log("sdasdasd", docFiles);
  };

  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
  };

  console.log("sdasdasd", docFiles);
  const handleUploadForField = async (fieldid, name) => {
    const files = docFiles[name]; // Assuming docFiles is an object where keys are the document names and values are arrays of File objects

    const formData = new FormData();
    files &&
      files.forEach(async (element, index) => {
        // Here 'files' is the FormData key. It may vary based on your backend requirement.

        formData.append("DocumentTypeId", element.documentTypeId);
        formData.append("Documents", element);
        formData.append("LoanApplicationId", id);
      });

    if (files || files?.length) {
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
      Notification("error", "select At least one doc");
    }
  };

  const [documentData, setDocumentData] = useState([]);
  console.log(documentData, "-=-=");
  // Initialize document data for each row
  const initializeDocumentData = () => {
    const initialData =
      commentData &&
      commentData?.map((comment) => ({
        documentFileName: "",
        selectedFile: null,
        errorMessage: "",
        selectedFilesArray: [],
        docFiles: [],
        remarks: "",
        ...comment,
      }));
    setDocumentData(initialData);
  };

  // Call the initialization function when needed
  useEffect(() => {
    initializeDocumentData();
  }, [commentData]);

  const handleDocumentFileNameChange1 = (event, rowIndex) => {
    const newDocumentFileName = event.target.value;

    let updatedDocumentData = [...documentData];
    updatedDocumentData[rowIndex].documentFileName = newDocumentFileName;
    setDocumentData(updatedDocumentData);
  };

  const handleFileChange1 = (event, rowIndex) => {
    const file = event.target.files[0];

    if (file) {
      const fileType = "." + file.name.split(".").pop().toLowerCase();

      if (allowedFileTypes.includes(fileType)) {
        let updatedDocumentData = [...documentData];
        updatedDocumentData[rowIndex].selectedFile = file;
        updatedDocumentData[rowIndex].errorMessage = "";

        // Check if a document name is available
        if (updatedDocumentData[rowIndex].documentFileName) {
          // Create a new document entry with its name and file
          const newDocumentEntry = {
            name: updatedDocumentData[rowIndex].documentFileName,
            file: file,
          };

          // Add the new entry to the selectedFilesArray
          updatedDocumentData[rowIndex].selectedFilesArray.push(
            newDocumentEntry
          );

          // Clear the document name for the next entry
          updatedDocumentData[rowIndex].documentFileName = "";
        }

        setDocumentData(updatedDocumentData);
      } else {
        let updatedDocumentData = [...documentData];
        updatedDocumentData[rowIndex].selectedFile = null;
        updatedDocumentData[rowIndex].errorMessage =
          "File type is not supported";
        setDocumentData(updatedDocumentData);
      }
    }
  };

  const handleUpload1 = (rowIndex) => {
    const {
      documentFileName,
      selectedFile,
      remarks, // Get remarks from the state
    } = documentData[rowIndex];

    if (selectedFile && documentFileName) {
      let updatedDocumentData = [...documentData];
      updatedDocumentData[rowIndex].selectedFilesArray.push({
        name: documentFileName,
        file: selectedFile,
      });
      // updatedDocumentData[rowIndex].selectedFile = null;
      // updatedDocumentData[rowIndex].documentFileName = "";
      // updatedDocumentData[rowIndex].errorMessage = "";

      // Clear the remarks field after upload if needed
      // updatedDocumentData[rowIndex].remarks = "";

      setDocumentData(updatedDocumentData);

      // Now, you can send both remarks and document data to your API
      // Make your API request here
      // Example:
      // api.uploadDocument({
      //   documentFileName,
      //   selectedFile,
      //   remarks,
      // })
    } else {
      const updatedDocumentData = [...documentData];
      updatedDocumentData[rowIndex].errorMessage =
        "Please enter a document name and choose a supported file to upload";
      setDocumentData(updatedDocumentData);
    }
  };

  const handleRemarksChange = (event, rowIndex) => {
    const newRemarks = event.target.value;
    console.log(newRemarks, "=-=-qqqqqqqqqqqqqqqqq");
    let updatedDocumentData = [...documentData];
    console.log(updatedDocumentData, "sassssssssssssss");
    updatedDocumentData[rowIndex].remarks = newRemarks;
    setDocumentData(updatedDocumentData);
  };

  const handleRemoveDocumentFile1 = (rowIndex, fileToRemove) => {
    const updatedDocumentData = [...documentData];
    updatedDocumentData[rowIndex].selectedFilesArray = updatedDocumentData[
      rowIndex
    ].selectedFilesArray.filter((fileObj) => fileObj.file !== fileToRemove);
    setDocumentData(updatedDocumentData);
  };

  const handleSubmitQuery = async (LoanApplicationQueryId) => {
    var newFilter = documentData.filter(
      (item) => item.id === LoanApplicationQueryId
    );
    console.log("newFilter===========5981", newFilter);
    if (newFilter?.length > 0) {
      await newFilter.forEach(async (element) => {
        console.log("584----------------------------");
        const formData = new FormData();
        formData.append("LoanApplicationQueryId", LoanApplicationQueryId);
        formData.append("LoanApplicationId", id);
        element?.selectedFilesArray.map((doc) => {
          console.log(doc);
          formData.append("Documents", doc?.file);
        });

        const token = localStorage.getItem("logintoken");
        if (element?.selectedFilesArray?.length > 0) {
          try {
            const response = await axios.post(
              "https://loancrmtrn.azurewebsites.net/api/LoanApplication/UploadQueryDocument",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // const { data } = response;
            Notification("success", "document Upload Successfully ");
            await axios.post(
              "https://loancrmtrn.azurewebsites.net/api/LoanApplication/UpdateQuery",
              {
                LoanApplicationQueryId: LoanApplicationQueryId,
                LoanApplicationId: id,
                remark: "",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            // router.push("/userDashBoard");
            // setFieldValue("activeStep", 2);
          } catch (error) {
            console.log(error);
            Notification("error", error?.response?.data[0]?.errorMessage);
          }
        } else {
          if (element?.remarks) {
            const formData = new FormData();
            formData.append("Remark", element?.remarks);
            formData.append("LoanApplicationId", id);
            formData.append("LoanApplicationQueryId", LoanApplicationQueryId);

            axios.post(
              "https://loancrmtrn.azurewebsites.net/api/LoanApplication/UpdateQuery",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            await Notification("success", "Query submitted ");
            // window.location.reload();
          } else {
            Notification("error", "Please add remark");
          }
        }
      });
    } else {
      Notification("error", "Please select atleast one document ");
    }
  };

  const handleUploadForOtherDocument = async () => {
    console.log(
      selectedFilesArray,
      otherDocumentId,
      documentFileName,
      "============================================"
    );
    if (
      !otherDocumentId ||
      selectedFilesArray.length === 0 ||
      !documentFileName
    ) {
      setErrorMessage(
        "Please select a document option, a file, and enter a document name."
      );
      return;
    }

    for (const { name, file } of selectedFilesArray) {
      const formData = new FormData();
      formData.append("LoanApplicationId", id);
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
            <div class="form">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, values }) => (
                  <Form>
                    <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                        <label for="first-name">Name</label>
                        <div>
                          <Field
                            type="text"
                            // initialValues={basicDetailState?.firstName}
                            name="firstName"
                            disabled
                            placeholder="First Name"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="error"
                          />
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                        <div class="single-input">
                          <label>Loan Type</label>
                          <>
                            {loanTypeOption && loanTypeOption.length > 0 && (
                              <select
                                className="selectDrop form-select"
                                value={selectOption}
                                onChange={handleSelectoption}
                              >
                                <option disabled={true} value="">
                                  Select Loan Type
                                </option>
                                {loanTypeOption.map((data, index) => (
                                  <>
                                    <option value={data?.id} key={index}>
                                      {data?.name}
                                    </option>
                                  </>
                                ))}
                              </select>
                            )}
                          </>
                          {errorLoanType && (
                            <p className="all_error">{errorLoanType}</p>
                          )}
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-3 col-sm-12 m-basics">
                        <label for="email">E-mail</label>
                        <Field
                          type="text"
                          name="email"
                          disabled
                          placeholder="First Name"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div class="col-lg-6 col-md-3 col-sm-12 m-basics">
                        <label for="phone">Contact No</label>
                        <div className="mobile-number-input">
                          {/* <img
                            src="/images/india_2.png"
                            className="indiaFlag"
                          />
                          <span className="country-code">+91</span> */}
                          <Field
                            type="text"
                            name="phoneNumber"
                            disabled
                            placeholder="Mobile Number"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="error"
                          />
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                        <label for="phone">Pincode</label>

                        {/* <img
                            src="/images/india_2.png"
                            className="indiaFlag"
                          />
                          <span className="country-code">+91</span> */}

                        <Field
                          type="text"
                          name="postalCode"
                          onChange={handlePincodeChange}
                          placeholder="Pincode"
                          initialValues={values?.postalCode}
                        />
                        <ErrorMessage
                          name="postalCode"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                        <label for="phone">City</label>

                        {/* <img
                            src="/images/india_2.png"
                            className="indiaFlag"
                          />
                          <span className="country-code">+91</span> */}
                        <Field
                          type="text"
                          name="city"
                          onChange={handleCityChange}
                          placeholder="City"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                        <div class="single-input">
                          <label for="state">State</label>
                          <>
                            {countryStateOption &&
                              countryStateOption.length > 0 && (
                                <select
                                  className="selectDrop form-select"
                                  // aria-label="Default select example"
                                  value={countryState}
                                  // initialValues={countryState?.stateId}
                                  onChange={handleSelectStateoption}
                                >
                                  <option disabled={true} value="">
                                    Select State
                                  </option>
                                  {countryStateOption.map((data, index) => (
                                    <option value={data?.id} key={index}>
                                      {data?.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                          </>
                          {errorStateType && (
                            <p className="all_error">{errorStateType}</p>
                          )}
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                        <label for="loan-status">Loan Status</label>
                        <Field
                          type="text"
                          name="loanStatus"
                          disabled
                          placeholder="Enter Loan Status"
                        />
                        <ErrorMessage
                          name="loanStatus"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                        <label for="Loan-Amount">Loan Amount (INR)</label>

                        <Field
                          type={"number"}
                          name="loanAmount"
                          placeholder="Enter Loan Amount"
                        />
                        <ErrorMessage
                          name="loanAmount"
                          component="div"
                          className="error"
                        />
                      </div>

                      <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
                        <div class="single-input">
                          <label for="term">Loan Tenure (Year)</label>

                          <Field
                            type={"number"}
                            name="loanTenure"
                            placeholder="Enter Loan Tenure"
                          />
                          <ErrorMessage
                            name="loanTenure"
                            component="div"
                            className="error"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="btn-section">
                      <button class="profile-btn me-3" disabled={isSubmitting}>
                        Save
                      </button>

                      <Link href="/userDashBoard">
                        <button class="profile-btn">Cancel</button>
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>

              <div class="loan-content-body">
                <h5>Query History</h5>
                <div class="loan-section-table">
                  <div class="table-responsive">
                    <table class="table ">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Query</th>
                          <th>Remarks</th>

                          <th>Submit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentData &&
                          // commentData.length &&
                          commentData.map((elm, index) => {
                            return (
                              <tr key={index}>
                                <td style={{ width: "5%" }}>
                                  <span
                                    class={`all-btn ${
                                      elm?.status === "Pending"
                                        ? "Rejected-btn"
                                        : elm?.status === "Query"
                                        ? "qyery-btn"
                                        : elm?.status === "Reject"
                                        ? "Rejected-btn"
                                        : elm?.status === "Submitted"
                                        ? "Approved-btn"
                                        : elm?.status === "Incomplete"
                                        ? "Process-btn"
                                        : ""
                                    }`}
                                  >
                                    {elm?.status === "Query"
                                      ? elm?.status === "Pending"
                                      : elm?.status}
                                  </span>
                                </td>
                                <td style={{ width: "13%" }}>{elm?.comment}</td>
                                <td style={{ width: "13%" }}>
                                  <div>
                                    {elm?.remark ? (
                                      <>
                                        {elm?.remark}
                                        <div className="query_row_remark justify-content-center">
                                          {elm.documentList.length > 0 ? (
                                            <ul>
                                              <h5 class="text-head">
                                                Uploaded Document
                                              </h5>
                                              {elm.documentList.length > 0 &&
                                                elm.documentList.map(
                                                  (detail, i) => (
                                                    <div key={i}>
                                                      <a
                                                        href={
                                                          detail.documentURL
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="document_hyper_link"
                                                      >
                                                        {detail.documentName}
                                                      </a>
                                                    </div>
                                                    // <li key={i}>-{detail.documentName}</li>
                                                  )
                                                )}
                                            </ul>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <textarea
                                          type="text"
                                          placeholder="Enter remarks"
                                          value={documentData[index]?.remarks}
                                          onChange={(event) =>
                                            handleRemarksChange(event, index)
                                          }
                                        />

                                        {elm.documentList.length ? (
                                          <>
                                            <div className="query_row_remark justify-content-start">
                                              {elm.documentList.length > 0 ? (
                                                <ul>
                                                  <h5 class="text-head">
                                                    Uploaded Document
                                                  </h5>
                                                  {elm.documentList.length >
                                                    0 &&
                                                    elm.documentList.map(
                                                      (detail, i) => (
                                                        <div key={i}>
                                                          <a
                                                            href={
                                                              detail.documentURL
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="document_hyper_link"
                                                          >
                                                            {
                                                              detail.documentName
                                                            }
                                                          </a>
                                                        </div>
                                                        // <li key={i}>-{detail.documentName}</li>
                                                      )
                                                    )}
                                                </ul>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div
                                              style={{ display: "flex" }}
                                              className="d-flex justify-content-between align-items-center mt-4"
                                            >
                                              <input
                                                type="text"
                                                placeholder="Enter document name"
                                                value={
                                                  documentData[index]
                                                    ?.documentFileName
                                                }
                                                onChange={(event) =>
                                                  handleDocumentFileNameChange1(
                                                    event,
                                                    index
                                                  )
                                                }
                                              />
                                              <div className="input-box">
                                                <input
                                                  type="file"
                                                  accept=".jpg, .jpeg, .png, .bmp, .pdf"
                                                  className="upload-box"
                                                  multiple
                                                  onChange={(event) =>
                                                    handleFileChange1(
                                                      event,
                                                      index
                                                    )
                                                  }
                                                />
                                              </div>
                                              <div
                                                style={{ display: "flex" }}
                                              ></div>
                                            </div>
                                            {documentData[index]
                                              ?.errorMessage && (
                                              <p className="error">
                                                {
                                                  documentData[index]
                                                    .errorMessage
                                                }
                                              </p>
                                            )}
                                            {documentData[index]
                                              ?.selectedFilesArray.length >
                                              0 && (
                                              <div>
                                                <p
                                                  style={{ textAlign: "start" }}
                                                >
                                                  Selected File:
                                                </p>
                                                <ul>
                                                  {documentData[
                                                    index
                                                  ]?.selectedFilesArray.map(
                                                    (fileObj, fileIndex) => (
                                                      <li key={fileIndex}>
                                                        <div className="delete_div">
                                                          <b>{fileObj.name}</b>{" "}
                                                          -{" "}
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
                                                            className="delete_button fa-solid fa-xmark"
                                                            onClick={() =>
                                                              handleRemoveDocumentFile1(
                                                                index,
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
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>

                                <td style={{ width: "10%" }}>
                                  {" "}
                                  {!elm?.remark ? (
                                    <button
                                      class="table-btn btn "
                                      onClick={() => handleSubmitQuery(elm?.id)}
                                    >
                                      Submit
                                    </button>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  {/* <div class="text-end">
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
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          <div
            class="tab-pane fade kyc-details"
            id="nav-kyc"
            role="tabpanel"
            aria-labelledby="nav-kyc-tab"
            tabindex="0"
          >
            <div class="row">
              <div className="form">
                {documentOption?.length > 0 &&
                  documentOption.map((data, index) => {
                    return (
                      <>
                        <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                          <div key={index}>
                            <label>
                              <span className="astrisk_mark">*</span>
                              {data?.name}
                            </label>
                            <div class="input-box-userDashboard ">
                              <input
                                type="file"
                                multiple
                                accept=".jpg, .jpeg, .png, .bmp, .pdf"
                                class="upload-box-userDashboard"
                                onChange={(e) =>
                                  handlePanFileChange(data?.name, e, data?.id)
                                }
                              />
                              <button
                                style={{
                                  margin: "10px",
                                  fontSize: "larger",
                                }}
                                onClick={() =>
                                  handleUploadForField(data?.id, data?.name)
                                }
                              >
                                <i class="fa-solid fa-upload"></i>
                              </button>
                            </div>
                          </div>
                          {docFiles[data?.name]?.length > 0 && (
                            <div>
                              <h4>Selected files:</h4>
                              {docFiles[data?.name] &&
                                docFiles[data?.name]?.map((file, index) => (
                                  <div key={index}>
                                    <div className="delete_div">
                                      {file && (
                                        // <PreviewComponent
                                        //   file={file}
                                        // />
                                        <span
                                          className="document_hyper_link"
                                          onClick={
                                            () => handlePreviewFile(file)

                                            // window.open(
                                            //   previewUrl,
                                            //   "_blank"
                                            // )
                                          }
                                        >
                                          {file?.name}
                                        </span>
                                      )}
                                      <div>
                                        <i
                                          class="delete_button fa-solid fa-xmark"
                                          onClick={() =>
                                            handleRemoveFile(data?.name, index)
                                          }
                                          style={{
                                            cursor: "pointer",
                                          }}
                                        ></i>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}

                          {uploadedFiles[data?.name]?.length > 0 && (
                            <div>
                              <h4>Uploaded files:</h4>
                              {uploadedFiles[data?.name]?.map((file, index) => (
                                <div key={index}>
                                  <span
                                    className="document_hyper_link"
                                    onClick={
                                      () => handlePreviewFile(file?.file)

                                      // window.open(
                                      //   previewUrl,
                                      //   "_blank"
                                      // )
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

                <div class="row">
                  {/* {docFiles.otherDocuments.map(
                                        (field, fieldIndex) => ( */}
                  <div
                    // key={fieldIndex}
                    class="my-4 col-lg-12 col-md-12 col-sm-12"
                  >
                    <h4 style={{ marginLeft: "0" }}>Other Document</h4>
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
                            setDocumentFileName(event.target.value)
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
                            fontSize: "larger",
                          }}
                          onClick={handleUploadForOtherDocument}
                        >
                          <i class="fa-solid fa-upload"></i>
                        </button>
                      </div>
                    </div>
                    <>
                      {errorMessage && <p className="error">{errorMessage}</p>}
                    </>
                    {selectedFilesArray.length > 0 && (
                      <div>
                        <p>Selected Files:</p>
                        <ul>
                          {selectedFilesArray.map((fileObj, index) => (
                            <li key={index}>
                              <div className="delete_div">
                                <b>{fileObj.name}</b> -
                                <span
                                  className="document_hyper_link"
                                  onClick={() =>
                                    handlePreviewFile(fileObj.file)
                                  }
                                >
                                  {fileObj.file.name}
                                </span>
                                <i
                                  class="delete_button fa-solid fa-xmark"
                                  onClick={() =>
                                    handleRemoveOtherDocumentFile(fileObj.file)
                                  }
                                ></i>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {uploadedOtherDocuemnt?.length > 0 && (
                      <div>
                        <h4>Uploaded files:</h4>
                        {uploadedOtherDocuemnt?.map((file, index) => (
                          <div key={index}>
                            <span
                              className="document_hyper_link"
                              onClick={
                                () => handlePreviewFile(file?.file)

                                // window.open(
                                //   previewUrl,
                                //   "_blank"
                                // )
                              }
                            >
                              {file?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* )
                                      )} */}
                </div>
                <button
                  type="button"
                  className="cmn-btn"
                  onClick={() => handleSubmitUploadDoc()}
                >
                  Submit
                </button>
              </div>
              <></>
            </div>
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
                          <input type="text" placeholder="comment " />
                        </td>
                        <td>
                          {" "}
                          <button class="table-btn btn ">Submit</button>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <span class="all-btn Re-Active-btn">ReActivate</span>
                        </td>
                        <td>GST Certificate not match</td>
                        <td>
                          <input type="text" placeholder="comment " />
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
                          <input type="text" placeholder="comment " />
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
