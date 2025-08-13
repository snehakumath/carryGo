
import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

useEffect(()=>{
console.log("Hello from Home");
  });
function Home() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <div
        className="relative py-28 text-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://tse2.mm.bing.net/th?id=OIP.I-pYD7I5FxpatYFHgFujcwHaEk&pid=Api&P=0&h=180')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="relative z-10 px-6">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-white underline">CarryGo</span>
          </h1>
          <p className="text-lg text-white mb-8">
            Connecting customers and transporters for seamless logistics.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/booking"
              className="bg-white text-black px-6 py-3 rounded-md border border-black hover:bg-black hover:text-white transition"
            >
              Book a Ride
            </Link>
            <Link
              to="/signup"
              className="bg-black text-white px-6 py-3 rounded-md border border-white hover:bg-white hover:text-black transition"
            >
              Join as a Transporter
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white border-t border-b border-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-8">Trusted by Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "10K+", label: "Registered Transporters" },
              { value: "1M+", label: "Goods Delivered" },
            ].map((stat, index) => (
              <div key={index}>
                <h3 className="text-4xl font-bold">{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-12">
            Why Choose <span className="underline">CarryGo</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: "👥", title: "For Customers", description: "Effortlessly book reliable transporters for your goods." },
              { icon: "🚛", title: "For Transporters", description: "Expand your business by connecting with potential customers." },
              { icon: "⏳", title: "Real-Time Updates", description: "Track the status of your bookings and deliveries instantly." },
              { icon: "💰", title: "Affordable Rates", description: "Competitive pricing with no hidden costs." },
              { icon: "🔒", title: "Secure Transactions", description: "Your payments are safe with our trusted system." },
              { icon: "🛠️", title: "24/7 Support", description: "Dedicated support team to assist you at any time." },
            ].map((feature, index) => (
              <div key={index} className="bg-white text-black shadow-md rounded-xl p-6 hover:shadow-lg transition transform hover:scale-105">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16 border-t border-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">Hear From Our Users</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { quote: "CarryGo made transporting my goods so easy and hassle-free!", name: "John Doe" },
              { quote: "Thanks to CarryGo, I’ve gained so many new customers as a transporter.", name: "Sarah Lee" },
              { quote: "The support team is amazing and always available to help.", name: "David Kim" },
            ].map((testimonial, index) => (
              <div key={index} className="bg-black text-white p-6 rounded-lg shadow">
                <p className="italic mb-4">“{testimonial.quote}”</p>
                <h4 className="font-medium">— {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-black">
        <h2 className="text-3xl font-semibold text-center mb-12">FAQs</h2>
        <div className="grid gap-8">
          {[
            {
              q: "How do I book a transporter?",
              a: "Simply go to the 'Book a Ride' section and fill in the necessary details.",
            },
            {
              q: "How do I register as a transporter?",
              a: "Click on 'Join as a Transporter' and complete the registration process.",
            },
            {
              q: "Is there customer support?",
              a: "Yes, our team is available 24/7 to help you with your queries.",
            },
          ].map((item, index) => (
            <div key={index} className="border-b border-black pb-4">
              <h3 className="font-semibold mb-1">{item.q}</h3>
              <p className="text-gray-700">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
