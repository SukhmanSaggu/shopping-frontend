import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import SectionTitle from '../components/SectionTitle';
import { assets } from '../assets/Images/import-images';
import CartValue from '../components/CartValue';

const Cart = () => {

  const {products, currency, cartItems, updateCart, navigate} = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(()=>{

    const tempData = [];
    for(const items in cartItems){
      for(const item in cartItems[items]){
        if(cartItems[items][item] > 0){
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          })
        }
      }
    }
    setCartData(tempData);
    
  },[cartItems])

  return (
    <div className='cart-page section-padding'>
      <div className="container">
        <SectionTitle SectionTitle1={'Our'} SectionTitle2={'Cart'}/>
        <div className="main-cart-page">
            {
              // console.log('hi..',cartData)
              
              cartData?.map((item,index) => {
                const productData = products?.find((product) => product._id === item._id);

                if (!productData || !productData.image || productData.image.length === 0) {
                  return null;
                }

                return (
                  <div className='items' key={index}>
                    <div className='flex gap-4'>
                    <div className="item-img">
                      <img src={productData.image[0]} alt="img" />
                    </div>
                    <div className="item-name">
                      <h4>{productData.name}</h4>
                      <div className="flex gap-2 items-center">
                        <p>{currency}{productData.price}</p>
                        <p className='product-size'>{item.size}</p>
                      </div>
                    </div>
                    </div>
             

                    <div className="quntity">
                      <input onChange={(e) => e.target.value === '' || e.target.value === 0 ? null : updateCart(item._id,item.size, Number(e.target.value))} type="number" min={1} defaultValue={item.quantity} />
                    </div>

                    <div className="delete-icon">
                      <img onClick={()=> updateCart(item._id, item.size, 0)} src={assets.bin_icon} alt="icon" />
                    </div>
                  </div>
                )
              })
            }
        </div>

        <div className="cart-value">
          <CartValue/>
          <button className='primary-btn' onClick={() => navigate('/place-order')}>

Proceed to checkout
</button>
        </div>
      </div>
    </div>
  )
}

export default Cart