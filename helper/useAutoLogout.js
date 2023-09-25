// hooks/useAutoLogout.js
import { useEffect } from "react";
import Router from "next/router";

// Function to handle the logout process
const handleLogout = () => {
  // Your logout logic here
  // For example, remove a JWT token from localStorage
  // Redirect user to the login page
  window.location.reload();
  window.location.href = "/";
  localStorage.clear();
  //   Router.push('/login');
};

const useAutoLogout = (timeout) => {
  useEffect(() => {
    let logoutTimer;

    // Function to reset the timer
    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(handleLogout, timeout);
    };

    // Set and reset the timer whenever an action is taken
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      // Cleanup: Remove all event listeners and clear the timer
      clearTimeout(logoutTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [timeout]);
};

export default useAutoLogout;
