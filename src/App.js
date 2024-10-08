
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
import { setPremiumTasks, setSocialTasks, setdetail } from './store/dataSlice';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();
  


  const fetchUserData = async () => {
    // Check if the Telegram WebApp object is available
    try {
      
      if (window.Telegram?.WebApp) {
        // Accessing the username from Telegram Web App data
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
          // setuserdata(user)
          dispatch(login(user))
         
         
        } else {
          console.log('User data not available');
        }
      } else {
        console.log('Telegram WebApp not available');
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  const fetchTasksData = async () => {

    try {
    
      
      const socialTasks =await  service.getAllData('social')
      console.log( socialTasks.documents)
      if (socialTasks?.documents) {
        
        dispatch(setSocialTasks(socialTasks?.documents))
      }
      const premiumTasks = await service.getAllData('premium')

     

      dispatch(setPremiumTasks(premiumTasks.documents))

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {

    fetchUserData()
    fetchTasksData()

  }, [loading]);
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
          // transition: Bounce,
          />

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
