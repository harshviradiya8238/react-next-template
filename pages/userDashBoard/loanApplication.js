import React, { useState } from "react";
import Stepper from "react-stepper-horizontal";
// import LoanDetailForm from "../common/LoanDetailForm";
// import UploadDoc from "../common/UploadDoc";
import LoanDetailForm from "../../components/common/LoanDetailForm";
import UploadDoc from "../../components/common/UploadDoc";
import LoanForm from "../../components/common/LoanForm";

// import './App.css';

function UserDetails() {
  return <LoanForm />;
}

function LoanDetail() {
  return <LoanDetailForm />;
}

function UploadDocument() {
  return <UploadDoc />;
}

function Confirmation() {
  return <h2>Application Submited </h2>;
}
function LoanApplication() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Loan Details" },
    { title: "Document Details" },
    { title: "Application confirmation" },
  ];

  function getSectionComponent() {
    switch (activeStep) {
      case 0:
        return <LoanDetail />;
      case 1:
        return <UploadDocument />;
      case 2:
        return <Confirmation />;

      default:
        return null;
    }
  }

  return (
    <section className="apply-for-loan business-loan" id="business-loan-form">
      <div className="overlay pt-120 wrapper">
        <div className="container wow fadeInUp">
          <div className="row justify-content-center">
            {/* <div className="col-lg-8">
              <div className="section-header text-center">
                <h2 className="title">
                  Apply for a loan today.
                </h2>
                <p>
                  Get business loans approved within days with transparent
                  lending criteria and transparent processes.
                </p>
              </div>
            </div> */}
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="form-content">
                <div className="section-header text-center">
                  <h2 className="title">Apply for a loan</h2>
                  <p>
                    Please fill the form below. We will get in touch with you
                    within 1-2 business days, to request all necessary details
                  </p>
                </div>
                {/* Loan form  */}

                <div style={{ marginTop: "100px" }}>
                  <Stepper steps={steps} activeStep={activeStep} />
                  <div style={{ padding: "20px" }}>
                    {getSectionComponent()}
                    <div className="d-flex">
                      {activeStep !== 0 && activeStep !== steps.length && (
                        <div
                          className="btn-area text-center m-4"
                          onClick={() => setActiveStep(activeStep - 1)}
                        >
                          <button className="cmn-btn ">Previous</button>
                        </div>
                      )}
                      {activeStep !== steps.length - 1 && (
                        <div
                          className="btn-area text-center m-4"
                          onClick={() => setActiveStep(activeStep + 1)}
                        >
                          <button className="cmn-btn">Next</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoanApplication;
