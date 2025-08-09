// import React, { useState, useEffect } from "react";


// const AddVehicleWithList = () => {
//   const [vehicleDetails, setVehicleDetails] = useState({
//     vehicle_id: "",
//     email: "",
//     vehicle_type: "truck",
//     model_make: "",
//     registration_number: "",
//     engine_number: "",
//     fuel_type: "petrol",
//     capacity: "",
//     length: "",
//     height: "",
//     availability_status: true,
//   });

//   const [vehicleList, setVehicleList] = useState([]);

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/vehicles");
//         const data = await response.json();
//         if (response.ok) {
//           setVehicleList(data);
//         }
//       } catch (error) {
//         console.error("Error fetching vehicles:", error);
//       }
//     };
//     fetchVehicles();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setVehicleDetails((prevDetails) => ({
//       ...prevDetails,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !vehicleDetails.vehicle_id ||
//       !vehicleDetails.email ||
//       !vehicleDetails.model_make ||
//       !vehicleDetails.registration_number ||
//       !vehicleDetails.engine_number ||
//       !vehicleDetails.capacity ||
//       !vehicleDetails.length ||
//       !vehicleDetails.height
//     ) {
//       alert("Please fill in all required fields!");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8000/api/vehicles", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(vehicleDetails),
//       });

//       const data = await response.json();
//       console.log("Data:",data);
//       if (response.ok) {
//         console.log("response:",response);
//         setVehicleList((prevList) => [...prevList, data]);
//         alert("Vehicle added successfully!");
//         setVehicleDetails({
//           vehicle_id: "",
//           email: "",
//           vehicle_type: "truck",
//           model_make: "",
//           registration_number: "",
//           engine_number: "",
//           fuel_type: "petrol",
//           capacity: "",
//           length: "",
//           height: "",
//           availability_status: true,
//         });
//       } else {
//         alert("Error adding vehicle: " + data.message);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Something went wrong!");
//     }
//   };

//   const handleRemove = async (index, vehicleId) => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/vehicles/${vehicleId}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         setVehicleList((prevList) => prevList.filter((_, i) => i !== index));
//       } else {
//         alert("Failed to delete vehicle!");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg mx-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add a Vehicle</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {Object.keys(vehicleDetails).map((key) => (
//             key !== "availability_status" && (
//               <div key={key}>
//                 <label className="block text-sm font-medium text-gray-700" htmlFor={key}>
//                   {key.replace("_", " ").toUpperCase()}
//                 </label>
//                 <input
//                   type="text"
//                   id={key}
//                   name={key}
//                   value={vehicleDetails[key]}
//                   onChange={handleChange}
//                   className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
//                   required
//                 />
//               </div>
//             )
//           ))}
//           <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full">
//             Add Vehicle
//           </button>
//         </form>
//       </div>

//       <div className="mt-8 max-w-4xl mx-auto">
//         <h3 className="text-xl font-bold text-gray-800 mb-4">Vehicle List</h3>
//         {vehicleList.length === 0 ? (
//           <p className="text-gray-600">No vehicles added yet.</p>
//         ) : (
//           <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
//             {vehicleList.map((vehicle, index) => (
//               <div key={vehicle.vehicle_id} className="flex items-center justify-between border-b pb-2">
//                 <div>
//                   <h4 className="font-bold text-gray-800">{vehicle.model_make}</h4>
//                   <p className="text-gray-600">Type: {vehicle.vehicle_type}</p>
//                   <p className="text-gray-600">Registration: {vehicle.registration_number}</p>
//                   <p className="text-gray-600">Engine: {vehicle.engine_number}</p>
//                   <p className="text-gray-600">Capacity: {vehicle.capacity} tons</p>
//                   <p className="text-gray-600">Dimensions: {vehicle.length}m x {vehicle.height}m</p>
//                   <p className="text-gray-600">Availability: {vehicle.availability_status ? "Available" : "Unavailable"}</p>
//                 </div>
//                 <button
//                   onClick={() => handleRemove(index, vehicle.vehicle_id)}
//                   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddVehicleWithList;

import { useState, useEffect } from "react";

const AddVehicleWithList = () => {
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicle_id: "",
    email: "",
    vehicle_type: "truck",
    model_make: "",
    registration_number: "",
    engine_number: "",
    fuel_type: "petrol",
    capacity: "",
    length: "",
    height: "",
    availability_status: true,
  });
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const [vehicleList, setVehicleList] = useState([]);
   const [transporterEmail, setTransporterEmail] = useState(null);
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/booking/user/me`, { withCredentials: true });
        setTransporterEmail(response.data.email);
      } catch (error) {
        console.error("Failed to retrieve user info:", error);
      }
    };
    fetchUserEmail();
  }, []);
  
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!transporterEmail) return; // Ensure transporterEmail is defined
  
      try {
        const response = await fetch(`${BACKEND_URL}/booking/trucks/${transporterEmail}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setVehicleList(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
  
    fetchVehicles();
  }, [transporterEmail]); // Add transporterEmail as a dependency
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "vehicle_id",
      "email",
      "model_make",
      "registration_number",
      "engine_number",
      "capacity",
      "length",
      "height",
    ];

    for (const field of requiredFields) {
      if (!vehicleDetails[field]) {
        alert(`Please fill in all required fields! Missing: ${field}`);
        return;
      }
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleDetails),
      });

      const data = await response.json();

      if (response.ok) {
        setVehicleList((prevList) => [...prevList, data]);
        alert("Vehicle added successfully!");
        setVehicleDetails({
          vehicle_id: "",
          email: "",
          vehicle_type: "truck",
          model_make: "",
          registration_number: "",
          engine_number: "",
          fuel_type: "petrol",
          capacity: "",
          length: "",
          height: "",
          availability_status: true,
        });
      } else {
        alert(`Error adding vehicle: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-100 rounded-xl shadow-xl">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            name="vehicle_id"
            value={vehicleDetails.vehicle_id}
            onChange={handleChange}
            placeholder="Vehicle ID"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="email"
            name="email"
            value={vehicleDetails.email}
            onChange={handleChange}
            placeholder="Owner Email"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="model_make"
            value={vehicleDetails.model_make}
            onChange={handleChange}
            placeholder="Model Make"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="registration_number"
            value={vehicleDetails.registration_number}
            onChange={handleChange}
            placeholder="Registration Number"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="engine_number"
            value={vehicleDetails.engine_number}
            onChange={handleChange}
            placeholder="Engine Number"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="capacity"
            value={vehicleDetails.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="length"
            value={vehicleDetails.length}
            onChange={handleChange}
            placeholder="Length"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="height"
            value={vehicleDetails.height}
            onChange={handleChange}
            placeholder="Height"
            required
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <select
            name="fuel_type"
            value={vehicleDetails.fuel_type}
            onChange={handleChange}
            className="p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-all"
        >
          Add Vehicle
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-8 text-center text-gray-800">Vehicle List</h2>
      <ul className="mt-6 bg-white p-6 rounded-lg shadow-md">
        {vehicleList.length > 0 ? (
          vehicleList.map((vehicle) => (
            <li key={vehicle.vehicle_id} className="border-b py-4 text-lg">
              <span className="font-semibold text-blue-600">{vehicle.model_make}</span> - {vehicle.registration_number} - {vehicle.vehicle_id}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-600">No vehicles added yet.</p>
        )}
      </ul>
    </div>
  );
};

export default AddVehicleWithList;
