import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from '../MotorOwner/shared/Nav';
import Home from '../MotorOwner/components/Home';
import ManageVehicles from '../MotorOwner/components/ManageVehicles';
import Booking from '../MotorOwner/components/Booking';
import Earning from '../MotorOwner/components/Earning';
import AboutUs from '../MotorOwner/components/AboutUs';
import Help from '../MotorOwner/components/Help';
import Footer from './shared/Footer';
import Notification from './shared/Notification';
import Profile from '../MotorOwner/components/Profile';

function OwnerDashboard() {
  return (
   <div>
    <Nav />
    <div className="container mx-auto">
      <Routes>
        <Route path="" element={<Home/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/manage-vehicles" element={<ManageVehicles/>} />
        <Route path="/booking" element={<Booking/>} />
        <Route path="/earning" element={<Earning/>} />
        <Route path="/about-us" element={<AboutUs/>} />
        <Route path="/help" element={<Help/>} />
        <Route path="/notifications" element={<Notification/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
    <Footer/>
    </div>
  )
}

export default OwnerDashboard;
