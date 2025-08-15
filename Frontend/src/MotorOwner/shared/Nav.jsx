import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationModal from "./Notification";
import { useApi } from "../../context/ApiContext";

function Nav() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const [loading, setLoading] = useState(true);

  const { authStatus } = useApi(); // ✅ moved before useEffect
  const isLoggedIn = authStatus?.loggedIn || false;
  const user = authStatus?.user || null;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authStatus) {
      setLoading(false);
    }
  }, [authStatus]);

  console.log("Auth Status",authStatus);
  console.log("is Loggedin",isLoggedIn, user);
  
    useEffect(() => {
      const handleScroll = () => setScrolling(window.scrollY > 50);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
      useEffect(() => {
        function handleClickOutside(event) {
          if (notifRef.current && !notifRef.current.contains(event.target)) {
            setIsNotifOpen(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <div ref={notifRef}>
      <NotificationModal 
        notifications={notifications} 
        onClose={() => setIsNotifOpen(false)} 
      />
    </div>
  </div>
)}

</nav>
  );
}

export default Nav;



// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import NotificationModal from "./Notification";
// import { useApi } from "../../context/ApiContext";

// function Nav() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isNotifOpen, setIsNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";


//   useEffect(() => {
//     fetch(`${BACKEND_URL}/auth/status`, {
//       method: "GET",
//       credentials: "include", // include cookies
//     })
//       .then((res) => res.ok ? res.json() : Promise.reject())
//       .then((data) => {
//         setIsLoggedIn(data.loggedIn);
//         setUser(data.user || null);
//       })
//       .catch(() => {
//         setIsLoggedIn(false);
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);
  
//   return (
//     // Only styling updated - structure untouched
// <nav className="bg-black border-b border-gray-800 shadow-md relative">
//   <div className="container mx-auto flex items-center justify-between px-4 py-3">
//     <Link to="/" className="text-2xl font-bold text-white tracking-wider hover:text-red-500 transition-all">CarryGo</Link>

//     <ul className="hidden lg:flex items-center space-x-8">
//       <li><Link to="/owner/home" className="text-white hover:text-red-500 transition-colors duration-200">Home</Link></li>
//       <li><Link to="/owner/booking" className="text-white hover:text-red-500 transition-colors duration-200">Book</Link></li>
//       {isLoggedIn && user?.user_type === "transporter" && (
//         <>
//           <li><Link to="/owner/earning" className="text-white hover:text-red-500 transition-colors duration-200">Earning</Link></li>
//           <li><Link to="/owner/manage-vehicles" className="text-white hover:text-red-500 transition-colors duration-200">Manage Vehicles</Link></li>
//         </>
//       )}
//       <li><Link to="/owner/about-us" className="text-white hover:text-red-500 transition-colors duration-200">About Us</Link></li>
//       <li><Link to="/owner/help" className="text-white hover:text-red-500 transition-colors duration-200">Help</Link></li>
//     </ul>

//     <div className="flex items-center space-x-4">
//       {loading ? (
//         <div className="text-white text-sm italic">Loading...</div>
//       ) : isLoggedIn && user ? (
//         <div className="flex items-center space-x-6">
//           {/* Notification Bell */}
//           <button
//             onClick={() => setIsNotifOpen(true)}
//             className="text-white hover:text-red-500 transition-colors duration-200 focus:outline-none relative"
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
//           <Link to="/owner/profile" className="text-white hover:text-red-500 transition-colors duration-200">
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
//           <Link
//             to="/login"
//             className="text-sm text-black bg-white px-4 py-2 rounded-md hover:bg-gray-200 transition-all"
//           >
//             Login
//           </Link>
//           <Link
//             to="/signup"
//             className="text-sm text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-all"
//           >
//             Signup
//           </Link>
//         </>
//       )}
//     </div>
//   </div>

//   {isNotifOpen && (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
//       onClick={(e) => e.target === e.currentTarget && setIsNotifOpen(false)}
//     >
//       <NotificationModal notifications={notifications} onClose={() => setIsNotifOpen(false)} />
//     </div>
//   )}
// </nav>
//   );
// }

// export default Nav;


