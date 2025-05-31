import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationModal from "./Notification";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/auth/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setIsLoggedIn(data.loggedIn);
        setUser(data.user);
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

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
    <>
      {/* Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolling ? "bg-black/90 shadow-md" : "bg-black"}`}>
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
            CarryGo
          </Link>

          {/* Navigation Links */}
          <ul className="hidden lg:flex items-center space-x-6">
            <li><Link to="/" className="text-white hover:text-gray-300 transition">Home</Link></li>
            <li><Link to="/booking" className="text-white hover:text-gray-300 transition">Book</Link></li>
            {isLoggedIn && user && (
              <li><Link to="/update-goods" className="text-white hover:text-gray-300 transition">Update Goods</Link></li>
            )}
            <li><Link to="/aboutus" className="text-white hover:text-gray-300 transition">About Us</Link></li>
            <li><Link to="/help" className="text-white hover:text-gray-300 transition">Help</Link></li>
          </ul>

          {/* Right Side: Notifications & Profile */}
          <div className="flex items-center space-x-6">
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : isLoggedIn && user ? (
              <div className="flex items-center space-x-6">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(true)}
                    className="text-white hover:text-gray-400 transition"
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
                </div>

                {/* Profile Icon */}
                <Link to="/profile" className="text-white hover:text-gray-400 transition">
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
                  className="text-black bg-white px-4 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>

        {isNotifOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center"
            onClick={(e) => e.target === e.currentTarget && setIsNotifOpen(false)}
          >
            <NotificationModal notifications={notifications} onClose={() => setIsNotifOpen(false)} />
          </div>
        )}
      </nav>
    </>
  );
}

export default Nav;




// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import NotificationModal from "./Notification";

// function Nav() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//    const [isNotifOpen, setIsNotifOpen] = useState(false);
//   const [scrolling, setScrolling] = useState(false);
//    const [notifications, setNotifications] = useState([]);
//   const notifRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

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

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolling(window.scrollY > 50);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

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
//     <>
//       {/* Navbar */}
//       <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolling ? "bg-black shadow-md" : "bg-black"}`}>
//         <div className="container mx-auto flex items-center justify-between px-6 py-4">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold text-red-500">
//             CarryGo
//           </Link>

//           {/* Navigation Links */}
//           <ul className="hidden lg:flex items-center space-x-6">
//             <li><Link to="/" className="text-white hover:text-gray-300">Home</Link></li>
//             <li><Link to="/booking" className="text-white hover:text-gray-300">Book</Link></li>
//             {isLoggedIn && user && (
//               <li><Link to="/update-goods" className="text-white hover:text-gray-300">Update Goods</Link></li>
//             )}
//             <li><Link to="/aboutus" className="text-white hover:text-gray-300">About Us</Link></li>
//             <li><Link to="/help" className="text-white hover:text-gray-300">Help</Link></li>
//           </ul>

//           {/* Right Side: Notifications & Profile */}
//           <div className="flex items-center space-x-6">
//             {loading ? (
//               <div className="text-white">Loading...</div>
//             ) : isLoggedIn && user ? (
//               <div className="flex items-center space-x-6">
//                 {/* Notification Bell */}
//                 <div className="relative" ref={notifRef}>
//                 <button
//                 onClick={() => setIsNotifOpen(true)}
//                 className="text-white hover:text-red-500 focus:outline-none relative"
//                 aria-label="Notifications"
//               >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       className="w-6 h-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.086-1.687-5.64-4.209-6.32A2.009 2.009 0 0012 4a2.009 2.009 0 00-1.791.68C7.687 5.36 6 7.914 6 11v3.158c0 .379-.145.737-.405 1.042L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
//                       />
//                     </svg>

//                   </button>
//                 </div>

//                 {/* Profile Icon */}
//                 <Link to="/profile" className="text-white hover:text-gray-300">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="w-8 h-8"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M5.121 17.804A9 9 0 1118.879 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 <Link to="/login" className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600">
//                   Login
//                 </Link>
//                 <Link to="/signup" className="text-white bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-800">
//                   Signup
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
        
//       {isNotifOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center"
//           onClick={(e) => e.target === e.currentTarget && setIsNotifOpen(false)}
//         >
//           <NotificationModal notifications={notifications} onClose={() => setIsNotifOpen(false)} />
//         </div>
//       )}
//       </nav>
//     </>
//   );
// }

// export default Nav;
