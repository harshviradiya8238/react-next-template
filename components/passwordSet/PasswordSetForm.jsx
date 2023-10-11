import Image from "next/image";
import Link from "next/link";
import arrow_left from "/public/images/icon/arrow-left.png";
import show_hide from "/public/images/icon/show-hide.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../utils/Notification";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import API from "../../helper/API";

const validationSchema = Yup.object({
  otp: Yup.string().required("OTP is required"),
  newPassword: Yup.string().required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "New password and confirm password must match "
  ),
});

const PasswordSetForm = () => {
  const router = useRouter();

  const [state, setState] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showNewPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
    <section className="sign-in-up set-password">
      <div className="overlay pt-60 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="form-content">
                <div className="section-header">
                  <h5 className="sub-title">
                    Unlock Your ambitions at every step
                  </h5>
                  <h2 className="title">Set Up Your Password</h2>
                  <p>
                    Your security is our top priority. You&#39;ll need this to
                    log into your bankio account
                  </p>
                </div>

                <Formik
                  initialValues={state}
                  validationSchema={validationSchema}
                  onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                  ) => {
                    try {
                      const response = await API.post(
                        "/User/ResetPasswordWithOTP",
                        {
                          otp: values.otp.toString(),
                          newPassword: values.newPassword,
                          confirmPassword: values.confirmPassword,
                        }
                      );

                      const { data } = response;

                      if (data?.success) {
                        Notification("success", data?.messages[0]?.messageText);
                        router.push("/login");
                      }
                    } catch (error) {
                      console.log(error);
                      Notification(
                        "error",
                        error?.response?.data[0]?.errorMessage
                      );
                    }
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <Form>
                      <div className="row">
                        <div className="col-4">
                          <div className="single-input">
                            <label htmlFor="choosePass">Enter OTP</label>
                            <div className="password-show d-flex align-items-center">
                              <Field
                                // type={"number"}
                                name="otp"
                                onKeyPress={(event) => {
                                  handleKeyPress(event);
                                }}
                                onInput={(event) => {
                                  if (event.target.value.length > 6) {
                                    event.preventDefault();
                                  }
                                }}
                                required
                                placeholder="OTP"
                              />
                            </div>
                            <ErrorMessage
                              name="otp"
                              component="div"
                              className="all_error"
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="single-input">
                            <label htmlFor="choosePass">New Password</label>
                            <div className="password-show d-flex align-items-center">
                              <Field
                                type={showNewPassword ? "text" : "password"}
                                className="passInput"
                                name="newPassword"
                                id="choosePass"
                                required
                                autocomplete="off"
                                placeholder="Password"
                              />
                              <span onClick={togglePasswordVisibility}>
                                {!showNewPassword ? (
                                  <i className="fas fa-eye-slash"></i>
                                ) : (
                                  <i className="fas fa-eye"></i>
                                )}
                              </span>
                            </div>
                            <ErrorMessage
                              name="newPassword"
                              component="div"
                              className="all_error"
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="single-input ">
                            <label htmlFor="confirmPass">
                              Confirm Password
                            </label>
                            <div className="password-show d-flex align-items-center">
                              <Field
                                type={showConfirmPassword ? "text" : "password"}
                                className="passInput"
                                required
                                name="confirmPassword"
                                id="confirmPass"
                                autocomplete="off"
                                placeholder="Password"
                              />
                              <span onClick={toggleConfirmPasswordVisibility}>
                                {!showConfirmPassword ? (
                                  <i className="fas fa-eye-slash"></i>
                                ) : (
                                  <i className="fas fa-eye"></i>
                                )}
                              </span>
                            </div>
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="all_error"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="btn-area">
                        <button className="cmn-btn" type="submit">
                          Submit Now
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="btn-back mt-60 d-flex align-items-center">
                  <Link href="/forgetpassword" className="back-arrow">
                    <Image src={arrow_left} alt="icon" />
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordSetForm;
