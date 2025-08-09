import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="bg-black text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-6">
            About <span className="text-gray-300">CarryGo</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            Empowering transporters and customers with seamless logistics solutions.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-black">
          How Transporters Can Work with <span className="text-gray-700">CarryGo</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: "fas fa-user-plus",
              title: "Sign Up & Verify",
              description:
                "Create an account, submit your details, and complete the verification process.",
            },
            {
              icon: "fas fa-truck-moving",
              title: "List Your Services",
              description:
                "Set your availability, pricing, and service areas to start receiving booking requests.",
            },
            {
              icon: "fas fa-check-circle",
              title: "Accept & Complete Rides",
              description:
                "Accept transport requests, fulfill deliveries on time, and get paid securely.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-gray-100 shadow-md rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-black text-4xl mb-4">
                <i className={step.icon}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Join CarryGo Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Why Join CarryGo?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-12 text-gray-700">
            Join a growing network of transporters and get access to thousands of customers in need of logistics services.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "More Customers", desc: "Expand your business with regular bookings." },
              { title: "Secure Payments", desc: "Get paid instantly through our secure platform." },
              { title: "Flexible Schedule", desc: "Work when you want, how you want." },
              { title: "24/7 Support", desc: "Our team is here to assist you anytime." },
            ].map((benefit, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold text-black mb-2">{benefit.title}</h3>
                <p className="text-gray-700">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-black text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-lg mb-6">Sign up today and start receiving transport requests!</p>
        <a
          href="/signup"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Join as a Transporter
        </a>
      </div>
    </div>
  );
};

export default AboutUs;
