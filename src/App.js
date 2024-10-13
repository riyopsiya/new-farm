
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
import loadingGif from './images/Animation - 1728853348711.gif'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();



  const fetchUserData = async () => {
    try {
      if (window.Telegram?.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;

        if (user) {
          dispatch(login(user));
          const userId = user.id; // Extract the user ID


          // Check if user exists in the Appwrite database
          const existingUser = await service.getUser(userId.toString());



          if (existingUser) {
            // User exists, dispatch login with user data
            // dispatch(login(existingUser));
          } else {
            // User doesn't exist, create a new user in the database
            // toast.success('user not exist,creating a new') 
            const newUser = {
              userID: userId,

              coins: 1000,
              taps: 100
            };

            const createdUser = await service.createUser(newUser);
            // dispatch(login(createdUser));

          }
        } else {
          console.log('User data not available');
        }
      } else {
        console.log('Telegram WebApp not available');
      }
    } catch (error) {
      console.log(error);
    }
  };


  const fetchTasksData = async () => {

    try {


      const socialTasks = await service.getAllData('social')

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

  if(loading){
    return <div className="w-screen h-screen flex justify-center items-center">
    {/* <img src={loadingGif} alt="" className="h-64" /> */}
    <iframe src="https://lottie.host/embed/330e3274-d251-4bce-a100-07f5cdf0e24c/KqrYQMghNl.json" className='h-48'></iframe>
  </div>
  
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
