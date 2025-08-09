import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    phone: "",
    address: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [stats, setStats] = useState({
    totalResponses: 0,
    acceptedOrders: 0,
    successfulOrders: 0
  });
  

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/profile`, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          const userData = response.data.user;
          setUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            city: userData.city,
            phone: userData.phone,
            address: userData.address,
          });
          setPreview(userData.profilePicture || "/Images/avatar.jpeg");

          // Fetch orders for this user
          fetchOrders(userData.email);
          fetchStats(userData.email);

        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  // const fetchOrders = async (email) => {
  //   console.log("Emails..:-",email);
  //   try {
  //     const response = await axios.get(`/booking/delivered-orders/${email}`);
  //     console.log("Fetched orders response:", response.data.completedBookings);
  //     setOrders(response.data.completedBookings);
  //     // since it's just an array      
  //   } catch (err) {
  //     console.error("Error fetching orders:", err);
  //   }
  // };
  
  const fetchOrders = (email) => {
    axios
      .get(`${BACKEND_URL}/booking/delivered-orders/${email}`, { withCredentials: true })
      .then((response) => {
        console.log("Fetched orders full response:", response);
        console.log("Fetched orders data:", response.data);
        setOrders(response.data.completedBookings);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };
  
  
  const fetchStats = async (email) => {
    console.log("fetchStats",email);
    try {
      const res = await axios.get(`${BACKEND_URL}/booking/stats/${email}`);
      console.log("response",res);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } 
  };
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (profilePic) data.append("profilePicture", profilePic);

    try {
      const response = await axios.put(`${BACKEND_URL}/api/profile`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // const handleLogout = () => {
  //   axios.post("/logout", {}, { withCredentials: true }).then(() => {
  //     window.location.href = "/login";
  //   });
  // };
  
  const handleLogout = () => {
      axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true })
        .then(() => {
          window.location.href = "/login"; // redirect to login
        })
        .catch((err) => {
          console.error("Logout failed:", err);
        });
    };

  if (!user) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-white flex flex-col md:flex-row p-6 gap-6">
      {/* Sidebar - Profile Info */}
      <div className="w-full md:w-1/3 bg-[#2c2c2e] p-6 rounded-2xl shadow-lg border border-gray-600">
      <div>
        <div className="flex justify-center items-center flex-col mb-6">
          <img
            src={preview}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-[#f5f5f5] shadow-md"
          />
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 bg-[#3a3a3c] border border-gray-500 rounded-md text-white"
              />
            </div>
            {["name", "email", "city", "phone"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-semibold mb-1 capitalize">{field}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[#3a3a3c] border border-gray-500 rounded-md text-white"
                />
              </div>
            ))}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#3a3a3c] border border-gray-500 rounded-md text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f5f5f5] text-black font-semibold py-2 rounded-md hover:bg-gray-300 transition"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            {["name", "email", "city", "phone", "address"].map((field) => (
              <div key={field} className="mb-4">
                <p className="text-sm font-semibold capitalize">{field}</p>
                <p>{user[field]}</p>
              </div>
            ))}
          </div>
        )}
        {/* Stats always shown */}
        <div className="mb-4 mt-6 border-t border-gray-400 pt-4">
          <p className="text-sm font-semibold">📦 Total Responses</p>
          <p>{stats.totalResponses}</p>
          <p className="text-sm font-semibold mt-2">✅ Accepted Orders</p>
          <p>{stats.acceptedOrders}</p>
          <p className="text-sm font-semibold mt-2">🏁 Successful Deliveries</p>
          <p>{stats.successfulOrders}</p>
        </div>
      </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#f5f5f5] text-black font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="w-full md:w-2/3 bg-[#2c2c2e] p-6 rounded-2xl shadow-lg border border-gray-600 overflow-y-auto max-h-[85vh]">
        <h2 className="text-xl font-semibold mb-4 text-[#f5f5f5]">Completed Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400">No completed orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <div
                key={order._id || idx}
                className="bg-[#3a3a3c] p-4 rounded-lg shadow-md border border-gray-500"
              >
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Amount:</strong> ₹{order.final_amount}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Customer :</strong> {order.name}</p>
                <p><strong>Customer Email:</strong> {order.email}</p>
                <p><strong>Truck:</strong> {order.vehicle_id.vehicle_id}</p>
                <p><strong>Pickup Location:</strong> {order.pickup_loc}</p>
                <p><strong>Dropoff Location:</strong> {order.dropoff_loc}</p>
                {/* Add more details as per your schema */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
