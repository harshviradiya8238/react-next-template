import React, { useMemo } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { CountryDropdown, CountrySelect } from "react-select-country-flag";
import Select from "react-select";
import countryList from "react-select-country-list";

function Profile() {
  const [phoneValue, setPhoneValue] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [value, setValue] = useState("");
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue(value);
  };

  const handleChange = () => {};
  const handleKycOnchange = () => {};

  return (
    <div class="profile-page-section">
      <div>
        <div class="nav nav-tabs " id="nav-tab" role="tablist">
          <div
            class="nav-link  active"
            id="nav-profile-b-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-profile"
            type="button"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="true"
          >
            Basic Details
          </div>
          <div
            class="nav-link"
            id="nav-kyc-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-kyc"
            type="button"
            role="tab"
            aria-controls="nav-kyc"
            aria-selected="false"
          >
            KYC Details
          </div>
        </div>
      </div>
      <div class="tab-content" id="nav-tabContent">
        <div
          class="tab-pane fade show active"
          id="nav-profile"
          role="tabpanel"
          aria-labelledby="nav-profile-b-tab"
          tabindex="0"
        >
          <form action="" class="form">
            <div class="col-1 mx-auto mb-2">
              <img src="/images/user.png" alt="" />
            </div>
            <div class="row">
              <div
                class="col-lg
              -4 col-md-6 col-sm-12 m-basics"
              >
                <label for="first-name">First Name</label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  placeholder="John Test"
                  // value="Jignesh Patel"
                  onChange={handleChange}
                  required
                />
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                <label for="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="johntest@gmail.com"
                  name="email"
                  onChange={handleChange}
                  // value="jigneshp123@gmail.com"
                  required
                />
              </div>

              <div class="col-lg-4 col-md-6 col-sm-12 m-basics">
                <label for="phone">Contact No</label>
                <PhoneInput
                  style={{
                    borderLeft: "1px solid #eef1ff",
                    borderTop: "1px solid #eef1ff",
                    borderBottom: "1px solid #eef1ff",
                  }}
                  international
                  defaultCountry="IN"
                  placeholder="+91 9999999999"
                  value={phoneValue}
                  onChange={setPhoneValue}
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 col-md-12 col-sm-12 m-basics">
                <label for="address"> Address Line 1 :</label>
                <input
                  id="address"
                  placeholder="A-301 Santosa Heights"
                  name="address"
                  rows="1"
                  onChange={handleChange}
                ></input>
              </div>
            </div>
            <div className="row">
              <div class="col-lg-12 col-md-12 col-sm-12 m-basics">
                <label for="address-2"> Address Line 2 :</label>
                <input
                  id="address-2"
                  name="address-2"
                  placeholder="near Royal Farm,satellite"
                  rows="1"
                  onChange={handleChange}
                ></input>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-3 col-md-6 col-sm-12 m-basics">
                <label for="phone">City:</label>
                <input
                  type="text"
                  placeholder="Surat"
                  id="city"
                  name="city"
                  onChange={handleChange}
                  // value="9237781246"
                  required
                />
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12 m-basics">
                <label for="phone">State:</label>
                <input
                  type="text"
                  id="state"
                  placeholder="Gujarat"
                  name="state"
                  onChange={handleChange}
                  // value="9237781246"
                  required
                />
              </div>

              <div class="col-lg-3 col-md-6 col-sm-12 m-basics">
                <label for="phone">Zip/Postal Code:</label>
                <input
                  type="text"
                  id="zip"
                  placeholder="394101"
                  name="zip"
                  onChange={handleChange}
                  // value="9237781246"
                  required
                />
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12 m-basics">
                <label for="phone">Country:</label>
                <div className="countrySelect">
                  <Select
                    options={options}
                    value={value}
                    onChange={changeHandler}
                  />
                </div>
              </div>
            </div>

            <div class="btn-section">
              <button class="profile-btn">Save</button>
            </div>
          </form>
        </div>

        <div
          class="tab-pane fade kyc-details"
          id="nav-kyc"
          role="tabpanel"
          aria-labelledby="nav-kyc-tab"
          tabindex="0"
        >
          <form action="" class="form ">
            <div class="row">
              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>PAN Card</h4>
                <div class="input-box ">
                  <input
                    type="file"
                    class="upload-box"
                    name="files[]"
                    onChange={handleKycOnchange}
                    multiple
                  />
                  {/* <i class="fa-solid fa-xmark"></i> */}
                </div>
              </div>

              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Front Side</h4>
                <div class="input-box">
                  <input
                    type="file"
                    class="upload-box"
                    name="files[]"
                    onChange={handleKycOnchange}
                    multiple
                  />
                  {/* <i class="fa-solid fa-xmark"></i> */}
                </div>
              </div>

              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Back Side</h4>
                <div class="input-box">
                  <input
                    type="file"
                    class="upload-box"
                    onChange={handleKycOnchange}
                    name="files[]"
                    multiple
                  />
                  {/* <i class="fa-solid fa-xmark"></i> */}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="bank-name">Bank Name</label>
                <input
                  type="text"
                  id="bank-name"
                  name="bank-name"
                  onChange={handleKycOnchange}
                  // value="HDFC Bank"
                  required
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="ac-number">Account Number</label>
                <input
                  type="number"
                  id="ac-number"
                  name="ac-number"
                  required
                  onChange={handleKycOnchange}
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="ac-number">ConfirmAccount Number</label>
                <input
                  type="number"
                  id="ac-number"
                  name="ac-number"
                  required
                  onChange={handleKycOnchange}
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="IFSC">IFSC Code</label>
                <input
                  type="text"
                  id="IFSC"
                  name="IFSC"
                  value=""
                  required
                  onChange={handleKycOnchange}
                />
              </div>
            </div>
            <div class="btn-section">
              <button class="profile-btn">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
