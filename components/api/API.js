import axios from "axios";
const baseUrl = "https://stagingapi.dequity.technology/developer";
// const baseUrl = `http://localhost:8000`;
const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

let localStorageNew;
if (typeof window !== "undefined") {
  // Perform localStorage action
  localStorageNew = localStorage.getItem("loginToken");
}
// localStorage.getItem("token");

export default axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30 secs
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${localStorageNew}`,
  },

  validateStatus: (status) => {
    if (status === 401) {
      window.location.href = "/";
      localStorage.clear();
    }
    return status;
  },
});
