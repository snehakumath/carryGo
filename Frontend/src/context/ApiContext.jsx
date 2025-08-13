import React, { createContext, useContext, useState, useEffect } from "react";
import API, { setAuthToken } from "../utils/api.js";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);
  // const [islogin ,setIsLoggedIn]=useState();
  const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);
   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  //const BACKEND_URL ="http://localhost:8000";
  useEffect(() => {
    console.log("ApiProvider mounted, checking auth...");
    checkAuth(); // check on mount
  }, []);

  // const login = async (email, password) => {
  //   try {
  //     const response = await API.post('/auth/login', { email, password });
  //     console.log("Snehaaa");
  //     // Backend sets cookie automatically, no need to manually save token here
  //     await checkAuth(); // update auth status
  //     return response.data;
  //   } catch (error) {
  //     console.error("Login failed", error);
  //     throw error;
  //   }
  // };
  

  const checkAuth = async () => {
    console.log("checkAuth");
    try {
      const response = await API.get(`${BACKEND_URL}/auth/status`);
      console.log("REs context checkAuth", response.data);
      setAuthStatus(response.data);
      return response.data;
    } catch (error) {
      console.error("Auth check failed", error);
      setAuthStatus(null);
      return null;
    }
  };

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
    <ApiContext.Provider value={{ checkAuth, authStatus, setAuthStatus }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);


// import React, { createContext, useContext, useState } from "react";
// import API, { setAuthToken, getCoordinates, processBooking } from "../utils/api.js"; // Single import

// const ApiContext = createContext();
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// export const ApiProvider = ({ children }) => {
//   const [authStatus, setAuthStatus] = useState(null);
//   const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);

//   // Set token when user logs in
//   const login = async (user_type, email, password) => {
//     try {
//       const response = await API.post(
//         '/auth/login',
//         { user_type, email, password },
//         { withCredentials: true } // very important to allow cookies!
//       );
//       console.log('Login success:', response.data);
  
//       const authData = await checkAuth();
//       return authData;
//     } catch (error) {
//       console.error('Login failed:', error.response?.data || error.message);
//       throw error;
//     }
//   };
  

//   // Check authentication status
//   const checkAuth = async () => {
//     try {
//       const response = await API.get('/auth/status', { withCredentials: true });
//       console.log('Auth status:', response.data);
//       setAuthStatus(response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Auth check failed:', error.response?.data || error.message);
//       setAuthStatus({ loggedIn: false, user: null });
//       return null;
//     }
//   };
  
//   // Process booking
//   const bookRide = async (formData) => {
//     return await processBooking(formData);
//   };

//   // Calculate fare
//   const calculateFare = async (pickup, dropoff) => {
//     const pickupCoords = await getCoordinates(pickup);
//     const dropoffCoords = await getCoordinates(dropoff);

//     if (pickupCoords && dropoffCoords) {
//       const distance = Math.sqrt(
//         Math.pow(dropoffCoords[0] - pickupCoords[0], 2) +
//         Math.pow(dropoffCoords[1] - pickupCoords[1], 2)
//       );
//       return { distance, fare: distance * 10 }; // Example rate per km
//     }
//     return null;
//   };

//     return (
//       <ApiContext.Provider value={{ login, checkAuth, bookRide, calculateFare, authStatus, setAuthStatus }}>
//         {children}
//       </ApiContext.Provider>
//     );
// };

// export const useApi = () => useContext(ApiContext);
