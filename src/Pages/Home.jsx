import React, { useState, useEffect } from "react";
import bountyimg from "../images/bountyimg.png";
import { useSelector } from "react-redux";
import { Client, Databases } from "appwrite";
import service from "../appwrite/database";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const { userInfo } = useSelector((state) => state.user);
  const initialTime = 8 * 60 * 60; // 8 hours in seconds
  // const userId = 1337182007;
  // const userId = 1751474467;
  const userId = userInfo?.id ;

  const [user, setUser] = useState([]);
  const [bountyAmount, setBountyAmount] = useState(1000);
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
      .setEndpoint(process.env.REACT_APP_APPWRITE_URL)
      .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

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
      unsubscribe();
    };
  }, [userId]);

  // Fetch user data for coins and taps from Appwrite
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
      setTaps(userData.taps);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


 


  // Initialize timer and check if farming is ongoing
  useEffect(() => {
 //check if timer is over 
 if (timeLeft === 0) {
  setTimeLeft(initialTime);
  setTaps(100);
  service.updateUserData(userId, { taps: 100 });
}

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
    localStorage.removeItem("endTime");
    service.updateUserData(userId, { taps: 100 });
  };




  const APY = 2.4; // 240% APY represented as a multiplier (2.4 = 240%)
  const SECONDS_IN_A_YEAR = 31536000;

  // Function to calculate per-second earnings
  const calculatePerSecondEarning = (amount) => {
    const perSecond = (amount * APY) / SECONDS_IN_A_YEAR;
    return perSecond
   
  };
// Countdown timer effect
useEffect(() => {
  let timer;
  if (isFarming && timeLeft > 0) {
    timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);

      let coinIncrease = calculatePerSecondEarning(bountyAmount);
      console.log(coinIncrease)
      setBountyAmount((prevBounty) => prevBounty + coinIncrease);

      if (timeLeft <= 1) {
        resetFarming();
      }
    }, 1000);


  }

  console.log(bountyAmount)
  
  return () => {
   
    clearInterval(timer);

  }
   
}, [isFarming, timeLeft]);

// Handle starting the farming timer
const handleStartFarming = () => {
  if (timeLeft === 0) {
    setTimeLeft(initialTime);
    setTaps(100);
    service.updateUserData(userId, { taps: 100 });
  }
  setIsFarming(true);
  const startTime = Date.now();
  const endTime = Date.now() + initialTime * 1000;
  localStorage.setItem("endTime", endTime);
  localStorage.setItem("startTime", startTime);
  localStorage.setItem("isFarming", true);
  localStorage.setItem("timeLeft", initialTime); // Store the initial time left
};

useEffect(() => {
  const savedStartTime = localStorage.getItem("startTime");
  const isFarmingActive = localStorage.getItem("isFarming") === "true";
  const initialTimeLeft = parseInt(localStorage.getItem("timeLeft"), 10);

  if (isFarmingActive && savedStartTime) {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - parseInt(savedStartTime, 10)) / 1000); // Calculate elapsed time in seconds

    console.log("Elapsed time in seconds:", elapsedTime);

    // Calculate total coins earned based on elapsed time
 
    const totalCoinsEarned = calculatePerSecondEarning(bountyAmount) * elapsedTime;
    console.log("Coins earned during inactivity:", totalCoinsEarned);


    

    // Update the bounty amount with the earned coins
    // console.log(user)
    
    // setBountyAmount(bountyAmount + totalCoinsEarned);

    // Calculate the remaining time
    const remainingTime = Math.max(0, initialTimeLeft - elapsedTime);
    setTimeLeft(remainingTime);

    // Reset farming if the remaining time is zero
    if (remainingTime === 0) {
      resetFarming();
    }
  }
}, []);






const saveUserData = () => {
  // Update the user's coins in the database
  service.updateUserData(userId, { coins: bountyAmount })
    .then(response => {
      console.log("Data saved successfully:", response);
    })
    .catch(error => {
      console.error("Error saving data:", error);
    });
};



useEffect(() => {
 


  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      console.log('unmounted')
      saveUserData();
    }
  };

  const handleBeforeUnload = (event) => {
    
    saveUserData();
    event.returnValue = ''; // This line helps with older browsers, though modern browsers often ignore it
  };



  // Add event listeners
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", handleBeforeUnload);

  // Cleanup event listeners on component unmount
  return () => {
  
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [userId, bountyAmount]);



  // Handle image tap
  const handleImageTap = async () => {
    if (taps > 0) {
      const newAmount = bountyAmount + 1;
      const newTaps = taps - 1;

      setBountyAmount(newAmount);
      setTaps(newTaps);

      try {
        await service.updateUserData(userId, { coins: newAmount, taps: newTaps });
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

  // Format time from seconds to hh:mm:ss
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
      {userInfo.first_name || userInfo.username ? (
        <div className="w-full flex flex-col text-left px-4 gap-4">
          <h2 className="font-bold text-lg md:text-xl">
            Welcome, {userInfo.first_name || userInfo.username}!
          </h2>

          <div className="flex space-x-4 items-center justify-start w-full rounded-lg text-xs">
            <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg font-bold">
              {formatTime(timeLeft)} Left
            </div>
            <div className="px-3 py-3 rounded-md border border-[#7d5126]">
              {taps} Taps
            </div>
          </div>
        </div>
      ) : null}

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
        {bountyAmount && <h2 className="text-3xl font-bold">{bountyAmount.toFixed(6)} BNTY</h2>}
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

