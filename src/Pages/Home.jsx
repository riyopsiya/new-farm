
import React, { useState, useEffect, useRef } from "react";
import bountyimg from "../images/bountyimg.png";
import { useSelector } from "react-redux";
import { Client, Databases } from "appwrite";
import service from "../appwrite/database";
import { NavLink } from 'react-router-dom'
import { IoMdPerson } from "react-icons/io";

const Home = () => {
  const { userInfo } = useSelector((state) => state.user);
  const initialTime = 8 * 60 * 60; // 8 hours in seconds
  // const userId = 1337182007;
  const userId = userInfo?.id;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [bountyAmount, setBountyAmount] = useState(1000);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isFarming, setIsFarming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [taps, setTaps] = useState(100);
  const [floatingPlusPosition, setFloatingPlusPosition] = useState(null);
  const bountyAmountRef = useRef(bountyAmount);
  const coinsGeneratedSinceStart = useRef(0); // Track coins generated since farming started
    const [totalCoinsGenerated, setTotalCoinsGenerated] = useState(0); // New state for total coins generated
   
 

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

    const unsubscribe = client.subscribe(channel, (response) => {
      if (response.payload?.coins) {
       
        setBountyAmount(response.payload.coins);
        bountyAmountRef.current = response.payload.coins;
      }
      if (response.payload?.taps) setTaps(response.payload.taps);
    });

    return () => unsubscribe();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const userData = await databases.getDocument(
        process.env.REACT_APP_APPWRITE_DATABASE_ID,
        process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
        userId.toString()
      );

      setUser(userData);
      setBountyAmount(userData.coins);
      bountyAmountRef.current = userData.coins;
      setTaps(userData.taps);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    bountyAmountRef.current = bountyAmount;
  }, [bountyAmount]);




  useEffect(() => {

    const calculateOfflineCoins = () => {
        const endTime = parseInt(localStorage.getItem("endTime") || "0", 10);
        const startTime = parseInt(localStorage.getItem("startTime") || "0", 10);
        const isFarmingActive = localStorage.getItem("isFarming") === "true";
        const coinsClaimed = localStorage.getItem("coinsClaimed") === "true";

        if (isFarmingActive && !coinsClaimed) {
            const currentTime = Date.now();

            if (endTime > currentTime) {
                // Farming is active, calculate total coins generated
                const timePassed = Math.floor((currentTime - startTime) / 1000);
                // console.log('time since farming started',timePassed)
                const coins = 0.0028 * timePassed;
                // console.log('Coins since farming started:', coins);

                // Update state for total coins generated
                setTotalCoinsGenerated(coins);
                coinsGeneratedSinceStart.current = coins;

                // Calculate remaining time for farming
                const remainingTime=Math.max(Math.floor((endTime - currentTime) / 1000), 0)
                setTimeLeft(remainingTime);
                setIsFarming(true);


                  // Check if the time left has become zero
                  if (remainingTime === 0) {
                    setCanClaim(true); // Show the claim button
                }
            } else {
                // Farming time is over
                const coins = Math.floor(0.0028 * initialTime)
            
            setTotalCoinsGenerated(coins);
            coinsGeneratedSinceStart.current = coins;

                // Reset farming state
       
                setCanClaim(true);
                resetFarming();
            }
        } else {
            // Farming is not active, reset farming state
            setCanClaim(false);
            // resetFarming();
        }
    };

    calculateOfflineCoins();

}, [isFarming]); // Run only once when the component mounts



  const resetFarming =async () => {
    setIsFarming(false);
    setTaps(100);
    setTimeLeft(initialTime);
    localStorage.removeItem("endTime");
    
    
    await service.updateUserData(userId, { taps: 100});  

  };
  const claimCoins = async () => {

      setCanClaim(false)
  const response= await service.updateUserCoins(userId, totalCoinsGenerated)
  
    coinsGeneratedSinceStart.current=0
  setTotalCoinsGenerated(0)
 
  // Mark coins as claimed in local storage
    localStorage.setItem("coinsClaimed", "true");

  };

  const APY = 2.4;
  const SECONDS_IN_A_YEAR = 31536000;

  const calculatePerSecondEarning = (amount) => (amount * APY) / SECONDS_IN_A_YEAR;



  useEffect(() => {
    let timer;
    if (isFarming && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        
        setTotalCoinsGenerated((prevBounty) => prevBounty + 0.0028 );
        if (timeLeft <= 1) resetFarming();
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isFarming, timeLeft]);





  const handleStartFarming = () => {
    if (timeLeft === 0) resetFarming();
    setIsFarming(true);
    const startTime = Date.now();
    // const endTime = Date.now() + 60 * 1000;  //60 sec 
    const endTime = Date.now() + initialTime * 1000;
    localStorage.setItem("endTime", endTime);
    localStorage.setItem("startTime", startTime);
    localStorage.setItem("isFarming", true);
      // Mark coins as claimed in local storage
      localStorage.setItem("coinsClaimed", "false");
  };

 
  const handleImageTap = async (e) => {
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

      // Capture the tap position within the image element
      const rect = e.target.getBoundingClientRect();
      const offsetX = e.clientX - rect.left; // X position within the image
      const offsetY = e.clientY - rect.top;  // Y position within the image

      // Calculate percentage positions to use in inline styles
      const xPercent = (offsetX / rect.width) * 100;
      const yPercent = (offsetY / rect.height) * 100;
      setFloatingPlusPosition({ x: xPercent, y: yPercent - 30 }); // Start a bit above the tap

      setTimeout(() => {
        setFloatingPlusPosition((prevPosition) => {
          if (prevPosition) { // Ensure prevPosition is not null
            return {
              ...prevPosition,
              y: prevPosition.y - 10, // Move up by 10% of the image height
            };
          }
          return prevPosition; // Return prevPosition if it's null
        });
      }, 1); // Delay to start the animation
  

      // Clear the floating +1 after the animation
      setTimeout(() => {
        setFloatingPlusPosition(null);
      }, 1000); // Duration of the animation
    }
  };


  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };



  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div>Loading...</div>
    </div>
  );


  return (
    <div className="flex flex-col items-center justify-between min-h-[65vh] text-white px-2 py-2 mt-4 overflow-hidden home-gradient ">

    {userInfo.first_name || userInfo.username ? (
        <div className="w-full flex flex-col text-left px-2 gap-4">

          <div className="flex w-full justify-between">
          <h2 className="font-semibold text-md md:text-lg">
            Welcome, {userInfo.first_name || userInfo.username}!
          </h2>

          <div className='absolute right-6'> <NavLink to={'/profile'} >       <IoMdPerson className='text-2xl' /></NavLink></div>

          </div>
        
          <div className="flex space-x-4 items-center justify-start w-full rounded-lg text-xs">
          <div className="bg-gradient-to-r from-black to-[#7d5126] w-32 flex justify-center px-2 py-3 rounded-lg font-semibold glass-effect">
              {formatTime(timeLeft)} Left
            </div>
            <div className="px-3 py-3 rounded-md w-20 text-center border border-[#7d5126] glass-effect">
              {taps} Taps
            </div>
          </div>
        </div>
      ) : null}
{/* 
<div className="w-full flex flex-col text-left px-2 gap-4">

          <div className="flex w-full justify-between">
          <h2 className="font-semibold text-md md:text-lg">
            Welcome, {userInfo.first_name || userInfo.username}!
          </h2>

          <div className='absolute right-6'> <NavLink to={'/profile'} >       <IoMdPerson className='text-2xl' /></NavLink></div>

          </div>
        
          <div className="flex space-x-4 items-center justify-start w-full rounded-lg text-xs">
          <div className="bg-gradient-to-r from-black to-[#7d5126] w-32 flex justify-center px-2 py-3 rounded-lg font-semibold glass-effect">
              {formatTime(timeLeft)} Left
            </div>
            <div className="px-3 py-3 rounded-md w-20 text-center border border-[#7d5126] glass-effect">
              {taps} Taps
            </div>
          </div>
        </div> */}
  {/* Center Section - Image and Bounty Amount */}
  <div className="flex flex-col items-center justify-center w-full  ">
    <div className="relative w-full flex justify-center" onClick={handleImageTap}>
      <img
        src={bountyimg}
        alt="Bounty Token"
        className="w-2/3 md:w-1/2 h-auto object-contain cursor-pointer"
      />
      {floatingPlusPosition && (
        <div
          className="floating-plus absolute text-lg text-green-500 transition-all duration-700"
          style={{
            left: `${floatingPlusPosition.x}%`,
            top: `${floatingPlusPosition.y}%`,
            transform: "translate(-50%, -50%)",
            transition: "top 1s ease-out",
          }}
        >
          +1
        </div>
      )}
    </div>
    {bountyAmount && (
      <div className="text-center mt-4">
        <h2 className="text-3xl font-bold">{bountyAmount.toFixed(4)} BNTY</h2>
        <p className="text-gray-400">Bounty Token</p>
      </div>
    )}
  </div>


  {canClaim  ? (
     <button
     className="bg-gradient-to-r fixed bottom-24 from-black to-[#7d5126] px-8 py-3 rounded-lg w-full text-lg font-bold"
     onClick={claimCoins}
   
   >
    Claim {totalCoinsGenerated.toFixed(4)} coins 
   </button>
  ) : (
    <button
        className="bg-gradient-to-r fixed bottom-24 from-black to-[#7d5126] px-8 py-3 rounded-lg w-full text-lg font-bold"
        onClick={handleStartFarming}
        disabled={isFarming && timeLeft > 0}
      >
        {isFarming ? (
  <span className="min-w-[10rem] inline-block text-center">
  Farming... {totalCoinsGenerated.toFixed(4)}
</span>
  ) : (
    "Start Farming"
  )}
      </button>
  )}
  
</div>

  );
};

export default Home;

