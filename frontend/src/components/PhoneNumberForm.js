import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PhoneNumberForm = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Invalid phone number format");
      return;
    }

    // Move to next step
    onNext(phoneNumber, otp);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-1/2 w-1/2 flex flex-col gap-3"
    >
      <div>
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="otp">OTP:</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      <button type="submit">Next</button>
    </form>
  );
};

export default PhoneNumberForm;
