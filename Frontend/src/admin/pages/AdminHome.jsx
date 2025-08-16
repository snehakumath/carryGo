import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent } from "../pages/card"; // adjust path based on location


const AdminHome = () => {
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalTransporters: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    transporterStatusCount: [],
    monthlySuccessRate: [],
  });
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  
  useEffect(() => {
    const fetchSummary = async () => {
      console.log("summary");
      try {
        const res = await axios.get(`${BACKEND_URL}/api/admin/summary`, {
          withCredentials: true,
        });
        console.log("Admin summary response:", res.data);
      setSummary(res.data);
       // setSummary({
          // totalCustomers: res.data.totalCustomers || 0,
          // totalTransporters: res.data.totalTransporters || 0,
          // totalRevenue: res.data.totalRevenue || 0,
          // monthlyRevenue: res.data.monthlyRevenue || [],
          // transporterStatusCount: res.data.transporterStatusCount || [],
          // monthlySuccessRate: res.data.monthlySuccessRate || [],
         
       // });
        
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };
    fetchSummary();
  }, []);

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="p-4">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold">Total Customers</h2>
            <p className="text-2xl">{summary.totalCustomers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold">Total Transporters</h2>
            <p className="text-2xl">{summary.totalTransporters}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold">Total Revenue</h2>
            <p className="text-2xl">₹{summary.totalRevenue}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Transporter Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summary.transporterStatusCount || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label>
   {summary.transporterStatusCount?.map((entry, index) => (
  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}

                  {/* {summary.transporterStatusCount.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))} */}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Monthly Success Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={summary.monthlySuccessRate || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="successRate" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Rate Text */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Success Rate Summary</h3>
            {summary.monthlySuccessRate.length > 0 ? (
              <ul className="list-disc pl-4">
                {summary.monthlySuccessRate.map((item, idx) => (
                  <li key={idx}>
                    {item.month}: {item.successRate}%
                  </li>
                ))}
              </ul>
            ) : (
              <p>No success rate data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer
// } from 'recharts';

// const AdminHome = () => {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const COLORS = ['#4b5563', '#9ca3af']; // Grey tones

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('adminToken');
//         const res = await axios.get('http://localhost:8000/api/admin/summary', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setSummary(res.data);
//       } catch (err) {
//         console.error("Failed to load admin summary:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="ml-64 p-6 text-gray-600">Loading dashboard...</div>;
//   }

//   return (
//     <>
//     <div className="p-6 bg-[#f8f8f8] min-h-screen ">
//       <h1 className="text-2xl font-bold mb-6 text-[#2e2e2e]">Website Performance Overview</h1>

//       {/* Overview Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
//         <Card title="Customers" value={summary.customers} />
//         <Card title="Transporters" value={summary.transporters} />
//         <Card title="Bookings" value={summary.bookings} />
//         <Card title="Revenue" value={`₹${(summary.revenue / 100000).toFixed(2)}L`} />
//       </div>

//       {/* Graphs */}
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Bar Chart */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="text-lg font-semibold mb-4 text-[#2e2e2e]">Monthly Bookings</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={summary.monthlyBookings}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="bookings" fill="#4b5563" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-white shadow rounded p-4">
//           <h2 className="text-lg font-semibold mb-4 text-[#2e2e2e]">User Distribution</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={[
//                   { name: 'Customers', value: summary.customers },
//                   { name: 'Transporters', value: summary.transporters }
//                 ]}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 label
//                 dataKey="value"
//               >
//                 <Cell fill="#4b5563" />
//                 <Cell fill="#9ca3af" />
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
// <div className="grid md:grid-cols-2 gap-8">
  
//   {/* 📈 Curve Line Chart for Revenue */}
//   <div className="bg-white shadow rounded p-4">
//     <h2 className="text-lg font-semibold mb-4 text-[#2e2e2e]">Monthly Revenue</h2>
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={summary.monthlyRevenue}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="month" />
//         <YAxis />
//         <Tooltip />
//         <Line type="monotone" dataKey="revenue" stroke="#374151" strokeWidth={3} dot={{ r: 4 }} />
//       </LineChart>
//     </ResponsiveContainer>
//   </div>

//   {/* ✅ Monthly Success Rate */}
//   <div className="bg-white shadow rounded p-4">
//     <h2 className="text-lg font-semibold mb-4 text-[#2e2e2e]">Monthly Success Rate (%)</h2>
//     <ResponsiveContainer width="100%" height={300}>
//       <BarChart data={summary.monthlySuccessRate}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="month" />
//         <YAxis domain={[0, 100]} />
//         <Tooltip />
//         <Bar dataKey="successRate" fill="#16a34a" />
//       </BarChart>
//     </ResponsiveContainer>
//   </div>
// </div>

//     </div>
//     </>
//   );
// };

// const Card = ({ title, value }) => (
//   <div className="bg-white shadow rounded p-4 text-center">
//     <div className="text-gray-500 text-sm">{title}</div>
//     <div className="text-2xl font-bold text-[#2e2e2e]">{value}</div>
//   </div>
// );

// export default AdminHome;
