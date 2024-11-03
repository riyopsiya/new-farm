import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Components/Header';
import BottomNav from './Components/BottomNav';
import Tasks from './Pages/Tasks';
import Boost from './Pages/Boost';
import ReferralPage from './Pages/ReferralPage';
import { useEffect, useState } from 'react';
import ProfilePage from './Pages/ProfilePage';
import { useDispatch } from 'react-redux';
import { login, setUserData } from './store/userSlice';
import AdminDashboard from './Pages/Admin';
import service from './appwrite/database';
import { setPremiumTasks, setSocialTasks } from './store/dataSlice';
import loadingGif from './images/Animation - 1728853348711.gif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const generateReferralCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    const codeLength = 8;

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  };

  const fetchUserData = async () => {
    try {
      // Fetch user info from Telegram
      if (window.Telegram?.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;

        if (user) {
          dispatch(login(user));
          const userId = user.id; // Extract the user ID

          // Check if user exists in the Appwrite database
          const existingUser = await service.getUser(userId.toString());

          if (existingUser) {
            // User exists, dispatch login with user data
            dispatch(setUserData(existingUser));
          } else {
            // User doesn't exist, check for referral code in the URL
            // const urlParams = new URLSearchParams(window.location.search);
            const referralCode = window.Telegram.WebApp.initDataUnsafe?.start_param; // Use the correct key for your referral code
            if (referralCode) {
              toast.success('refer code is found')
              handleNewUserWithReferral(userId, referralCode);
            } else {
              toast.error('refer code is not found')
              handleNewUser(userId);
            }
          }
        } else {
          console.log('User data not available');
        }
      } else {
        console.log('Telegram WebApp not available');
      }
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
    }
  };

  const handleNewUser = async (userId) => {
    const newUser = {
      userID: userId,
      coins: 1000,
      taps: 100,
      referralCode: generateReferralCode(),
    };

    const createdUser = await service.createUser(newUser);
    dispatch(setUserData(createdUser));
  };

  const handleNewUserWithReferral = async (userId, referralCode) => {
    // Check if the referral code exists and belongs to a valid user
    const referrer = await service.getUserByReferralCode(referralCode);
    console.log(referrer)
    if (referrer) {
      // Create new user with bonus coins for both users
      const newUser = {
        userID: userId,
        coins: 2000, // 1000 + 1000 bonus
        taps: 100,
        referralCode: generateReferralCode(),
      };

      const createdUser = await service.createUser(newUser);
      dispatch(setUserData(createdUser));

      // Update the referrer with additional coins
      referrer.coins += 1000;
      await service.updateUserData(referrer.userID, { coins: referrer.coins });

      console.log("Referral bonus awarded to both users");
    } else {
      alert("Invalid referral code. Creating new user without referral bonus.");
      handleNewUser(userId);
    }
  };

  const fetchTasksData = async () => {
    try {
   
      const socialTasks = await service.getAllData('social');
      if (socialTasks?.documents) {
        dispatch(setSocialTasks(socialTasks?.documents));
      }
      const premiumTasks = await service.getAllData('premium');
      dispatch(setPremiumTasks(premiumTasks.documents));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
    fetchUserData();
    fetchTasksData();
  }, [loading]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <iframe src="https://lottie.host/embed/330e3274-d251-4bce-a100-07f5cdf0e24c/KqrYQMghNl.json" className='h-48'></iframe>
      </div>
    );
  }

  return (
    <>
      <Router>
        <ToastContainer
          className={'text-sm '}
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/boost" element={<Boost />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <BottomNav />
      </Router>
    </>
  );
}

export default App;
