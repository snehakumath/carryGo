
import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "./FeedbackForm";
import { useApi } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";
const Profile = () => {

  const [user, setUser]  = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbacks, setFeedbacks] = useState({});
const [feedbackForm, setFeedbackForm] = useState({});
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
   const { setAuthStatus } = useApi();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    phone: "",
    address: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate(); 

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
          fetchOrders(userData.email);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        if (err.response && err.response.status === 401) {
          window.location.href = "/login";
        }
      });
  }, []);
  
  // useEffect(() => {
  //   axios
  //     .get(`${BACKEND_URL}/api/profile`, { withCredentials: true })
  //     .then((response) => {
  //       if (response.data.success) {
  //         const userData = response.data.user;
  //        // console.log("Response",response);
  //         setUser(userData);
  //         setFormData({
  //           name: userData.name,
  //           email: userData.email,
  //           city: userData.city,
  //           phone: userData.phone,
  //           address: userData.address,
  //         });
  //         setPreview(userData.profilePicture || "/Images/avatar.jpeg");

  //         // Fetch orders for this user
  //         fetchOrders(userData.email);
  //       }
  //     })
  //     .catch((err) => console.error("Error fetching profile:", err));
  // }, []);

  const fetchOrders = async (email) => {
    try {
      console.log("email",email);
      const response = await axios.get(`${BACKEND_URL}/booking/view-orders/${email}`);
        console.log("response",response);
      if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        response.data.orders.forEach(order => fetchFeedbackForOrder(order._id));
       // console.log("data",response.data.orders );
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };
  
  const fetchFeedbackForOrder = async (orderId) => {
    try {
      console.log("fetch",orderId);
      const res = await axios.get(`${BACKEND_URL}/api/feedback/${orderId}`);
      console.log("REs",res);
      if (res.data.feedback && res.data.feedback.orderId) {
        setFeedbacks((prev) => ({ ...prev, [res.data.feedback.orderId]: res.data.feedback }));
      }
      
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const submitFeedback = async (order) => {
    const feedback = feedbackForm[order.order_id];
    if (!feedback || !feedback.rating || !feedback.comments) {
      alert("Please provide rating and comments.");
      return;
    }
   console.log("Feedback: ",feedback,feedback.rating,feedback.comments);
    try {
      await axios.post(`${BACKEND_URL}/api/feedback`, {
        orderId: order.order_id,
        rating: feedback.rating,
        feedbackText: feedback.comments,
      });
      alert("Feedback submitted successfully");
      fetchFeedbackForOrder(order.order_id); // Refresh feedback
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
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
  //     localStorage.removeItem("token");
  //     window.location.href = "/login";
  //   });
  // };
const handleLogout = async () => {
  try {
    await axios.post(`${BACKEND_URL}/logout`, {}, { withCredentials: true });
    setAuthStatus({ loggedIn: false, user: null }); // update Nav instantly
    navigate("/login"); // use react-router navigation
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  
  

  if (!user) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-white flex flex-col md:flex-row p-6 gap-6">
      {/* Sidebar - Profile Info */}
      <div className="w-full md:w-1/3 bg-[#2c2c2e] p-6 rounded-2xl shadow-lg border border-gray-600">
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
          {Array.isArray(orders) && orders.map((order, idx) => (
  <div
    key={order.order_id || idx}
    className="bg-[#3a3a3c] p-4 rounded-lg shadow-md border border-gray-500"
  >
  <p><strong>Order ID:</strong> {order.order_id}</p>
<p><strong>Nameee:</strong> {order.name}</p>
<p><strong>Email:</strong> {order.email}</p>
<p><strong>Pickup Location:</strong> {order.pickup_loc}</p>
<p><strong>Dropoff Location:</strong> {order.dropoff_loc}</p>
<p><strong>Goods Type:</strong> {order.goods_type}</p>
<p><strong>Goods Weight:</strong> {order.goods_weight} kg</p>
<p><strong>Truck Type:</strong> {order.truckType}</p>
<p><strong>Pickup Date:</strong> {new Date(order.pickup_date).toLocaleDateString()}</p>
<p><strong>Status:</strong> {order.status}</p>
<p><strong>Bid Status:</strong> {order.bid_status}</p>
<p><strong>Order Completed:</strong> {order.order_completed ? "Yes" : "No"}</p>
<p><strong>Final Amount:</strong> ₹{order.final_amount ?? "Pending"}</p>
<div className="mt-4 border-t pt-4">
  <h3 className="text-lg font-semibold text-white">Feedback</h3>

  {feedbacks[order._id] ? (
  <div className="mt-2">
    <p><strong>Rating:</strong> {feedbacks[order._id].rating} ⭐</p>
    <p><strong>Comments:</strong> {feedbacks[order._id].feedbackText}</p>
  </div>
) : (
    <div className="mt-2 space-y-2">
      <label className="block text-sm">Rating:</label>
      <select
        value={feedbackForm[order.order_id]?.rating || ""}
        onChange={(e) =>
          setFeedbackForm((prev) => ({
            ...prev,
            [order.order_id]: {
              ...(prev[order.order_id] || {}),
              rating: e.target.value,
            },
          }))
        }
        className="w-full px-3 py-2 bg-[#4a4a4c] border border-gray-500 rounded-md text-white"
      >
        <option value="">Select rating</option>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <label className="block text-sm mt-2">Comments:</label>
      <textarea
        value={feedbackForm[order.order_id]?.comments || ""}
        onChange={(e) =>
          setFeedbackForm((prev) => ({
            ...prev,
            [order.order_id]: {
              ...(prev[order.order_id] || {}),
              comments: e.target.value,
            },
          }))
        }
        className="w-full px-3 py-2 bg-[#4a4a4c] border border-gray-500 rounded-md text-white"
        rows={3}
      />

      <button
        onClick={() => submitFeedback(order)}
        className="mt-2 bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md"
      >
        Submit Feedback
      </button>
    </div>
  )}
</div>
</div>
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

