import React from 'react';
import {Outlet} from 'react-router-dom';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
function Layout() {
  return (
    <div>
      <Nav/>
      <br></br>
      <br></br>
      <div>
         <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default Layout
