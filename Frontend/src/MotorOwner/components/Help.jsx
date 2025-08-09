import React from "react";

const Help = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <div className="bg-gray-800 text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-6">
            Need Help? <span className="text-gray-300">We're Here!</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-gray-200">
            Find answers to common questions and get support for using CarryGo.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          {[
            {
              question: "How do I sign up as a transporter?",
              answer:
                "Click on the 'Join as a Transporter' button, fill in your details, and complete the verification process.",
            },
            {
              question: "How do I accept a delivery request?",
              answer:
                "Once your account is approved, you can log in and browse available delivery requests in your area.",
            },
            {
              question: "What payment methods are supported?",
              answer:
                "CarryGo supports online payments through credit/debit cards and digital wallets for quick and secure transactions.",
            },
            {
              question: "How can I contact support?",
              answer:
                "You can reach our support team via email at support@carrygo.com or call our 24/7 helpline.",
            },
          ].map((faq, index) => (
            <div key={index} className="mb-6 border-b border-gray-300 pb-4">
              <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Still Need Help?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-700">
            Contact our support team for further assistance.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "fas fa-envelope", method: "Email Us", contact: "support@carrygo.com" },
              { icon: "fas fa-phone", method: "Call Us", contact: "+1 234 567 890" },
              { icon: "fas fa-comments", method: "Live Chat", contact: "Chat with us now" },
            ].map((support, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-200">
                <div className="text-gray-600 text-4xl mb-4">
                  <i className={support.icon}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{support.method}</h3>
                <p className="text-gray-600">{support.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-800 text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
        <p className="text-lg mb-6 text-gray-200">Our support team is available 24/7 to assist you.</p>
        <a
          href="/contact"
          className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default Help;
