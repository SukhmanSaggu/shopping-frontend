import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/Images/import-images'
import { Link, NavLink } from 'react-router-dom'
import { MdArrowBackIos } from 'react-icons/md'
import { ShopContext } from '../context/ShopContext'
import BrandLogo from './BrandLogo'


const Header = () => {

  const [showmenu, Setshowmenu] = useState(false);
   const { showSearch, setShowSearch, getCartCount, token, logout, navigate } = useContext(ShopContext)
   const [showDropdown, setShowDropdown] = useState(false);

   // Close dropdown on click outside
   useEffect(() => {
     if (!showDropdown) return;
     const closeDropdown = () => setShowDropdown(false);
     document.addEventListener("click", closeDropdown);
     return () => document.removeEventListener("click", closeDropdown);
   }, [showDropdown]);

  return (
    <header>
      <div className="container flex items-center justify-between">
        <div className="logo-box">
          <Link to={"/"} style={{ textDecoration: 'none' }}>
            <BrandLogo variant="header" size={40} showText={true} />
          </Link>
        </div>

        <div className={`primary-menu ${showmenu ? 'active-menu' : '' }`}>
          <div className="back-menu" onClick={() => Setshowmenu(false)}>
          <MdArrowBackIos /> Back
          </div>
          <nav>
            <ul className='flex items-center gap-6'>
              <li>
                <NavLink onClick={()=>Setshowmenu(false)} to={'/'} className={({isActive}) => (isActive ? 'active-menu' : '')} >Home</NavLink>
              </li>
              <li>
                <NavLink onClick={()=>Setshowmenu(false)} to={'/about'} className={({isActive}) => (isActive ? 'active-menu' : '')}>About Us</NavLink>
              </li>
              <li>
                <NavLink onClick={()=>Setshowmenu(false)} to={'/collection'} className={({isActive}) => (isActive ? 'active-menu' : '')}>Collection</NavLink>
              </li>
              <li>
                <NavLink onClick={()=>Setshowmenu(false)} to={'/contact-us'} className={({isActive}) => (isActive ? 'active-menu' : '')}>Contact</NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="user flex items-center gap-5">
          <div className="search-icon">
            <img src={assets.search_icon} alt="Search Icon" onClick={()=> { setShowSearch(true); navigate('/collection'); }} />
          </div>
          <div className="user-icon relative">
            {token ? (
              <>
                <img 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(prev => !prev);
                  }}
                  className="w-5 cursor-pointer hover:opacity-80 transition-opacity" 
                  src={assets.profile_icon} 
                  alt="Profile Icon" 
                />
                {showDropdown && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-10 pt-2 z-50"
                  >
                    <div className="flex flex-col gap-2 w-36 py-3 px-4 bg-white text-slate-800 rounded-lg shadow-lg border border-slate-100 text-sm">
                      {localStorage.getItem('adminToken') && (
                        <>
                          <p 
                            onClick={() => {
                              setShowDropdown(false);
                              navigate('/admin');
                            }} 
                            className="cursor-pointer text-indigo-600 hover:text-indigo-850 font-bold transition-colors"
                          >
                            Admin Panel
                          </p>
                          <hr className="border-slate-100 my-1" />
                        </>
                      )}
                      <p 
                        onClick={() => {
                          setShowDropdown(false);
                          navigate('/orders');
                        }} 
                        className="cursor-pointer hover:text-black transition-colors font-medium"
                      >
                        My Orders
                      </p>
                      <hr className="border-slate-100 my-1" />
                      <p 
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }} 
                        className="cursor-pointer hover:text-red-600 text-red-500 font-semibold transition-colors"
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to={'/login'}><img className="w-5 cursor-pointer" src={assets.profile_icon} alt="Profile Icon" /></Link>
            )}
          </div>
          <div className="cart-icon">
            <Link to={'/cart'}>
              <img src={assets.cart_icon} alt="Cart Icon" />
                <span className='cart-count'>
                    {getCartCount()}
                </span>
            </Link>
          </div>
          <div className="menu-icon">
            <img onClick={() => Setshowmenu(true)} src={assets.menu_icon} alt="menu-icon" />
          </div>
        </div>
      </div>

    </header>
  )
}

export default Header