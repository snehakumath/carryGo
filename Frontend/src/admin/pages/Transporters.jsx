import React, { useEffect, useState } from "react";
import axios from "axios";
import TransporterProfile from "./TransporterProfile"; // make sure path is correct

const AdminTransporters = () => {
  const [transporters, setTransporters] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null); // new
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${BACKEND_URL}/api/admin/transporters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransporters(res.data);
      } catch (err) {
        console.error("Error fetching transporters", err);
      }
    };
    fetchData();
  }, []);

  

  const filtered = transporters.filter((t) =>
    `${t.name} ${t.email} ${t.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <h2 className="text-2xl font-bold text-[#2e2e2e] mb-4">Transporters Overview</h2>

      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">Bookings</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((transporter) => (
              <tr key={transporter._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{transporter.name}</td>
                <td className="px-4 py-2">{transporter.email}</td>
                <td className="px-4 py-2">{transporter.phone}</td>
                <td className="px-4 py-2">{transporter.city || "-"}</td>
                <td className="px-4 py-2">{transporter.bookingCount}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedEmail(transporter.email)}
                    className="bg-[#910b0b] text-white text-sm px-3 py-1 rounded hover:bg-red-800 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No matching transporters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedEmail && (
        <div className="mt-6">
          <TransporterProfile email={selectedEmail} />
        </div>
      )}
    </div>
  );
};

export default AdminTransporters;

