import React from "react";

function LoanDetailForm() {
  return (
    <form action="#">
      <div className="row">
        <div className="col-6">
          <div className="single-input">
            <label htmlFor="name">Loan Amount</label>
            <input type="text" id="name" placeholder="Loan Amount" required />
          </div>
        </div>

        <div className="col-6">
          <div className="single-input">
            <label htmlFor="name">Loan Type</label>
            <select
              className="selectDrop form-select"
              aria-label="Default select example"
            >
              <option selected>Business Loan</option>
              <option value="1">Personal Loan</option>
              <option value="2">Home Loan</option>
              <option value="3">Car Loan</option>
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="single-input">
            <label htmlFor="phone">PAN</label>
            <input type="text" id="phone" placeholder="XXXXXXXXXX" required />
          </div>
        </div>
        <div className="col-6">
          <div className="single-input">
            <label htmlFor="state">State</label>
            <input type="text" id="state" placeholder="Gujarat" required />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="single-input">
            <label htmlFor="term">Loan Tenure</label>
            <input type="text" id="term" placeholder="12 months" />
          </div>
        </div>
      </div>
      {/* <div className="btn-area text-center">
        <button className="cmn-btn">Submit</button>
      </div> */}
    </form>
  );
}

export default LoanDetailForm;
