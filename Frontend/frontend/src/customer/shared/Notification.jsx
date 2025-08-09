import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { X } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const socket = io(BACKEND_URL);


const CustomerNotification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [customerEmail,setCustomerEmail]=useState(null);
  
  useEffect(() => {
      // Fetch user profile data from the backend
      axios.get(`${BACKEND_URL}/api/profile`)
        .then((response) => {
          if (response.data.success) {
              setCustomerEmail(response.data.user.email);
          } else {
            console.error("Error fetching profile data");
          }
        })
        .catch((err) => console.error("Error:", err));
    }, []);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));

    if (customerEmail) {
      socket.emit("joinCustomer", customerEmail);
      console.log("Joined room with email:", customerEmail);
    }

    // Load previous notifications
    socket.on("previousNotifications", (data) => {
      console.log("Previous notifications:", data);
      setNotifications(data);
    });

    socket.on("customerNotification", (data) => {
      console.log("Received Notification:", data);

      // Prevent duplicate notifications
      setNotifications((prev) => {
        const exists = prev.some((notif) => notif._id === data._id);
        return exists ? prev : [data, ...prev];
      });
    });

    return () => {
      socket.off("customerNotification");
      socket.off("previousNotifications");
      socket.off("connect");
    };
  }, [customerEmail]);

  // Mark notifications as read when opened
  const markAsRead = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/notifications/markAsRead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customerEmail }),
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="relative bg-white shadow-lg rounded-lg w-80">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <h2 className="text-gray-700 font-semibold">Customer Notifications</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Notification List */}
      <ul className="max-h-64 overflow-auto">
        {notifications.length === 0 ? (
          <li className="p-3 text-center text-gray-500">No new notifications</li>
        ) : (
          notifications.map((notif) => (
            <li key={notif._id} className="p-3 border-b text-sm">
              <strong>{notif.message}</strong>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CustomerNotification;


