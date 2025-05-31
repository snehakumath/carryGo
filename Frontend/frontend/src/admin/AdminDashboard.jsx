// File: AdminDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { Link, Routes, Route, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Users from './Users';
// import Orders from './Orders';
// import Transporters from './Transporters';
// import Analytics from './Analytics';
// import DashboardHome from './DashboardHome';

// const AdminDashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear session and redirect
//     localStorage.removeItem('adminToken');
//     navigate('/admin-login');
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#910b0b] text-white flex flex-col p-4">
//         <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
//         <nav className="flex flex-col gap-4">
//           <Link to="" className="hover:text-yellow-300">Dashboard</Link>
//           <Link to="users" className="hover:text-yellow-300">Users</Link>
//           <Link to="orders" className="hover:text-yellow-300">Orders</Link>
//           <Link to="transporters" className="hover:text-yellow-300">Transporters</Link>
//           <Link to="analytics" className="hover:text-yellow-300">Analytics</Link>
//           <button onClick={handleLogout} className="mt-auto text-left text-sm text-red-300 hover:text-red-100">Logout</button>
//         </nav>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 bg-gray-100 p-6">
//         <Routes>
//           <Route path="" element={<DashboardHome />} />
//           <Route path="users" element={<Users />} />
//           <Route path="orders" element={<Orders />} />
//           <Route path="transporters" element={<Transporters />} />
//           <Route path="analytics" element={<Analytics />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;
