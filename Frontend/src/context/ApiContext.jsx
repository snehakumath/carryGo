import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api.js";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  // Load from localStorage first so refresh doesn't reset login
  const storedAuth = localStorage.getItem("authStatus");
  const [authStatus, setAuthStatus] = useState(
    storedAuth ? JSON.parse(storedAuth) : null
  );

  useEffect(() => {
    console.log("ApiProvider mounted, checking auth...");
    checkAuth();
  }, []);

  // Keep localStorage in sync when auth changes
  useEffect(() => {
    if (authStatus) {
      localStorage.setItem("authStatus", JSON.stringify(authStatus));
    } else {
      localStorage.removeItem("authStatus");
    }
  }, [authStatus]);

  const checkAuth = async () => {
    try {
      const response = await API.get(`${BACKEND_URL}/auth/status`, {
        withCredentials: true,
      });
      console.log("Response from checkAuth:", response.data);
      setAuthStatus(response.data);
      return response.data;
    } catch (error) {
      console.error("Auth check failed", error);
      setAuthStatus(null);
      return null;
    }
  };

  return (
    <ApiContext.Provider value={{ checkAuth, authStatus, setAuthStatus }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);


// import React, { createContext, useContext, useState, useEffect } from "react";
// import API, { setAuthToken } from "../utils/api.js";

// const ApiContext = createContext();

// export const ApiProvider = ({ children }) => {
//   const [authStatus, setAuthStatus] = useState(null);
//   // const [islogin ,setIsLoggedIn]=useState();
//   const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);
//    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
//   //const BACKEND_URL ="http://localhost:8000";
//   useEffect(() => {
//     console.log("ApiProvider mounted, checking auth...");
//     checkAuth(); // check on mount
//   }, []);

//   const checkAuth = async () => {
//     console.log("checkAuth");
//     try {
//       const response = await API.get(`${BACKEND_URL}/auth/status`, {
//         withCredentials: true
//       });      
//       console.log("REs context checkAuth", response.data);
//       setAuthStatus(response.data);
//       const storedAuth = localStorage.getItem("authStatus");
// const [authStatus, setAuthStatus] = useState(
//   storedAuth ? JSON.parse(storedAuth) : null
// );

//       return response.data;
//     } catch (error) {
//       console.error("Auth check failed", error);
//       setAuthStatus(null);
//       return null;
//     }
//   };

//   const bookRide = async (formData) => {
//         return await processBooking(formData);
//       };
    
//       // Calculate fare
//       const calculateFare = async (pickup, dropoff) => {
//         const pickupCoords = await getCoordinates(pickup);
//         const dropoffCoords = await getCoordinates(dropoff);
    
//         if (pickupCoords && dropoffCoords) {
//           const distance = Math.sqrt(
//             Math.pow(dropoffCoords[0] - pickupCoords[0], 2) +
//             Math.pow(dropoffCoords[1] - pickupCoords[1], 2)
//           );
//           return { distance, fare: distance * 10 }; // Example rate per km
//         }
//         return null;
//       };

//   return (
//     <ApiContext.Provider value={{ checkAuth, authStatus, setAuthStatus }}>
//       {children}
//     </ApiContext.Provider>
//   );
// };

// export const useApi = () => useContext(ApiContext);


