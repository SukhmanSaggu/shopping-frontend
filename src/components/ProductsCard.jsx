import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductsCard = ({id, Image, ProductName, Price}) => {

  const {currency} = useContext(ShopContext);

    return (
        <div className='product-card'>
            <Link to={`/product/${id}`}>
            
            <div className="img-box">
                {
                  
                    <img src={Image[0]} alt={ProductName} />
                }
            </div>
            <div className="content-box">
                <h4 className='product-title'>{ProductName}</h4>
                <span className='price'>{currency}{Price}</span>
            </div>
            </Link>
        </div>
    )
}

export default ProductsCard