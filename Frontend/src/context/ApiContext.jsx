import React, { createContext, useContext, useState } from "react";
import API, { setAuthToken, getCoordinates, processBooking } from "../utils/api.js"; // Single import

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);

  // Set token when user logs in
  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const token = response.data.token;
      setUserToken(token);
      localStorage.setItem("token", token);
      setAuthToken(token);
      return response.data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await API.get("/auth/status");
      setAuthStatus(response.data);
      return response.data;
    } catch (error) {
      console.error("Auth check failed", error);
      return null;
    }
  };

  // Process booking
  const bookRide = async (formData) => {
    return await processBooking(formData);
  };

  // Calculate fare
  const calculateFare = async (pickup, dropoff) => {
    const pickupCoords = await getCoordinates(pickup);
    const dropoffCoords = await getCoordinates(dropoff);

    if (pickupCoords && dropoffCoords) {
      const distance = Math.sqrt(
        Math.pow(dropoffCoords[0] - pickupCoords[0], 2) +
        Math.pow(dropoffCoords[1] - pickupCoords[1], 2)
      );
      return { distance, fare: distance * 10 }; // Example rate per km
    }
    return null;
  };

  return (
    <ApiContext.Provider value={{ login, checkAuth, bookRide, calculateFare, authStatus }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
