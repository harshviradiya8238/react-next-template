import Image from "next/image";
import Link from "next/link";
import show_hide from "/public/images/icon/show-hide.png";
import { useState } from "react";

const LoginForm = () => {
  const handleLogin = () => {
    <Link href="https://loan-dashboard.netlify.app/#"></Link>;
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <section className="sign-in-up login">
      <div className="overlay pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="form-content">
                <div className="section-header">
                  <h5 className="sub-title">The Power of Financial Freedom</h5>
                  <h2 className="title">Login</h2>
                  <p>
                    Your security is our top priority. You&#39;ll need this to
                    log into your bankio account
                  </p>
                </div>

                <form action="#">
                  <div className="row">
                    <div className="col-12">
                      <div className="single-input">
                        <label htmlFor="email">Email Id or Mobile</label>
                        <div className="password-show d-flex align-items-center">
                          <input
                            type={"email"}
                            id="email"
                            className="passInput"
                            placeholder="Your email ID here"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="single-input ">
                        <label htmlFor="confirmPass"> Password</label>
                        <div className="password-show d-flex align-items-center">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="passInput"
                            id="confirmPass"
                            placeholder="Enter Your Password"
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
                    <button className="cmn-btn">
                      <Link href="/userDashBoard">Login</Link>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
