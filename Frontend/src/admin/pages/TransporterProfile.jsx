import React, { useEffect, useState } from "react";
import axios from "axios";

const TransporterProfile = ({ email }) => {
  const [transporter, setTransporter] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  useEffect(() => {
    if (!email) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res1 = await axios.get(`${BACKEND_URL}/api/admin/transporters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res1.data.find((u) => u.email === email);
        setTransporter(user);

        const res2 = await axios.get(`${BACKEND_URL}/api/admin/transporter-bookings/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res2.data);
      } catch (err) {
        console.error("Error loading transporter profile", err);
      }
    };

    fetchData();
  }, [email]);

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.patch(`${BACKEND_URL}/api/admin/toggle-user-status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setTransporter((prev) =>
        prev ? { ...prev, status: res.data.user.status } : prev
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };
  

  const filteredBookings = bookings.filter((b) =>
    `${b.order_id} ${b.pickup_loc} ${b.dropoff_loc} ${b.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f5f5f5] min-h-screen">
      <h2 className="text-2xl font-bold text-[#2e2e2e] mb-4">Transporter Profile</h2>

      {transporter && (
        <div className="bg-white shadow rounded p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">{transporter.name}</h3>
          <p><strong>Email:</strong> {transporter.email}</p>
          <p><strong>Phone:</strong> {transporter.phone}</p>
          <p><strong>City:</strong> {transporter.city || "—"}</p>
                <button
                      onClick={() => handleToggleStatus(transporter._id)}
                      className={`text-sm px-3 py-1 rounded transition ${
                        transporter.status === "Suspended" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      } text-white ml-2`}
                    >
                      {transporter.status === "Suspended" ? "Activate" : "Suspend"}
                    </button>
          
        </div>
      )}

      <input
        type="text"
        placeholder="Search bookings..."
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Pickup</th>
              <th className="px-4 py-2">Drop-off</th>
              <th className="px-4 py-2">Goods</th>
              <th className="px-4 py-2">Weight</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{b.order_id}</td>
                <td className="px-4 py-2">{b.pickup_loc}</td>
                <td className="px-4 py-2">{b.dropoff_loc}</td>
                <td className="px-4 py-2">{b.goods_type}</td>
                <td className="px-4 py-2">{b.goods_weight} kg</td>
                <td className="px-4 py-2">{b.status}</td>
                <td className="px-4 py-2">{b.final_amount ? `₹${b.final_amount}` : "-"}</td>
                <td className="px-4 py-2">
                  {new Date(b.pickup_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransporterProfile;
