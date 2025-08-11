
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./customer/components/Home";
import Booking from "./customer/components/Booking";
import AboutUs from "./customer/components/AboutUs";
import Help from "./customer/components/Help";
import Layout from "./customer/components/Layout";
import UpdateGoods from "./customer/components/UpdateGoods";
import Login from "./customer/components/Login";
import Signup from "./customer/components/Signup";
import OwnerDashboard from "./MotorOwner/OwnerDashboard";
import Profile from "./customer/components/Profile";
import Payment from "./customer/components/Payment";
import ProtectedRoute from "./customer/components/ProtectedRoute";
import Notification from "./customer/shared/Notification";
import { ApiProvider } from "./context/ApiContext";
import AdminLogin from "./admin/AdminLogin";
import AdminSignup from "./admin/AdminSignup";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProtectedRoute from "./admin/pages/ProtectedRoute";

//import AdminDashboard from "./admin/AdminDashboard";

function App() {
  const token = localStorage.getItem("token");

  return (
    <ApiProvider>
    <Router>
      <Routes>
        {/* Redirect "/" based on login status */}
        <Route path="/" element={token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<Booking />} />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="help" element={<Help />} />
            <Route path="update-goods" element={<UpdateGoods />} />
           <Route path="profile" element={<Profile/>} /> 
            <Route path="payment" element={<Payment/>} />
            <Route path="/notifications" element={<Notification/>}/>
          </Route>
        </Route>

        {/* Protected Owner Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/owner/*" element={<OwnerDashboard />} />
        </Route>
       {/* Admin Auth Routes */}
<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/admin-signup" element={<AdminSignup />} />

{/* Admin Protected Routes */}
<Route path="/admin/*" element={
  <AdminProtectedRoute >
    <AdminDashboard />
  </AdminProtectedRoute>
} />

{/* <Route element={<AdminProtectedRoute />}>
  <Route path="/admin/*" element={<AdminDashboard />} />
</Route> */}

      </Routes>
    </Router>
    </ApiProvider>
  );
}

export default App;
