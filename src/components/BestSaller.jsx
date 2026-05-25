import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductsCard from './ProductsCard';
import SectionTitle from './SectionTitle';

const BestSaller = () => {
    const { products } = useContext(ShopContext);
    const [bestSaller, SetBestSaller] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            const filtered = products.filter((items) => items.bestseller);
            SetBestSaller(filtered.slice(0, 4));
        }
    }, [products]);

    return (
        <div className='best-saller'>
          <div className="container">
            <div className="text-center">
              <SectionTitle SectionTitle1={'Best'} SectionTitle2={'Seller'} />
            </div>
            <div className="bestsallerProducts-list">
              {bestSaller.map((items, index) => {
                return <ProductsCard key={index} id={items._id} Image={items.image} ProductName={items.name} Price={items.price} />
              })}
            </div>
          </div>
        </div>
    )
}

export default BestSaller