
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
import { login } from './store/userSlice';
import AdminDashboard from './Pages/Admin';
import service from './appwrite/database';
import { setPremiumTasks, setSocialTasks } from './store/dataSlice';

function App() {
  const [userdata, setuserdata] = useState({})
  const dispatch = useDispatch();
  // { login }

  const fetchUserData = async () => {
    // Check if the Telegram WebApp object is available
    try {
      if (window.Telegram?.WebApp) {
        // Accessing the username from Telegram Web App data
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
          setuserdata(user)
          dispatch(login(user))

        } else {
          console.log('User data not available');
        }
      } else {
        console.log('Telegram WebApp not available');
      }
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {

    fetchUserData()
 

  }, []);
  return (
    <>
      <Router>



        <Header />


        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/boost" element={<Boost />} />
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* 404 Not Found route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>

        {/* Bottom navigation bar could be static */}
        <BottomNav />



        <BottomNav />
      </Router>
    </>
  );
}

export default App;
