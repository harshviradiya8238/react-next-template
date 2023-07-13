import Image from "next/image";
import Link from "next/link";
import arrow_left from "/public/images/icon/arrow-left.png";
import show_hide from "/public/images/icon/show-hide.png";

const ForgetPasswordForm = () => {
  return (
    <section className="sign-in-up set-password">
      <div className="overlay pt-120 pb-120">
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
                <form action="#">
                  <div className="row">
                    <div className="col-12">
                      <div className="single-input">
                        <label>Mobile Number or Email</label>
                        <div className="password-show d-flex align-items-center">
                          <input
                            type={"number"}
                            className="passInput"
                            autocomplete="off"
                            placeholder="Enter Your Mobile Number OR Email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn-area">
                    <button className="cmn-btn">Get OTP</button>
                  </div>
                </form>
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
