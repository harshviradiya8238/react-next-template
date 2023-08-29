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
  const [countryState, SetCountryState] = useState("");
  const [errorStateType, setErrorStateType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {
          const userData = jwtDecode(token);
          const response = await axios.get(
            `https://loancrmtrn.azurewebsites.net/api/User/GetById?userId=${userData?.UserDetails?.Id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { data } = response;
          if (data?.success) {
            setProfileState(data.value);
            setAccountState(data.value);
            SetCountryState(data?.value?.stateId);
          }
          return response;
        }
      } catch (error) {
        console.log(error);
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
    fetchData();
    GetAllState();
  }, []);

  const handleKycOnchange = () => {};

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
    state: countryState,
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
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Please enter 10 digits")
      .required("Phone Number is required"),
    addressLine1: Yup.string().required("Address Line 1 is required"),
    city: Yup.string().required("City is required"),
    zipCode: Yup.string().required("Zip Code is required"),
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

  const handleSubmit = async (values, { setSubmitting }) => {
    const token = localStorage.getItem("logintoken");
    try {
      const userData = jwtDecode(token);
      const response = await axios.post(
        "https://loancrmtrn.azurewebsites.net/api/User/UpdateUserBasicDetail",
        {
          id: userData?.UserDetails?.Id,
          firstName: values?.firstName,
          lastName: values?.lastName,
          email: values?.email,
          phoneNumber: Number(values?.phoneNumber),
          addressLine1: values?.addressLine1,
          addressLine2: values?.addressLine2,
          city: values?.city,
          stateId: Number(countryState),
          zipCode: values?.zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = response;

      await setKey("profile");
      setSubmitting(false);
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
      const response = await axios.post(
        "https://loancrmtrn.azurewebsites.net/api/User/UpdateUserKYCDetail",
        {
          id: userData?.UserDetails?.Id,
          bankName: values?.bankName,
          accountNumber: values?.accountNumber,
          ifscCode: values?.ifscCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    SetCountryState(target.value);
    setErrorStateType("");
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
            {({ isSubmitting }) => (
              <Form class="form">
                <div class="col-1 mx-auto mb-2">
                  <img src="/images/user.png" alt="" />
                </div>
                <div class="row">
                  <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                    <label for="first-name">First Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      disabled
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
                      disabled
                      placeholder="Enter Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                    <label for="email">E-mail</label>

                    <Field
                      type="email"
                      name="email"
                      disabled
                      placeholder="Enter  Email"
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
                      <img src="/images/india_2.png" className="indiaFlag" />
                      <span className="country-code">+91</span>
                      <Field
                        type="text"
                        name="phoneNumber"
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
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                    <label for="phone">City:</label>

                    <Field
                      type="text"
                      name="city"
                      placeholder="Plese Enter  City"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                    <label for="address"> Address Line 1 :</label>

                    <Field
                      type="text"
                      name="addressLine1"
                      placeholder="Address Line 1"
                    />
                    <ErrorMessage
                      name="addressLine1"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                    <label for="address-2"> Address Line 2 :</label>
                    <Field
                      type="text"
                      name="addressLine2"
                      placeholder="Address Line 2"
                    />
                  </div>

                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                    <label for="phone">State:</label>
                    <>
                      {countryStateOption && countryStateOption.length > 0 && (
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
                  <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                    <label for="phone">Zip/Postal Code:</label>

                    <Field
                      type="number"
                      name="zipCode"
                      placeholder="Plese Enter zipCode"
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
              </Form>
            )}
          </Formik>
        </Tab>
        <Tab eventKey="profile" title="KYC Details">
          <div class="form">
            <div className="d-flex">
              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Front Side</h4>
                <div class="input-box ">
                  <input
                    type="file"
                    multiple
                    ref={aRef}
                    class="upload-box"
                    onChange={(e) => handlePanFileChange("aadharFront", e)}
                  />
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
                            <button
                              class="delete_button"
                              onClick={() =>
                                handleRemoveFile("aadharFront", index)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Back Side</h4>
                <div class="input-box ">
                  <input
                    type="file"
                    multiple
                    ref={aRef}
                    class="upload-box"
                    onChange={(e) => handlePanFileChange("aadharBack", e)}
                  />
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
                            <button
                              class="delete_button"
                              onClick={() =>
                                handleRemoveFile("aadharBack", index)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div class="row">
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
          </div>
        </Tab>
      </Tabs>
    </div>

    // <div class="profile-page-section">
    //   <Nav variant="tabs" defaultActiveKey="basic">
    //     <Nav.Item>
    //       <Nav.Link eventKey="basic" onSelect={() => handleTabChange("basic")}>
    //         Basic Details
    //       </Nav.Link>
    //     </Nav.Item>
    //     <Nav.Item>
    //       <Nav.Link eventKey="kyc" onSelect={() => handleTabChange("kyc")}>
    //         KYC Details
    //       </Nav.Link>
    //     </Nav.Item>
    //   </Nav>

    //   <Tab.Content style={{ display: "block" }}>
    //     <Tab.Pane eventKey="basic">
    //       {/* Render Basic Details Form */}

    //       <Formik
    //         initialValues={initialValues}
    //         validationSchema={validationSchema}
    //         onSubmit={handleSubmit}
    //         enableReinitialize
    //       >
    //         {({ isSubmitting }) => (
    //           <Form>
    //             <div class="col-1 mx-auto mb-2">
    //               <img src="/images/user.png" alt="" />
    //             </div>
    //             <div class="row">
    //               <div
    //                 class="col-lg
    //           -4 col-md-6 col-sm-12 m-basics"
    //               >
    //                 <label for="first-name">First Name</label>
    //                 {/* <input
    //               type="text"
    //               id="first-name"
    //               name="firstName"
    //               placeholder="John Test"
    //               value={profileState.firstName}
    //               onChange={handleChange}
    //               required
    //             /> */}
    //                 <Field type="text" name="firstName" />
    //                 <ErrorMessage
    //                   name="firstName"
    //                   component="div"
    //                   className="error"
    //                 />
    //               </div>
    //               <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
    //                 <label for="email">E-mail</label>
    //                 {/* <input
    //               type="email"
    //               id="email"
    //               placeholder="johntest@gmail.com"
    //               name="email"
    //               onChange={handleChange}
    //               value={profileState?.email}
    //               required
    //             /> */}
    //                 <Field type="email" name="email" />
    //                 <ErrorMessage
    //                   name="email"
    //                   component="div"
    //                   className="error"
    //                 />
    //               </div>

    //               <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
    //                 <label for="phone">Contact No</label>
    //                 {/* <input
    //               type={"number"}
    //               id="number"
    //               // placeholder=""
    //               name="Phone"
    //               onChange={handleChange}
    //               value={profileState?.email}
    //               required
    //             /> */}
    //                 {/* <PhoneInput
    //               style={{
    //                 borderLeft: "1px solid #eef1ff",
    //                 borderTop: "1px solid #eef1ff",
    //                 borderBottom: "1px solid #eef1ff",
    //               }}
    //               international
    //               name="phoneNumber"
    //               defaultCountry="IN"
    //               placeholder="+91 9999999999"
    //               value={profileState?.phoneNumber}
    //               onChange={setPhoneValue}
    //             /> */}
    //                 <Field type="text" name="phoneNumber" />
    //                 <ErrorMessage
    //                   name="phoneNumber"
    //                   component="div"
    //                   className="error"
    //                 />
    //               </div>
    //             </div>
    //             <div class="row">
    //               <div class="col-lg-12 col-md-12 col-sm-12 m-basics">
    //                 <label for="address"> Address Line 1 :</label>
    //                 {/* <input
    //               id="address"
    //               placeholder="A-301 Santosa Heights"
    //               name="address1"
    //               rows="1"
    //               value={profileState?.address1}
    //               onChange={handleChange}
    //             ></input> */}
    //                 <Field type="text" name="addressLine1" />
    //                 <ErrorMessage
    //                   name="addressLine1"
    //                   component="div"
    //                   className="error"
    //                 />
    //               </div>
    //             </div>
    //             <div className="row">
    //               <div class="col-lg-12 col-md-12 col-sm-12 m-basics">
    //                 <label for="address-2"> Address Line 2 :</label>
    //                 {/* <input
    //               id="address-2"
    //               name="address2"
    //               placeholder="near Royal Farm,satellite"
    //               rows="1"
    //               value={profileState?.address2}
    //               onChange={handleChange}
    //             ></input> */}
    //                 <Field type="text" name="addressLine2" />
    //               </div>
    //             </div>

    //             <div class="row">
    //               <div class="col-lg-3 col-md-6 col-sm-12 m-basics">
    //                 <label for="phone">City:</label>
    //                 {/* <input
    //               type="text"
    //               placeholder="Surat"
    //               id="city"
    //               value={profileState?.city}
    //               name="city"
    //               onChange={handleChange}
    //               // value="9237781246"
    //               required
    //             /> */}
    //                 <Field type="text" name="city" />
    //                 <ErrorMessage
    //                   name="city"
    //                   component="div"
    //                   className="error"
    //                 />
    //               </div>
    //               <div class="col-lg-3 col-md-6 col-sm-12 m-basics">
    //                 <label for="phone">State:</label>
    //                 {/* <input
    //               type="text"
    //               value={profileState?.state}
    //               id="state"
    //               placeholder="Gujarat"
    //               name="state"
    //               onChange={handleChange}
    //               // value="9237781246"
    //               required
    //             /> */}
    //                 <Field type="text" name="state" />
    //                 <ErrorMessage
    //                   name="state"
    //                   component="div"
    //                   className="error"
    //                 />
    //               </div>

    //               <div class="col-lg-3 col-md-6 col-sm-12 m-basics">
    //                 <label for="phone">Zip/Postal Code:</label>
    //                 {/* <input
    //               type="text"
    //               id="zip"
    //               placeholder="394101"
    //               name="zipCode"
    //               value={profileState?.zip}
    //               onChange={handleChange}
    //               // value="9237781246"
    //               required
    //             /> */}
    //                 <Field type="text" name="zipCode" />
    //                 <ErrorMessage
    //                   name="zipCode"
    //                   component="div"
    //                   className="error"
    //                 />
    //               </div>
    //             </div>

    //             <div class="btn-section">
    //               <button
    //                 type="submit"
    //                 class="profile-btn"
    //                 disabled={isSubmitting}
    //               >
    //                 Save
    //               </button>
    //             </div>
    //           </Form>
    //         )}
    //       </Formik>
    //     </Tab.Pane>
    //     <Tab.Pane eventKey="kyc">
    //       {/* Render KYC Details Form */}
    //       <div
    //         // class="tab-pane fade kyc-details"
    //         id="nav-kyc"
    //         // role="tabpanel"
    //         aria-labelledby="nav-kyc-tab"
    //         tabindex="0"
    //       >
    //         <form action="" class="form ">
    //           <div class="row">
    //             <div class="my-4 col-lg-6 col-md-6 col-sm-12">
    //               <h4>PAN Card</h4>
    //               <div class="input-box ">
    //                 <input
    //                   type="file"
    //                   multiple
    //                   ref={aRef}
    //                   class="upload-box"
    //                   onChange={(e) => handlePanFileChange("panCard", e)}
    //                 />
    //               </div>
    //               {docFiles?.panCard?.length > 0 && (
    //                 <div>
    //                   <h4>Selected files:</h4>
    //                   {docFiles &&
    //                     docFiles?.panCard?.map((file, index) => (
    //                       <div key={index}>
    //                         <div className="selectfile">
    //                           <p>{file?.name}</p>
    //                           <i
    //                             class="fa-solid fa-xmark"
    //                             onClick={() =>
    //                               handleRemoveFile("panCard", index)
    //                             }
    //                             style={{ cursor: "pointer" }}
    //                           ></i>
    //                         </div>

    //                         <div
    //                           class="progress"
    //                           role="progressbar"
    //                           aria-label="Basic example"
    //                           aria-valuenow="100"
    //                           aria-valuemin="0"
    //                           aria-valuemax="100"
    //                           style={{ height: "6px" }}
    //                         >
    //                           <div
    //                             class="progress-bar"
    //                             style={{ width: "100%" }}
    //                           ></div>
    //                         </div>
    //                       </div>
    //                     ))}
    //                 </div>
    //               )}
    //             </div>

    //             <div class="my-4 col-lg-6 col-md-6 col-sm-12">
    //               <h4>Aadhaar Upload- Front Side</h4>
    //               <div class="input-box ">
    //                 <input
    //                   type="file"
    //                   multiple
    //                   ref={aRef}
    //                   class="upload-box"
    //                   onChange={(e) => handlePanFileChange("aadharFront", e)}
    //                 />
    //               </div>
    //               {docFiles?.aadharFront?.length > 0 && (
    //                 <div>
    //                   <h4>Selected files:</h4>
    //                   {docFiles &&
    //                     docFiles?.aadharFront?.map((file, index) => (
    //                       <div key={index}>
    //                         <div className="selectfile">
    //                           <p>{file?.name}</p>
    //                           <i
    //                             class="fa-solid fa-xmark"
    //                             onClick={() =>
    //                               handleRemoveFile("aadharFront", index)
    //                             }
    //                             style={{ cursor: "pointer" }}
    //                           ></i>
    //                         </div>

    //                         <div
    //                           class="progress"
    //                           role="progressbar"
    //                           aria-label="Basic example"
    //                           aria-valuenow="100"
    //                           aria-valuemin="0"
    //                           aria-valuemax="100"
    //                           style={{ height: "6px" }}
    //                         >
    //                           <div
    //                             class="progress-bar"
    //                             style={{ width: "100%" }}
    //                           ></div>
    //                         </div>
    //                       </div>
    //                     ))}
    //                 </div>
    //               )}
    //             </div>

    //             <div class="my-4 col-lg-6 col-md-6 col-sm-12">
    //               <h4>Aadhaar Upload- Back Side</h4>
    //               <div class="input-box ">
    //                 <input
    //                   type="file"
    //                   multiple
    //                   ref={aRef}
    //                   class="upload-box"
    //                   onChange={(e) => handlePanFileChange("aadharBack", e)}
    //                 />
    //               </div>
    //               {docFiles?.aadharBack?.length > 0 && (
    //                 <div>
    //                   <h4>Selected files:</h4>
    //                   {docFiles &&
    //                     docFiles?.aadharBack?.map((file, index) => (
    //                       <div key={index}>
    //                         <div className="selectfile">
    //                           <p>{file?.name}</p>
    //                           <i
    //                             class="fa-solid fa  -xmark"
    //                             onClick={() =>
    //                               handleRemoveFile("aadharBack", index)
    //                             }
    //                             style={{ cursor: "pointer" }}
    //                           ></i>
    //                         </div>

    //                         <div
    //                           class="progress"
    //                           role="progressbar"
    //                           aria-label="Basic example"
    //                           aria-valuenow="100"
    //                           aria-valuemin="0"
    //                           aria-valuemax="100"
    //                           style={{ height: "6px" }}
    //                         >
    //                           <div
    //                             class="progress-bar"
    //                             style={{ width: "100%" }}
    //                           ></div>
    //                         </div>
    //                       </div>
    //                     ))}
    //                 </div>
    //               )}
    //             </div>
    //           </div>
    //           <div class="row">
    //             <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
    //               <label for="bank-name">Bank Name</label>
    //               <input
    //                 type="text"
    //                 id="bank-name"
    //                 name="bank-name"
    //                 onChange={handleKycOnchange}
    //                 // value="HDFC Bank"
    //                 required
    //               />
    //             </div>
    //             <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
    //               <label for="ac-number">Account Number</label>
    //               <input
    //                 type="number"
    //                 id="ac-number"
    //                 name="ac-number"
    //                 required
    //                 onChange={handleKycOnchange}
    //               />
    //             </div>
    //             <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
    //               <label for="ac-number">Confirm Account Number</label>
    //               <input
    //                 type="number"
    //                 id="ac-number"
    //                 name="ac-number"
    //                 required
    //                 onChange={handleKycOnchange}
    //               />
    //             </div>
    //             <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
    //               <label for="IFSC">IFSC Code</label>
    //               <input
    //                 type="text"
    //                 id="IFSC"
    //                 name="IFSC"
    //                 required
    //                 onChange={handleKycOnchange}
    //               />
    //             </div>
    //           </div>
    //           <div class="btn-section">
    //             <button class="profile-btn">Save</button>
    //           </div>
    //         </form>
    //       </div>
    //     </Tab.Pane>
    //   </Tab.Content>
    // </div>
  );
}

export default Profile;
