import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickup_loc: "",
    dropoff_loc: "",
    pickup_date: "",
    goods_type: "",
    goods_weight: "",
    weightUnit: "kg",
    truckType: "",
    name: "",
    phone: "",
    email: "",
    shareTruck: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showSuccessGif, setShowSuccessGif] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   fetch("/auth/status", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     credentials: "include",
  //   })
  //     .then((res) => res.ok ? res.json() : Promise.reject())
  //     .then((data) => {
  //       setIsLoggedIn(data.loggedIn);
  //       setUser(data.user);
  //     })
  //     .catch(() => setIsLoggedIn(false));
  // }, []);

   useEffect(() => {
      setLoading(true); // Optional
      fetch("http://localhost:8000/auth/status", {
        method: "GET",
        credentials: 'include',
      })
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((data) => {
          setIsLoggedIn(data.loggedIn);
          setUser(data.user);
        })
        .catch(() => setIsLoggedIn(false))
        .finally(() => setLoading(false));
    }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const nextStep = () => validateStep() ? (step === 3 && calculateFare(), setStep(step + 1)) : alert("Please fill in all required fields!");
  const prevStep = () => setStep(step - 1);

  const validateStep = () => {
    switch (step) {
      case 1: return formData.pickup_loc && formData.dropoff_loc;
      case 2: return formData.name && formData.phone && formData.email;
      case 3: return formData.goods_type && formData.goods_weight;
      case 4: return formData.truckType;
      default: return true;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (angle) => (angle * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCoordinates = async (location) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
      const data = await response.json();
      return data.length > 0 ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const calculateFare = async () => {
    const pickupCoords = await getCoordinates(formData.pickup_loc);
    const dropoffCoords = await getCoordinates(formData.dropoff_loc);
    if (pickupCoords && dropoffCoords) {
      const dist = calculateDistance(...pickupCoords, ...dropoffCoords);
      setDistance(dist);
      const ratePerKm = 10;
      setFare(dist * ratePerKm);
    } else {
      alert("Could not retrieve coordinates.");
    }
  };

  const handleBooking = async () => {
    if (!isLoggedIn || !user) {
      alert("Please log in to continue.");
      return navigate("/login");
    }

    try {
      const response = await axios.post(`http://localhost:8000/booking/process`, formData);
     // console.log("REs",response);
      if (response.status === 201) {
        setShowSuccessGif(true);
        setTimeout(() => {
          setShowSuccessGif(false);
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to create booking.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl border border-gray-200 text-black">
      <h1 className="text-3xl font-bold text-center mb-6 border-b pb-2">Truck Booking</h1>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 1: Location Details</h2>
          <input type="text" name="pickup_loc" value={formData.pickup_loc} onChange={handleChange} placeholder="Pickup location" className="w-full border px-4 py-2 rounded mb-3 bg-white" />
          <input type="text" name="dropoff_loc" value={formData.dropoff_loc} onChange={handleChange} placeholder="Drop location" className="w-full border px-4 py-2 rounded mb-3 bg-white" />
          <input type="date" name="pickup_date" value={formData.pickup_date} onChange={handleChange} className="w-full border px-4 py-2 rounded mb-3 bg-white" />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 2: Personal Details</h2>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full border px-4 py-2 rounded mb-3 bg-white" />
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border px-4 py-2 rounded mb-3 bg-white" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full border px-4 py-2 rounded mb-3 bg-white" />
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 3: Goods Details</h2>
          <select name="goods_type" value={formData.goods_type} onChange={handleChange} className="w-full border px-4 py-2 rounded mb-3 bg-white">
            <option value="">Select Material Type</option>
            <option value="General Cargo">General Cargo</option>
            <option value="Perishable Goods">Perishable Goods</option>
            <option value="Construction Materials">Construction Materials</option>
            <option value="Agricultural Products">Agricultural Products</option>
            <option value="Industrial Goods">Industrial Goods</option>
            <option value="Heavy Equipment">Heavy Equipment</option>
          </select>
          <input type="number" name="goods_weight" value={formData.goods_weight} onChange={handleChange} placeholder="Weight" className="w-full border px-4 py-2 rounded mb-3 bg-white" />
          <select name="weightUnit" value={formData.weightUnit} onChange={handleChange} className="w-full border px-4 py-2 rounded mb-3 bg-white">
            <option value="kg">kg</option>
            <option value="tons">tons</option>
          </select>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 4: Truck Details</h2>
          <select name="truckType" value={formData.truckType} onChange={handleChange} className="w-full border px-4 py-2 rounded mb-3 bg-white">
          <option value="Mini Truck">Mini Truck (600kg)</option>
          <option value="Pickup Truck">Pickup Truck (1.5T)</option>
          <option value="14ft Truck">14ft Truck (3.5T)</option>
          <option value="Container Truck">20ft Container (6T)</option>
          <option value="Flatbed Truck">Flatbed Truck (Variable)</option>
          </select>
          <label className="flex items-center gap-2 mt-2">
      <input
        type="checkbox"
        name="shareTruck"
        checked={formData.shareTruck}
        onChange={(e) => setFormData({ ...formData, shareTruck: e.target.checked })}
        className="h-4 w-4"
      />
      <span className="text-gray-700">Share this truck with others to lower cost (if available)</span>
    </label>
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button onClick={prevStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            Previous
          </button>
        )}
        {step < 4 ? (
          <button onClick={nextStep} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            Next
          </button>
        ) : (
          <button onClick={handleBooking} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
            Confirm Booking
          </button>
        )}
      </div>

      {fare && (
        <div className="mt-6 text-center text-black font-semibold">
          Estimated Fare: ₹{fare.toFixed(2)} ({distance?.toFixed(2)} km)
        </div>
      )}

      {showSuccessGif && (
        <div className="mt-6 flex justify-center">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDdvb3BtZ2VncGd4ZmJtd3dkNHZnbTQ4ZW95NnRkZWp1OWY5ZWV1ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XreQmk7ETCak0/giphy.gif"
            alt="Booking Confirmed"
            className="w-48 h-48"
          />
        </div>
      )}
    </div>
  );
};

export default BookingForm;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const BookingForm = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     pickup_loc: "",
//     dropoff_loc: "",
//     pickup_date: "",
//     goods_type: "",
//     goods_weight: "",
//     weightUnit: "kg",
//     truckType: "",
//     name: "",
//     phone: "",
//     email: "",
//   });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [fare, setFare] = useState(null); // Fare calculation state
//   const [distance, setDistance] = useState(null);
//   const [showSuccessGif, setShowSuccessGif] = useState(false);



//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setIsLoggedIn(false);
//       return;
//     }

//     fetch("/auth/status", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//     })
//       .then((res) => (res.ok ? res.json() : Promise.reject()))
//       .then((data) => {
//         setIsLoggedIn(data.loggedIn);
//         setUser(data.user);
//       })
//       .catch(() => setIsLoggedIn(false));
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const nextStep = () => {
//     if (validateStep()) {
//       if (step === 3) {
//         calculateFare(); // Calculate fare before confirming booking
//       }
//       setStep(step + 1);
//     } else {
//       alert("Please fill in all required fields!");
//     }
//   };

//   const prevStep = () => {
//     setStep(step - 1);
//   };

//   const validateStep = () => {
//     switch (step) {
//       case 1:
//         return formData.pickup_loc && formData.dropoff_loc;
//       case 2:
//         return formData.name && formData.phone && formData.email;
//       case 3:
//         return formData.goods_type && formData.goods_weight;
//       case 4:
//         return formData.truckType;
//       default:
//         return true;
//     }
//   };

//  // Function to calculate Haversine distance between two coordinates
//  const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of Earth in km
//   const toRad = (angle) => (angle * Math.PI) / 180;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };

// // Function to get latitude and longitude of a location
// const getCoordinates = async (location) => {
//   try {
//     const response = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
//     );
//     const data = await response.json();
//     if (data.length > 0) {
//       return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//     }
//   } catch (error) {
//     console.error("Error fetching coordinates:", error);
//   }
//   return null;
// };


// // Function to calculate fare based on distance and other factors
// const calculateFare = async () => {
//   try {
//     const pickupCoords = await getCoordinates(formData.pickup_loc);
//     const dropoffCoords = await getCoordinates(formData.dropoff_loc);
    
//     if (pickupCoords && dropoffCoords) {
//       const calculatedDistance = calculateDistance(
//         pickupCoords[0], pickupCoords[1],
//         dropoffCoords[0], dropoffCoords[1]
//       );
      
//       setDistance(calculatedDistance);
//       const ratePerKm = 10; // Example rate
//       setFare(calculatedDistance * ratePerKm);
//     } else {
//       alert("Could not retrieve coordinates for locations.");
//     }
//   } catch (error) {
//     console.error("Error calculating fare:", error);
//   }
// };



// const handleBooking = async () => {
//   if (!isLoggedIn || !user) {
//     alert("Please log in to continue.");
//     navigate("/login");
//     return;
//   }

//   try {
//     const response = await axios.post("/booking/process", formData);
//     if (response.status === 201) {
//       setShowSuccessGif(true); // Show the GIF
//       setTimeout(() => {
//         setShowSuccessGif(false); // Hide it after 3 seconds
//         navigate("/"); // Navigate or reset the form as needed
//       }, 3000);
//     }
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     alert("Failed to create booking. Please try again.");
//   }
// };

  
//   const handleCalculateFare = async () => {
//       if (!pickupInput || !dropoffInput) {
//         setError("Please enter both pickup and drop-off locations.");
//         return;
//       }
  
//       setError(null);
  
//       try {
//         const pickupCoords = await getCoordinates(pickupInput);
//         const dropoffCoords = await getCoordinates(dropoffInput);
  
//         if (pickupCoords && dropoffCoords) {
//           setRoute([pickupCoords, dropoffCoords]);
//           const calculatedDistance = L.latLng(pickupCoords).distanceTo(L.latLng(dropoffCoords)) / 1000;
//           setDistance(calculatedDistance);
//           setFare(calculateFare(calculatedDistance));
//         } else {
//           setError("Unable to find locations. Please enter a valid address.");
//         }
//       } catch (error) {
//         setError("Error calculating fare. Please try again.");
//       }
//     };
  
    
//   return (
//     <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
//       <h1 className="text-2xl font-bold text-center text-red-500 mb-4">Truck Booking</h1>

//       {step === 1 && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Step 1: Location Details</h2>
//           <input
//             type="text"
//             name="pickup_loc"
//             value={formData.pickup_loc}
//             onChange={handleChange}
//             placeholder="Pickup location"
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           />
//           <input
//             type="text"
//             name="dropoff_loc"
//             value={formData.dropoff_loc}
//             onChange={handleChange}
//             placeholder="Drop location"
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           />
//           <input
//             type="date"
//             name="pickup_date"
//             value={formData.pickup_date}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           />
//         </div>
//       )}

//       {step === 2 && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Step 2: Personal Details</h2>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           />
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder="Phone Number"
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email Address"
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           />
//         </div>
//       )}

//       {step === 3 && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Step 3: Goods Details</h2>
//           <select
//             name="goods_type"
//             value={formData.goods_type}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           >
//             <option value="" disabled>Select Material Type</option>
//             <option value="General Cargo">General Cargo</option>
//             <option value="Perishable Goods">Perishable Goods</option>
//             <option value="Construction Materials">Construction Materials</option>
//             <option value="Agricultural Products">Agricultural Products</option>
//             <option value="Industrial Goods">Industrial Goods</option>
//             <option value="Heavy Equipment">Heavy Equipment</option>
//           </select>
//           <input
//             type="number"
//             name="goods_weight"
//             value={formData.goods_weight}
//             onChange={handleChange}
//             placeholder="Weight"
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           />
//           <select
//             name="weightUnit"
//             value={formData.weightUnit}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           >
//             <option value="kg">kg</option>
//             <option value="tons">tons</option>
//           </select>
//         </div>
//       )}

//       {step === 4 && (
//         <div>
//           <h2 className="text-xl font-bold mb-4">Step 4: Truck Details</h2>
//           <select
//             name="truckType"
//             value={formData.truckType}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg mb-2"
//           >
//                         <option value="Small Truck">Small Truck</option>
//             <option value="Medium Truck">Medium Truck</option>
//             <option value="Large Truck">Large Truck</option>
//             <option value="Container Truck">Container Truck</option>
//             <option value="Flatbed Truck">Flatbed Truck</option>
//           </select>
//         </div>
//       )}

//       <div className="flex justify-between mt-4">
//         {step > 1 && (
//           <button
//             onClick={prevStep}
//             className="bg-gray-500 text-white px-4 py-2 rounded-lg"
//           >
//             Previous
//           </button>
//         )}
//         {step < 4 ? (
//           <button
//             onClick={nextStep}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleBooking}
//             className="bg-green-500 text-white px-4 py-2 rounded-lg"
//           >
//             Confirm Booking
//           </button>
//         )}
//       </div>

//       {fare !== null && (
//         <div className="mt-4 text-lg font-bold text-center">
//           Estimated Fare: ₹{fare.toFixed(2)}
//         </div>
//       )}
//       {showSuccessGif && (
//   <div className="mt-4 flex justify-center">
//     <img
//       src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDdvb3BtZ2VncGd4ZmJtd3dkNHZnbTQ4ZW95NnRkZWp1OWY5ZWV1ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XreQmk7ETCak0/giphy.gif"
//       alt="Booking Confirmed"
//       className="w-48 h-48"
//     />
//   </div>
// )}

//     </div>
//   );
// };

// export default BookingForm;
