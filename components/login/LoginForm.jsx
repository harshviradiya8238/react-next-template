import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import show_hide from "/public/images/icon/show-hide.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Notification from "../utils/Notification";
import { useRouter } from "next/router";

import axios from "axios";
import API from "../../helper/API";

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
      <div className="overlay pt-40 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
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
                    API.post("/Auth/Login", {
                      userName: "asd",
                      userEmail: values.email,
                      userPassword: values.password,
                    })
                      .then(async (dataset) => {
                        const { data } = dataset;
                        console.log(data);
                        if (data.success) {
                          // Redirect to a new page using the router

                          await Notification("success", "Login SuccessFully");
                          await localStorage.setItem(
                            "logintoken",
                            data.value.token
                          );
                          await localStorage.setItem(
                            "user",
                            JSON.stringify(data?.value)
                          );
                          await router.push("/userDashBoard");
                          await window.location.reload();
                        } else {
                          Notification("error", data[0].errorMessage);
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                        // Notification("error", err);
                        Notification(
                          "error",
                          err?.response?.data[0].errorMessage
                        );
                        console.log("error", err);
                      });
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
                                placeholder="Email"
                                required
                              />

                              {/* {touched.email && errors.email && (
                                <div>{errors.email}</div>
                              )} */}
                            </div>
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="all_error"
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="single-input ">
                            <label> Password</label>
                            <div className="password-show d-flex align-items-center">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="confirmPass"
                                placeholder="Password"
                                onBlur={handleBlur}
                                className="passInput"
                                onChange={handleChange}
                                required
                              />

                              <span onClick={togglePasswordVisibility}>
                                {!showPassword ? (
                                  <i className="fas fa-eye-slash cursor-pointer"></i>
                                ) : (
                                  <i className="fas fa-eye cursor-pointer	"></i>
                                )}
                              </span>
                            </div>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="all_error"
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
