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

const token =
  typeof window !== "undefined" ? localStorage.getItem("logintoken") : "";

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
      window.location.reload();
      window.location.href = "/";
      localStorage.clear();
    }
    return status;
  },
});
