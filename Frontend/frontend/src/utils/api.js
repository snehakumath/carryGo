import axios from "axios";

const API = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for authentication if needed
});

// Function to set Authorization token dynamically
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.Authorization;
  }
};

// API calls
export const checkAuthStatus = () => API.get("/auth/status");
export const processBooking = (data) => API.post("/booking/process", data);
export const getCoordinates = (location) =>
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
    .then((res) => res.json())
    .then((data) =>
      data.length > 0 ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null
    )
    .catch((err) => console.error("Error fetching coordinates:", err));

export default API;

