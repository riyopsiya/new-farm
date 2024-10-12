import React, { useState, useEffect } from "react";
import bountyimg from "../images/bountyimg.png";
import { useSelector } from "react-redux";
import { Client, Databases } from "appwrite";
import service from "../appwrite/database";



const Home = () => {
  const { userInfo } = useSelector((state) => state.user);
  const initialTime = 8 * 60 * 60; // 8 hours in seconds
  const userId = userInfo?.id || 1337182007; // Use userInfo.id if available
  const localStorageCoins = localStorage.getItem("bountyAmount")
    ? parseFloat(localStorage.getItem("bountyAmount"))
    : 0;

  const [user, setUser] = useState([]);
  const [bountyAmount, setBountyAmount] = useState(localStorageCoins);
  const [timeLeft, setTimeLeft] = useState(
    localStorage.getItem("timeLeft")
      ? parseInt(localStorage.getItem("timeLeft"))
      : initialTime
  );
  const [isFarming, setIsFarming] = useState(
    localStorage.getItem("isFarming") === "true"
  );
  const [taps, setTaps] = useState(
    localStorage.getItem("taps") ? parseInt(localStorage.getItem("taps")) : 100
  );
  const [floatingPlusPosition, setFloatingPlusPosition] = useState(null);

  // Initialize Appwrite client
  const client = new Client();
  const databases = new Databases(client);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!userId) return;

    client
      .setEndpoint(process.env.REACT_APP_APPWRITE_URL) // Your Appwrite endpoint
      .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID); // Your Appwrite project ID

    const channel = `databases.${process.env.REACT_APP_APPWRITE_DATABASE_ID}.collections.${process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID}.documents.${userId}`;

    // Subscribe to real-time updates on the user's document
    const unsubscribe = client.subscribe(channel, (response) => {
      console.log(response)
      if (response.payload && response.payload.coins) {
        setBountyAmount(response.payload.coins);
        localStorage.setItem("bountyAmount", response.payload.coins);
      }
    });

    return () => {
      unsubscribe(); // Clean up the subscription when the component unmounts
    };
  }, [userId]);

  // Fetch user data for coins from Appwrite
  const fetchUserData = async () => {
    try {
      const userData = await databases.getDocument(
        process.env.REACT_APP_APPWRITE_DATABASE_ID,
        process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
        userId
      );
      setUser(userData);
      setBountyAmount(userData.coins);
      localStorage.setItem("bountyAmount", userData.coins);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (localStorageCoins > 0) {
      setBountyAmount(localStorageCoins);
    }
    fetchUserData();
  }, []);

  // Timer and farming logic
  useEffect(() => {
    if (isFarming) {
      const savedStartTime = localStorage.getItem("startTime");
      const elapsedTime = Math.floor((Date.now() - savedStartTime) / 1000);
      const newTimeLeft = Math.max(initialTime - elapsedTime, 0);

      setTimeLeft(newTimeLeft);
      localStorage.setItem("timeLeft", newTimeLeft);

      if (newTimeLeft === 0) {
        setIsFarming(false);
        setTaps(100);
        localStorage.setItem("taps", 100);
      }
    }
  }, [isFarming]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (isFarming && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          const updatedTime = prevTime - 1;
          localStorage.setItem("timeLeft", updatedTime);
          return updatedTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isFarming, timeLeft]);

  // Handle start farming
  const handleStartFarming = () => {
    if (timeLeft === 0) {
      setTimeLeft(8 * 60 * 60); // Reset to 8 hours
      setTaps(100);
      localStorage.setItem("taps", 100);
    }
    setIsFarming(true);
    localStorage.setItem("isFarming", "true");
    localStorage.setItem("startTime", Date.now());
  };

  // Handle image tap
  const handleImageTap = async () => {
    if (taps > 0) {
      const newAmount = bountyAmount + 1;

      setBountyAmount(newAmount);
      localStorage.setItem("bountyAmount", newAmount);

      setTaps((prevTaps) => {
        const newTaps = prevTaps - 1;
        localStorage.setItem("taps", newTaps);
        return newTaps;
      });

      // Update the user's coins in the database
      try {
        await service.updateUserCoins(userId, newAmount); // Appwrite call to update coins
        console.log("Coins updated in Appwrite:", newAmount);
      } catch (error) {
        console.error("Error updating coins in Appwrite:", error);
      }

      // Floating +1 animation
      const randomX = Math.random() * 50 + 25;
      const randomY = Math.random() * 40 + 10;
      setFloatingPlusPosition({ x: randomX, y: randomY });

      setTimeout(() => {
        setFloatingPlusPosition(null);
      }, 1000);
    }
  };

  // Function to format time from seconds to hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-between h-[70vh] bg-[#1f221f] text-white p-4 overflow-hidden">
      {(userInfo.first_name || userInfo.username) ? (
        <div className="w-full flex text-left px-4">
          <h2 className="font-bold text-lg md:text-xl">
            Welcome, {userInfo.first_name || userInfo.username}!
          </h2>
        </div>
      ) : null}

      <div className="flex space-x-4 p-3 items-center justify-start w-full rounded-lg text-xs">
        <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg font-bold">
          {formatTime(timeLeft)} Left
        </div>
        <div className="px-3 py-3 rounded-md border border-[#7d5126]">
          {taps} Taps
        </div>
      </div>

      <div className="relative mt-4 w-full flex justify-center" onClick={handleImageTap}>
        <img
          src={bountyimg}
          alt="Bounty Token"
          className="w-2/3 md:w-1/2 h-auto object-contain cursor-pointer"
        />
        {floatingPlusPosition && (
          <div
            className="floating-plus absolute text-lg text-green-500"
            style={{
              left: `${floatingPlusPosition.x}%`,
              top: `${floatingPlusPosition.y}%`,
            }}
          >
            +1
          </div>
        )}
      </div>

      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold">{bountyAmount.toFixed(2)} BNTY</h2>
        <p className="text-gray-400">Bounty Token</p>
      </div>

      <button
        className="bg-gradient-to-r fixed bottom-24 from-black to-[#7d5126] px-8 py-3 rounded-lg w-full text-lg font-bold"
        onClick={handleStartFarming}
        disabled={isFarming && timeLeft > 0}
      >
        {isFarming ? "Farming..." : "Start Farming"}
      </button>
    </div>
  );
};

export default Home;
