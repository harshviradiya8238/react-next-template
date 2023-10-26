import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../../../components/utils/Notification";
import Link from "next/link";
import API from "../../../helper/API";
import PaginationTable from "../../../components/paginaton_table/PaginationTable";

function ViewLoan() {
  const router = useRouter();
  const { id } = router.query;

  const [countryStateOption, SetCountryStateOption] = useState("");

  const [loanTypeOption, setLoanTypeOption] = useState([]);
  const [selectOption, setSelectOption] = useState("");
  const [uploadedExist, setUploadedExist] = useState([]);
  const [documentOption, setDocumentOption] = useState([]);
  const [otherDocumentId, setOtherDocumentId] = useState("");
  const [commentData, setCommentData] = useState("");
  const [queryDocuemntListing, setQueryDocuemntListing] = useState("");
  const [bankOption, setBankOption] = useState([]);


  const validationSchema = Yup.object().shape({
    loanAmount: Yup.string().required("loan Amount is required"),
    // loanTenure: Yup.string().required("loan Tenure is required"),
    postalCode: Yup.string().required("Pincode is required"),
    city: Yup.string().required("City is required"),
  });

  const [basicDetailState, setBasicDetailState] = useState({
    firstName: "",
    email: "",
    loanApplicationNumber: "",
    phoneNumber: "",
    state: "",
    postalCode: "",
    city: "",
    loanType: "",
    loanTenure: "",
    loanAmount: "",
    loanStatus: "",
  });
  const [preffredBank, setPreffredBank] = useState()
  console.log(preffredBank, "ppppppppppp");

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

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    const GetLoanById = async (token) => {
      // const token = localStorage.getItem("logintoken");
      try {
        const { id } = router.query;

        if (id) {
          const response = await API.get(`/LoanApplication/GetById?id=${id}`);
          const { data } = response;
          setPreffredBank(data.value)
          setBasicDetailState({
            ...data.value,
            state: data?.value?.stateId,
            loanType: data?.value?.loanTypeId,
          });

          GetBankAndDocumetByLoanTypeId(data?.value?.loanTypeId);
        }
      } catch (error) {
        console.log(error);
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
      try {
        const response = await API.get("/LoanType/GetAll");
        const { data } = response;

        setLoanTypeOption(data?.value?.gridRecords);
      } catch (error) {
        console.log(error);
      }
    };
    const GetCommentById = async (token) => {
      try {
        const { id } = router.query;
        if (id) {
          const response = await API.get(
            `/LoanApplication/GetQueryByLoanApplicationId?id=${id}`,
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
    const GetAllBank = async (token) => {
      try {
        const response = await API.get("/BanksAndInstitute/GetAll?pageNumber=1", {

          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const { data } = response;
        // if (data?.value?.gridRecords?.length > 0) {
        setBankOption(data.value.gridRecords);
        // setEligiblity(true);
        // } else {
        //   setBankOption([]);
        //   // setSatate({ ...state, activeStep: 2 });
        // }
        // setLoanTypeOption(data?.value?.gridRecords);
      } catch (error) {
        console.log(error);
      }
    };
    GetLoanById(token);
    GetAllState();
    GetAll(token);
    GetCommentById(token);
    GetAllBank(token)
  }, [id]);

  const GetBankAndDocumetByLoanTypeId = async (selectOption) => {
    const token = localStorage.getItem("logintoken");
    try {
      const response = await API.post(
        `/LoanApplication/GetBankAndDocumetByLoanTypeId`,
        {
          loanTypeId: selectOption,
        }
      );
      const { data } = response;


      // if (data?.value?.bank?.length > 0) {
      //   setBankOption([...data.value.bank]);
      //   // setEligiblity(true);
      // } else {
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
      const Docresponse = await API.get(
        `/LoanApplication/GetDocumentByLoanApplicationId?loanApplicationId=${id}`
      );
      setUploadedExist(Docresponse?.data?.value);
      setOtherDocumentId(data?.value?.otherDocumentId);
    } catch (error) {
      console.log(error);
      Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };

  const initialValues = {
    firstName:
      basicDetailState?.user?.firstName +
      " " +
      basicDetailState?.user?.lastName,
    email: basicDetailState?.user?.email,
    loanApplicationNumber:
      basicDetailState?.applicationNumberForLoan?.toUpperCase(),
    phoneNumber: basicDetailState?.user?.phoneNumber,
    loanStatus: basicDetailState?.status,
    loanTenure: basicDetailState?.tenure,
    loanAmount: basicDetailState?.amount,
    city: basicDetailState?.city,
    loanType: basicDetailState?.loanType,
    state: basicDetailState?.state,
    postalCode: basicDetailState?.postalCode,
  };

  const [docFiles, setdocFiles] = useState([]);
  const [documentFileName, setDocumentFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadedOtherDocuemnt, setuploadedOtherDocuemnt] = useState([]);
  const [selectedFilesArray, setSelectedFilesArray] = useState([]);
  const [loanTypeChanged, setLoanTypeChanged] = useState(false);
  const [fieldErrorMessages, setFieldErrorMessages] = useState({});

  const [selectedRowData, setSelectedRowData] = useState([]);
  const [totalUploadedSize, setTotalUploadedSize] = useState(0);

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

  const allowedFileTypes = [".jpg", ".jpeg", ".png", ".bmp", ".pdf"];
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
    if (loanTypeChanged) {
      const isConfirmed = window.confirm(
        "Your loan type has been changed. Are you sure you want to proceed?"
      );
      if (!isConfirmed) {
        return;
      }
    }

    try {
      const response = await API.post(
        `/LoanApplication/UpdateLoanApplication`,
        {
          loanApplicationId: id,
          loanTypeId: values.loanType,
          stateId: Number(values.state),
          amount: Number(values.loanAmount),
          tenure: Number(values.loanTenure),
          city: values?.city,
          postalCode: values?.postalCode,
          isActive: true,
        }
      );
      const { data } = response;
      setLoanTypeChanged(false);
      setSubmitting(false);
      await GetBankAndDocumetByLoanTypeId(values.loanType);
      await Notification("success", "Loan Application Updated SuccessFully");
    } catch (error) {
      console.log(error);
    }
  };
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

  const handleUploadForField = async (fieldid, name) => {
    const files = docFiles[name]; // Assuming docFiles is an object where keys are the document names and values are arrays of File objects
    if (!files || !files?.length) {
      Notification("error", "please select atleast one document");
      return;
    }
    const formData = new FormData();
    console.log(files);
    files &&
      files.forEach(async (element, index) => {
        // Here 'files' is the FormData key. It may vary based on your backend requirement.
        console.log(element);
        formData.append("DocumentTypeId", element.documentTypeId);
        formData.append("Documents", element?.file);
      });
    formData.append("LoanApplicationId", id);

    const token = localStorage.getItem("logintoken");

    try {
      const response = await API.post(
        "/LoanApplication/UploadLoanDocument",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      Notification("success", "Document uploaded successfully ");
      const newDocFiles = { ...docFiles };
      newDocFiles[name] = [];

      setdocFiles(newDocFiles);
      // setFieldValue("activeStep", 2);

      const Docresponse = await API.get(
        `/LoanApplication/GetDocumentByLoanApplicationId?loanApplicationId=${id}`
      );
      setUploadedExist(Docresponse?.data?.value);
      setUploadedFiles((prevState) => ({
        ...prevState,
        [name]: [...(prevState[name] || []), ...files],
      }));
    } catch (error) {
      console.log(error);
      Notification("error", error?.response?.data[0]?.errorMessage);
    }
  };

  const [documentData, setDocumentData] = useState([]);
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
    const files = event.target.files;

    let updatedDocumentData = [...documentData];

    // Assume the entered document name is stored in documentFileName for the given rowIndex.
    const documentName = updatedDocumentData[rowIndex].documentFileName;
    if (!documentName) {
      // Handle the case where no document name is entered by the user
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file) {
        const fileType = "." + file.name.split(".").pop().toLowerCase();

        if (allowedFileTypes.includes(fileType)) {
          // Create a new document entry with its name and file
          const newDocumentEntry = {
            name: documentName,
            file: file,
          };

          // Add the new entry to the selectedFilesArray
          updatedDocumentData[rowIndex].selectedFilesArray.push(
            newDocumentEntry
          );

          updatedDocumentData[rowIndex].errorMessage = "";
        } else {
          updatedDocumentData[rowIndex].errorMessage =
            "One or more file types are not supported";
        }
      }
    }

    // Clear the document name for the next entry
    updatedDocumentData[rowIndex].documentFileName = "";

    setDocumentData(updatedDocumentData);
  };

  const handleRemarksChange = (event, rowIndex) => {
    const newRemarks = event.target.value;
    let updatedDocumentData = [...documentData];
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

    await newFilter.forEach(async (element) => {
      const token = localStorage.getItem("logintoken");
      if (element?.remarks) {
        const formData = new FormData();
        formData.append("Remark", element?.remarks);
        formData.append("LoanApplicationId", id);
        formData.append("LoanApplicationQueryId", LoanApplicationQueryId);

        await API.post(
          "/LoanApplication/UpdateQuery",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        try {
          if (id) {
            const response = await API.get(
              `/LoanApplication/GetQueryByLoanApplicationId?id=${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const { data } = response;
            await setCommentData(data.value);
            await Notification("success", "Query submitted ");
          }
        } catch (error) {
          console.log(error);
          // Notification("error", error?.response?.data[0]?.errorMessage);
        }

        // window.location.reload();
      }
    });
  };

  const handleSubmitDocuemntQuery = async (LoanApplicationQueryId) => {
    var newFilter = documentData.filter(
      (item) => item.id === LoanApplicationQueryId
    );

    await newFilter.forEach(async (element) => {
      if (element?.selectedFilesArray?.length > 0) {
        const formData = new FormData();
        formData.append("LoanApplicationQueryId", LoanApplicationQueryId);
        formData.append("LoanApplicationId", id);
        element?.selectedFilesArray.map((doc) => {
          formData.append("Documents", doc?.file);
          formData.append("OtherDocumentName", doc?.name);

        });
        const token = localStorage.getItem("logintoken");
        if (element?.selectedFilesArray?.length > 0) {
          try {
            const response = await API.post(
              "/LoanApplication/UploadQueryDocument",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            // const { data } = response;
            Notification("success", "Document uploaded successfully ");
            await API.post(
              "/LoanApplication/UpdateQuery",
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
            try {
              if (id) {
                const response = await API.get(
                  `/LoanApplication/GetQueryByLoanApplicationId?id=${id}`,
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

            // router.push("/userDashBoard");
            // setFieldValue("activeStep", 2);
          } catch (error) {
            console.log(error);
            Notification("error", "please Select File");
          }
        }
      } else {
        Notification("error", "Please select atleast one document ");
      }
    });
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
      formData.append("LoanApplicationId", id);
      formData.append("DocumentTypeId", otherDocumentId);
      formData.append("Documents", file);
      formData.append("OtherDocumentName", name);

      // Add the ID here

      try {
        const token = localStorage.getItem("logintoken");
        const response = await API.post(
          "/LoanApplication/UploadLoanDocument",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // const { data } = response;
        Notification("success", "Document uploaded successfully ");
        // setSelectedFilesArray([]);
        setSelectedFilesArray([]);
        setDocumentFileName("");
        const Docresponse = await API.get(
          `/LoanApplication/GetDocumentByLoanApplicationId?loanApplicationId=${id}`
        );
        setUploadedExist(Docresponse?.data?.value);
        // const newUploadedDocs = [
        //   ...uploadedOtherDocuemnt,
        //   ...selectedFilesArray,
        // ];
        // setuploadedOtherDocuemnt(newUploadedDocs);
        // setFieldValue("activeStewindow.location.reload();
      } catch (error) {
        console.log(error);
        Notification("error", error?.response?.data[0]?.errorMessage);
      }
    }
  };

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = commentData?.length || "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = commentData?.slice(startIndex, endIndex) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getDocumentDetailsById = (id) => {
    var dataCheck = [];
    // console.log(uploadedExist, "-=-=-=");
    uploadedExist?.filter((item) =>
      item?.documentDetail?.filter((newItem) => {
        if (newItem.id === id) {
          dataCheck.push(newItem);
        }
      })
    );
    return dataCheck;
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
                {({ isSubmitting, values, handleChange }) => (
                  <Form>
                    <div class="row">
                      <div className="d-flex justify-content-end">
                        {/* <span className="mr-10">Loan Status - </span> */}
                        <h4
                          class={`title_text ${basicDetailState?.status === "Pending"
                            ? "Pending-text"
                            : basicDetailState?.status === "Query"
                              ? "qyery-text"
                              : basicDetailState?.status === "Reject"
                                ? "Rejected-text"
                                : basicDetailState?.status === "Approve"
                                  ? "Approved-text"
                                  : basicDetailState?.status === "Incomplete"
                                    ? "Process-text"
                                    : ""
                            }`}
                        >
                          {basicDetailState?.status === "Approve"
                            ? "Approved"
                            : basicDetailState?.status === "Reject"
                              ? "Rejected"
                              : basicDetailState?.status?.toUpperCase()}
                        </h4>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                        <label for="first-name">Loan Application Number</label>
                        <div>
                          <Field
                            type="text"
                            // initialValues={basicDetailState?.firstName}
                            name="loanApplicationNumber"
                            disabled
                            placeholder="Loan Application Number"
                          />
                          <ErrorMessage
                            name="loanApplicationNumber"
                            component="div"
                            className="error"
                          />
                        </div>
                      </div>

                      <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                        <div class="single-input">
                          <label>Loan Type</label>
                          <>
                            {loanTypeOption && loanTypeOption.length > 0 && (
                              <select
                                className="selectDrop form-select"
                                name="loanType"
                                value={values?.loanType}
                                onChange={async (e) => {
                                  handleChange(e);

                                  if (
                                    e.target.value !== initialValues.loanType
                                  ) {
                                    setLoanTypeChanged(true);
                                  } else {
                                    setLoanTypeChanged(false);
                                  }
                                  setSelectOption(e.target.value);
                                }}
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
                          {/* {errorLoanType && (
                            <p className="all_error">{errorLoanType}</p>
                          )} */}
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
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

                      <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
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
                      <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
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

                      <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
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
                      <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
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
                                  name="state"
                                  // aria-label="Default select example"
                                  value={values?.state}
                                  onChange={handleChange}
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
                          {/* {errorStateType && (
                            <p className="all_error">{errorStateType}</p>
                          )} */}
                        </div>
                      </div>
                      {/* <div class="col-lg-4 col-md-3 col-sm-12 m-basics">
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
                      </div> */}
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
              {preffredBank?.bankDetailForLoans?.length ? (
                <div class="row preferred_bank">
                  <div className="col-lg-6 col-md-6 col-sm-12 m-basics ">
                    <div class="table-section">
                      <>
                        <h5> Preferred bank</h5>
                        <table class="table mt-4 preferred_bank_table">
                          <thead>
                            <tr>
                              <th scope="col">Sr.No</th>

                              <th scope="col">Bank Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {preffredBank &&
                              preffredBank?.bankDetailForLoans?.length &&
                              preffredBank?.bankDetailForLoans.map(
                                (elm, index) => {
                                  return (
                                    <>
                                      <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{elm?.bankName}</td>
                                      </tr>
                                    </>
                                  );
                                }
                              )}
                          </tbody>
                        </table>
                      </>

                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {bankOption &&
                bankOption.filter(bank => !preffredBank?.bankDetailForLoans?.some(prefBank => prefBank.bankName === bank.name) && !selectedRowData.some(selectedRowData => selectedRowData.id === bank.id)).length ?

                <div class="table-section">
                  <span className="text-head">
                    {" "}
                    Choose other bank Preference
                  </span>

                  {/* <h4> Choose your Preference</h4> */}
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Sr.No</th>
                        <th scope="col">Bank Name</th>
                        {/* <th scope="col">Rate of interest</th> */}
                      </tr>
                    </thead>
                    <tbody>


                      <>
                        {bankOption &&
                          bankOption.filter(bank => !preffredBank?.bankDetailForLoans?.some(prefBank => prefBank.bankName === bank.name) && !selectedRowData.some(selectedRowData => selectedRowData.id === bank.id)).map((elm, index) => {
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
                        {/* <div className="align-right"> */}


                        {/* </div> */}
                      </>
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-end">

                    <button
                      type="button"
                      className="cmn-btn"
                      onClick={async () => {
                        const token =
                          localStorage.getItem("logintoken");
                        if (selectedRowData.length) {
                          try {
                            const response = await API.post(
                              `/LoanApplication/UpdateLoanApplication`,
                              {
                                isActive: true,
                                loanApplicationId:
                                  id,
                                bankIds: selectedRowData,
                                tenure: Number(basicDetailState.tenure),
                                stateId: basicDetailState?.state,
                                city: basicDetailState?.city,
                                postalCode: basicDetailState?.postalCode,
                                loanTypeId: basicDetailState?.loanType,
                                amount: Number(basicDetailState?.amount)

                              }
                            );
                            // const { id } = router.query;
                            const loanDATA = await API.get(`/LoanApplication/GetById?id=${id}`);
                            // setPreffredBank(loanDATA.value)

                            const { data } = response;

                            await Notification(
                              "success",
                              "Bank selection Submitted successfully"
                            );


                          } catch (error) {
                            console.log(error);
                          }
                        } else {
                          await Notification(
                            "error",
                            "please select bank "
                          );

                        }

                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>
                : ""}

              <div class="loan-content-body">
                <h5>Query History</h5>
                <div class="loan-section-table">
                  <div class="table-responsive">
                    <table class="table query_table">
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Query</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems &&
                          // commentData.length &&
                          currentItems.map((elm, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <span
                                    class={` ${elm?.status === "Pending"
                                      ? "Rejected-text"
                                      : elm?.status === "Query"
                                        ? "qyery-text"
                                        : elm?.status === "Reject"
                                          ? "Rejected-text"
                                          : elm?.status === "Approved"
                                            ? "Approved-text"
                                            : elm?.status === "Submitted"
                                              ? "Process-text"
                                              : ""
                                      }`}
                                  >
                                    {elm?.status?.toUpperCase()}
                                  </span>
                                </td>
                                <td>{elm?.comment}

                                  <div className="query_row_remark justify-content-start">
                                    {elm.documentList.filter((ele, i) => ele.documentSource === "Admin").length > 0 && (
                                      <ul>
                                        <h6 class="text-head text-head-query">
                                          Attached  Documents :
                                        </h6>
                                        {elm.documentList.length > 0 &&
                                          elm.documentList.filter((ele, i) => ele.documentSource === "Admin").map(
                                            (detail, i) => (
                                              <>
                                                {/* <li key={i}>{detail.otherDocumentName}-</li> */}
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

                                              </>
                                            )
                                          )}
                                      </ul>
                                    )}
                                  </div>

                                </td>
                                <td>
                                  <div>
                                    {elm?.remark ||
                                      elm?.status === "Approved" ? (
                                      <>
                                        <span>{elm?.remark}</span>
                                        <div className="query_row_remark justify-content-start">
                                          {elm.documentList.length > 0 && (
                                            <ul>
                                              {elm.documentList.length > 0 &&
                                                elm.documentList.map(
                                                  (detail, i) => (
                                                    <>
                                                      <h6 class="text-head text-head-query">
                                                        Uploaded Documents :
                                                      </h6>
                                                      <li key={i}>{detail.otherDocumentName}-</li>
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

                                                    </>
                                                  )
                                                )}
                                            </ul>
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

                                        <>
                                          <div className="query_row_remark justify-content-start">
                                            {elm.documentList.filter((ele, i) => ele.documentSource === "User").length > 0 ? (
                                              <>
                                                <h5 class="text-head text-head-query">
                                                  Uploaded Document
                                                </h5>
                                                <ul>
                                                  {elm.documentList.length > 0 &&
                                                    elm.documentList.filter((ele, i) => ele.documentSource === "User").map(
                                                      (detail, i) => (
                                                        <>

                                                          <div style={{ display: "flex" }}>

                                                            <span className="view_doc" key={i}>{detail?.otherDocumentName}-{" "}</span>
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
                                                          </div>

                                                        </>
                                                      )
                                                    )}
                                                </ul>
                                              </>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </>

                                        <>
                                          <div className="d-flex justify-content-between align-items-baseline mt-4">
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
                                            <div>
                                              <input
                                                type="file"
                                                accept=".jpg, .jpeg, .png, .bmp, .pdf"
                                                className="upload-box-userDashboard-query"
                                                multiple
                                                onChange={(event) =>
                                                  handleFileChange1(
                                                    event,
                                                    index
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="d-flex position-relative" style={{ left: "75px" }}>
                                              <button
                                                className="upload_icon"
                                                onClick={() => {
                                                  handleSubmitDocuemntQuery(
                                                    elm?.id
                                                  );
                                                }}
                                              >
                                                <i class="fa-solid fa-upload"></i>
                                              </button>
                                            </div>
                                          </div>
                                          {documentData[index]
                                            ?.errorMessage && (
                                              <p className="error">
                                                {documentData[index].errorMessage}
                                              </p>
                                            )}
                                          {documentData[index]
                                            ?.selectedFilesArray.length > 0 && (
                                              <div>
                                                <p className="text-start">
                                                  Selected File:
                                                </p>
                                                <ul>
                                                  {documentData[
                                                    index
                                                  ]?.selectedFilesArray.map(
                                                    (fileObj, fileIndex) => (
                                                      <li key={fileIndex}>
                                                        <div className="delete_div">
                                                          <b>{fileObj.name}</b> -{" "}
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
                                      </>
                                    )}
                                  </div>
                                </td>

                                <td>
                                  {" "}
                                  {!elm?.remark ||
                                    !elm?.status == "Approved" ? (
                                    <button
                                      class="cmn-btn btn "
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
                    <>
                      {!currentItems?.length && (
                        <div className="text-center">
                          <h4>No Data Found</h4>
                        </div>
                      )}
                    </>
                  </div>
                  {totalItems > itemsPerPage && (
                    <PaginationTable
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  )}
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
                {currentItems && currentItems?.length ? (
                  <span className="valid_formate">
                    * Valid File Formats JPG, JPEG, PNG, PDF <br />* Maximum
                    allowed file size is of 10MB <br />* After Selecting File,
                    click on upload button
                  </span>
                ) : (
                  ""
                )}
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
                              {/* <span className="astrisk_mark">*</span> */}
                              {data?.name}{" "}
                              {data?.instructions && (
                                <span className="instructions">
                                  <span>&#40; </span>

                                  {data?.instructions}
                                  <span>&#41; </span>
                                </span>
                              )}
                            </label>
                            <div class="input-box-userDashboard">
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
                                className="upload_icon"
                                onClick={() =>
                                  handleUploadForField(data?.id, data?.name)
                                }
                              >
                                <i class="fa-solid fa-upload"></i>
                              </button>
                            </div>
                            <div>
                              {getDocumentDetailsById(data?.id).map(
                                (docDetail, index) => {
                                  console.log(docDetail);
                                  return (
                                    <ul key={index}>
                                      <a
                                        key={docDetail.id}
                                        href={docDetail.documentURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="document_hyper_link"
                                      >
                                        {docDetail.documentName}
                                      </a>
                                    </ul>
                                  );
                                }
                              )}
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
                                        <span
                                          className="document_hyper_link"
                                          onClick={() =>
                                            handlePreviewFile(file)
                                          }
                                        >
                                          {file?.file
                                            ?.name}
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
                        </div>
                      </>
                    );
                  })}

                <div class="row">
                  <div class="my-4 col-lg-12 col-md-12 col-sm-12">
                    <h4 className="ml-0">Other Document</h4>
                    <div className="d-flex align-items-baseline flex-wrap">
                      <div className="other_doc_input">
                        <input
                          type="text"
                          placeholder="Enter document name"
                          value={documentFileName}
                          onChange={(event) =>
                            setDocumentFileName(event.target.value)
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
                            className="upload_icon"
                            onClick={handleUploadForOtherDocument}
                          >
                            <i class="fa-solid fa-upload"></i>
                          </button>
                        </div>
                      </div>

                      {/* {otherDocumentId} */}
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

                    {getDocumentDetailsById(otherDocumentId).map(
                      (docDetail, index) => {
                        return (
                          <> <ul key={index}>
                            <b>{docDetail?.otherDocumentName} - </b>
                            <a
                              key={docDetail.id}
                              href={docDetail.documentURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document_hyper_link"
                            >
                              {docDetail.documentName}
                            </a>
                          </ul></>

                        );
                      }
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="cmn-btn"
                  onClick={async () => {
                    const allUploadEmpty = Object.values(uploadedFiles).every(
                      (array) => array.length === 0
                    );

                    const hasDocumentDetails = uploadedExist.some(
                      (document) => document.documentDetail.length > 0
                    );

                    if (
                      allUploadEmpty &&
                      uploadedOtherDocuemnt.length === 0 &&
                      !hasDocumentDetails
                    ) {
                      Notification(
                        "error",
                        "Please Upload at least one document"
                      );
                    } else {

                      // Reload the page if there are document details in at least one object
                      if (hasDocumentDetails) {
                        await router.push(`/userDashBoard/viewLoan/${id}`);
                        window.location.reload();
                      } else {


                        // Handle your regular submission logic here
                        // For example, you can submit a form or perform other actions
                        // when there are no document details to reload the page
                      }
                    }
                  }}
                >
                  Submit
                </button>
                <span className="valid_formate">
                  * Valid File Formats JPG, JPEG, PNG, PDF <br />* Maximum
                  allowed file size is of 10MB <br />* After Selecting File,
                  click on upload button
                </span>
              </div>
              <></>
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
