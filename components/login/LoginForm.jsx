import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import show_hide from "/public/images/icon/show-hide.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../utils/Notification";
import { useRouter } from "next/router";

import axios from "axios";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("password is required"),
});

const LoginForm = () => {
  const router = useRouter();

  const [state, setSatate] = useState({
    email: "",
    password: "",
  });
  const handleLogin = () => {
    <Link href="https://loan-dashboard.netlify.app/#"></Link>;
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="sign-in-up login">
      <div className="overlay pt-60 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div>
                <div className="section-header">
                  <h5 className="sub-title">The Power of Financial Freedom</h5>
                  <h2 className="title">Login</h2>
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
                    console.log(values);

                    axios
                      .post(
                        "https://loancrmtrn.azurewebsites.net/api/Auth/Login",
                        {
                          userName: "asd",
                          userEmail: values.email,
                          userPassword: values.password,
                        }
                      )
                      .then((dataset) => {
                        const { data } = dataset;
                        console.log(data);
                        if (data.success) {
                          console.log(data);
                          // Redirect to a new page using the router
                          router.push("/userDashBoard");

                          Notification("success", "Login SuccessFully");
                          localStorage.setItem("logintoken", data.value.token);
                        } else {
                          Notification("error", "error");
                        }
                      })
                      .catch((err) => {
                        // Notification("error", err);
                        Notification("error", "invalid credential");
                        console.log("error", err);
                      });

                    // try {
                    //     saveJob(values, navigate);
                    //     if (setReadOnly) setReadOnly(true);
                    // } catch (err) {
                    //     setStatus({ success: false });
                    //     setErrors({ submit: err.message });
                    //     setSubmitting(false);
                    // }
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
                        <div className="col-12">
                          <div className="single-input">
                            <label htmlFor="email">Email Id </label>
                            <div className="password-show d-flex align-items-center">
                              <input
                                type={"email"}
                                name="email"
                                id="email"
                                className="passInput"
                                error={
                                  touched.jobPosition && errors.jobPosition
                                }
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter Your Email Id or phone number"
                                required
                              />

                              {/* {touched.email && errors.email && (
                                <div>{errors.email}</div>
                              )} */}
                            </div>
                            <ErrorMessage
                              name="email"
                              component="div"
                              style={{ color: "red" }}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="single-input ">
                            <label htmlFor="confirmPass"> Password</label>
                            <div className="password-show d-flex align-items-center">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="confirmPass"
                                placeholder="Enter Your Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                              />

                              <span onClick={togglePasswordVisibility}>
                                {showPassword ? (
                                  <i className="fas fa-eye-slash"></i>
                                ) : (
                                  <i className="fas fa-eye"></i>
                                )}
                              </span>
                            </div>
                            <ErrorMessage
                              name="password"
                              component="div"
                              style={{ color: "red" }}
                            />
                            <div className="forgot-area text-end">
                              <Link
                                href="/forgetpassword"
                                className="forgot-password"
                              >
                                Forgot Password?
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="btn-area">
                        <button className="cmn-btn" type="submit">
                          {/* <Link href="/userDashBoard"> */}
                          Login
                          {/* </Link> */}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
