
 // Initialize Appwrite client and subscribe to real-time updates
 useEffect(() => {
    if (!userId) return;

    client.setEndpoint(process.env.REACT_APP_APPWRITE_URL).setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

    const channel = `databases.${process.env.REACT_APP_APPWRITE_DATABASE_ID}.collections.${process.env.REACT_APP_APPWRITE_USERS_COLLECTION_ID}.documents.${userId}`;
    
    const unsubscribe = client.subscribe(channel, (response) => {
      if (response.payload?.coins) {
        setBountyAmount(response.payload.coins);
        bountyAmountRef.current = response.payload.coins;
      }
      if (response.payload?.taps) {
        setTaps(response.payload.taps);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Fetch user data for initial state
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

  // Save coins every 10 seconds if farming is active
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isFarming) {
        console.log("Saving bountyAmount to the database:", bountyAmountRef.current);
        saveUserData(bountyAmountRef.current);
        localStorage.setItem("lastSaved", Date.now());
      }
    }, 10000);

    return () => clearInterval(saveInterval);
  }, [userId, isFarming]);

  const resetFarming = () => {
    setIsFarming(false);
    setTaps(100);
    setTimeLeft(initialTime);
    localStorage.removeItem("endTime");
    service.updateUserData(userId, { taps: 100 });
  };

  const calculatePerSecondEarning = (amount) => {
    const APY = 2.4;
    const SECONDS_IN_A_YEAR = 31536000;
    return (amount * APY) / SECONDS_IN_A_YEAR;
  };

  useEffect(() => {
    let timer;
    if (isFarming && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        const coinIncrease = calculatePerSecondEarning(bountyAmountRef.current);
        setBountyAmount((prevBounty) => {
          const updatedBounty = prevBounty + coinIncrease;
          bountyAmountRef.current = updatedBounty;
          return updatedBounty;
        });

        if (timeLeft <= 1) {
          resetFarming();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isFarming, timeLeft]);

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
    localStorage.setItem("timeLeft", initialTime);
  };

  const saveUserData = async (amount) => {
    await service.updateUserData(userId, { coins: amount })
      .then(response => console.log("Data saved successfully:", response))
      .catch(error => console.error("Error saving data:", error));
  };

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

      const randomX = Math.random() * 50 + 25;
      const randomY = Math.random() * 40 + 10;
      setFloatingPlusPosition({ x: randomX, y: randomY });

      setTimeout(() => setFloatingPlusPosition(null), 1000);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
