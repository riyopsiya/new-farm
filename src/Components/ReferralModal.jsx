// ReferralModal.js
import React, { useState } from 'react';

const ReferralModal = ({ isOpen, onClose, onSubmit }) => {
    const [referralCode, setReferralCode] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(referralCode);
        setReferralCode('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Enter Referral Code</h2>
                <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Referral Code"
                    className="border p-2 rounded w-full"
                />
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="mr-2 bg-gray-300 p-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ReferralModal;
