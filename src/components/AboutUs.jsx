import React, { useContext } from 'react'
import { assets } from '../assets/Images/import-images'
import SectionTitle from './SectionTitle'
import { ShopContext } from '../context/ShopContext'

const AboutUs = () => {
  const { navigate } = useContext(ShopContext);

  return (
    <div className='about-page'>
      <div className="container">
        <SectionTitle SectionTitle1={'About'} SectionTitle2={'Us'} />
        
        {/* Main Brand Story */}
        <div className="main-about">
          <div className="about-img">
            <img src={assets.about_img} alt="Elegant fashion flatlay" style={{ borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }} />
          </div>
          <div className="about-content">
            <h3>Crafting Timeless Style Since 2018</h3>
            <p>
              SAGGU | Maison de la Vega was born out of a shared passion for timeless fashion and contemporary design. Our journey began with a simple vision: to curate collections that elevate everyday style by seamlessly combining premium-grade craftsmanship with effortless elegance. We believe that what you wear is a reflection of your identity, and every stitch, fold, and detail matters.
            </p>
            <p>
              Each garment in our catalog is hand-selected and rigorously verified. From sourcing high-quality, sustainable fabrics to implementing master tailoring techniques, we prioritize durability, luxury comfort, and state-of-the-art aesthetics. We bridge the gap between premium design and accessible prices, ensuring that you look and feel your absolute best in every setting.
            </p>
            <button onClick={() => navigate('/contact-us')} className='primary-btn' style={{ borderRadius: '4px', marginTop: '15px' }}>
              Contact Us
            </button>
          </div>
        </div>

        {/* Why Choose Us & Trust Stats Grid */}
        <div className="why-choose-us-section">
          <SectionTitle SectionTitle1={'Why'} SectionTitle2={'Choose Us'} />
          
          <div className="about-stats-grid">
            {/* Stat Card 1: Brand Rating */}
            <div className="about-stat-card">
              <div className="about-stat-icon">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="about-stat-number">4.8★</div>
              <div className="about-stat-title">Brand Rating</div>
              <p className="about-stat-desc">
                Trusted by over 50,000+ fashion enthusiasts globally for our perfect fit, premium feel, and outstanding aesthetics.
              </p>
            </div>

            {/* Stat Card 2: Express Shipping */}
            <div className="about-stat-card">
              <div className="about-stat-icon">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div className="about-stat-number">Express</div>
              <div className="about-stat-title">Worldwide Delivery</div>
              <p className="about-stat-desc">
                Fast, reliable global shipping with secure protective packaging and end-to-end automatic parcel tracking.
              </p>
            </div>

            {/* Stat Card 3: Quality Craftsmanship */}
            <div className="about-stat-card">
              <div className="about-stat-icon">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="about-stat-number">Premium</div>
              <div className="about-stat-title">Guaranteed Quality</div>
              <p className="about-stat-desc">
                Every single piece undergoes a meticulous multi-point quality assurance check to ensure top-tier materials and stitch perfection.
              </p>
            </div>

            {/* Stat Card 4: 7-Day Return Guarantee */}
            <div className="about-stat-card">
              <div className="about-stat-icon">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
              <div className="about-stat-number">7-Day</div>
              <div className="about-stat-title">Seamless Exchange</div>
              <p className="about-stat-desc">
                Not the perfect fit? Enjoy ultimate peace of mind with our transparent, swift, and entirely hassle-free return and exchange policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs