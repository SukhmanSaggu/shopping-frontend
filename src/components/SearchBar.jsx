import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/Images/import-images'
import { useLocation } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const inputRef = useRef(null);

    useEffect( ()=>{
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location])

    const handleClearOrClose = () => {
        if (search) {
            setSearch('');
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } else {
            setShowSearch(false);
        }
    }
    
    return showSearch && visible ? (
        <div className='showSearch-section'>
            <div className="container">
                <div className="main-showSearch-section">
                    <div className="search-box">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder='Search for products...' 
                            value={search} 
                            onChange={(e)=> setSearch(e.target.value)} 
                            onKeyDown={(e) => { if(e.key === 'Enter') e.target.blur(); }}
                        />
                        <div className="search-icon-btn" onClick={() => inputRef.current && inputRef.current.focus()}>
                            <img src={assets.search_icon} alt="icon" />
                        </div>
                    </div>
                    <span onClick={handleClearOrClose} className={`close-icon ${search ? 'has-text' : ''}`} title={search ? 'Clear Search' : 'Close Search'}>
                        <img src={assets.cross_icon} alt="icon" />
                    </span>
                </div>
            </div>
        </div>
    ) : null
}

export default SearchBar