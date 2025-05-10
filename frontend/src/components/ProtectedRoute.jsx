import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

// To check if user is authrized to acces certain links
// I put this for the Custom and Favorite pages (Check app.jsx)

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthrized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthrized(false));
  });

  // Checks if there is a valid refresh token
  // If there is it will get an access token and save to local storage
  // Other wise authrization failed which will bring them to login page

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthrized(true);
      } else {
        setIsAuthrized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthrized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthrized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthrized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
