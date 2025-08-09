import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NotificationModal from "./Notification";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     setIsLoggedIn(false);
  //     setUser(null);
  //     setLoading(false);
  //     return;
  //   }

  //   fetch("/auth/status", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setIsLoggedIn(data.loggedIn);
  //       setUser(data.user || null);
  //     })
  //     .catch(() => setIsLoggedIn(false))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/auth/status`, {
      method: "GET",
      credentials: "include", // include cookies
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setIsLoggedIn(data.loggedIn);
        setUser(data.user || null);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);
  
  return (
    // Only styling updated - structure untouched
<nav className="bg-black border-b border-gray-800 shadow-md relative">
  <div className="container mx-auto flex items-center justify-between px-4 py-3">
    <Link to="/" className="text-2xl font-bold text-white tracking-wider hover:text-red-500 transition-all">CarryGo</Link>

    <ul className="hidden lg:flex items-center space-x-8">
      <li><Link to="/owner/home" className="text-white hover:text-red-500 transition-colors duration-200">Home</Link></li>
      <li><Link to="/owner/booking" className="text-white hover:text-red-500 transition-colors duration-200">Book</Link></li>
      {isLoggedIn && user?.user_type === "transporter" && (
        <>
          <li><Link to="/owner/earning" className="text-white hover:text-red-500 transition-colors duration-200">Earning</Link></li>
          <li><Link to="/owner/manage-vehicles" className="text-white hover:text-red-500 transition-colors duration-200">Manage Vehicles</Link></li>
        </>
      )}
      <li><Link to="/owner/about-us" className="text-white hover:text-red-500 transition-colors duration-200">About Us</Link></li>
      <li><Link to="/owner/help" className="text-white hover:text-red-500 transition-colors duration-200">Help</Link></li>
    </ul>

    <div className="flex items-center space-x-4">
      {loading ? (
        <div className="text-white text-sm italic">Loading...</div>
      ) : isLoggedIn && user ? (
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="text-white hover:text-red-500 transition-colors duration-200 focus:outline-none relative"
            aria-label="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.086-1.687-5.64-4.209-6.32A2.009 2.009 0 0012 4a2.009 2.009 0 00-1.791.68C7.687 5.36 6 7.914 6 11v3.158c0 .379-.145.737-.405 1.042L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
              />
            </svg>
          </button>

          {/* Profile Icon */}
          <Link to="/owner/profile" className="text-white hover:text-red-500 transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <>
          <Link
            to="/login"
            className="text-sm text-black bg-white px-4 py-2 rounded-md hover:bg-gray-200 transition-all"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-all"
          >
            Signup
          </Link>
        </>
      )}
    </div>
  </div>

  {isNotifOpen && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={(e) => e.target === e.currentTarget && setIsNotifOpen(false)}
    >
      <NotificationModal notifications={notifications} onClose={() => setIsNotifOpen(false)} />
    </div>
  )}
</nav>

    // <nav className="bg-black border-b shadow-md relative">
    //   <div className="container mx-auto flex items-center justify-between px-4 py-3">
    //     <Link to="/" className="text-xl font-bold text-red-500">CarryGo</Link>

    //     <ul className="hidden lg:flex items-center space-x-6">
    //       <li><Link to="/owner/home" className="text-white hover:text-red-500">Home</Link></li>
    //       <li><Link to="/owner/booking" className="text-white hover:text-red-500">Book</Link></li>
    //       {isLoggedIn && user?.user_type === "transporter" && (
    //         <>
    //           <li><Link to="/owner/earning" className="text-white hover:text-red-500">Earning</Link></li>
    //           <li><Link to="/owner/manage-vehicles" className="text-white hover:text-red-500">Manage Vehicles</Link></li>
    //         </>
    //       )}
    //       <li><Link to="/owner/about-us" className="text-white hover:text-red-500">About Us</Link></li>
    //       <li><Link to="/owner/help" className="text-white hover:text-red-500">Help</Link></li>
    //     </ul>

    //     <div className="flex items-center space-x-4">
    //       {loading ? (
    //         <div className="text-white">Loading...</div>
    //       ) : isLoggedIn && user ? (
    //         <div className="flex items-center space-x-6">
    //           {/* Notification Bell */}
    //           <button
    //             onClick={() => setIsNotifOpen(true)}
    //             className="text-white hover:text-red-500 focus:outline-none relative"
    //             aria-label="Notifications"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //               className="w-6 h-6"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.086-1.687-5.64-4.209-6.32A2.009 2.009 0 0012 4a2.009 2.009 0 00-1.791.68C7.687 5.36 6 7.914 6 11v3.158c0 .379-.145.737-.405 1.042L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
    //               />
    //             </svg>
    //           </button>

    //           {/* Profile Icon */}
    //           <Link to="/owner/profile" className="text-white hover:text-red-500">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //               className="w-8 h-8"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    //               />
    //             </svg>
    //           </Link>
    //         </div>
    //       ) : (
    //         <>
    //           <Link to="/login" className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600">Login</Link>
    //           <Link to="/signup" className="text-white bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-800">Signup</Link>
    //         </>
    //       )}
    //     </div>
    //   </div>

    //   {isNotifOpen && (
    //     <div 
    //       className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center"
    //       onClick={(e) => e.target === e.currentTarget && setIsNotifOpen(false)}
    //     >
    //       <NotificationModal notifications={notifications} onClose={() => setIsNotifOpen(false)} />
    //     </div>
    //   )}
    // </nav>
  );
}

export default Nav;




// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Nav() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isNotifOpen, setIsNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const notifRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
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
//       .catch(() => setIsLoggedIn(false))
//       .finally(() => setLoading(false));
//   }, []);

//   // Real-time Notifications from Socket.io
//   useEffect(() => {
//     socket.on("newNotification", (message) => {
//       setNotifications((prev) => [message, ...prev]); // Add new notification to the list
//     });

//     return () => {
//       socket.off("newNotification");
//     };
//   }, []);

//   // Close notification dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (notifRef.current && !notifRef.current.contains(event.target)) {
//         setIsNotifOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav className="bg-black border-b shadow-md relative">
//       <div className="container mx-auto flex items-center justify-between px-4 py-3">
//         <Link to="/" className="text-xl font-bold text-red-500">CarryGo</Link>

//         <ul className="hidden lg:flex items-center space-x-6">
//           <li><Link to="/owner/home" className="text-white hover:text-red-500">Home</Link></li>
//           <li><Link to="/owner/booking" className="text-white hover:text-red-500">Book</Link></li>
//           {isLoggedIn && user && (
//             <>
//               <li><Link to="/owner/earning" className="text-white hover:text-red-500">Earning</Link></li>
//               <li><Link to="/owner/manage-vehicles" className="text-white hover:text-red-500">Manage vehicles</Link></li>
//             </>
//           )}
//           <li><Link to="/owner/about-us" className="text-white hover:text-red-500">About Us</Link></li>
//           <li><Link to="/owner/help" className="text-white hover:text-red-500">Help</Link></li>
//         </ul>

//         <div className="flex items-center space-x-4">
//           {loading ? (
//             <div className="text-white">Loading...</div>
//           ) : isLoggedIn && user ? (
//             <div className="flex items-center space-x-6">
//               {/* Notification Bell */}
//               <div className="relative" ref={notifRef}>
//                 <button
//                   onClick={() => setIsNotifOpen(!isNotifOpen)}
//                   className="text-white hover:text-red-500 focus:outline-none relative"
//                   aria-label="Notifications"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.086-1.687-5.64-4.209-6.32A2.009 2.009 0 0012 4a2.009 2.009 0 00-1.791.68C7.687 5.36 6 7.914 6 11v3.158c0 .379-.145.737-.405 1.042L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
//                     />
//                   </svg>

//                   {/* Notification Badge */}
//                   {notifications.length > 0 && (
//                     <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                       {notifications.length}
//                     </span>
//                   )}
//                 </button>

//                 {/* Notification Dropdown */}
//                 {isNotifOpen && (
//                   <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md z-20 p-3">
//                     <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Notifications</h3>
//                     {notifications.length > 0 ? (
//                       notifications.map((notif, index) => (
//                         <div key={index} className="p-2 border-b last:border-none text-gray-800">
//                           {notif}
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-gray-500 text-sm p-2">No new notifications</p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Profile Icon */}
//               <Link to="/profile" className="text-white hover:text-red-500">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   className="w-8 h-8"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                 </svg>
//               </Link>
//             </div>
//           ) : (
//             <>
//               <Link to="/login" className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600">
//                 Login
//               </Link>
//               <Link to="/signup" className="text-white bg-gray-700 px-3 py-1 rounded-md hover:bg-gray-800">
//                 Signup
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Background Blur Effect */}
//       {isNotifOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"
//           onClick={() => setIsNotifOpen(false)}
//         ></div>
//       )}
//     </nav>
//   );
// }

// export default Nav;
