import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-8">
      <div className="container mx-auto px-4">
        {/* Top Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <Link
              to="/"
              className="text-xl font-bold text-red-500 cursor-pointer"
            >
              CarryGo
            </Link>
            <p className="text-sm mt-2">
              Your reliable transport solution for all your delivery needs. Fast, efficient, and trustworthy service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-2">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="/owner"
                  className="text-white hover:text-red-500 text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/owner/manage-vehicles"
                  className="text-white hover:text-red-500 text-sm"
                >
                  Manage Vehicles
                </a>
              </li>
              <li>
                <a
                  href="/owner/booking"
                  className="text-white hover:text-red-500 text-sm"
                >
                  Booking
                </a>
              </li>
              <li>
                <a
                  href="/owner/earning"
                  className="text-white hover:text-red-500 text-sm"
                >
                  Earning
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-semibold mb-2">Contact Info</h5>
            <ul className="space-y-2">
              <li className="text-sm">
                <strong>Email:</strong> contact@carrygo.com
              </li>
              <li className="text-sm">
                <strong>Phone:</strong> +123 456 7890
              </li>
              <li className="text-sm">
                <strong>Address:</strong> 123 Transport Ave, City, Country
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h5 className="font-semibold mb-2">Follow Us</h5>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                className="text-white hover:text-red-500 text-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.twitter.com"
                className="text-white hover:text-red-500 text-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com"
                className="text-white hover:text-red-500 text-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com"
                className="text-white hover:text-red-500 text-xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-sm mt-8 border-t pt-4">
          <p>&copy; {new Date().getFullYear()} CarryGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;