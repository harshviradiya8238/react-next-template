import React from "react";

function Profile() {
  const handleChange = () => {};

  return (
    <div class="profile-page-section wrapper">
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
            Profile Details
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
            <div class="col-2 mx-auto mb-2">
              <img src="/images/user.png" alt="" />
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="first-name">First Name</label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  // value="Jignesh Patel"
                  onChange={handleChange}
                  required
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  // value="jigneshp123@gmail.com"
                  required
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="phone">Phone Number</label>
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  onChange={handleChange}
                  // value="9237781246"
                  required
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="bdate">Birthday Date</label>
                <input
                  type="date"
                  id="bdate"
                  name="begin"
                  placeholder="06-08-2002"
                  // value="06-08-2002"
                  min="1997-01-01"
                  onChange={handleChange}
                  max="2030-12-31"
                />
              </div>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 m-basics">
              <p>Address:</p>
              <label for="address">Street Address Line 1 :</label>
              <textarea
                id="address"
                name="address"
                rows="1"
                onChange={handleChange}
              ></textarea>
            </div>
            <div class="col-lg-12 col-md-12 col-sm-12 m-basics">
              <label for="address-2">Street Address Line 2 :</label>
              <textarea
                id="address-2"
                name="address-2"
                rows="1"
                onChange={handleChange}
              ></textarea>
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
                    multiple
                  />
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </div>

              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Front Side</h4>
                <div class="input-box">
                  <input
                    type="file"
                    class="upload-box"
                    name="files[]"
                    multiple
                  />
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </div>

              <div class="my-4 col-lg-6 col-md-6 col-sm-12">
                <h4>Aadhaar Upload- Back Side</h4>
                <div class="input-box">
                  <input
                    type="file"
                    class="upload-box"
                    name="files[]"
                    multiple
                  />
                  <i class="fa-solid fa-xmark"></i>
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
                  // value="HDFC Bank"
                  required
                />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="ac-number">Account Number</label>
                <input type="number" id="ac-number" name="ac-number" required />
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12 m-basics">
                <label for="IFSC">IFSC Code</label>
                <input type="text" id="IFSC" name="IFSC" value="" required />
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
