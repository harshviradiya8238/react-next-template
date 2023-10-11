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
import API from "../../helper/API.js";

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
              state: data?.value?.stateId,
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
    fetchData();
    GetAllState();
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

  const [docFiles, setdocFiles] = useState({
    panCard: [],
    aadharFront: [],
    aadharBack: [],
  });

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
    confirmAccountNumber: Yup.string()
      .required("Confirm Account Number is required")
      .oneOf(
        [Yup.ref("accountNumber"), null],
        "Confirm Account Number and Account Number must match"
      ),
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
              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <label>
                  <span className="astrisk_mark">*</span>
                  Aadhaar Upload- Front Side
                </label>
                <div class="input-box-userDashboard ">
                  <input
                    type="file"
                    multiple
                    ref={aRef}
                    class="upload-box-userDashboard"
                    onChange={(e) => handlePanFileChange("aadharFront", e)}
                  />
                  <button
                    className="upload_icon"
                  // onClick={() =>
                  //   handleUploadForField(
                  //     data?.id,
                  //     data?.name
                  //   )
                  // }
                  >
                    <i class="fa-solid fa-upload"></i>
                  </button>
                </div>

                {docFiles?.aadharFront?.length > 0 && (
                  <div>
                    <h4>Selected files:</h4>
                    {docFiles &&
                      docFiles?.aadharFront?.map((file, index) => (
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
                                handleRemoveFile("aadharFront", index)
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
                    multiple
                    ref={aRef}
                    class="upload-box-userDashboard"
                    onChange={(e) => handlePanFileChange("aadharFront", e)}
                  />
                  <button
                    className="upload_icon"
                  // onClick={() =>
                  //   handleUploadForField(
                  //     data?.id,
                  //     data?.name
                  //   )
                  // }
                  >
                    <i class="fa-solid fa-upload"></i>
                  </button>
                </div>
                {docFiles?.aadharBack?.length > 0 && (
                  <div>
                    <h4>Selected files:</h4>
                    {docFiles &&
                      docFiles?.aadharBack?.map((file, index) => (
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
                                handleRemoveFile("aadharBack", index)
                              }
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
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
                      <label for="bank-name">Bank Name</label>
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
                      <label for="IFSC">IFSC Code</label>
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
                      <label for="ac-number">Account Number</label>
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
