import React, { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ orderId, transporterId, userEmail }) => {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/feedback", {
        email: userEmail,
        order_id: orderId,
        transporter_id: transporterId,
        rating,
        comments,
      });
      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  if (submitted) return <p className="text-green-400">Feedback submitted. Thank you!</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-20 px-2 py-1 rounded bg-[#505050] text-white border border-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Comments:</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows="3"
          className="w-full px-2 py-1 rounded bg-[#505050] text-white border border-gray-400"
        />
      </div>
      <button
        type="submit"
        className="bg-[#f5f5f5] text-black font-semibold px-4 py-2 rounded hover:bg-gray-300"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
