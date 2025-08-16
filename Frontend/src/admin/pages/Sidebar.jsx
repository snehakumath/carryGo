import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Truck, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.startsWith(path);
  const activeClass = "bg-[#2a2a2a] text-white font-semibold";
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin-login');
  };

  return (
    <div className="w-64 h-screen bg-[#1e1e1e] text-white fixed shadow-xl border-r border-gray-700">
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">Admin Panel</div>
      <ul className="space-y-2 p-4 text-sm">
        <li>
          <Link
            to="/admin"
            className={`flex items-center gap-3 p-3 rounded hover:bg-[#333] transition ${isActive('/admin') && location.pathname === '/admin' ? activeClass : ''}`}
          >
            <Home size={20} /> Home
          </Link>
        </li>
        <li>
          <Link
            to="/admin/customers"
            className={`flex items-center gap-3 p-3 rounded hover:bg-[#333] transition ${isActive('/admin/customers') ? activeClass : ''}`}
          >
            <Users size={20} /> Customers
          </Link>
        </li>
        <li>
          <Link
            to="/admin/transporters"
            className={`flex items-center gap-3 p-3 rounded hover:bg-[#333] transition ${isActive('/admin/transporters') ? activeClass : ''}`}
          >
            <Truck size={20} /> Transporters
          </Link>
        </li>
        <li>
          <Link
            to="/admin/queries"
            className={`flex items-center gap-3 p-3 rounded hover:bg-[#333] transition ${isActive('/admin/queries') ? activeClass : ''}`}
          >
            <HelpCircle size={20} /> Queries
          </Link>
        </li>
        <li className="pt-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded hover:bg-[#333] transition text-left"
          >
            <LogOut size={20} /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

