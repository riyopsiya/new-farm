import React, { useState, useEffect } from "react";
import bountyimg from "../images/bountyimg.png";
import { useSelector } from "react-redux";
import { Client, Databases } from "appwrite";
import service from "../appwrite/database";

const Home = () => {
  const { userInfo } = useSelector((state) => state.user);
  const initialTime = 8 * 60 * 60; // 8 hours in seconds
  // const userId = userInfo?.id ;
  const userId = 1337182007 ;

  const [user, setUser] = useState([]);
  const [bountyAmount, setBountyAmount] = useState(null);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isFarming, setIsFarming] = useState(false);
  const [taps, setTaps] = useState(100);
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
      if (response.payload && response.payload.coins) {
        setBountyAmount(response.payload.coins);
      }
      if (response.payload && response.payload.taps) {
        setTaps(response.payload.taps);
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
        userId.toString()
      );
      console.log(userData)
      setUser(userData);
      setBountyAmount(userData.coins);
      setTaps(userData.taps); // Initialize taps from user data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Timer and farming logic
  useEffect(() => {
    const savedEndTime = localStorage.getItem("endTime");
    if (savedEndTime) {
      const endTime = Number(savedEndTime);
      const newTimeLeft = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0) {
        resetFarming();
      } else {
        setIsFarming(true);
      }
    }
  }, []);

  const resetFarming = () => {
    setIsFarming(false);
    setTaps(100);
    localStorage.removeItem("endTime"); // Remove end time from local storage
    service.updateUserData(userId, { taps: 100 }); // Reset taps in the database
  };

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (isFarming && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        if (timeLeft <= 1) {
          resetFarming();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isFarming, timeLeft]);

  // Handle start farming
  const handleStartFarming = () => {
    if (timeLeft === 0) {
      setTimeLeft(8*60*60); // Reset to 8 hours
      setTaps(100);
      service.updateUserData(userId, { taps: 100 }); // Reset taps in the database
    }
    setIsFarming(true);
    const endTime = Date.now() + initialTime * 1000; // Calculate end time
    localStorage.setItem("endTime", endTime); // Save end time in local storage
  };

  // Handle image tap
  const handleImageTap = async () => {
    if (taps > 0) {
      const newAmount = bountyAmount + 1;
      const newTaps = taps - 1;

      setBountyAmount(newAmount);
      setTaps(newTaps);

      // Update the user's coins and taps in the database
      try {
        await service.updateUserData(userId, { coins: newAmount, taps: newTaps }); // Appwrite call to update coins and taps
        console.log("Coins and taps updated in Appwrite:", newAmount, newTaps);
      } catch (error) {
        console.error("Error updating coins and taps in Appwrite:", error);
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
    <div className="flex flex-col items-center justify-between h-[65vh] bg-[#1f221f] text-white p-4 overflow-hidden">
      {(userInfo.first_name || userInfo.username) ? (
       <div className="w-full flex flex-col text-left px-4 gap-4">
       <h2 className="font-bold text-lg md:text-xl">
       Welcome, {userInfo.first_name || userInfo.username}!
       
      
       </h2>
  <h2>{userInfo}</h2>
          <div className="flex space-x-4  items-center justify-start w-full rounded-lg text-xs">
            <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg font-bold">
              {formatTime(timeLeft)} Left
            </div>
            <div className="px-3 py-3 rounded-md border border-[#7d5126]">
              {taps} Taps
            </div>
          </div>
     </div>
      ) : null}
     
     {/* <div className="flex space-x-4  items-center justify-start w-full rounded-lg text-xs">
            <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg font-bold">
              {formatTime(timeLeft)} Left
            </div>
            <div className="px-3 py-3 rounded-md border border-[#7d5126]">
              {taps} Taps
            </div>
          </div> */}

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
       {bountyAmount && <h2 className="text-3xl font-bold">{bountyAmount.toFixed(2)} BNTY</h2>} 
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
