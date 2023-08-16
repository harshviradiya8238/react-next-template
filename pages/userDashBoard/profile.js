import React, { useMemo, useRef } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { CountryDropdown, CountrySelect } from "react-select-country-flag";
import Select from "react-select";
import countryList from "react-select-country-list";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import axios from "axios";

function Profile() {
  const aRef = useRef(null);

  const [phoneValue, setPhoneValue] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [value, setValue] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {
          const userData = jwtDecode(token);
          const response = await axios.get(
            `https://loancrmtrn.azurewebsites.net/api/User/GetById?userId=${userData?.UserDetails?.Id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { data } = response;
          if (data?.success) {
            setUserInfo(data.value);
          }
          return response;
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [0]);

  const handleKycOnchange = () => {};

  const [profileState, setProfileState] = useState({
    firstName: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  useEffect(() => {
    setProfileState({
      firstName: userInfo?.firstName,
      phoneNumber: userInfo?.phoneNumber,
      email: userInfo?.email,
    });
  }, [userInfo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileState((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [docFiles, setdocFiles] = useState({
    panCard: [],
    aadharFront: [],
    aadharBack: [],
  });

  const handlePanFileChange = (fieldType, event) => {
    const selectedFiles = [...event.target.files];
    const updatedFiles = selectedFiles.slice(0, 3);
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: updatedFiles,
    }));
  };

  const handleRemoveFile = (fieldType, index) => {
    setdocFiles((prevState) => ({
      ...prevState,
      [fieldType]: prevState[fieldType].filter((_, i) => i !== index),
    }));
  };

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
                  name="firstName"
                  placeholder="John Test"
                  value={profileState.firstName}
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
                  value={profileState?.email}
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
                  name="phoneNumber"
                  defaultCountry="IN"
                  placeholder="+91 9999999999"
                  value={profileState?.phoneNumber}
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
                  name="address1"
                  rows="1"
                  value={profileState?.address1}
                  onChange={handleChange}
                ></input>
              </div>
            </div>
            <div className="row">
              <div class="col-lg-12 col-md-12 col-sm-12 m-basics">
                <label for="address-2"> Address Line 2 :</label>
                <input
                  id="address-2"
                  name="address2"
                  placeholder="near Royal Farm,satellite"
                  rows="1"
                  value={profileState?.address2}
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
                  value={profileState?.city}
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
                  value={profileState?.state}
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
                  name="zipCode"
                  value={profileState?.zip}
                  onChange={handleChange}
                  // value="9237781246"
                  required
                />
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
                    multiple
                    ref={aRef}
                    class="upload-box"
                    onChange={(e) => handlePanFileChange("panCard", e)}
                  />
                </div>
                {docFiles?.panCard?.length > 0 && (
                  <div>
                    <h4>Selected files:</h4>
                    {docFiles &&
                      docFiles?.panCard?.map((file, index) => (
                        <div key={index}>
                          <div className="selectfile">
                            <p>{file?.name}</p>
                            <i
                              class="fa-solid fa-xmark"
                              onClick={() => handleRemoveFile("panCard", index)}
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>

                          <div
                            class="progress"
                            role="progressbar"
                            aria-label="Basic example"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ height: "6px" }}
                          >
                            <div
                              class="progress-bar"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Front Side</h4>
                <div class="input-box ">
                  <input
                    type="file"
                    multiple
                    ref={aRef}
                    class="upload-box"
                    onChange={(e) => handlePanFileChange("aadharFront", e)}
                  />
                </div>
                {docFiles?.aadharFront?.length > 0 && (
                  <div>
                    <h4>Selected files:</h4>
                    {docFiles &&
                      docFiles?.aadharFront?.map((file, index) => (
                        <div key={index}>
                          <div className="selectfile">
                            <p>{file?.name}</p>
                            <i
                              class="fa-solid fa-xmark"
                              onClick={() =>
                                handleRemoveFile("aadharFront", index)
                              }
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>

                          <div
                            class="progress"
                            role="progressbar"
                            aria-label="Basic example"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ height: "6px" }}
                          >
                            <div
                              class="progress-bar"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Back Side</h4>
                <div class="input-box ">
                  <input
                    type="file"
                    multiple
                    ref={aRef}
                    class="upload-box"
                    onChange={(e) => handlePanFileChange("aadharBack", e)}
                  />
                </div>
                {docFiles?.aadharBack?.length > 0 && (
                  <div>
                    <h4>Selected files:</h4>
                    {docFiles &&
                      docFiles?.aadharBack?.map((file, index) => (
                        <div key={index}>
                          <div className="selectfile">
                            <p>{file?.name}</p>
                            <i
                              class="fa-solid fa  -xmark"
                              onClick={() =>
                                handleRemoveFile("aadharBack", index)
                              }
                              style={{ cursor: "pointer" }}
                            ></i>
                          </div>

                          <div
                            class="progress"
                            role="progressbar"
                            aria-label="Basic example"
                            aria-valuenow="100"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ height: "6px" }}
                          >
                            <div
                              class="progress-bar"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
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
                <label for="ac-number">Confirm Account Number</label>
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
