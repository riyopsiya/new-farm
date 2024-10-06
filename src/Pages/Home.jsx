import React, { useState, useEffect } from "react";
import bountyimg from "../images/bountyimg.png";
import { useSelector } from "react-redux";


const Home = () => {
const { userInfo }= useSelector((state) => state.user);
const { userdetails }= useSelector((state) => state.tasks);


  const initialTime = 8 * 60 * 60; // 8 hours in seconds
  const [bountyAmount, setBountyAmount] = useState(
    localStorage.getItem("bountyAmount") ? parseFloat(localStorage.getItem("bountyAmount")) : 1000.0
  );
  const [timeLeft, setTimeLeft] = useState(
    localStorage.getItem("timeLeft")
      ? parseInt(localStorage.getItem("timeLeft"))
      : initialTime
  );
  const [startTime, setStartTime] = useState(
    localStorage.getItem("startTime")
      ? parseInt(localStorage.getItem("startTime"))
      : null
  );
  const [isFarming, setIsFarming] = useState(
    localStorage.getItem("isFarming") === "true"
  );
  const [taps, setTaps] = useState(
    localStorage.getItem("taps") ? parseInt(localStorage.getItem("taps")) : 100
  ); // Start taps at 100
 
  const [floatingPlusPosition, setFloatingPlusPosition] = useState(null); // Position for floating +1

  // Function to format time from seconds to hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate the remaining time when user returns
  const calculateRemainingTime = () => {
    const storedStartTime = localStorage.getItem("startTime");
    if (storedStartTime) {
      const timePassed = Math.floor((Date.now() - storedStartTime) / 1000); // in seconds
      const updatedTimeLeft = Math.max(timeLeft - timePassed, 0);
      setTimeLeft(updatedTimeLeft);
      return updatedTimeLeft;
    }
    return timeLeft;
  };

  // Timer countdown effect
  useEffect(() => {
    let timer;
    if (isFarming && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    // Update localStorage with the remaining time and taps
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("taps", taps);
    localStorage.setItem("bountyAmount", bountyAmount.toFixed(2));
 
    if (!startTime) {
      const newStartTime = Date.now();
      setStartTime(newStartTime);
      localStorage.setItem("startTime", newStartTime);
    }

    // Clear the timer when timeLeft reaches 0 and reset timer and taps
    if (timeLeft === 0) {
      setIsFarming(false);
      resetTimerAndTaps();
    }

    return () => clearInterval(timer);
  }, [isFarming, timeLeft, taps, startTime,bountyAmount]);

  // Handle start farming
  const handleStartFarming = () => {
    setIsFarming(true);
  };

  // Handle tap on the image
  const handleImageTap = () => {
    if (taps > 0) {
      setBountyAmount((prevAmount) => prevAmount + 1); // Increase bounty by 1
      setTaps((prevTaps) => prevTaps - 1); // Decrease tap count

      // Randomly position the floating +1 around the image
      const randomX = Math.random() * 50 + 25; // Random X between 25% and 75%
      const randomY = Math.random() * 40 + 10; // Random Y between 10% and 50%
      setFloatingPlusPosition({ x: randomX, y: randomY });

      // Hide floating +1 after 1 second
      setTimeout(() => {
        setFloatingPlusPosition(null);
      }, 1000);
    }
  };

  // Reset timer and taps when 8 hours are completed
  const resetTimerAndTaps = () => {
    setTimeLeft(initialTime); // Reset to 8 hours
    setTaps(100); // Reset taps to 100
    localStorage.setItem("timeLeft", initialTime);
    localStorage.setItem("taps", 100);
    localStorage.removeItem("startTime"); // Clear the start time
  };

  return (
    <div className="flex flex-col items-center justify-between h-[30rem] bg-[#1f221f] text-white p-4">
      {(userInfo.first_name || userInfo.username) ? (
        <div className="w-full flex text-left px-4 mb-4">
          <h2 className="font-bold">
            Welcome, {userInfo.first_name || userInfo.username}!
          </h2>
        </div>
      ):(null) }



      {/* Countdown and Taps */}
      <div className="flex space-x-4 p-3 items-center justify-start w-full rounded-lg text-xs mt-2">
        <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg font-bold">
          {formatTime(timeLeft)} Left
        </div>
        <div className="px-3 py-3 rounded-md border border-[#7d5126]">
          {taps} Taps
        </div>
      </div>

      {/* Image of coins */}
      <div className="relative mt-8" onClick={handleImageTap}>
        <img
          src={bountyimg}
          alt="Bounty Token"
          className="w-64 h-64 object-contain cursor-pointer"
        />
        {/* Floating +1 */}
        {floatingPlusPosition && (
          <div
            className="floating-plus"
            style={{
              left: `${floatingPlusPosition.x}%`,
              top: `${floatingPlusPosition.y}%`,
            }}
          >
            +1
          </div>
        )}
      </div>

      {/* Bounty Token Info */}
      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold">{bountyAmount.toFixed(2)} BNTY</h2>
        <p className="text-gray-400">Bounty Token</p>
      </div>

      {/* Start Farming Button */}
      <button
        className="bg-gradient-to-r fixed bottom-24 from-black to-[#7d5126] px-8 py-3 rounded-lg w-full mt-8 text-lg font-bold"
        onClick={handleStartFarming}
        disabled={isFarming} // Disable button after farming starts
      >
        {isFarming ? "Farming in Progress..." : "Start Farming"}
      </button>
    </div>
  );
};

export default Home;
