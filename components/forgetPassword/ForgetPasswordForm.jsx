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
import API from "../../helper/API.js.Js";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ForgetPasswordForm = () => {
  const router = useRouter();

  const [state, setState] = useState({
    email: "",
  });

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
                  <h2 className="title">Forget Your Password ? </h2>
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
                      const response = await API.post("/User/ForgotPassword", {
                        userEmail: values.email,
                        userPassword: "string",
                      });
                      const { data } = response;

                      if (data?.success) {
                        Notification("success", data?.messages[0]?.messageText);
                        Notification(
                          "success",
                          "OTP sent to your registered Mobile number or Email"
                        );

                        router.push("/password-set");
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
                        <div className="col-12">
                          <div className="single-input">
                            <label>Mobile Number or Email</label>
                            <div className="password-show d-flex align-items-center">
                              <Field
                                type={"email"}
                                name="email"
                                placeholder="Your email ID here"
                                required
                              />
                            </div>
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="all_error"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="btn-area">
                        {/* <Link href="/password-set" className="back-arrow"> */}
                        <button className="cmn-btn" type="submit">
                          Get OTP
                        </button>
                        {/* </Link> */}
                      </div>
                    </Form>
                  )}
                </Formik>
                <div className="btn-back mt-60 d-flex align-items-center">
                  <Link href="/login" className="back-arrow">
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

export default ForgetPasswordForm;
