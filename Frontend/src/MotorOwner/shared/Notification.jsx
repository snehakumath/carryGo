import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const seenNotificationIds = useRef(new Set());
  const socketRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(BACKEND_URL);
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.emit("joinTransporter");

    socket.off("previousNotifications");
    socket.on("previousNotifications", (data) => {
      const newOnes = data.filter((notif) => {
        if (seenNotificationIds.current.has(notif._id)) return false;
        seenNotificationIds.current.add(notif._id);
        return true;
      });

      setNotifications((prev) => [...prev, ...newOnes]);
    });

    socket.off("newNotification");
    socket.on("newNotification", (data) => {
      console.log('Received new notifications:', data);
      const newData = Array.isArray(data) ? data : [data];

      const newOnes = newData.filter((notif) => {
        if (seenNotificationIds.current.has(notif._id)) return false;
        seenNotificationIds.current.add(notif._id);
        return true;
      });

      if (newOnes.length > 0) {
        setNotifications((prev) => [...newOnes, ...prev]);
        toast.info("New notification received!");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-xl text-white font-semibold mb-4">Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className="text-white">{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;



// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { X } from "lucide-react";

// const socket = io("http://localhost:8000");

// const Notification = ({ onClose }) => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     socket.on("connect", () => console.log("Connected to server"));

//     socket.emit("joinTransporter");

//     // Load previous notifications
//     socket.on("previousNotifications", (data) => {
//       console.log("Previous notifications:", data);
//       setNotifications(data);
//     });

//     socket.on("newNotification", (data) => {
//       console.log("Received Notification:", data);

//       // Prevent duplicate notifications
//       setNotifications((prev) => {
//         const exists = prev.some((notif) => notif._id === data._id);
//         return exists ? prev : [data, ...prev];
//       });
//     });

//     return () => {
//       socket.off("newNotification");
//       socket.off("previousNotifications");
//       socket.off("connect");
//     };
//   }, []);

//   return (
//     <div className="relative bg-white shadow-lg rounded-lg w-80">
//       {/* Header */}
//       <div className="p-3 border-b flex items-center justify-between">
//         <h2 className="text-gray-700 font-semibold">Notifications</h2>
//         <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
//           <X className="w-5 h-5 text-gray-700" />
//         </button>
//       </div>

//       {/* Notification List */}
//       <ul className="max-h-64 overflow-auto">
//         {notifications.length === 0 ? (
//           <li className="p-3 text-center text-gray-500">No new notifications</li>
//         ) : (
//           notifications.map((notif) => (
//             <li key={notif._id} className="p-3 border-b text-sm">
//               <strong>{notif.message}</strong>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// };

// export default Notification;



