import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import LatestCollection from '../components/LatestCollection';
import ShopContextProvider from '../context/ShopContext';
import BestSaller from '../components/BestSaller';
import OurPolicy from '../components/OurPolicy';
import NewsLatter from '../components/NewsLatter';
import SearchBar from '../components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Home = () => {
  const location = useLocation();
  return (
    <div>
      <ShopContextProvider>
        <ToastContainer/>
          <Header />
          <SearchBar/>
          {location.pathname === "/" ? <Mainpage /> : <Outlet />}
          <Footer />
      </ShopContextProvider>
    </div>
  )
}


const Mainpage = () => {
  return (
    <>
      <HeroSection />
      <LatestCollection />
      <BestSaller/>
      <OurPolicy/>
      {/* <NewsLatter/> */}
    </>
  )
}
export default Home

