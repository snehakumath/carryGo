// import React from "react";
// import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import Home from "./customer/components/Home"; // Home page component
// import Booking from "./customer/components/Booking"; // Booking page component
// import AboutUs from "./customer/components/AboutUs"; // About Us page component
// import Help from "./customer/components/Help"; // Help page component
// import Layout from "./customer/components/Layout"; // Navigation bar
// import UpdateGoods from "./customer/components/UpdateGoods";
// import Login from "./customer/components/Login"; // Login page component
// import Signup from "./customer/components/Signup"; // Signup page component
// import OwnerDashboard from "./MotorOwner/OwnerDashboard";
// import Profile from './customer/components/Profile';
// import Payment from "./customer/components/Payment";


// function App(){
//   return (
//     <div>
//     <Router>
//     <Routes>
//     <Route path="login" element={<Login/>} />
//     <Route path="signup" element={<Signup />} />   
//       <Route path="/" element={<Layout/>}>
//       <Route index element={<Home />} /> 
//       <Route path="booking" element={<Booking />} /> 
//       <Route path="aboutus" element={<AboutUs />} /> 
//       <Route path="help" element={<Help/>} /> 
//       <Route path="update-goods" element={<UpdateGoods />} />
//       <Route path="profile" element={<Profile/>} />
//       <Route path="payment" element={<Payment/>} />
//       </Route>
//       <Route path="/owner/*" element={<OwnerDashboard/>}/>
//     </Routes>
//     </Router>
//     {/* <OwnerDashboard/> */}
//     </div>
//   )
// }

// export default App;


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
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route> */}
      </Routes>
    </Router>
    </ApiProvider>
  );
}

export default App;
