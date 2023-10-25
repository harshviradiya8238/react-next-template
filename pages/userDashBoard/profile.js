import React, { useMemo, useRef } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { CountryDropdown, CountrySelect } from "react-select-country-flag";
import Select from "react-select";
import countryList from "react-select-country-list";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Notification from "../../components/utils/Notification";
import Link from "next/link";
import Preloader from "../../components/preloader/Preloader";
import API from "../../helper/API";

function Profile() {
  const aRef = useRef(null);

  const [activeTab, setActiveTab] = useState("basic"); // 'basic' for Basic Details, 'kyc' for KYC Details

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  const changeHandler = (value) => {
    setValue(value);
  };

  const [profileState, setProfileState] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [accountState, setAccountState] = useState({
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
  });
  const [key, setKey] = useState("home");
  const [countryStateOption, SetCountryStateOption] = useState("");
  const [documentOption, setDocumentOption] = useState("");
  // const [countryState, SetCountryState] = useState("");
  const [errorStateType, setErrorStateType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {
          const userData = jwtDecode(token);
          const response = await API.get(
            `/User/GetById?userId=${userData?.UserDetails?.Id}`
            // {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // }
          );
          const { data } = response;
          if (data?.success) {
            setProfileState({
              ...data.value,
              state: data?.value?.stateId ? data?.value?.stateId : "",
            });
            setAccountState(data.value);
            // SetCountryState(data?.value?.stateId);
          }
          return response;
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
    const GetAllKycDocOption = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {

          const userData = jwtDecode(token);
          const Docresponse = await API.get(
            `/DocumentType/GetAll`, {
            entityType: 1,
            entityId: userData?.UserDetails?.Id,
          }
          );
          const filteredDocuments = Docresponse?.data?.value.filter(doc =>
            doc.name === "Adhar Card" || doc.name === "Pan card"
          );
          console.log(filteredDocuments);
          setDocumentOption(filteredDocuments);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const GetAllKycDocument = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {

          const userData = jwtDecode(token);
          const Docresponse = await API.post(
            `/Document/GetDocuments`, {
            entityType: 1,
            entityId: userData?.UserDetails?.Id,
          }
          );
          setDocumentresponse(Docresponse?.data?.value);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    GetAllState();
    GetAllKycDocument()
    GetAllKycDocOption()
  }, []);

  const handleKycOnchange = () => { };

  // useEffect(() => {
  //   setProfileState({
  //     firstName: userInfo?.firstName,
  //     phoneNumber: userInfo?.phoneNumber,
  //     email: userInfo?.email,
  //   });
  // }, [userInfo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [docFiles, setdocFiles] = useState(
    {
      'Adhar Card': { front: [], back: [] },
      // ... other document types
    }
  );
  const [documentResponse, setDocumentresponse] = useState([]);
  // const handlePanFileChange = (fieldType, event) => {
  //   const selectedFiles = [...event.target.files];
  //   const updatedFiles = selectedFiles.slice(0, 3);
  //   setdocFiles((prevState) => ({
  //     ...prevState,
  //     [fieldType]: updatedFiles,
  //   }));
  // };

  // const handleRemoveFile = (fieldType, index) => {
  //   setdocFiles((prevState) => ({
  //     ...prevState,
  //     [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
  //   }));
  // };

  const handleFileChange = (type, side, e) => {
    if (type === "Adhar Card" && (side === 'front' || side === 'back')) {
      let updatedAadhar = { ...docFiles[type] };
      updatedAadhar[side] = [...e.target.files];
      setdocFiles({ ...docFiles, [type]: updatedAadhar });
    } else {
      setdocFiles({ ...docFiles, [type]: [...e.target.files] });
    }
  };

  const handleRemoveFile = (type, side, index) => {
    if (type === "Adhar Card" && (side === 'front' || side === 'back')) {
      let updatedAadhar = { ...docFiles[type] };
      let filesForSide = [...updatedAadhar[side]];
      filesForSide.splice(index, 1);
      updatedAadhar[side] = filesForSide;
      setdocFiles({ ...docFiles, [type]: updatedAadhar });
    } else {
      let files = [...docFiles[type]];
      files.splice(index, 1);
      setdocFiles({ ...docFiles, [type]: files });
    }
  };

  const initialValues = {
    firstName: profileState?.firstName,
    lastName: profileState?.lastName,
    email: profileState?.email,
    phoneNumber: profileState?.phoneNumber.replace(/91/g, ""),
    addressLine1: profileState?.addressLine1,
    addressLine2: profileState?.addressLine2,
    city: profileState?.city,
    state: profileState?.state,
    zipCode: profileState?.zipCode,
  };
  const initialValuesAccount = {
    bankName: accountState?.bankName,
    accountNumber: accountState?.accountNumber,
    confirmAccountNumber: accountState?.confirmAccountNumber,
    ifscCode: accountState?.ifscCode,
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    // email: Yup.string().email("Invalid email").required("Email is required"),
    // phoneNumber: Yup.string()
    //   .matches(/^\d{10}$/, "Please enter 10 digits")
    //   .required("Phone Number is required"),
    // addressLine1: Yup.string().required("Address Line 1 is required"),
    // addressLine2: Yup.string().required("Address Line 2 is required"),
    city: Yup.string().required("City is required"),
    zipCode: Yup.string().required("Pincode is required"),
  });

  const validationSchemaAccount = Yup.object().shape({
    bankName: Yup.string().required("Bank Name is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    // confirmAccountNumber: Yup.string()
    //   .required("Confirm Account Number is required")
    //   .oneOf(
    //     [Yup.ref("accountNumber"), null],
    //     "Confirm Account Number and Account Number must match"
    //   ),
    ifscCode: Yup.string().required("IFSC is required"),
  });

  const handleSubmit = async (values, setSubmitting) => {
    const token = localStorage.getItem("logintoken");

    try {
      const userData = jwtDecode(token);

      const response = await API.post(
        "/User/UpdateUserBasicDetail",
        {
          id: userData?.UserDetails?.Id,
          firstName: values?.firstName,
          lastName: values?.lastName,
          addressLine1: values?.addressLine1 ? values?.addressLine1 : "",
          addressLine2: values?.addressLine2 ? values?.addressLine2 : "",
          city: values?.city,
          stateId: Number(values?.state),
          zipCode: values?.zipCode,
          isActive: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;

      await setKey("profile");
      // setSubmitting(false);
      Notification("success", "Profile Updated SuccessFully");
    } catch (error) {
      console.log(error);
      // Notification("error", "Please Enter All Field");

      // Notification("error", error?.response?.data[0]?.errorMessage);
    }
    // console.log(values);
    // setTimeout(() => {
    //   // alert(JSON.stringify(values, null, 2));
    //   setSubmitting(false);
    // }, 400);
  };
  const handleSubmitAccountDetails = async (values, { setSubmitting }) => {
    const token = localStorage.getItem("logintoken");

    console.log(documentOption);
    const ADHAAR_ID = documentOption.find(doc => doc.name === "Adhar Card")?.id;
    const PAN_ID = documentOption.find(doc => doc.name === "Pan card")?.id;
    if (!ADHAAR_ID || !PAN_ID) {
      return Notification("error", "Error retrieving document IDs");
    }
    // Check for Aadhaar card's front side
    const aadharFrontDocuments = getDocumentDetailsById("Adhar Card", ADHAAR_ID, true);
    if (aadharFrontDocuments.length === 0) {
      return Notification("error", "Please Upload Aadhaar Front Side Proof");
    }

    // Check for Aadhaar card's back side
    const aadharBackDocuments = getDocumentDetailsById("Adhar Card", ADHAAR_ID, false);
    if (aadharBackDocuments.length === 0) {
      return Notification("error", "Please Upload Aadhaar Back Side Proof");
    }

    // Check for PAN card
    const panDocuments = getDocumentDetailsById("Pan card", PAN_ID);
    if (panDocuments.length === 0) {
      return Notification("error", "Please Upload PAN card");
    }
    try {
      const userData = jwtDecode(token);
      const response = await API.post(
        "/User/UpdateUserKYCDetail",
        {
          id: userData?.UserDetails?.Id,
          bankName: values?.bankName,
          accountNumber: values?.accountNumber,
          ifscCode: values?.ifscCode,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      const { data } = response;
      await setKey("home");
      setSubmitting(false);
      Notification("success", "Profile Updated SuccessFully");
    } catch (error) {
      console.log(error);
      // Notification("error", "Please Enter All Field");
      // Notification("error", error?.response?.data[0]?.errorMessage);
    }

    setTimeout(() => {
      // alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };

  const handleSelectStateoption = ({ target }) => {
    setProfileState((oldState) => {
      return { ...oldState, countryState: target.value };
    });
    // SetCountryState(target.value);
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

  const handleInput = (event) => {
    event.target.value = event.target.value.toUpperCase();
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
  const getCityByPincode = async (pincode) => {
    try {
      const response = await axios.get(
        `https://dev.yowza.international/location/details/${pincode}`
      );
      // Assuming the response object has a field `city` that contains the city name
      const { places, state, country, City } = response.data.data;
      return City;
    } catch (error) {
      Notification("error", "Invalid Pincode");
      console.error("An error occurred while fetching data: ", error);
      return null;
    }
  };



  const handleUploadForField = async (type, docid) => {


    const token = localStorage.getItem("logintoken");
    const userData = jwtDecode(token);

    // const url = 'YOUR_API_ENDPOINT'; // replace with your API endpoint
    console.log(docFiles, "][][]");
    const formData = new FormData();
    const filesArray = type === "front" || type === "back"
      ? docFiles["Adhar Card"][type === "front" ? "front" : "back"]
      : docFiles[type];

    if (Array.isArray(filesArray)) {
      filesArray.forEach((file) => {
        formData.append('Files', file);
      });
    }

    formData.append("EntityType", Number(1))
    formData.append('EntityId', userData?.UserDetails?.Id);
    formData.append('DocumentTypeId', docid);
    formData.append('IsFront', type === 'front' ? true : false);

    try {
      const response = await API.post(
        `/Document/UploadDocument`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      Notification("success", "Document uploaded successfully ");
      const Docresponse = await API.post(
        `/Document/GetDocuments`, {
        entityType: 1,
        entityId: userData?.UserDetails?.Id,
      }
      );
      setDocumentresponse(Docresponse?.data?.value)
      setdocFiles([])
      // console.log('Upload Successful: ', response.data);
    } catch (error) {
      console.log('Error in uploading file: ', error);
    }

  };


  const getDocumentIdByName = (docName) => {
    const doc = documentOption.find(d => d.name === docName);
    return doc ? doc.id : null;
  }
  // const getDocumentDetailsById = () => {
  //   var dataCheck = [];
  //   documentResponse?.filter((item) => {
  //     if (item.documentTypeId === "c5f357d2-f481-4763-bb9d-202783279c36") {
  //       dataCheck.push(item);
  //     }
  //   }
  //   );
  //   return dataCheck;
  // };

  const getDocumentDetailsById = (docName, typeId, isFront) => {
    const dataCheck = documentResponse?.filter(item =>
      item.documentTypeId === typeId &&
      (docName === 'Adhar Card' ? item.isFront === isFront : true)
    );
    return dataCheck || [];
  };


  return (
    <div class="profile-page-section">
      <Preloader />
      <Tabs
        id="fill-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      // className="mb-3"
      >
        <Tab eventKey="home" title="Basic Details">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              isSubmitting,
              values,
              handleChange,
              errors,
              setFieldValue,
            }) => (
              <Form class="form">
                {/* <div class="col-1 mx-auto mb-2">
                  <img src="/images/user.png" alt="" />
                </div> */}
                <div class="row">
                  <h3 class="text-head">Basic Details</h3>
                  <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                    <label for="first-name">First Name</label>
                    <Field
                      id="firstName"
                      type="text"
                      name="firstName"
                      onChange={handleChange}
                      placeholder="Enter First Name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                    <label for="last-name">Last Name</label>
                    <Field
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                    <label for="phone">Contact No</label>

                    <div className="mobile-number-input">
                      {/* <img src="/images/india_2.png" className="indiaFlag" />
                      <span className="country-code">+91</span> */}
                      <Field
                        type="text"
                        name="phoneNumber"
                        // onChange={handleChange}
                        disabled
                        placeholder="Enter  Contact Number"
                      />
                    </div>

                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                    <label for="email">E-mail</label>

                    <Field
                      type="email"
                      name="email"
                      // onChange={handleChange}
                      disabled
                      placeholder="Enter  Email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>
                <div class="row">
                  <h3 class="text-head">Address</h3>
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                    <label for="address"> Address Line 1 :</label>

                    <Field
                      type="text"
                      name="addressLine1"
                      placeholder="Address Line 1"
                      onChange={handleChange}
                    />
                    {/* <ErrorMessage
                      name="addressLine1"
                      component="div"
                      className="error"
                    /> */}
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                    <label for="address-2"> Address Line 2 :</label>
                    <Field
                      type="text"
                      name="addressLine2"
                      placeholder="Address Line 2"
                      onChange={handleChange}
                    />
                    {/* <ErrorMessage
                      name="addressLine2"
                      component="div"
                      className="error"
                    /> */}
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12 m-basics">
                    <label for="phone">Pincode:</label>

                    <Field
                      type="number"
                      name="zipCode"
                      maxLength="6"
                      placeholder="Plese Enter Pincode"
                      onChange={async (e) => {
                        handleChange(e);
                        const pincode = e.target.value;

                        // Assuming getCityByPincode is a function that fetches city based on pincode
                        if (pincode.length === 6) {
                          const city = await getCityByPincode(pincode);
                          if (city) {
                            setFieldValue("city", city);
                          }
                        }
                      }}
                      onKeyPress={(event) => {
                        handleKeyPress(event);
                      }}
                    />
                    <ErrorMessage
                      name="zipCode"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12 m-basics">
                    <label for="phone">City:</label>

                    <Field
                      type="text"
                      name="city"
                      onChange={handleChange}
                      placeholder="Plese Enter  City"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div class="col-lg-4 col-md-4 col-sm-12 m-basics">
                    <label for="phone">State:</label>
                    <>
                      {countryStateOption && countryStateOption.length > 0 && (
                        <select
                          className="selectDrop form-select"
                          // aria-label="Default select example"
                          name="state"
                          value={values?.state}
                          onChange={handleChange}
                        // initialValues={values?.state}
                        // onChange={handleSelectStateoption}
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

                <div class="btn-section">
                  <button
                    type="submit"
                    class="profile-btn me-3"
                  // disabled={isSubmitting}
                  >
                    Save
                  </button>
                  <Link href="/userDashBoard">
                    <button class="profile-btn">Cancel</button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Tab>
        <Tab eventKey="profile" title="KYC Details">
          <div class="form">
            <div className="row">

              {documentOption && documentOption.map((doc, index) => (
                <>
                  {doc.name === "Adhar Card" ? (
                    <>
                      <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                        <label>
                          <span className="astrisk_mark">*</span>
                          Aadhaar Upload- Front Side
                        </label>
                        <div class="input-box-userDashboard ">
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png, .bmp, .pdf"
                            multiple
                            ref={aRef}
                            class="upload-box-userDashboard"
                            onChange={(e) => handleFileChange(doc.name, "front", e)}  // for Aadhar front

                          />
                          <button
                            className="upload_icon"
                            onClick={() => handleUploadForField("front", getDocumentIdByName("Adhar Card"))}

                          >
                            <i class="fa-solid fa-upload"></i>
                          </button>
                        </div>
                        {getDocumentDetailsById(doc.name, doc.id, true).map(
                          (docDetail, index) => {

                            return (
                              <ul key={index}>
                                <a
                                  key={docDetail.id}
                                  href={docDetail.documentName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="document_hyper_link"
                                >
                                  {docDetail.originalName}
                                </a>
                              </ul>
                            );
                          }
                        )}

                        {docFiles?.["Adhar Card"]?.front?.length > 0 && (
                          <div>
                            <h4>Selected files:</h4>
                            {docFiles &&
                              docFiles["Adhar Card"]?.front.map((file, index) => (
                                <div key={index}>
                                  <div className="selectfile">
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
                                    <i
                                      class="delete_button fa-solid fa-xmark"
                                      onClick={() =>
                                        handleRemoveFile(doc.name, "front", index)  // for Aadhar back

                                      }
                                      style={{ cursor: "pointer" }}
                                    ></i>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                        <label>
                          <span className="astrisk_mark">*</span>
                          Aadhaar Upload- Back Side
                        </label>
                        <div class="input-box-userDashboard ">
                          <input
                            type="file"
                            accept=".jpg, .jpeg, .png, .bmp, .pdf"
                            multiple
                            ref={aRef}
                            class="upload-box-userDashboard"
                            onChange={(e) => handleFileChange(doc.name, "back", e)}   // for Aadhar back

                          />
                          <button
                            className="upload_icon"
                            onClick={() => handleUploadForField("back", getDocumentIdByName("Adhar Card"))}

                          >
                            <i class="fa-solid fa-upload"></i>
                          </button>
                        </div>
                        {getDocumentDetailsById(doc.name, doc.id, false).map(
                          (docDetail, index) => {
                            return (
                              <ul key={index}>
                                <a
                                  key={docDetail.id}
                                  href={docDetail.documentName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="document_hyper_link"
                                >
                                  {docDetail.originalName}
                                </a>
                              </ul>
                            );
                          }
                        )}
                        {docFiles?.["Adhar Card"]?.back?.length > 0 && (
                          <div>
                            <h4>Selected files:</h4>
                            {docFiles &&
                              docFiles?.["Adhar Card"]?.back?.map((file, index) => (
                                <div key={index}>
                                  <div className="selectfile">
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
                                    <i
                                      class="delete_button fa-solid fa-xmark"
                                      onClick={() =>
                                        handleRemoveFile(doc.name, "back", index)
                                      }
                                      style={{ cursor: "pointer" }}
                                    ></i>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </>) :

                    <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                      <label>
                        <span className="astrisk_mark">*</span>
                        {doc.name}
                      </label>
                      <div class="input-box-userDashboard">
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png, .bmp, .pdf"
                          ref={aRef}
                          class="upload-box-userDashboard"
                          onChange={(e) => handleFileChange(doc.name, null, e)}     // for other documents

                        />
                        <button
                          className="upload_icon"
                          onClick={() => handleUploadForField(doc.name, getDocumentIdByName(doc.name))}

                        >
                          <i class="fa-solid fa-upload"></i>
                        </button>
                      </div>
                      <div>
                        {
                          docFiles?.[doc.name]?.length > 0 && (
                            <>
                              <h4>Selected files:</h4>
                              {docFiles?.[doc.name]?.map((file, index) => (
                                <div key={index}>
                                  <div className="selectfile">
                                    <span
                                      className="document_hyper_link"
                                      onClick={() => handlePreviewFile(file)}
                                    >
                                      {file?.name}
                                    </span>
                                    <i
                                      class="delete_button fa-solid fa-xmark"
                                      onClick={() => handleRemoveFile(doc.name, index)}
                                      style={{ cursor: "pointer" }}
                                    ></i>
                                  </div>
                                </div>
                              ))}
                            </>
                          )
                        }
                        {getDocumentDetailsById(doc.name, doc.id, false).map(
                          (docDetail, index) => {
                            return (
                              <ul key={index}>
                                <a
                                  key={docDetail.id}
                                  href={docDetail.documentName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="document_hyper_link"
                                >
                                  {docDetail.originalName}
                                </a>
                              </ul>
                            );
                          }
                        )}
                      </div>
                    </div>
                  }
                </>
              ))}

            </div>

            <Formik
              initialValues={initialValuesAccount}
              validationSchema={validationSchemaAccount}
              onSubmit={handleSubmitAccountDetails}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form>
                  <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                      <label for="bank-name"><span className="astrisk_mark">
                        *
                      </span>Bank Name</label>
                      <Field
                        type="text"
                        name="bankName"
                        placeholder="Bank Name"
                      />
                      <ErrorMessage
                        name="bankName"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                      <label for="IFSC"><span className="astrisk_mark">
                        *
                      </span>IFSC Code</label>
                      <Field
                        type="text"
                        name="ifscCode"
                        placeholder="Bank IFSC Code"
                        onInput={handleInput}
                        onKeyPress={(event) => {
                          var charCode = event.which
                            ? event.which
                            : event.keyCode;

                          if (
                            event.key === " " ||
                            event.target.value.length > 10
                          ) {
                            event.preventDefault(); // Prevent space input
                          }
                        }}
                      />
                      <ErrorMessage
                        name="ifscCode"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                      <label for="ac-number"><span className="astrisk_mark">
                        *
                      </span>Account Number</label>
                      <Field
                        type={"number"}
                        name="accountNumber"
                        placeholder="Bank Account Number"
                      />
                      <ErrorMessage
                        name="accountNumber"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                      <label for="ac-number">Confirm Account Number</label>
                      <Field
                        type={"number"}
                        name="confirmAccountNumber"
                        placeholder="Confirm Account Number"
                      />
                      <ErrorMessage
                        name="confirmAccountNumber"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div class="btn-section">
                      <button
                        type="submit"
                        class="profile-btn me-3"
                        disabled={isSubmitting}
                      >
                        Save
                      </button>
                      <Link href="/userDashBoard">
                        <button class="profile-btn">Cancel</button>
                      </Link>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Profile;
