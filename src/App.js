
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

function App() {
  const [userdata,setuserdata]=useState({})
  const dispatch=useDispatch();
  // { login }

  useEffect(() => {
    // Check if the Telegram WebApp object is available
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
  }, []);
  return (
    <>
      <Router>

        
        
          <Header />

         
          <Routes>
            <Route path="/" element={<Home    />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/boost" element={<Boost />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/profile" element={<ProfilePage />} />
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
