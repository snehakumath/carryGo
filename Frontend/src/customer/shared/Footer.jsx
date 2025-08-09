import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">About CarryGo</h2>
            <p className="text-sm text-gray-400">
              CarryGo is a reliable transport service that ensures your goods are
              delivered on time and with care. Your journey, our responsibility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-white transition">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/aboutus" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white transition">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <p className="text-sm text-gray-400">
              <strong>Email:</strong> support@carrygo.com
            </p>
            <p className="text-sm text-gray-400">
              <strong>Phone:</strong> +1 234 567 890
            </p>
            <p className="text-sm text-gray-400">
              <strong>Address:</strong> 123 Transport Lane, Cityville
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CarryGo. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


// import React from "react";
// import { Link } from "react-router-dom";

// function Footer() {
//   return (
//     <footer className="bg-black text-white py-6">
//       <div className="container mx-auto px-4">
//         {/* Top Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* About Section */}
//           <div>
//             <h2 className="text-lg font-bold text-red-500 mb-4">About CarryGo</h2>
//             <p className="text-sm">
//               CarryGo is a reliable transport service that ensures your goods are
//               delivered on time and with care. Your journey, our responsibility.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h2 className="text-lg font-bold text-red-500 mb-4">Quick Links</h2>
//             <ul className="space-y-2">
//               <li>
//                 <Link to="/" className="hover:text-red-500">
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/booking" className="hover:text-red-500">
//                   Book Now
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/aboutus" className="hover:text-red-500">
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/help" className="hover:text-red-500">
//                   Help
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Section */}
//           <div>
//             <h2 className="text-lg font-bold text-red-500 mb-4">Contact Us</h2>
//             <p className="text-sm">
//               <strong>Email:</strong> support@carrygo.com
//             </p>
//             <p className="text-sm">
//               <strong>Phone:</strong> +1 234 567 890
//             </p>
//             <p className="text-sm">
//               <strong>Address:</strong> 123 Transport Lane, Cityville
//             </p>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="border-t border-gray-700 my-6"></div>

//         {/* Bottom Section */}
//         <div className="flex flex-col md:flex-row items-center justify-between">
//           <p className="text-sm text-gray-500">
//             &copy; {new Date().getFullYear()} CarryGo. All Rights Reserved.
//           </p>
//           <div className="flex space-x-4 mt-4 md:mt-0">
//             <a
//               href="https://facebook.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-gray-500 hover:text-white"
//             >
//               <i className="fab fa-facebook-f"></i>
//             </a>
//             <a
//               href="https://twitter.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-gray-500 hover:text-white"
//             >
//               <i className="fab fa-twitter"></i>
//             </a>
//             <a
//               href="https://instagram.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-gray-500 hover:text-white"
//             >
//               <i className="fab fa-instagram"></i>
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
