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

import axios from "axios";
import Notification from "../components/utils/Notification";
import { useRouter } from "next/router";
import Link from "next/link";
import jwtDecode from "jwt-decode";

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
});

function RegisterApplication() {
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState(null);

  const [state, setSatate] = useState({
    step1: { firstName: "", lastName: "", email: "", phone: "", refer: "" },
    step2: { loanType: "", loanAmount: "", loanTerm: "", state: "" },
    stepVerify: { mobileotp: "", emailotp: "" },
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
    // { title: "Registration confirmation" },
  ];
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [sendOtp, setVerifyOtp] = useState(false);

  const [apiData, setapiData] = useState({});

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
            referrerCode: value.step1.refer
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
    <section className="apply-for-loan business-loan" id="business-loan-form">
      <div className="overlay pt-120">
        <div className="container wow fadeInUp">
          <div className="row justify-content-center"></div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="form-content">
                <div className="section-header text-center">
                  <h3 class="thankYou_register">
                    <span> Registration </span>
                  </h3>
                  {/* <h2 className="title">Registration</h2> */}
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
                                          className="all_error"
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
                                          className="all_error"
                                        />
                                      </div>
                                    </div>

                                    <div className="d-flex justify-content-start align-items-center">
                                      <button
                                        type="submit"
                                        onClick={async () => {
                                          const { mobileotp, emailotp } =
                                            values.stepVerify || {};

                                          {
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
                                                  "Mobile OTP is required"
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
                                                await localStorage.setItem(
                                                  "logintoken",
                                                  tokenData
                                                );
                                                localStorage.setItem(
                                                  "user",
                                                  JSON.stringify(data?.value)
                                                );
                                                await setVerifyOtp(true);
                                                router.push("/userDashBoard");
                                                await Notification(
                                                  "success",
                                                  "OTP Verify SuccessFully and Password Send on Your Email"
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
                                        className="cmn-btn w-auto"
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
                                        <label>Last Name:</label>
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
                                        <label>Email:</label>
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
                                        <label>Contact No:</label>
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
                                      style={{
                                        backgroundColor:
                                          values.step1.firstName &&
                                            values.step1.lastName &&
                                            values.step1.email &&
                                            values.step1.phone
                                            ? "#1a4dbe"
                                            : "gray",
                                      }}
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

export default RegisterApplication;
