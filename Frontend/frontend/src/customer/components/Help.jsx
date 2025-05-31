import React from "react";

function Help() {
  return (
    <div className="help-page">
      {/* Hero Section */}
      <section className="hero bg-gray-900 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Need Help?</h1>
          <p className="mt-4 text-lg">
            We're here to assist you with any questions or concerns.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="p-6 bg-white shadow-md rounded-md">
              <h3 className="text-xl font-bold">How can I track my shipment?</h3>
              <p className="mt-2 text-gray-700">
                You can track your shipment by using the "Track Shipment" feature on our home page. Enter your tracking ID to get real-time updates.
              </p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-md">
              <h3 className="text-xl font-bold">What should I do if my goods are delayed?</h3>
              <p className="mt-2 text-gray-700">
                If your goods are delayed, please contact our support team immediately. We’ll provide updates and work to resolve the issue as quickly as possible.
              </p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-md">
              <h3 className="text-xl font-bold">What are your operating hours?</h3>
              <p className="mt-2 text-gray-700">
                Our services operate 24/7. However, customer support is available from 8:00 AM to 8:00 PM (local time).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact py-16 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="mt-4">We’re here to help. Reach out to us anytime.</p>
          <div className="mt-8 flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-8">
            <div className="p-6 bg-gray-800 rounded-md shadow-md">
              <h3 className="text-xl font-bold">Customer Support</h3>
              <p className="mt-2">Email: support@carrygo.com</p>
              <p>Phone: +1 (800) 123-4567</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-md shadow-md">
              <h3 className="text-xl font-bold">Head Office</h3>
              <p className="mt-2">123 CarryGo Street</p>
              <p>Logistics City, LS 56789</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="support py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Still Have Questions?</h2>
          <p className="text-lg text-gray-700">
            Feel free to get in touch with our support team for further assistance.
          </p>
          <div className="mt-6">
            <a
              href="mailto:support@carrygo.com"
              className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Help;