import React from 'react';

const PaymentPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* Payment Methods Section */}
      <div className="container mx-auto p-8 mt-10 bg-white rounded-2xl shadow-xl">
        <h2 className="text-4xl font-semibold text-center text-[#910b0b] mb-8">Choose Payment Method</h2>

        {/* QR Code Payment Option */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
          <div className="w-full lg:w-1/2 text-center">
            <h3 className="text-2xl font-medium mb-4">Pay via QR Code</h3>
            <p className="text-lg text-gray-600 mb-4">Scan the QR code below to pay securely using your UPI app.</p>
            <div className="flex justify-center mb-6">
              <img src="https://www.cilips.org.uk/wp-content/uploads/2021/09/qr-code-7.png" alt="QR Code" className="w-48 h-48 border-4 border-[#910b0b] rounded-md" />
            </div>
            <p className="text-lg text-gray-600">Scan to pay using Google Pay, PhonePe, etc.</p>
          </div>
        </div>

        {/* UPI Payment Option */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
          <div className="w-full lg:w-1/2 text-center">
            <h3 className="text-2xl font-medium mb-4">Pay via UPI (Google Pay, PhonePe)</h3>
            <p className="text-lg text-gray-600 mb-4">Choose your preferred UPI app to complete the payment:</p>
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <img src="https://www.cilips.org.uk/wp-content/uploads/2021/09/qr-code-7.png" alt="Google Pay" className="w-20 h-20 mb-2 transition-transform transform hover:scale-110" />
                <p className="text-lg">Google Pay</p>
              </div>
              <div className="text-center">
                <img src="https://www.cilips.org.uk/wp-content/uploads/2021/09/qr-code-7.png" alt="PhonePe" className="w-20 h-20 mb-2 transition-transform transform hover:scale-110" />
                <p className="text-lg">PhonePe</p>
              </div>
            </div>
            <p className="text-lg text-gray-600">Open your app, scan the code, and complete the payment.</p>
          </div>
        </div>

        {/* Bank Payment Option */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-medium mb-4">Pay via Bank Transfer</h3>
          <p className="text-lg text-gray-600 mb-4">Transfer the amount to the following account:</p>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mx-auto w-full max-w-md mb-6">
            <p className="font-semibold">Bank Name: <span className="text-gray-800">Example Bank</span></p>
            <p className="font-semibold">Account Number: <span className="text-gray-800">1234567890</span></p>
            <p className="font-semibold">IFSC Code: <span className="text-gray-800">EXAM1234567</span></p>
          </div>
          <p className="text-lg text-gray-600">Use your bank's mobile app or website to complete the payment.</p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-[#910b0b] text-white py-2 px-6 rounded-full shadow-lg text-xl hover:bg-[#a12c2c] transition-all">
            Confirm Payment
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#5f1515] text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 carryGo. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage;
