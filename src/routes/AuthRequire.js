import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
function AuthRequire({ children }) {
  const { isInitialize, isAuthenticated } = useAuth();
  const location = useLocation();
  // console.log(`isInitial in Authrequire ${isInitialize}`);
  if (!isInitialize) {
    return <LoadingScreen />;
  }
  // console.log(location);
  // console.log(`isAuth = ${isAuthenticated}`);
  if (!isAuthenticated) {
    console.log("isAuthenticated false");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // console.log("isAuthenticated true");
  return children;
}

export default AuthRequire;
