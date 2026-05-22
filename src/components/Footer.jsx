import React from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from './BrandLogo'

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="main-footer">
          <div className="box">
            <Link to={"/"} style={{ textDecoration: 'none' }}>
              <BrandLogo variant="footer" size={48} showText={true} />
            </Link>
            <p className="text-slate-600 mt-4">
              We curate elegant, timeless fashion that fuses Spanish-French heritage with a modern artistic vision. Designed with premium quality craftsmanship and an eye for high-end minimalism, SAGGU | Maison de la Vega makes dressing beautifully an everyday luxury.
            </p>
          </div>
          <div className="box">
            <h4>Quick Links</h4>

            <ul>
              <li><Link to="/" className="hover:text-black transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-black transition-colors duration-200">About Us</Link></li>
              <li><Link to="/collection" className="hover:text-black transition-colors duration-200">Collection</Link></li>
              <li><Link to="/contact-us" className="hover:text-black transition-colors duration-200">Contact</Link></li>
              <li><Link to="/admin" className="text-indigo-650 hover:text-indigo-900 font-semibold transition-colors duration-200">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="box">
            <h4>GET IN TOUCH</h4>
            <ul>
              <li><a href="tel:842745342" className="hover:text-black transition-colors duration-200">842745342</a></li>
              <li><a href="mailto:sukhmansaggu4030@gmail.com" className="hover:text-black transition-colors duration-200">sukhmansaggu4030@gmail.com</a></li>
              <li><span className="text-slate-500">Kahnuwan Road, Batala, Punjab</span></li>
            </ul>
          </div>
        </div>
        <div className="bottom-footer text-center py-2">
          <p>Copyright 2026 SAGGU | Maison de la Vega - All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer