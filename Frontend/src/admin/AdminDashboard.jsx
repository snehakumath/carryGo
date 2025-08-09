import Sidebar from './pages/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AdminHome from './pages/AdminHome';
import Customers from './pages/Customers';
import Transporters from './pages/Transporters';
import Queries from './pages/Queries';
import CustomerProfile from './pages/CustomerProfile';
import TransporterProfile from './pages/TransporterProfile';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <Routes>
        <Route index element={<AdminHome />} />
          {/* <Route path="/" element={<AdminHome />} /> */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/transporters" element={<Transporters />} />
          <Route path="/queries" element={<Queries />} />
         <Route path="/customer-profile/:email" element={<CustomerProfile/>} />
         <Route path="/transporter-profile/:email" element={<TransporterProfile/>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
