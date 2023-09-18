import axios from "axios";

const baseUrl = "https://loancrmtrn.azurewebsites.net/api";
// const baseUrl = `http://localhost:4000`;
const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

// console.log(localStorage.getItem("logintoken"));

const token =
  typeof window !== "undefined" ? localStorage.getItem("logintoken") : "";

console.log(token, "======================-----------dddddddddddddddd");
export default axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30 secs
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: token ? `Bearer ${token}` : "",
  },

  validateStatus: (status) => {
    if (status === 401) {
      console.log(status, "------------------------");
      window.location.reload();
      window.location.href = "/";
      localStorage.clear();
    }
    return status;
  },
});
