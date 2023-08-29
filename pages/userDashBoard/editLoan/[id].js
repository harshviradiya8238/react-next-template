import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../../../components/utils/Notification";
import Link from "next/link";

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

  const validationSchema = Yup.object().shape({
    loanAmount: Yup.string().required("loan Amount is required"),
    loanTenure: Yup.string().required("loan Tenure is required"),
  });

  const [basicDetailState, setBasicDetailState] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    state: "",
    loanType: "",
    loanTenure: "",
    loanAmount: "",
    loanStatus: "",
  });

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
          const response = await axios.get(
            `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetById?id=${id}`,

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
        const response = await axios.get(
          "https://loancrmtrn.azurewebsites.net/api/State/GetAll"
        );
        const { data } = response;
        SetCountryStateOption(data.value);
      } catch (error) {
        console.log(error);
      }
    };
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

    GetLoanById(token);
    GetAllState();
    GetAll(token);
    // GetBankAndDocumetByLoanTypeId(selectOption);
  }, [id]);

  const GetBankAndDocumetByLoanTypeId = async (selectOption) => {
    const token = localStorage.getItem("logintoken");
    try {
      const response = await axios.post(
        `https://loancrmtrn.azurewebsites.net/api/LoanApplication/GetBankAndDocumetByLoanTypeId`,
        {
          loanTypeId: selectOption,
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
  };

  const [documentFileName, setDocumentFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFilesArray, setSelectedFilesArray] = useState([]);
  const [loanApplicationId, setLoanAppliactionId] = useState("");

  const [docFiles, setdocFiles] = useState([]);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!selectOption) {
      setErrorLoanType("Please Select Loan Type.");
    }
    if (!countryState) {
      setErrorStateType("Please Select State");
    }

    const token = localStorage.getItem("logintoken");

    try {
      const response = await axios.post(
        `https://loancrmtrn.azurewebsites.net/api/LoanApplication/UpdateLoanApplication`,
        {
          loanApplicationId: id,
          loanTypeId: selectOption,
          stateId: Number(countryState),
          amount: Number(values.loanAmount),
          tenure: Number(values.loanTenure),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  };

  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
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

        formData.append("LoanApplicationId", id);
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
          // setFieldValue("activeStep", 2);
        } catch (error) {
          console.log(error);
          Notification("error", error?.response?.data[0]?.errorMessage);
        }
      });
    } else {
      Notification("error", "Please select atLeast one document ");
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
    //   Notification("error", "Please select atLeast one document ");
    // }
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
                {({ isSubmitting }) => (
                  <Form>
                    <div class="row">
                      <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                        <label for="first-name">Name</label>
                        <Field
                          type="text"
                          // initialValues={basicDetailState?.firstName}
                          name="firstName"
                          disabled
                          placeholder="Enter Your First Name"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="error"
                        />
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
                            <p style={{ color: "red" }}>{errorLoanType}</p>
                          )}
                        </div>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                        <label for="email">E-mail</label>
                        <Field
                          type="text"
                          name="email"
                          disabled
                          placeholder="Enter Your First Name"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                        <label for="phone">Contact No</label>
                        <div className="mobile-number-input">
                          <img
                            src="/images/india_2.png"
                            className="indiaFlag"
                          />
                          <span className="country-code">+91</span>
                          <Field
                            type="text"
                            name="phoneNumber"
                            disabled
                            placeholder="Enter Your Mobile Number"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="error"
                          />
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
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
                            <p style={{ color: "red" }}>{errorStateType}</p>
                          )}
                        </div>
                      </div>
                      <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
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
                      <div class="col-lg-3 col-md-3 col-sm-12 m-basics">
                        <label for="Loan-Amount">Loan Amount</label>

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
                          <label for="term">Loan Tenure</label>
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
                <h5>Comment History</h5>
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
                            <input
                              type="text"
                              placeholder="Enter your comment "
                            />
                          </td>
                          <td>
                            {" "}
                            <button class="table-btn btn ">Submit</button>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <span class="all-btn Re-Active-btn">
                              ReActivate
                            </span>
                          </td>
                          <td>GST Certificate not match</td>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter your comment "
                            />
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
                            <input
                              type="text"
                              placeholder="Enter your comment "
                            />
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
                            <h4>{data?.name}</h4>
                            <div class="input-box ">
                              <input
                                type="file"
                                multiple
                                accept=".jpg, .jpeg, .png, .bmp, .pdf"
                                // ref={aRef}
                                class="upload-box"
                                onChange={(e) =>
                                  handlePanFileChange(data?.name, e, data?.id)
                                }
                              />
                            </div>
                          </div>
                          {docFiles[data?.name]?.length > 0 && (
                            <div>
                              <h4>Selected files:</h4>
                              {docFiles[data?.name] &&
                                docFiles[data?.name]?.map((file, index) => (
                                  <div key={index}>
                                    <div className="selectfile">
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

                                      <button
                                        class="delete_button"
                                        onClick={() =>
                                          handleRemoveFile(data?.name, index)
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                      >
                                        Delete
                                      </button>
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
                                ))}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })}
                <div class="my-4 col-lg-12 col-md-12 col-sm-12">
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
                        }}
                        onClick={handleUpload}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                  <>{errorMessage && <p className="error">{errorMessage}</p>}</>
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
                                onClick={() => handlePreviewFile(fileObj.file)}
                              >
                                {fileObj.file.name}
                              </span>
                              <button
                                class="delete_button"
                                onClick={() =>
                                  handleRemoveOtherDocumentFile(fileObj.file)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                          <input
                            type="text"
                            placeholder="Enter your comment "
                          />
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
                          <input
                            type="text"
                            placeholder="Enter your comment "
                          />
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
                          <input
                            type="text"
                            placeholder="Enter your comment "
                          />
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
