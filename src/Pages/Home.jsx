
import React, { useState, useEffect, useRef } from "react";
import bountyimg from "../images/bountyimg.png";
import { useSelector } from "react-redux";
import { Client, Databases } from "appwrite";
import service from "../appwrite/database";

const Home = () => {
  const { userInfo } = useSelector((state) => state.user);
  const initialTime = 8 * 60 * 60; // 8 hours in seconds
  // const userId = 1337182007;
  // const userId = 1751474467;
  const userId = userInfo?.id;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [bountyAmount, setBountyAmount] = useState(1000);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isFarming, setIsFarming] = useState(false);
  const [taps, setTaps] = useState(100);
  const [floatingPlusPosition, setFloatingPlusPosition] = useState(null);
  const bountyAmountRef = useRef(bountyAmount);

 

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
    let saveInterval;

    if (isFarming) {
      saveInterval = setInterval(() => {

        saveUserData(bountyAmountRef.current);
      }, 10000);
    }

    return () => clearInterval(saveInterval);
  }, [isFarming]);

  // useEffect(() => {
  //   const endTime = parseInt(localStorage.getItem("endTime") || "0", 10);
  //   const isFarmingActive = localStorage.getItem("isFarming") === "true";
  //   const savedBountyAmount = parseFloat(localStorage.getItem("bountyAmount") || "0");
  //   const lastVisitedTime = parseInt(localStorage.getItem("lastVisitedTime") || Date.now(), 10);

  //   if (isFarmingActive && endTime > Date.now()) {
  //     const offlineDuration = Math.floor((Date.now() - lastVisitedTime) / 1000);
  //     console.log('offline duration', offlineDuration)
  //     const offlineCoinsEarned = calculatePerSecondEarning(savedBountyAmount) * offlineDuration;
  //     console.log('offline coins earned', offlineCoinsEarned)

  //     // Update bounty amount immediately with offline coins earned
  //     const updatedBountyAmount = savedBountyAmount + offlineCoinsEarned;
  //     setBountyAmount(updatedBountyAmount);
  //     bountyAmountRef.current = updatedBountyAmount; // Update the ref to keep it in sync
  //     saveUserData(updatedBountyAmount);


  //     setTimeLeft(Math.max(Math.floor((endTime - Date.now()) / 1000), 0));
  //     setIsFarming(true);
  //   } else {
  //     resetFarming();
  //   }

  //   return () => {
  //     localStorage.setItem("bountyAmount", bountyAmountRef.current.toString());
  //     localStorage.setItem("lastVisitedTime", Date.now().toString());
  //   }
  // }, []);


  useEffect(() => {
    const calculateOfflineCoins = () => {
      const endTime = parseInt(localStorage.getItem("endTime") || "0", 10);
      const startTime = parseInt(localStorage.getItem("startTime") || "0", 10);

      const isFarmingActive = localStorage.getItem("isFarming") === "true";
      const savedBountyAmount = parseFloat(localStorage.getItem("bountyAmount") || "0");
      const lastVisitedTime = parseInt(localStorage.getItem("lastVisitedTime") || Date.now(), 10);

      if (isFarmingActive && endTime > Date.now()) {
        const offlineDuration = Math.floor((Date.now() - lastVisitedTime) / 1000);
        const offlineCoinsEarned = calculatePerSecondEarning(savedBountyAmount) * offlineDuration;
        const updatedBountyAmount = savedBountyAmount + offlineCoinsEarned;

        setBountyAmount(updatedBountyAmount);
        bountyAmountRef.current = updatedBountyAmount;
        saveUserData(updatedBountyAmount); // Save updated amount to database

        setTimeLeft(Math.max(Math.floor((endTime - Date.now()) / 1000), 0));

        setIsFarming(true);
      } else {
        resetFarming();
      }
    };

    calculateOfflineCoins();

    return () => {
      localStorage.setItem("bountyAmount", bountyAmountRef.current.toString());
      localStorage.setItem("lastVisitedTime", Date.now().toString());
    };
  }, [isFarming]); // Dependency on isFarming to recalculate if farming was active

  const resetFarming = () => {
    setIsFarming(false);
    setTaps(100);
    setTimeLeft(initialTime);
    localStorage.removeItem("endTime");
    
    
    service.updateUserData(userId, { taps: 100});  

  };

  const APY = 2.4;
  const SECONDS_IN_A_YEAR = 31536000;

  const calculatePerSecondEarning = (amount) => (amount * APY) / SECONDS_IN_A_YEAR;

  useEffect(() => {
    let timer;
    if (isFarming && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        setBountyAmount((prevBounty) => prevBounty + calculatePerSecondEarning(bountyAmountRef.current));
        if (timeLeft <= 1) resetFarming();
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isFarming, timeLeft]);






  const handleStartFarming = () => {
    if (timeLeft === 0) resetFarming();
    setIsFarming(true);
    const startTime = Date.now();
    const endTime = Date.now() + initialTime * 1000;
    localStorage.setItem("endTime", endTime);
    localStorage.setItem("startTime", startTime);
    localStorage.setItem("isFarming", true);
  };

  const saveUserData = async (amount) => {
    try {
      await service.updateUserData(userId, { coins: amount });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    const saveOnVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem("bountyAmount", bountyAmountRef.current.toString());
        saveUserData(bountyAmountRef.current);
      }
    };

    const saveOnBeforeUnload = (event) => {
      localStorage.setItem("bountyAmount", bountyAmountRef.current.toString());
      saveUserData(bountyAmountRef.current);
      event.returnValue = '';
    };

    document.addEventListener("visibilitychange", saveOnVisibilityChange);
    window.addEventListener("beforeunload", saveOnBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", saveOnVisibilityChange);
      window.removeEventListener("beforeunload", saveOnBeforeUnload);
    };
  }, [userId]);



  // Define the function for image tap
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

      // Set initial floating +1 position
      // setFloatingPlusPosition({ x: xPercent, y: yPercent });
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

  // // Handle image tap
  // const handleImageTap = async () => {
  //   if (taps > 0) {
  //     const newAmount = bountyAmount + 1;
  //     const newTaps = taps - 1;

  //     setBountyAmount(newAmount);
  //     setTaps(newTaps);

  //     try {
  //       await service.updateUserData(userId, { coins: newAmount, taps: newTaps });
  //     } catch (error) {
  //       console.error("Error updating coins and taps in Appwrite:", error);
  //     }

  //     // Floating +1 animation
  //     const randomX = Math.random() * 50 + 25;
  //     const randomY = Math.random() * 40 + 10;
  //     setFloatingPlusPosition({ x: randomX, y: randomY });

  //     setTimeout(() => {
  //       setFloatingPlusPosition(null);
  //     }, 1000);
  //   }
  // };



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
    <div className=" flex flex-col items-center justify-between h-[65vh]  text-white py-4 overflow-hidden home-gradient">

      {/* <div className='absolute -z-10  bg-gradient-to-tr from-black via-[#7d5126] to-black top-4  blur-3xl opacity-100 rounded-full h-96  w-24 lg:w-96'></div> */}

      {userInfo.first_name || userInfo.username ? (
        <div className="w-full flex flex-col text-left px-4 gap-4">
          <h2 className="font-semibold text-md md:text-lg">
            Welcome, {userInfo.first_name || userInfo.username}!
          </h2>

          <div className="flex space-x-4 items-center justify-start w-full rounded-lg text-xs">
            <div className="bg-gradient-to-r from-black to-[#7d5126] w-40 flex justify-center px-2 py-3 rounded-lg font-semibold">
              {formatTime(timeLeft)} Left
            </div>
            <div className="px-3 py-3 rounded-md border border-[#7d5126]">
              {taps} Taps
            </div>
          </div>
        </div>
      ) : null}

{/*       
    <div className="w-full flex flex-col text-left px-4 gap-4">
          <h2 className="font-semibold text-md md:text-lg">
            Welcome, Hardik!
          </h2>

          <div className="flex space-x-4 items-center justify-start w-full rounded-lg text-xs">
            <div className="bg-gradient-to-r from-black to-[#7d5126] w-40 flex justify-center px-2 py-3 rounded-lg font-semibold">
              {formatTime(timeLeft)} Left
            </div>
            <div className="px-3 py-3 rounded-md border border-[#7d5126]">
              {taps} Taps
            </div>
          </div>
        </div> */}


     
        <div 
    className="relative mt-4 w-full flex justify-center  shadow-xl py-16  shadow-blue-gradient" 
    onClick={handleImageTap}
>  <img
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
              transition: "top 1s ease-out", // Smoothly move the text upwards
            }}
          >
            +1
          </div>
        )}
      </div>

      <div className="text-center mt-4">
        {bountyAmount && <h2 className="text-3xl font-bold">{bountyAmount.toFixed(4)} BNTY</h2>}
        <p className="text-gray-400">Bounty Token</p>
      </div>

      <button
        className="bg-gradient-to-r fixed bottom-24 from-black to-[#7d5126] px-8 py-3 rounded-lg w-full text-lg font-bold"
        onClick={handleStartFarming}
        disabled={isFarming && timeLeft > 0}
      >
        {isFarming ? (
    <span>
      Farming...
    </span>
  ) : (
    "Start Farming"
  )}
      </button>
    </div>
  );
};

export default Home;






// import React, { useState, useEffect, useRef } from "react";
// import bountyimg from "../images/bountyimg.png";
// import { useSelector } from "react-redux";
// import { Client, Databases } from "appwrite";
// import service from "../appwrite/database";

// const Home = () => {
//   const { userInfo } = useSelector((state) => state.user);
//   const initialTime = 8 * 60 * 60; // 8 hours in seconds
//   const userId = 1337182007;
//   // const userId = 1751474467;
//   // const userId = userInfo?.id;
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState({});
//   const [bountyAmount, setBountyAmount] = useState(1000);
//   const [timeLeft, setTimeLeft] = useState(initialTime);
//   const [isFarming, setIsFarming] = useState(false);
//   const [taps, setTaps] = useState(100);
//   const [floatingPlusPosition, setFloatingPlusPosition] = useState(null);
//   const bountyAmountRef = useRef(bountyAmount);
//   const coinsGeneratedSinceStart = useRef(0); // Track coins generated since farming started
//   const [totalCoinsGenerated, setTotalCoinsGenerated] = useState(0); // New state for total coins generated
 

//   // Initialize Appwrite client
//   const client = new Client();
//   const databases = new Databases(client);

//   // WebSocket connection for real-time updates
//   useEffect(() => {

//     if (!userId) return;

//     client
//       .setEndpoint(process.env.REACT_APP_APPWRITE_URL)
//       .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

//     const channel = `databases.${process.env.REACT_APP_APPWRITE_DATABASE_ID}.collections.${process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID}.documents.${userId}`;

//     const unsubscribe = client.subscribe(channel, (response) => {
//       if (response.payload?.coins) {
//         setBountyAmount(response.payload.coins);
//         bountyAmountRef.current = response.payload.coins;
//       }
//       if (response.payload?.taps) setTaps(response.payload.taps);
//     });

//     return () => unsubscribe();
//   }, [userId]);

//   const fetchUserData = async () => {
//     try {
//       const userData = await databases.getDocument(
//         process.env.REACT_APP_APPWRITE_DATABASE_ID,
//         process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID,
//         userId.toString()
//       );

//       setUser(userData);
//       setBountyAmount(userData.coins);
//       bountyAmountRef.current = userData.coins;
//       setTaps(userData.taps);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     bountyAmountRef.current = bountyAmount;
//   }, [bountyAmount]);



//   // useEffect(() => {
//   //   let saveInterval;

//   //   if (isFarming) {
//   //     saveInterval = setInterval(() => {

//   //       saveUserData(bountyAmountRef.current);
//   //     }, 10000);
//   //   }

//   //   return () => clearInterval(saveInterval);
//   // }, [isFarming]);



//   useEffect(() => {
//     const calculateOfflineCoins = () => {
//       const endTime = parseInt(localStorage.getItem("endTime") || "0", 10);
//       const startTime = parseInt(localStorage.getItem("startTime") || "0", 10);

//       const isFarmingActive = localStorage.getItem("isFarming") === "true";
//       const savedBountyAmount = parseFloat(localStorage.getItem("bountyAmount") || "0");
//       const lastVisitedTime = parseInt(localStorage.getItem("lastVisitedTime") || Date.now(), 10);

//       if (isFarmingActive && endTime > Date.now()) {
//         // const offlineDuration = Math.floor((Date.now() - lastVisitedTime) / 1000);
//         // const offlineCoinsEarned = calculatePerSecondEarning(savedBountyAmount) * offlineDuration;
//         // const updatedBountyAmount = savedBountyAmount + offlineCoinsEarned;

//         // setBountyAmount(updatedBountyAmount);
//         // bountyAmountRef.current = updatedBountyAmount;
//         // saveUserData(updatedBountyAmount); // Save updated amount to database

//         setTimeLeft(Math.max(Math.floor((endTime - Date.now()) / 1000), 0));

//         const timepassed=Math.max(Math.floor((Date.now()-startTime) / 1000), 0)
//         console.log('time since farming started',timepassed)
//         console.log('user coins',bountyAmountRef.current)
//        const coins=calculatePerSecondEarning(bountyAmountRef.current ) *timepassed
//        console.log('coins since farming started',coins)
//         setTotalCoinsGenerated(coins); // Update total coins generated
//         coinsGeneratedSinceStart.current = coins

//         setIsFarming(true);
//       } else {
//         resetFarming();
//       }
//     };

//     calculateOfflineCoins();

//     return () => {
//       localStorage.setItem("bountyAmount", bountyAmountRef.current.toString());
//       localStorage.setItem("lastVisitedTime", Date.now().toString());
//     };
//   }, [isFarming]); // Dependency on isFarming to recalculate if farming was active

//   const resetFarming = () => {
//     setIsFarming(false);
//     setTaps(100);
//     setTimeLeft(initialTime);
//     localStorage.removeItem("endTime");
    
//     const newcoins=bountyAmountRef.current+coinsGeneratedSinceStart.current
//     service.updateUserData(userId, { taps: 100,coins:newcoins });   //update the generated coins after farming is over

//     coinsGeneratedSinceStart.current=0
//   setTotalCoinsGenerated(0)
//   };

//   const APY = 2.4;
//   const SECONDS_IN_A_YEAR = 31536000;

//   const calculatePerSecondEarning = (amount) => (amount * APY) / SECONDS_IN_A_YEAR;

//   // useEffect(() => {
//   //   let timer;
//   //   if (isFarming && timeLeft > 0) {
//   //     timer = setInterval(() => {
//   //       setTimeLeft((prevTime) => prevTime - 1);
//   //       setBountyAmount((prevBounty) => prevBounty + calculatePerSecondEarning(bountyAmountRef.current));
//   //       if (timeLeft <= 1) resetFarming();
//   //     }, 1000);
//   //   }

//   //   return () => clearInterval(timer);
//   // }, [isFarming, timeLeft]);




//   useEffect(() => {
//     let timer;
//     if (isFarming && timeLeft > 0) {
//       timer = setInterval(() => {
//         setTimeLeft((prevTime) => prevTime - 1);
        
//         setTotalCoinsGenerated((prevBounty) => prevBounty + calculatePerSecondEarning(bountyAmountRef.current ));
//         if (timeLeft <= 1) resetFarming();
//       }, 1000);
//     }

//     return () => clearInterval(timer);
//   }, [isFarming, timeLeft]);




//   const handleStartFarming = () => {
//     if (timeLeft === 0) resetFarming();
//     setIsFarming(true);
//     const startTime = Date.now();
//     const endTime = Date.now() + initialTime * 1000;
//     localStorage.setItem("endTime", endTime);
//     localStorage.setItem("startTime", startTime);
//     localStorage.setItem("isFarming", true);
//   };

//   const saveUserData = async (amount) => {
//     try {
//       await service.updateUserData(userId, { coins: amount });
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
//   };

//   useEffect(() => {
//     const saveOnVisibilityChange = () => {
//       if (document.visibilityState === "hidden") {
//         localStorage.setItem("bountyAmount", bountyAmountRef.current.toString());
//         saveUserData(bountyAmountRef.current);
//       }
//     };

//     const saveOnBeforeUnload = (event) => {
//       localStorage.setItem("bountyAmount", bountyAmountRef.current.toString());
//       saveUserData(bountyAmountRef.current);
//       event.returnValue = '';
//     };

//     document.addEventListener("visibilitychange", saveOnVisibilityChange);
//     window.addEventListener("beforeunload", saveOnBeforeUnload);

//     return () => {
//       document.removeEventListener("visibilitychange", saveOnVisibilityChange);
//       window.removeEventListener("beforeunload", saveOnBeforeUnload);
//     };
//   }, [userId]);



//   // Define the function for image tap
//   const handleImageTap = async (e) => {
//     if (taps > 0) {
//       const newAmount = bountyAmount + 1;
//       const newTaps = taps - 1;

//       setBountyAmount(newAmount);
//       setTaps(newTaps);

//       try {
//         await service.updateUserData(userId, { coins: newAmount, taps: newTaps });
//       } catch (error) {
//         console.error("Error updating coins and taps in Appwrite:", error);
//       }

//       // Capture the tap position within the image element
//       const rect = e.target.getBoundingClientRect();
//       const offsetX = e.clientX - rect.left; // X position within the image
//       const offsetY = e.clientY - rect.top;  // Y position within the image

//       // Calculate percentage positions to use in inline styles
//       const xPercent = (offsetX / rect.width) * 100;
//       const yPercent = (offsetY / rect.height) * 100;

//       // Set initial floating +1 position
//       setFloatingPlusPosition({ x: xPercent, y: yPercent });

//       // Move the floating +1 upwards after a short delay
//       setTimeout(() => {
//         setFloatingPlusPosition((prevPosition) => ({
//           ...prevPosition,
//           y: prevPosition.y - 10, // Move up by 10% of the image height
//         }));
//       }, 100); // Delay to start the animation

//       // Clear the floating +1 after the animation
//       setTimeout(() => {
//         setFloatingPlusPosition(null);
//       }, 1000); // Duration of the animation
//     }
//   };

//   // // Handle image tap
//   // const handleImageTap = async () => {
//   //   if (taps > 0) {
//   //     const newAmount = bountyAmount + 1;
//   //     const newTaps = taps - 1;

//   //     setBountyAmount(newAmount);
//   //     setTaps(newTaps);

//   //     try {
//   //       await service.updateUserData(userId, { coins: newAmount, taps: newTaps });
//   //     } catch (error) {
//   //       console.error("Error updating coins and taps in Appwrite:", error);
//   //     }

//   //     // Floating +1 animation
//   //     const randomX = Math.random() * 50 + 25;
//   //     const randomY = Math.random() * 40 + 10;
//   //     setFloatingPlusPosition({ x: randomX, y: randomY });

//   //     setTimeout(() => {
//   //       setFloatingPlusPosition(null);
//   //     }, 1000);
//   //   }
//   // };



//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div>Loading...</div>
//     </div>
//   );

//   return (
//     <div className=" flex flex-col items-center justify-between h-[65vh]  text-white p-4 overflow-hidden">

//       {/* <div className='absolute -z-10  bg-gradient-to-tr from-black via-[#7d5126] to-black top-4  blur-3xl opacity-100 rounded-full h-96  w-24 lg:w-96'></div> */}

//       {userInfo.first_name || userInfo.username ? (
//         <div className="w-full flex flex-col text-left px-4 gap-4">
//           <h2 className="font-bold text-lg md:text-xl">
//             Welcome, {userInfo.first_name || userInfo.username}!
//           </h2>

//           <div className="flex space-x-4 items-center justify-start w-full rounded-lg text-xs">
//             <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg font-bold">
//               {formatTime(timeLeft)} Left
//             </div>
//             <div className="px-3 py-3 rounded-md border border-[#7d5126]">
//               {taps} Taps
//             </div>
//           </div>
//         </div>
//       ) : null}


//       <div className="flex space-x-4 items-center justify-start w-full rounded-lg text-xs">
//         <div className="bg-gradient-to-r from-black to-[#7d5126] px-8 py-3 rounded-lg font-bold">
//           {formatTime(timeLeft)} Left
//         </div>
//         <div className="px-3 py-3 rounded-md border border-[#7d5126]">
//           {taps} Taps
//         </div>
//       </div>

//       <div className="relative mt-4 w-full flex justify-center" onClick={handleImageTap}>
//         <img
//           src={bountyimg}
//           alt="Bounty Token"
//           className="w-2/3 md:w-1/2 h-auto object-contain cursor-pointer"
//         />
//         {floatingPlusPosition && (
//           <div
//             className="floating-plus absolute text-lg text-green-500 transition-all duration-700"
//             style={{
//               left: `${floatingPlusPosition.x}%`,
//               top: `${floatingPlusPosition.y}%`,
//               transform: "translate(-50%, -50%)",
//               transition: "top 1s ease-out", // Smoothly move the text upwards
//             }}
//           >
//             +1
//           </div>
//         )}
//       </div>

//       <div className="text-center mt-4">
//         {bountyAmount && <h2 className="text-3xl font-bold">{bountyAmount.toFixed(4)} BNTY</h2>}
//         <p className="text-gray-400">Bounty Token</p>
//       </div>

//       <button
//         className="bg-gradient-to-r fixed bottom-24 from-black to-[#7d5126] px-8 py-3 rounded-lg w-full text-lg font-bold"
//         onClick={handleStartFarming}
//         disabled={isFarming && timeLeft > 0}
//       >
//         {isFarming ? (
//     <span>
//       Farming... <span className="font-semibold">{totalCoinsGenerated.toFixed(4)} coins</span>
//     </span>
//   ) : (
//     "Start Farming"
//   )}
//       </button>
//     </div>
//   );
// };

// export default Home;
