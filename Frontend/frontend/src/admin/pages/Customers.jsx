import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomerProfile from "./CustomerProfile"; // ✅ Import your component

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState(null); // ✅ Track selected customer

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("/api/admin/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers", err);
      }
    };
    fetchData();
  }, []);
  
  

  const filtered = customers.filter((c) =>
    `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ If an email is selected, show CustomerProfile
  if (selectedEmail) {
    return (
      <CustomerProfile
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)} // back button handler
      />
    );
  }

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      <h2 className="text-2xl font-bold text-[#2e2e2e] mb-4">Customers Overview</h2>

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
            {filtered.map((cust) => (
              <tr key={cust._id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{cust.name}</td>
                <td className="px-4 py-2">{cust.email}</td>
                <td className="px-4 py-2">{cust.phone}</td>
                <td className="px-4 py-2">{cust.city || "-"}</td>
                <td className="px-4 py-2">{cust.bookingCount}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedEmail(cust.email)} // ✅ Open profile
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
                  No matching customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;


