import React from "react";
import Preloader from "../../components/preloader/Preloader";
import { useState } from "react";
import { useEffect } from "react";
import API from "../../helper/API.js";

function Earn() {
  const [referCode, setReferCode] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("logintoken");
      try {
        if (token) {
          // const userData = jwtDecode(token);
          const response = await API.post(
            `https://loancrmtrn.azurewebsites.net/api/User/GetReferralCodeLink`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { data } = response;
          if (data?.success) {
            setReferCode(data.value);
          }
          return response;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <div class="loan-content-body">
      <Preloader />
      <div class="container">
        <div class="cashback-section"></div>
        <div class="invite-section">
          <div class="col-lg-7 col-md-6 col-sm-12">
            <div class="input-box" style={{ maxWidth: "fit-content" }}>
              <input
                type="text"
                id="myInput"
                value={referCode}
              // value="https://developer.android.com/training/app-links"
              />
              <i class="fa-solid fa-copy" style={{ cursor: "pointer" }}></i>
            </div>
          </div>
          <div class="icon-section">
            <a href="#">
              {" "}
              <i class="fa-brands fa-facebook"></i>
            </a>
            <a href="#">
              {" "}
              <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="#">
              {" "}
              <i class="fa-brands fa-twitter"></i>
            </a>
            <a href="#">
              {" "}
              <i class="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
        <div class="loan-section-table">
          <h3 class="text-head">
            <span class="Refer">Refer & Earn</span>
          </h3>
          {/* <div class="d-flex justify-content-end">
            <div class="col-lg-3 col-sm-12 ">
              <form class="form">
                <div>
                  <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input
                  class="input"
                  placeholder="Search"
                  required=""
                  type="text"
                />
                <button class="reset" type="reset">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </form>
            </div>
          </div> */}
          <div class="table-responsive">
            <table class="table align-td-middle table-card">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Tami Rowe</td>
                  <td>18 June,2022</td>

                  <td>₹ 1200.00</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Kristy Ruecker</td>
                  <td>10 June,2022</td>
                  <td>₹ 1700.00</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Roland Torphy</td>
                  <td>29 March,2022 </td>
                  <td>₹ 1000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-end">
            <div class="pagination">
              <a href="#">&laquo;</a>
              <a href="#" class="active">
                1
              </a>
              <a href="#">2</a>
              <a href="#">3</a>
              <a href="#">4</a>
              <a href="#">&raquo;</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Earn;
