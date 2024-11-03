// Components/ReferralModal.js
import React, { useState } from 'react';

const ReferralModal = ({ onConfirm, onClose }) => {
  const [referralCode, setReferralCode] = useState("");

  const handleConfirm = () => {
    onConfirm(referralCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">Do you have a referral code?</h2>
        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
          className="border p-2 rounded mb-4"
        />
        <div>
          <button onClick={handleConfirm} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Confirm
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;
