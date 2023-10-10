// hooks/useAuth.js

import { useEffect } from "react";
import { useRouter } from "next/router";

function useAuth() {
  const router = useRouter();
  const isAuthenticated =
    typeof window !== "undefined" && localStorage.getItem("logintoken")
      ? true
      : false;

  return isAuthenticated;
}

export default useAuth;
