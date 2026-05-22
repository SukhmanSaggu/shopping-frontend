import React, { useContext, useEffect, useState } from 'react'
import SectionTitle from './SectionTitle';
import ProductsCard from './ProductsCard';
import { ShopContext } from '../context/ShopContext';

const RelatedProducts = ({category, subCategory}) => {

    const {products} = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {

        if (products.length > 0) {
            
            let productCopy = products.slice();

            productCopy = productCopy.filter((item) => category === item.category);
            productCopy = productCopy.filter((item) => subCategory === item.subCategory);

            setRelated(productCopy.slice(1,5));
            

        }
    }, [products])
    

  return (
    <div className='relatedProducts'>
        <SectionTitle SectionTitle1={'Related'} SectionTitle2={'Products'}/>

        <div className="main-relatedProduct">
            {
                related.map((items, index) => (
                    <ProductsCard key={index} id={items._id} Image={items.image} ProductName={items.name} Price={items.price} />
                ))
            }
        </div>
    </div>
  )
}

export default RelatedProducts