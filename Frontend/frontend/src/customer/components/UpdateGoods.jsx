import { useEffect,useState } from "react";
import axios from "axios";

const GoodsTracking = () => {
  const [goodsData, setGoodsData] = useState([]);
  const [selectedGood, setSelectedGood] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [assignedOrder, setAssignedOrder] = useState(null);

  
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get("http://localhost:8000/booking/user/me", { withCredentials: true });
        setUserEmail(response.data.email);
      } catch (error) {
        console.error("Failed to retrieve user info:", error);
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const response = await axios.get("http://localhost:8000/booking/goods");
        const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize time for comparison
      // console.log("REsponse",response);
       const filteredOrders = response.data.filter(order => {
        const orderDate = new Date(order.pickup_date); // Assuming your order has a pickup_date field
        orderDate.setHours(0, 0, 0, 0);
        return (
          order.email === userEmail &&
          orderDate >= today
          && order.status!=='Completed'
        );
      });
      console.log("After filter",filteredOrders);
        setGoodsData(filteredOrders);
      } catch (error) {
        console.error("Error fetching goods data:", error);
      }
    };
    if (userEmail) fetchGoods();
  }, [userEmail]);

  useEffect(() => {
    if (!selectedGood) return;
    const fetchBids = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/bids/received/${selectedGood._id}`);

        console.log("Fetched Bids:", response.data); // Debugging
        setBids(response.data); // Assuming response is an array
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };
    fetchBids();
  }, [selectedGood]);
  
  const handlePayment = async (order,bid) => {
    console.log(order);
    console.log("Bid handlePayment",bid);
    try {
      const amount = bid.bid_amount;
    const order_id = order?._id;
      const payment_method = "UPI";
      console.log(amount,order_id);
      if (!amount || !order_id) {
        alert("Invalid order/payment info.");
        return;
      }
     
      const response = await axios.post("http://localhost:8000/api/payments/create-order", {
        amount,
        order_id,
        transporter_email: order.transporter_email?.email
        ,
        payment_method,
      });
  
      const { orderId, key } = response.data;
  
      const options = {
        key,
        amount: amount * 100,
        currency: "INR",
        name: "CarryGo",
        description: "Transport Booking Payment",
        order_id: orderId,
        handler: async function (response) {
          const verification = await axios.post("http://localhost:8000/api/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: amount * 100,
          });
  
          if (verification.data.success) {
            alert("✅ Payment successful!");
            setIsPaymentDone(true);
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          email: userEmail,
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in payment:", error);
      alert("Payment error");
    }
  };
  
  const placeBid = async () => {
    if (!bidAmount || !selectedGood) return;
    try {
      const response = await axios.post("http://localhost:8000/api/bids/bids", {
        good_id: selectedGood._id,
        transporter_email: userEmail,
        amount: bidAmount,
      });
  
      // Optimistically update the bids state
      setBids((prevBids) => [...prevBids, response.data]);  
      setBidAmount("");
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };
  

  const acceptBid = async (bid) => {
    console.log("Bid",bid);
    try {
      await axios.post("http://localhost:8000/api/bids/customer/accept", {
        good_id: selectedGood._id,
        transporter_email: bid.transporter.email,
        amount: bid.bid_amount,
      });
      const newAssignedOrder = { ...selectedGood, transporter: bid };
      console.log(newAssignedOrder);
      setAssignedOrder({ ...selectedGood, transporter: bid });
      setGoodsData((prev) =>
        prev.map((item) =>
          item._id === selectedGood._id ? { ...item, bid_status: "Accepted" } : item
        )
      );
      alert("Bid accepted!");
      setSelectedGood(null);

        // Now trigger payment
    await handlePayment(newAssignedOrder);
    }catch(error) {
      console.error("Error accepting bid:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
   {isPaymentDone ? (
  <div className="text-center">
    <h2 className="text-2xl font-semibold mb-4 text-green-600">Booking Confirmed!</h2>
    <img
      src="https://media.tenor.com/Gl5LJOSU1LIAAAAC/truck-delivery.gif"
      alt="Transport Success"
      className="mx-auto w-64 h-64"
    />
    <p className="mt-2 text-lg">Thank you for your booking!</p>
  </div>
    ) : (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Goods Bidding System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goodsData.map((good) => (
          <div
            key={good._id}
            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedGood(good)}
          >
            <h3 className="font-semibold text-lg">{good.goods_type}</h3>
            <p>From: {good.pickup_loc} To: {good.dropoff_loc}</p>
            <p className="text-gray-500 text-sm">{good.status}</p>
            <p>date: {good.pickup_date}</p>
          </div>
        ))}
      </div>

      {selectedGood && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">{selectedGood.goods_type} - Bidding</h2>
          <p><strong>Pickup:</strong> {selectedGood.pickup_loc}</p>
          <p><strong>Dropoff:</strong> {selectedGood.dropoff_loc}</p>

          {/* Display Bids */}
          <div className="mt-4">
            <h3 className="font-semibold">Bids Received</h3>
            {bids?.length > 0 ? (
  bids.map((bid) => (
    <div key={bid._id} className="p-2 border-b">
     <p><strong>Transporter:</strong> {bid.transporter?.email}</p>
      <p><strong>Bid Amount:</strong> Rs.{bid.bid_amount || "0"}</p>
      
      {/* Show button only if bid not accepted */}
      {selectedGood?.bid_status !== "Customer Accepted" && (
        <button onClick={() => acceptBid(bid)} className="bg-green-500 text-white p-2 rounded">
          Accept Bid
        </button>
      )}
    {selectedGood?.bid_status === "Customer Accepted" && ( 
  <div className="mt-6 p-4 border rounded-lg shadow-md bg-green-100">
    <h2 className="text-xl font-semibold">Assigned Transporter</h2>
    <p><strong>Goods Type:</strong> {selectedGood.goods_type}</p>
    <p><strong>Pickup:</strong> {selectedGood.pickup_loc}</p>
    <p><strong>Dropoff:</strong> {selectedGood.dropoff_loc}</p>
    <p><strong>Transporter:</strong> {selectedGood.transporter_email.email}</p>
    <p><strong>Accepted Bid:</strong> Rs.{bid.bid_amount}</p>
    <p><strong>Status:</strong>{selectedGood.status}</p>
    {selectedGood?.status !== "Paid" && (
      <button
        onClick={() => handlePayment(selectedGood,bid)}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Pay Now
      </button>
    )}
  </div>
)}
    </div>
  ))
) : (
  <p className="text-gray-500">No bids yet.</p>
)}

          </div>
        </div>
      )}
    </div>
    )}
    </div>
  );
};

export default GoodsTracking;

