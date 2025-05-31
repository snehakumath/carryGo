// import React from "react";
// import { Link } from "react-router-dom";

// function Home() {

  
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

// <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         Motor Owner Dashboard
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.length > 0 ? (
//           orders.map((order) => (
//             <div
//               key={order.id}
//               className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between"
//             >
//               <div>
//                 <h2 className="text-xl font-bold text-gray-700">
//                   Order #{order.id}
//                 </h2>
//                 <p className="text-gray-600">Customer: {order.customerName}</p>
//                 <p className="text-gray-600">Pickup: {order.pickupLocation}</p>
//                 <p className="text-gray-600">Drop-off: {order.dropoffLocation}</p>
//                 <p className="text-gray-600">Goods: {order.goodsType}</p>
//                 <p className="text-gray-600">Weight: {order.weight} kg</p>
//                 <p className="text-gray-600">Preferred Truck: {order.truckType}</p>
//                 <p className="text-gray-600">Date: {order.pickupDate}</p>
//               </div>
//               <div className="mt-4 flex justify-between">
//                 <button
//                   onClick={() => handleAccept(order.id)}
//                   className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleReject(order.id)}
//                   className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-700 text-center col-span-full">
//             No new orders at the moment.
//           </p>
//         )}
//       </div>
//     </div>


//       <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl text-center">
//         <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to a Trusted Platform!</h1>
//         <p className="text-gray-600 mb-6">
//           Join thousands of successful motor owners who trust us to manage their fleet and bookings efficiently.
//           Our platform is built for your convenience, with security and transparency at the core of everything we do.
//         </p>

//         {/* Key Benefits Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           <div className="flex flex-col items-center p-6 bg-blue-100 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold text-blue-700 mb-4">Effortless Fleet Management</h2>
//             <p className="text-gray-700 text-lg">
//               Easily manage your vehicles, track availability, and update details at any time. We simplify your fleet management with intuitive tools.
//             </p>
//           </div>

//           <div className="flex flex-col items-center p-6 bg-green-100 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold text-green-700 mb-4">Reliable Booking System</h2>
//             <p className="text-gray-700 text-lg">
//               Our real-time booking system ensures you never miss a request. You can confirm, manage, and optimize bookings without any hassle.
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           <div className="flex flex-col items-center p-6 bg-yellow-100 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold text-yellow-700 mb-4">Track Your Earnings</h2>
//             <p className="text-gray-700 text-lg">
//               Monitor your earnings effortlessly with our advanced financial tracking tools. Know your profits at a glance and make informed decisions.
//             </p>
//           </div>

//           <div className="flex flex-col items-center p-6 bg-purple-100 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-semibold text-purple-700 mb-4">24/7 Support</h2>
//             <p className="text-gray-700 text-lg">
//               We're always here for you. Get instant support whenever you need help with bookings, earnings, or anything else.
//             </p>
//           </div>
//         </div>

//         {/* Trust Badge Section */}
//         <div className="text-center mt-12">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
//           <p className="text-lg text-gray-600 mb-6">
//             Our platform is trusted by motor owners across the country. Here's why:
//           </p>

//           <div className="flex justify-center gap-12">
//             <div className="flex flex-col items-center">
//               <img
//                 src="/images/secure.png" // You can replace with a security icon or image
//                 alt="Secure"
//                 className="w-24 h-24 mb-4"
//               />
//               <p className="text-gray-700">Secure & Reliable</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <img
//                 src="/images/support.png" // Replace with support-related image/icon
//                 alt="Support"
//                 className="w-24 h-24 mb-4"
//               />
//               <p className="text-gray-700">24/7 Support</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <img
//                 src="/images/growth.png" // Replace with an image indicating business growth
//                 alt="Growth"
//                 className="w-24 h-24 mb-4"
//               />
//               <p className="text-gray-700">Grow Your Business</p>
//             </div>
//           </div>
//         </div>

//         {/* Call to Action Section */}
//         <div className="mt-12 text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to Start?</h2>
//           <p className="text-gray-600 mb-6">
//             Join a trusted network of motor owners today and experience the difference. Manage your fleet, bookings, and earnings with ease!
//           </p>

//           <Link
//             to="/owner/signup"
//             className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
//           >
//             Get Started Now
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;



import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <div
        className="relative py-28 text-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://tse2.mm.bing.net/th?id=OIP.I-pYD7I5FxpatYFHgFujcwHaEk&pid=Api&P=0&h=180')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 px-6">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="underline">CarryGo</span>
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Seamless logistics. Smarter connections.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/booking"
              className="bg-white text-black border border-black px-6 py-2 rounded-md hover:bg-black hover:text-white transition"
            >
              Book a Ride
            </Link>
            <Link
              to="/signup"
              className="bg-black text-white border px-6 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Join as a Transporter
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 border-t border-b border-gray-200 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-10">Trusted by Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "10K+", label: "Transporters Joined" },
              { value: "1M+", label: "Deliveries Completed" },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="text-4xl font-bold">{item.value}</h3>
                <p className="text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-12">Why Partner with CarryGo?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: "🚛", title: "Expand Reach", desc: "Connect with thousands of customers seeking reliable transport." },
              { icon: "⏱️", title: "Fast Matching", desc: "Get matched instantly with nearby delivery requests." },
              { icon: "📍", title: "Live Tracking", desc: "Real-time tracking keeps customers informed and builds trust." },
              { icon: "💸", title: "Timely Payments", desc: "Guaranteed payments without delay." },
              { icon: "🔧", title: "Easy Management", desc: "Dashboard to manage rides, earnings, and vehicle info." },
              { icon: "🛡️", title: "Reliable Support", desc: "24/7 customer and transporter support." },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 text-black rounded-xl p-6 border hover:shadow-md transition">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10">What Our Transporters Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { quote: "CarryGo helped me grow my business!", name: "Ravi Kumar" },
              { quote: "The booking flow is smooth and intuitive.", name: "Aarav Singh" },
              { quote: "I can now reach customers I never could before.", name: "Karan Mehta" },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <p className="italic mb-4 text-gray-700">“{testimonial.quote}”</p>
                <h4 className="font-medium text-gray-900">— {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-black">
        <h2 className="text-3xl font-semibold text-center mb-12">FAQs</h2>
        <div className="space-y-8">
          {[
            {
              q: "How do I sign up as a transporter?",
              a: "Click 'Join as a Transporter' above and fill out your vehicle and contact info.",
            },
            {
              q: "How does payment work?",
              a: "Payments are processed automatically to your account after each completed delivery.",
            },
            {
              q: "Can I manage multiple vehicles?",
              a: "Yes, our dashboard supports managing multiple vehicles from one account.",
            },
          ].map((item, i) => (
            <div key={i} className="border-b border-gray-300 pb-4">
              <h3 className="font-semibold mb-1">{item.q}</h3>
              <p className="text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
