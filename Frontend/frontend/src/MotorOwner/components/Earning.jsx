import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#a855f7",
  "#f97316",
  "#ec4899",
  "#10b981",
];

const Earnings = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [chartDataCity, setChartDataCity] = useState([]);
  const [chartDataVehicle, setChartDataVehicle] = useState([]);
  const [transporterEmail, setTransporterEmail] = useState(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/booking/user/me`,
          { withCredentials: true }
        );
        setTransporterEmail(response.data.email);
      } catch (error) {
        console.error("Failed to retrieve user info:", error);
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (!transporterEmail) return;

    axios
      .get(
        `${BACKEND_URL}/api/payments/completed-orders/${transporterEmail}`
      )
      .then((res) => {
        const orders = Array.isArray(res.data) ? res.data : [];

        setCompletedOrders(orders);

        const total = orders.reduce(
          (sum, o) => sum + (o.amountEarned || 0),
          0
        );
        setTotalEarnings(total);

        const earningsByCity = {};
        const earningsByVehicle = {};

        orders.forEach((o) => {
          const city = o.dropoff_loc || "Unknown";
          earningsByCity[city] =
            (earningsByCity[city] || 0) + (o.amountEarned || 0);

          const vehicle = o.truck?.vehicle_id || "Unknown Vehicle";
          earningsByVehicle[vehicle] =
            (earningsByVehicle[vehicle] || 0) + (o.amountEarned || 0);
        });

        setChartDataCity(
          Object.entries(earningsByCity).map(([name, value]) => ({
            name,
            value,
          }))
        );
        setChartDataVehicle(
          Object.entries(earningsByVehicle).map(([name, value]) => ({
            name,
            value,
          }))
        );
      })
      .catch((err) => console.error("Failed to load orders", err));
  }, [transporterEmail]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Earnings Overview</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <p className="text-xl font-semibold text-green-700">
          Total Earnings: ₹{totalEarnings}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Pie Chart by City */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Earnings by City</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={chartDataCity}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartDataCity.map((_, index) => (
                  <Cell
                    key={`city-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart by Vehicle */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Earnings by Vehicle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={chartDataVehicle}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartDataVehicle.map((_, index) => (
                  <Cell
                    key={`vehicle-cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completed Orders */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Completed Orders</h3>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {completedOrders.map((order) => (
            <div key={order._id} className="border p-3 rounded">
              <p>
                <strong>From:</strong> {order.pickup_loc}
              </p>
              <p>
                <strong>To:</strong> {order.dropoff_loc}
              </p>
              <p>
                <strong>Delivered:</strong> {order.deliveryDate}
              </p>
              <p>
                <strong>Truck:</strong> {order.truck?.vehicle_id || "N/A"}
              </p>
              <p>
                <strong>Earned:</strong> ₹{order.amountEarned}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earnings;



//  import React, { useEffect, useState } from "react";
// import axios from "axios";
// import io from "socket.io-client";
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF6688"];

// const Earnings = () => {
//   const [earningsData, setEarningsData] = useState(null);
//   const [monthlyEarnings, setMonthlyEarnings] = useState([]);
//   const [completedBookings, setCompletedBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [transporterEmail, setTransporterEmail] = useState(null);

//   const socket = io("http://localhost:5000");

//   useEffect(() => {
//     const fetchUserEmail = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/booking/user/me", { withCredentials: true });
//         setTransporterEmail(response.data.email);
//       } catch (error) {
//         console.error("Failed to retrieve user info:", error);
//       }
//     };
//     fetchUserEmail();
//   }, []);

//   useEffect(() => {
//     if (!transporterEmail) return;

//     axios
//       .get(`http://localhost:8000/api/payments/earnings/${transporterEmail}`)
//       .then((response) => {
//         setEarningsData(response.data);
//         setMonthlyEarnings(response.data.monthlyEarnings);
//       })
//       .catch((error) => console.error("Error fetching earnings:", error));

// });
// useEffect(() => { 
//   if (!transporterEmail) return;

//   console.log("Fetching completed orders for:", transporterEmail);

//   axios
//   .get(`http://localhost:8000/bookings/completed-order?email=${transporterEmail}`)
//   .then((response) => {
//     console.log("API Response:", response.data); 
//     setCompletedBookings(response.data);
//   })
//   .catch((error) => {
//     console.error("Error fetching completed bookings:", error);
//   });

// }, [transporterEmail]);



//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     socket.on("newBooking", (data) => {
//       setNotifications((prev) => [...prev, data.message]);
//     });

//     return () => {
//       socket.off("newBooking");
//     };
//   }, []);

//   if (loading) return <p className="text-center text-lg font-bold">Loading Earnings...</p>;

//   if (!earningsData) return <p className="text-center text-lg text-red-500">No earnings data found.</p>;

//   // Pie Chart Data
//   const pieData = [
//     { name: "Total Earnings", value: earningsData.totalEarnings },
//     { name: "Pending Amount", value: earningsData.pendingEarnings },
//   ];

//   // Bar Chart for Monthly Earnings by Vehicle
//   const barData = monthlyEarnings.map((item) => ({
//     month: item.month,
//     ...item.vehicles.reduce((acc, vehicle) => {
//       acc[vehicle.vehicle_name] = vehicle.earnings;
//       return acc;
//     }, {}),
//   }));

//   return (
//     <div className="container mx-auto p-6">
//       <h2 className="text-3xl font-bold text-center mb-6">Transporter Earnings Dashboard</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="p-6 bg-white shadow-lg rounded-lg text-center">
//           <h3 className="text-xl font-semibold mb-2">Total Earnings</h3>
//           <p className="text-2xl font-bold text-green-600">₹{earningsData.totalEarnings}</p>
//         </div>

//         <div className="p-6 bg-white shadow-lg rounded-lg text-center">
//           <h3 className="text-xl font-semibold mb-2">Pending Payments</h3>
//           <p className="text-2xl font-bold text-red-500">₹{earningsData.pendingEarnings}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//         <div className="bg-white shadow-lg p-4 rounded-lg flex justify-center">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white shadow-lg p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-center">Monthly Earnings Per Vehicle</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={barData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               {monthlyEarnings.length > 0 &&
//                 monthlyEarnings[0].vehicles.map((vehicle, index) => (
//                   <Bar key={vehicle.vehicle_name} dataKey={vehicle.vehicle_name} fill={COLORS[index % COLORS.length]} />
//                 ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="mt-8">
//         <h3 className="text-2xl font-bold text-center mb-4">Payment Milestones</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="py-2 px-4 text-left">Transaction ID</th>
//                 <th className="py-2 px-4 text-left">Total Amount</th>
//                 <th className="py-2 px-4 text-left">Paid Amount</th>
//                 <th className="py-2 px-4 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {earningsData.payments.map((payment) => (
//                 <tr key={payment.transaction_id} className="border-b">
//                   <td className="py-2 px-4">{payment.transaction_id}</td>
//                   <td className="py-2 px-4">₹{payment.total_amount}</td>
//                   <td className="py-2 px-4">₹{payment.paid_amount}</td>
//                   <td className={`py-2 px-4 ${payment.payment_status === "success" ? "text-green-500" : "text-red-500"}`}>
//                     {payment.payment_status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Completed Bookings Section */}
//       <div className="mt-8">
//         <h3 className="text-2xl font-bold text-center mb-4">Completed Bookings</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="py-2 px-4 text-left">Booking ID</th>
//                 <th className="py-2 px-4 text-left">Customer Name</th>
//                 <th className="py-2 px-4 text-left">Vehicle</th>
//                 <th className="py-2 px-4 text-left">Total Price</th>
//                 <th className="py-2 px-4 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {completedBookings.map((booking) => (
//                 <tr key={booking.id} className="border-b">
//                   <td className="py-2 px-4">{booking.id}</td>
//                   <td className="py-2 px-4">{booking.customer_name}</td>
//                   <td className="py-2 px-4">{booking.vehicle}</td>
//                   <td className="py-2 px-4">₹{booking.total_price}</td>
//                   <td className="py-2 px-4 text-green-500">Completed</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Earnings;
