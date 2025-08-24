import React, { useState, useEffect } from "react";
import axios from "axios";

const Booking = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [placedBids, setPlacedBids] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [transporterEmail, setTransporterEmail] = useState(null);
  const [bidAmounts, setBidAmounts] = useState({});
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [busyTrucks, setBusyTrucks] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState({});
  const [assignedTrucks, setAssignedTrucks] = useState({});

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  // Fetch logged-in transporter's email
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
        if (!transporterEmail) return;
      
        axios.get(`${BACKEND_URL}/booking/trucks/${transporterEmail}`)
          .then((res) => {
            console.log("Trucks API Response:", res.data);
            if (Array.isArray(res.data)) {
              console.log("res.data",res.data);
              const available = res.data.filter(truck => truck.availability_status === true);
              setAvailableTrucks(available);
              const busy = res.data.filter(truck => truck.availability_status !== true);
              setBusyTrucks(busy);
              console.log("Available Trucks",available);
              console.log("Busy Trucks",busy);
            } else {
              console.error("Expected an array but got:", res.data);
              setAvailableTrucks([]);
            }
          })
          .catch((err) => console.error("Error fetching transporter's trucks:", err));
      }, [transporterEmail]);

  // Fetch orders once transporterEmail is available 
  // useEffect(() => {
  //   if (!transporterEmail) return;

  //   axios.get(`${BACKEND_URL}/booking/orders?transporterEmail=${transporterEmail}`)
  //     .then((res) => {
  //       console.log("Response Data:", res.data);
  //       setAvailableOrders(res.data.availableOrders || []);
  //       setPlacedBids(res.data.placedBids || []);
  //       setAcceptedOrders(res.data.acceptedOrders || []);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching orders:", err);
  //       if (err.response) {
  //         console.error("Response Data:", err.response.data);
  //       }
  //     });
      
  // }, [transporterEmail]);
  useEffect(() => {
    if (!transporterEmail) return;
  
    axios.get(`${BACKEND_URL}/booking/orders?transporterEmail=${transporterEmail}`)
      .then((res) => {
        console.log("Response Data:", res.data);
  
        const orders = Array.isArray(res.data) ? res.data : [];
       console.log("Orders",orders);
        // Distinguish on frontend
        const availableOrders = orders.filter(o => o.transporter_email==null); 
        const acceptedOrders = orders.filter(o => 
          o.transporter_email === transporterEmail && (o.bid_status == "Customer Accepted")
        );
        const placedBids = orders.filter(o => 
          o.bid_status=="Bidding" && o.status=="Accepted"
        );
  
        setAvailableOrders(availableOrders);
        setAcceptedOrders(acceptedOrders);
        setPlacedBids(placedBids);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        if (err.response) {
          console.error("Response Data:", err.response.data);
        }
      });
  }, [transporterEmail]);
  

  const handlePlaceBid = async (orderId) => {
    const bidAmount = bidAmounts[orderId];
  
    if (!bidAmount) {
      alert("Please enter a bid amount");
      return;
    }
  
    try {
      const response = await axios.post(
       `${BACKEND_URL}/api/bids/place-bid`,
        {
          booking_id: orderId,
          transporter_email: transporterEmail,
          bid_amount: bidAmount,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Bid placed successfully:", response.data);
  
      // ✅ Re-fetch updated orders from backend
      const updated = await axios.get(
        `${BACKEND_URL}/booking/orders?transporterEmail=${transporterEmail}`
      );
      setPlacedBids((prevBids) => {
        const placedOrder = availableOrders.find((order) => order._id === orderId);
  
        if (!placedOrder) return prevBids; // Ensure order exists before adding
  
        return [
          ...prevBids,
          {
            ...placedOrder,
            bids: [...(placedOrder.bids || []), response.data.newBid],
          },
        ];
      });
      setAvailableOrders(updated.data.availableOrders || []);
       setPlacedBids(updated.data.placedBids || []);
      setAcceptedOrders(updated.data.acceptedOrders || []);
      //console.log("After bid placed list ",placedOrder);
    } catch (error) {
      console.error("Error placing bid:", error);
  
      if (error.response) {
        console.error("Server Response:", error.response.data);
        alert(`Error: ${error.response.data.message || "Failed to place bid"}`);
      }
    }
  };const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
       `${BACKEND_URL}/booking/cancel-booking`,
        {
          booking_id: orderId,
          transporter_email: transporterEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true, // ensure cookies are sent if using cookies
        }
      );
  
      alert("Order cancelled successfully!");
  
      // 🚨 Auto-logout if transporter is suspended
      if (response.data.logout) {
        alert("⚠️ Your account has been suspended due to multiple cancellations.");
        localStorage.removeItem("token"); // Clear JWT
        window.location.href = "/login";  // Redirect to login
        return; // Stop further execution
      }
  
      // 🔄 Refresh orders after cancellation
      const updatedOrders = await axios.get(
        `${BACKEND_URL}/booking/orders?transporterEmail=${transporterEmail}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAcceptedOrders(updatedOrders.data.acceptedOrders || []);
  
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order.");
    }
  };
  
  const handleAssignTruck = async (orderId, selectedTruckId,truck_shared) => {
    if (!selectedTruckId) {
      alert("Please select a truck before marking as done.");
      return;
    }
  
    try {
      console.log(orderId,selectedTruckId,truck_shared);
      const response = await axios.post(
        `${BACKEND_URL}/booking/assign-truck`,
        {
          booking_id: orderId,
          vehicle_id: selectedTruckId,
          truck_shared:truck_shared,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      alert("Truck assigned successfully!");

      setAssignedTrucks((prev) => ({ ...prev, [orderId]: true }));
  
      // Optionally refresh accepted orders and truck list
      const updatedOrders = await axios.get(
        `${BACKEND_URL}/booking/orders?transporterEmail=${transporterEmail}`
      );
      setAcceptedOrders(updatedOrders.data.acceptedOrders || []);
      console.log("updated order",updatedOrders);
      const updatedTrucks = await axios.get(
        `${BACKEND_URL}/booking/trucks/${transporterEmail}`
      );
      const available = updatedTrucks.data.filter(truck => truck.availability_status === true );
      const busy = updatedTrucks.data.filter(truck => truck.availability_status !== true );
      setAvailableTrucks(available);
      setBusyTrucks(busy);
  
    } catch (error) {
      console.error("Failed to assign truck:", error);
      alert("Error assigning truck. Try again.");
    }
  };

  const markAsAvailable = async (truckId) => {
   
    try {
      await axios.put(`${BACKEND_URL}/booking/vehicles/make-available/${truckId}`, {
        status: "available"
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      alert("Truck status updated to available!");
      // Optionally: refresh the bookings or vehicles list
    } catch (error) {
      console.error("Error updating truck status:", error);
      alert("Failed to update truck status.");
    }
  };
  
  const handleCompletedOrder = async (orderId) => {
    try {
      const response = await axios.post(
       `${BACKEND_URL}/booking/complete-order`,
        { booking_id: orderId}, // your backend should accept this
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
     console.log(response);
      alert("Order marked as completed!");
  
      // ✅ Re-fetch updated acceptedOrders
      const updatedOrders = await axios.get(
        `${BACKEND_URL}/booking/orders?transporterEmail=${transporterEmail}`
      );
      setAcceptedOrders(updatedOrders.data.acceptedOrders || []);
  
      // ✅ Optional: Also update busy/available trucks (if truck status is reset on complete)
      const updatedTrucks = await axios.get(
       `${BACKEND_URL}/booking/trucks/${transporterEmail}`
      );
      const available = updatedTrucks.data.filter(t => t.availability_status === true);
      const busy = updatedTrucks.data.filter(t => t.availability_status === false);
      //console.log("Available",available);
      setAvailableTrucks(available);
      setBusyTrucks(busy);
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Failed to mark order as complete.");
    }
  };
   
  return (
 
    <div className="min-h-screen bg-white py-10 px-6">
    <h2 className="text-3xl font-bold text-center mb-10 text-black">Manage Bookings</h2>
  
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  
      {/* Available Orders Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Orders</h3>
        {availableOrders.length > 0 ? (
          availableOrders.map(order => (
            <div key={order._id} className="mb-6 border p-4 rounded-xl bg-gray-100 shadow-sm">
              <p className="font-medium text-gray-800">Order #{order._id}</p>
              <p className="text-gray-600">Pickup: {order.pickup_loc}</p>
              <p className="text-gray-600">Dropoff: {order.dropoff_loc}</p>
              <p className="text-gray-600">Dropoff: {order.pickup_date}</p>
              <p className="text-sm text-gray-500">
                Sharing: <span className={order.is_shared ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
                  {order.is_shared ? "Allowed" : "Not Allowed"}
                </span>
              </p>

              <input
                type="number"
                placeholder="Enter bid amount (₹)"
                className="mt-3 border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500"
                value={bidAmounts[order._id] || ""}
                onChange={(e) => setBidAmounts({ ...bidAmounts, [order._id]: e.target.value })}
              />
              <button
                onClick={() => handlePlaceBid(order._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mt-3 w-full transition duration-300"
              >
                Place Bid
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No available orders</p>
        )}
      </div>
  
      {/* Placed Bids Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Placed Bids</h3>
        {placedBids.length > 0 ? (
          placedBids.map(order => (
            <div key={order._id} className="mb-6 border p-4 rounded-xl bg-gray-100 shadow-sm">
              <p className="font-medium text-gray-800">Order #{order._id}</p>
              <p className="text-gray-600">Customer: {order.email}</p>
              <p className="text-gray-600">Pickup: {order.pickup_loc}</p>
              <p className="text-gray-600">Dropoff: {order.dropoff_loc}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No placed bids</p>
        )}
      </div>
  
      {/* Accepted Orders Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Accepted Orders</h3>
        {acceptedOrders.length > 0 ? (
          acceptedOrders.map(order => (
            <div key={order._id} className="mb-6 border p-4 rounded-xl bg-gray-100 shadow-sm">
              <p className="font-medium text-gray-800">Order #{order._id}</p>
              <p className="text-gray-600">Pickup: {order.pickup_loc}</p>
              <p className="text-gray-600">Dropoff: {order.dropoff_loc}</p>
              <p className="text-gray-600">
                Accepted Bid: ₹{order.bids?.find(bid => bid.status === "Accepted")?.bid_amount || "N/A"}
              </p>
  
              {!order.vehicle_id && (
                <>
         <select
        value={selectedVehicles[order._id] || ""}
        onChange={(e) =>
          setSelectedVehicles({
            ...selectedVehicles,
            [order._id]: e.target.value,
          })
        }
        className="w-full border border-gray-300 rounded-lg mt-2 p-2">
        <option value="" disabled>Select Truck</option>
        {availableTrucks.map((truck) => (
          <option key={truck._id} value={truck._id}>
            {truck.vehicle_id}
          </option>
        ))}
      </select>

              <button
                onClick={() => handleAssignTruck(order._id, selectedVehicles[order._id],order.is_shared)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mt-3 w-full"
              >
                Assign Truck
              </button>
                </>
              )}
  
              <button
                onClick={() => handleCompletedOrder(order._id)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mt-3 w-full transition"
              >
                Mark as Completed
              </button>
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg mt-2 w-full transition"
              >
                ❌ Cancel Order
              </button>

            </div>
          ))
        ) : (
          <p className="text-gray-500">No accepted orders</p>
        )}
      </div>
  
    </div>
  
    {/* Busy Trucks Section */}
{busyTrucks.length > 0 && (
  <div className="mt-12">
    <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Busy Trucks</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {busyTrucks.map((truck) => (
        <div
          key={truck._id}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
        >
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-xl font-semibold text-gray-700">
              🚛 Truck #{truck._id}
            </h4>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                truck.availability_status
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {truck.availability_status ? "Available" : "Busy"}
            </span>
          </div>

          <div className="text-sm text-gray-600 space-y-2 mb-5">
          <p><span className="font-medium text-gray-850">Vehicle Number:</span> {truck.vehicle_id}</p>
            <p><span className="font-medium text-gray-800">Vehicle Type:</span> {truck.vehicle_type}</p>
            <p><span className="font-medium text-gray-800">Model:</span> {truck.model_make}</p>
            <p><span className="font-medium text-gray-800">Capacity:</span> {truck.capacity} kgs</p>
  
          </div>

          <button
            onClick={() => markAsAvailable(truck.vehicle_id)}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 px-4 rounded-xl transition duration-300"
          >
            ✅ Mark as Available
          </button>
        </div>
      ))}
      {/* Available Trucks Section */}
<div className="bg-white rounded-xl shadow-md p-6">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Trucks</h3>
  {availableTrucks.length > 0 ? (
    availableTrucks.map(truck => (
      <div key={truck._id} className="mb-4 border p-4 rounded-lg bg-green-50 shadow-sm">
        <p className="font-medium text-green-900">Truck #{truck._id}</p>
        <p className="text-green-800">Vehicle Number: {truck.vehicle_id}</p>
        <p className="text-green-800">Type: {truck.vehicle_type}</p>
        <p className="text-green-800">Capacity: {truck.capacity}</p>
        
        <p className="text-green-800">Status: {truck.availability_status ? "Available" : "Busy"}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No available trucks currently</p>
  )}
</div>

    </div>
  </div>
)}

  </div>
  );
};

export default Booking;




