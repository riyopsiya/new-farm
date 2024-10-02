import React, { useState, useEffect } from "react";
import bountyimg  from "../images/bountyimg.png";

const Home = ({userdata}) => {
  const [timeLeft, setTimeLeft] = useState(7 * 60 * 60 + 55 * 60 + 33); // 7:55:33 in seconds
  const [taps, setTaps] = useState(100);

  // Function to format time from seconds to hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center justify-between h-[30rem]  bg-[#1f221f] text-white p-4">

     {(userdata.first_name || userdata.username )?( <div className="w-full flex text-left px-4 mb-4"> <h2 className="font-bold">Welcome,{userdata.first_name || userdata.username }! </h2></div> ):(null)  }

      {/* Countdown and Taps */}
      <div className="flex space-x-4  p-3 items-center justify-start w-full rounded-lg text-xs mt-2">
        <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg   font-bold">
          
         {formatTime(timeLeft)} Left
        </div>
        <div className=" px-3 py-3 rounded-md border  border-[#7d5126] ">{taps} Taps</div>
      </div>

      {/* Image of coins */}
      <div className="mt-8">
        <img
          src={bountyimg}
          alt="Bounty Token"
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Bounty Token Info */}
      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold">1000.00 BNTY</h2>
        <p className="text-gray-400">Bounty Token</p>
      </div>

      {/* Start Farming Button */}
      <button className="bg-gradient-to-r fixed bottom-24 from-black to-[#7d5126] px-8 py-3 rounded-lg w-full mt-8 text-lg font-bold">
         Farming Coming Soon...
      </button>

     
    </div>
  );
};

export default Home;
