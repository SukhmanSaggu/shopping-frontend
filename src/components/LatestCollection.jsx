import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import ProductsCard from './ProductsCard';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, SetLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      SetLatestProducts(products.slice(0, 8));
    }
  }, [products]);

  return (
    <div className='latest-section section-padding'>
      <div className="container">
        <div className="text-center">
          <SectionTitle SectionTitle1={'Latest'} SectionTitle2={'Collection'} />
        </div>

        <div className="latestProducts-list">
          {latestProducts?.map((items, index) => {
            return <ProductsCard key={index} id={items._id} Image={items.image} ProductName={items.name} Price={items.price} />
          })}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/collection" 
            className="primary-btn" 
            style={{ borderRadius: '4px', padding: '14px 45px', textDecoration: 'none' }}
          >
            Show More
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LatestCollection