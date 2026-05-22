import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/Images/import-images'
import { ShopContext } from '../context/ShopContext'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Interactive banner states
  const [activeTurbanPose, setActiveTurbanPose] = useState(0); // 0: blazer, 1: sweater, 2: black suit
  const [activeCouplePose, setActiveCouplePose] = useState(0); // 0: couple, 1: sweater close up
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const { addToCart, navigate } = useContext(ShopContext);

  // banner products mapping to actual product IDs in local DB
  const BANNER_PRODUCTS = {
    blazer: {
      _id: "aaabb",
      name: "Premium Pinstriped Olive Blazer",
      price: 4999,
      image: assets.turban_man_green_blazer,
      description: "An elegant, premium tailored olive green pinstriped blazer jacket, perfect for collection highlights and elevated styles.",
      size: "L"
    },
    mug: {
      _id: "aaaaa",
      name: "NOT TODAY Ceramic Mug",
      price: 899,
      image: assets.turban_man_holding_mug,
      description: "A premium white ceramic mug with 'NOT TODAY' bold black typography. Perfect for your daily coffee and tea sessions.",
      size: "M"
    },
    sweater: {
      _id: "aaaab",
      name: "Classic Knit Blue Sweater",
      price: 1499,
      image: assets.turban_man_blue_sweater,
      description: "A premium crewneck knitted blue sweater for a comfortable and stylish weekend casual look.",
      size: "L"
    },
    velvetSuit: {
      _id: "aaabz",
      name: "Royal Velvet Dinner Suit",
      price: 6999,
      image: assets.turban_man_black_suit,
      description: "A luxurious black velvet blazer jacket, tailored for special occasions and exclusive evening night edits.",
      size: "L"
    },
    notebook: {
      _id: "aaaag",
      name: "Versatility Journal & Pen Set",
      price: 1299,
      image: assets.silver_necklace_black_notebook,
      description: "A hand-crafted black leather journal featuring smooth premium cream paper, paired with a matching gold fountain pen.",
      size: "S"
    },
    trenchCoat: {
      _id: "aaaau",
      name: "Classy Beige Winter Trench Coat",
      price: 3499,
      image: assets.couple_fashion_trench,
      description: "A premium double-breasted beige trench coat featuring tailored button details and an adjustable belt.",
      size: "M"
    },
    silkScarf: {
      _id: "aaaae",
      name: "Patterned Silk Scarf",
      price: 999,
      image: assets.fashion_flatlay,
      description: "A premium silk scarf featuring abstract geometric patterns in terracotta, cream, and deep forest green.",
      size: "S"
    },
    leatherBag: {
      _id: "aaaaw",
      name: "Minimalist Green Leather Handbag",
      price: 2400,
      image: assets.fashion_flatlay,
      description: "A modern structural shoulder bag crafted from top-grain forest green leather with clean gold hardware.",
      size: "M"
    },
    boots: {
      _id: "aaacb",
      name: "Tan Heeled Suede Boots",
      price: 3999,
      image: assets.about_img,
      description: "Elegant tan suede ankle boots with comfortable block heels, matching your timeless wardrobe choices perfectly.",
      size: "M"
    },
    cardigan: {
      _id: "aaace",
      name: "Classic Cozy Knit Cardigan",
      price: 2999,
      image: assets.about_img,
      description: "A premium thick-knit beige cardigan with textured details, perfect for layering during chilly seasons.",
      size: "M"
    },
    jeans: {
      _id: "aaacj",
      name: "Vintage Slim Fit Blue Jeans",
      price: 1999,
      image: assets.about_img,
      description: "Classic medium-wash denim jeans with a comfortable slim-straight fit, built from durable quality cotton.",
      size: "M"
    }
  };

  const slides = [
    { type: 'turban-collage', title: "Elevated Style" },
    { type: 'couple-collage', title: "Refined Aesthetics" },
    { type: 'flatlay-collage', title: "Refined Aesthetics" },
    {
      type: 'standard',
      image: assets.about_img,
      firstTagline: "CLASSIC STYLES",
      title: "Timeless Essentials",
      secoundTagline: "Explore Collection"
    }
  ];

  // Auto scroll slides (except if quick view is open)
  useEffect(() => {
    if (quickViewProduct) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length, quickViewProduct]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const openQuickView = (e, productKey) => {
    e.stopPropagation();
    setQuickViewProduct(BANNER_PRODUCTS[productKey]);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (quickViewProduct) {
      addToCart(quickViewProduct._id, quickViewProduct.size);
      closeQuickView();
    }
  };

  // Get active image for turban slide based on bottom left thumbnail or center thumbnail click
  const getTurbanMainImage = () => {
    if (activeTurbanPose === 0) return assets.turban_man_green_blazer;
    if (activeTurbanPose === 1) return assets.turban_man_blue_sweater;
    return assets.turban_man_black_suit;
  };

  return (
    <section className='hero-section'>
      <div className="container">
        <div className="main-hero-section">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            
            if (slide.type === 'turban-collage') {
              return (
                <div key={index} className={`hero-slide turban-collage-slide ${isActive ? 'active' : ''}`}>
                  {/* Left content panel */}
                  <div className="collage-left">
                    <div className="hero-text">
                      <span className='first-tagline'>COLLECTION HIGHLIGHTS</span>
                      <h1 className="editorial-title">Elevated<br/>Style</h1>
                      <button onClick={(e) => openQuickView(e, 'blazer')} className='secound-tagline premium-action-btn'>
                        VIEW THE EDIT
                      </button>
                    </div>

                    {/* Small vertical thumbnails vertically stacked */}
                    <div className="vertical-thumbnails-left">
                      <div className={`v-thumb ${activeTurbanPose === 0 ? 'active' : ''}`} onClick={() => setActiveTurbanPose(0)}>
                        <img src={assets.turban_man_green_blazer} alt="Turban Blazer" />
                      </div>
                      <div className={`v-thumb ${activeTurbanPose === 1 ? 'active' : ''}`} onClick={() => setActiveTurbanPose(1)}>
                        <img src={assets.turban_man_blue_sweater} alt="Turban Sweater" />
                      </div>
                      <div className={`v-thumb ${activeTurbanPose === 2 ? 'active' : ''}`} onClick={() => setActiveTurbanPose(2)}>
                        <img src={assets.turban_man_black_suit} alt="Turban Suit" />
                      </div>
                    </div>
                  </div>

                  {/* Main center image panel */}
                  <div className="collage-center">
                    <div className="main-featured-image-box">
                      <img src={getTurbanMainImage()} alt="Featured Look" className="featured-main-img" />
                      
                      {/* Pulse Hotspots on Main Image */}
                      {activeTurbanPose === 0 && (
                        <>
                          <div className="hotspot-pulse p-blazer" onClick={(e) => openQuickView(e, 'blazer')}>
                            <span className="pulse-ring"></span>
                            <span className="pulse-dot"></span>
                            <div className="hotspot-tooltip">Premium Blazer<br/>₹4,999</div>
                          </div>
                          <div className="hotspot-pulse p-watch" onClick={(e) => openQuickView(e, 'notebook')}>
                            <span className="pulse-ring"></span>
                            <span className="pulse-dot"></span>
                            <div className="hotspot-tooltip">Accessories Edit</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* 3 bottom horizontal thumbnails */}
                    <div className="horizontal-thumbnails-bottom">
                      <div className="h-thumb" onClick={() => setActiveTurbanPose(1)}>
                        <img src={assets.turban_man_blue_sweater} alt="Weekend Casual" />
                        <span className="thumb-caption">Knit Wear</span>
                      </div>
                      <div className="h-thumb" onClick={(e) => openQuickView(e, 'notebook')}>
                        <img src={assets.silver_necklace_black_notebook} alt="Accessories" />
                        <span className="thumb-caption">Gold Set</span>
                      </div>
                      <div className="h-thumb" onClick={() => setActiveTurbanPose(0)}>
                        <img src={assets.turban_man_green_blazer} alt="Pinstripe Blazer" />
                        <span className="thumb-caption">Blazers</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side product blocks */}
                  <div className="collage-right">
                    {/* Circle Crop Mug */}
                    <div className="circle-product-block" onClick={(e) => openQuickView(e, 'mug')}>
                      <div className="circle-crop-wrapper">
                        <img src={assets.turban_man_holding_mug} alt="Ceramic Mug" />
                      </div>
                      <div className="pulse-indicator"></div>
                    </div>

                    {/* Weekend Casual Vertical Block */}
                    <div className="weekend-casual-block" onClick={(e) => openQuickView(e, 'sweater')}>
                      <div className="img-holder">
                        <img src={assets.turban_man_blue_sweater} alt="Weekend Casual Look" />
                      </div>
                      <div className="text-overlay">
                        <h3>WEEKEND CASUAL</h3>
                        <p>Same rawa raw jacket, silk and luxury leather styles</p>
                      </div>
                    </div>

                    {/* Versatility in every choice & Night Edit */}
                    <div className="bottom-right-row">
                      <div className="versatility-box" onClick={(e) => openQuickView(e, 'notebook')}>
                        <span className="tag">VERSATILITY IN EVERY CHOICE</span>
                        <div className="small-circle-img">
                          <img src={assets.silver_necklace_black_notebook} alt="Notebook & Jewelry" />
                        </div>
                      </div>

                      <div className="night-edit-box" onClick={(e) => openQuickView(e, 'velvetSuit')}>
                        <img src={assets.turban_man_black_suit} alt="Night Edit" />
                        <div className="night-overlay">
                          <span>NIGHT EDIT</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Banner bottom links */}
                    <div className="banner-footer-menu">
                      <Link to="/collection" className="b-menu-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        Shop
                      </Link>
                      <Link to="/collection" className="b-menu-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20F4 19.5L4 3.5A2.5 2.5 0 0 1 6.5 1H20V17H6.5a2.5 2.5 0 0 0-2.5 2.5z"/></svg>
                        Journal
                      </Link>
                      <Link to="/about" className="b-menu-link">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        About
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            if (slide.type === 'couple-collage') {
              return (
                <div key={index} className={`hero-slide couple-collage-slide ${isActive ? 'active' : ''}`}>
                  <div className="collage-left">
                    <div className="hero-text">
                      <span className='first-tagline'>NEW ARRIVALS</span>
                      <h1 className="editorial-title">Refined<br/>Aesthetics</h1>
                      <button onClick={(e) => openQuickView(e, 'trenchCoat')} className='secound-tagline premium-action-btn'>
                        EXPLORE MORE
                      </button>
                    </div>

                    {/* Small vertical thumbnails */}
                    <div className="vertical-thumbnails-left">
                      <div className="v-thumb active" onClick={(e) => openQuickView(e, 'trenchCoat')}>
                        <img src={assets.couple_fashion_trench} alt="Couple Look" />
                      </div>
                      <div className="v-thumb" onClick={(e) => openQuickView(e, 'silkScarf')}>
                        <img src={assets.fashion_flatlay} alt="Flatlay Scarf" />
                      </div>
                    </div>
                  </div>

                  <div className="collage-center">
                    <div className="main-featured-image-box">
                      <img src={assets.couple_fashion_trench} alt="Featured Couple Look" className="featured-main-img" />
                      
                      {/* Pulse Hotspots on Couple */}
                      <div className="hotspot-pulse p-coat" onClick={(e) => openQuickView(e, 'trenchCoat')}>
                        <span className="pulse-ring"></span>
                        <span className="pulse-dot"></span>
                        <div className="hotspot-tooltip">Trench Coat<br/>₹3,499</div>
                      </div>
                      <div className="hotspot-pulse p-scarf" onClick={(e) => openQuickView(e, 'silkScarf')}>
                        <span className="pulse-ring"></span>
                        <span className="pulse-dot"></span>
                        <div className="hotspot-tooltip">Silk Scarf<br/>₹999</div>
                      </div>
                    </div>

                    <div className="horizontal-thumbnails-bottom">
                      <div className="h-thumb" onClick={(e) => openQuickView(e, 'trenchCoat')}>
                        <img src={assets.couple_fashion_trench} alt="Fashion Trench" />
                        <span className="thumb-caption">Trench</span>
                      </div>
                      <div className="h-thumb" onClick={(e) => openQuickView(e, 'silkScarf')}>
                        <img src={assets.fashion_flatlay} alt="Flatlay Scarf" />
                        <span className="thumb-caption">Silk</span>
                      </div>
                    </div>
                  </div>

                  <div className="collage-right">
                    <div className="circle-product-block" onClick={(e) => openQuickView(e, 'mug')}>
                      <div className="circle-crop-wrapper">
                        <img src={assets.turban_man_holding_mug} alt="Mug Crop" />
                      </div>
                      <div className="pulse-indicator"></div>
                    </div>

                    <div className="weekend-casual-block" onClick={(e) => openQuickView(e, 'leatherBag')}>
                      <div className="img-holder">
                        <img src={assets.fashion_flatlay} alt="Bag Detail" />
                      </div>
                      <div className="text-overlay">
                        <h3>SIGNATURE ACCESSORIES</h3>
                        <p>Complete the elegant ensemble with handcrafted leather bags</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (slide.type === 'flatlay-collage') {
              return (
                <div key={index} className={`hero-slide flatlay-collage-slide ${isActive ? 'active' : ''}`}>
                  <div className="collage-left">
                    <div className="hero-text">
                      <span className='first-tagline'>NEW ARRIVALS</span>
                      <h1 className="editorial-title font-medium">Refined<br/>Aesthetics</h1>
                      <button onClick={(e) => openQuickView(e, 'trenchCoat')} className='secound-tagline premium-action-btn'>
                        EXPLORE MORE
                      </button>
                    </div>
                  </div>

                  <div className="collage-flatlay-main" onClick={(e) => openQuickView(e, 'trenchCoat')}>
                    <div className="flatlay-featured-box">
                      <img src={assets.fashion_flatlay} alt="Curated Flatlay" className="flatlay-img" />
                      
                      {/* Pulse Hotspots on Curated Items */}
                      <div className="hotspot-pulse fl-coat" onClick={(e) => openQuickView(e, 'trenchCoat')}>
                        <span className="pulse-ring"></span>
                        <span className="pulse-dot"></span>
                        <div className="hotspot-tooltip">Beige Coat<br/>₹3,499</div>
                      </div>
                      <div className="hotspot-pulse fl-scarf" onClick={(e) => openQuickView(e, 'silkScarf')}>
                        <span className="pulse-ring"></span>
                        <span className="pulse-dot"></span>
                        <div className="hotspot-tooltip">Silk Scarf<br/>₹999</div>
                      </div>
                      <div className="hotspot-pulse fl-bag" onClick={(e) => openQuickView(e, 'leatherBag')}>
                        <span className="pulse-ring"></span>
                        <span className="pulse-dot"></span>
                        <div className="hotspot-tooltip">Leather Bag<br/>₹2,400</div>
                      </div>
                      <div className="hotspot-pulse fl-mug" onClick={(e) => openQuickView(e, 'mug')}>
                        <span className="pulse-ring"></span>
                        <span className="pulse-dot"></span>
                        <div className="hotspot-tooltip">Ceramic Mug<br/>₹899</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Standard fallback slides
            return (
              <div 
                key={index} 
                className={`hero-slide standard-slide ${isActive ? 'active' : ''}`}
              >
                <div className="hero-content">
                  <div className="hero-text">
                    <span className='first-tagline'>{slide.firstTagline}</span>
                    <h1>{slide.title}</h1>
                    <Link to="/collection" className='secound-tagline'>
                      {slide.secoundTagline}
                    </Link>
                  </div>
                </div>
                <div className="hero-images">
                  <div className="itme" style={{ position: 'relative' }}>
                    <img src={slide.image} alt={slide.title} />
                    {slide.title === "Timeless Essentials" && (
                      <>
                        <div className="hotspot-pulse ess-cardigan" onClick={(e) => openQuickView(e, 'cardigan')}>
                          <span className="pulse-ring"></span>
                          <span className="pulse-dot"></span>
                          <div className="hotspot-tooltip">Cozy Knit Cardigan<br/>₹2,999</div>
                        </div>
                        <div className="hotspot-pulse ess-boots" onClick={(e) => openQuickView(e, 'boots')}>
                          <span className="pulse-ring"></span>
                          <span className="pulse-dot"></span>
                          <div className="hotspot-tooltip">Suede Boots<br/>₹3,999</div>
                        </div>
                        <div className="hotspot-pulse ess-jeans" onClick={(e) => openQuickView(e, 'jeans')}>
                          <span className="pulse-ring"></span>
                          <span className="pulse-dot"></span>
                          <div className="hotspot-tooltip">Vintage Blue Jeans<br/>₹1,999</div>
                        </div>
                        <div className="hotspot-pulse ess-mug" onClick={(e) => openQuickView(e, 'mug')}>
                          <span className="pulse-ring"></span>
                          <span className="pulse-dot"></span>
                          <div className="hotspot-tooltip">Ceramic Mug<br/>₹899</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button className="slider-arrow prev" onClick={handlePrev} aria-label="Previous slide">&#10094;</button>
          <button className="slider-arrow next" onClick={handleNext} aria-label="Next slide">&#10095;</button>

          {/* Dot Indicators (Now representing 5 total slides) */}
          <div className="slider-dots">
            {slides.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Product Quick-View Glassmorphic Drawer / Modal */}
      {quickViewProduct && (
        <div className="quickview-overlay" onClick={closeQuickView}>
          <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeQuickView} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="qv-content">
              <div className="qv-image-box">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} />
              </div>
              <div className="qv-info-box">
                <span className="brand-label">EXCLUSIVE HIGHLIGHTS</span>
                <h2>{quickViewProduct.name}</h2>
                <div className="qv-price">₹{quickViewProduct.price.toLocaleString('en-IN')}</div>
                <p className="qv-desc">{quickViewProduct.description}</p>
                <div className="qv-meta">
                  <div className="meta-item">
                    <span className="meta-label">Selected Size:</span>
                    <span className="meta-value">{quickViewProduct.size}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Availability:</span>
                    <span className="meta-value in-stock">In Stock</span>
                  </div>
                </div>
                <div className="qv-actions">
                  <button className="qv-add-cart-btn" onClick={handleAddToCart}>
                    ADD TO CART
                  </button>
                  <button className="qv-detail-btn" onClick={() => { closeQuickView(); navigate(`/product/${quickViewProduct._id}`); }}>
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HeroSection