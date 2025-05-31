// import React from "react";
// function AboutUs() {
//   return (
//     <div className="bg-gray-100 py-10">
//       <div className="container mx-auto px-4">
//         {/* Page Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-red-500">About CarryGo</h1>
//           <p className="text-gray-600 mt-2">
//             Your trusted partner in transportation and logistics.
//           </p>
//         </div>

//         {/* Mission and Vision */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <h2 className="text-2xl font-bold text-black">Our Mission</h2>
//             <p className="text-gray-600 mt-4">
//               At CarryGo, our mission is to provide fast, reliable, and
//               affordable transportation solutions for businesses and individuals
//               alike. We aim to bridge the gap between efficiency and
//               convenience, ensuring every delivery is handled with care and
//               professionalism.
//             </p>
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-black">Our Vision</h2>
//             <p className="text-gray-600 mt-4">
//               We envision a world where logistics and transportation are no
//               longer a hassle. CarryGo strives to become a global leader in
//               transport services by leveraging technology and customer-centric
//               approaches to redefine the logistics industry.
//             </p>
//           </div>
//         </div>

//         {/* Company Values */}
//         <div className="mt-12">
//           <h2 className="text-2xl font-bold text-center text-black">
//             Our Core Values
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
//             <div className="text-center">
//               <h3 className="text-xl font-bold text-red-500">Reliability</h3>
//               <p className="text-gray-600 mt-2">
//                 We take pride in delivering on our promises, ensuring your goods
//                 arrive safely and on time.
//               </p>
//             </div>
//             <div className="text-center">
//               <h3 className="text-xl font-bold text-red-500">Innovation</h3>
//               <p className="text-gray-600 mt-2">
//                 By using the latest technology, we streamline processes and
//                 enhance the customer experience.
//               </p>
//             </div>
//             <div className="text-center">
//               <h3 className="text-xl font-bold text-red-500">Customer Focus</h3>
//               <p className="text-gray-600 mt-2">
//                 Your satisfaction is our priority. We listen, adapt, and strive
//                 to exceed expectations.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Team Section */}
//         <div className="mt-12">
//           <h2 className="text-2xl font-bold text-center text-black">
//             Meet Our Team
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
//             <div className="text-center">
//               <img
//                 src="https://via.placeholder.com/150"
//                 alt="Team Member"
//                 className="rounded-full mx-auto"
//               />
//               <h3 className="text-xl font-bold text-black mt-4">John Doe</h3>
//               <p className="text-gray-600">CEO & Founder</p>
//             </div>
//             <div className="text-center">
//               <img
//                 src="https://via.placeholder.com/150"
//                 alt="Team Member"
//                 className="rounded-full mx-auto"
//               />
//               <h3 className="text-xl font-bold text-black mt-4">Jane Smith</h3>
//               <p className="text-gray-600">Operations Manager</p>
//             </div>
//             <div className="text-center">
//               <img
//                 src="https://via.placeholder.com/150"
//                 alt="Team Member"
//                 className="rounded-full mx-auto"
//               />
//               <h3 className="text-xl font-bold text-black mt-4">Emily Davis</h3>
//               <p className="text-gray-600">Head of Marketing</p>
//             </div>
//           </div>
//         </div>

//         {/* Call to Action */}
//         <div className="mt-12 text-center">
//           <h2 className="text-2xl font-bold text-black">
//             Ready to Transport with Us?
//           </h2>
//           <p className="text-gray-600 mt-4">
//             Get started with CarryGo today and experience hassle-free
//             transportation services.
//           </p>
//           <button className="mt-6 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600">
//             Contact Us
//           </button>
//         </div>
//       </div>
//       <br/>
//     </div>
//   );
// }

// export default AboutUs;

import React from "react";

function AboutUs() {
  return (
    <div className="bg-white py-10 text-black">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">About CarryGo</h1>
          <p className="text-gray-700 mt-2">
            Your trusted partner in transportation and logistics.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-100 p-6 rounded-lg">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
            <p className="text-gray-800 mt-4">
              At CarryGo, our mission is to provide fast, reliable, and
              affordable transportation solutions for businesses and individuals
              alike. We aim to bridge the gap between efficiency and
              convenience, ensuring every delivery is handled with care and
              professionalism.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
            <p className="text-gray-800 mt-4">
              We envision a world where logistics and transportation are no
              longer a hassle. CarryGo strives to become a global leader in
              transport services by leveraging technology and customer-centric
              approaches to redefine the logistics industry.
            </p>
          </div>
        </div>

        {/* Company Values */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-900">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-black">Reliability</h3>
              <p className="text-gray-800 mt-2">
                We take pride in delivering on our promises, ensuring your goods
                arrive safely and on time.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-black">Innovation</h3>
              <p className="text-gray-800 mt-2">
                By using the latest technology, we streamline processes and
                enhance the customer experience.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-black">Customer Focus</h3>
              <p className="text-gray-800 mt-2">
                Your satisfaction is our priority. We listen, adapt, and strive
                to exceed expectations.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-900">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="rounded-full mx-auto border border-gray-300"
              />
              <h3 className="text-xl font-bold mt-4 text-gray-900">John Doe</h3>
              <p className="text-gray-700">CEO & Founder</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="rounded-full mx-auto border border-gray-300"
              />
              <h3 className="text-xl font-bold mt-4 text-gray-900">Jane Smith</h3>
              <p className="text-gray-700">Operations Manager</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="rounded-full mx-auto border border-gray-300"
              />
              <h3 className="text-xl font-bold mt-4 text-gray-900">Emily Davis</h3>
              <p className="text-gray-700">Head of Marketing</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gray-100 py-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900">Ready to Transport with Us?</h2>
          <p className="text-gray-800 mt-4">
            Get started with CarryGo today and experience hassle-free
            transportation services.
          </p>
          <button className="mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">
            Contact Us
          </button>
        </div>
      </div>
      <br />
    </div>
  );
}

export default AboutUs;
