import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;
// const baseUrl = `http://localhost:4000`;
const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

export default axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30 secs
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
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
