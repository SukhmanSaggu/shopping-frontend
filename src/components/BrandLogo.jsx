import React from 'react'

const BrandLogo = ({ className = '', size = 42, variant = 'header', showText = true }) => {
  return (
    <div className={`brand-logo-container ${variant} ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="brand-emblem-svg"
      >
        {/* Shirorekha (Top horizontal Devanagari line) */}
        <rect x="35" y="14" width="50" height="7" rx="1" fill="currentColor" />
        
        {/* Left vertical pillar (first pillar of "M") */}
        <rect x="15" y="46" width="8" height="40" rx="1" fill="currentColor" />
        
        {/* The Connecting Bridge (horizontal link for 'स') */}
        <rect x="23" y="60" width="52" height="6" fill="currentColor" />

        {/* Right vertical pillar (Devanagari main stem & right pillar of "M") */}
        <rect x="75" y="14" width="10" height="72" rx="1.5" fill="currentColor" />
        
        {/* The Loop: Fuses Devanagari 'स' (Sa) and French 'M' (Maison) */}
        <path 
          d="M 52,22 
             C 42,22 28,28 28,43 
             C 28,53 38,58 48,48 
             C 54,42 62,32 75,32" 
          stroke="currentColor" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
        />

        {/* Diagonal sweeping foot of 'स' */}
        <path 
          d="M 33,63 
             L 50,86" 
          stroke="currentColor" 
          strokeWidth="7" 
          strokeLinecap="round" 
          fill="none"
        />
      </svg>
      {showText && (
        <div className="brand-text-box">
          <span className="brand-main-title">
            SAGGU
          </span>
          <span className="brand-subtitle">
            Maison de la Vega
          </span>
        </div>
      )}
    </div>
  )
}

export default BrandLogo
