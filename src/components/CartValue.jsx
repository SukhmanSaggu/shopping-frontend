import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartValue = () => {
    const {currency,deliveryFee,getCartAmount} = useContext(ShopContext);

    const subtotal = getCartAmount();
    const shippingFee = subtotal === 0 ? 0 : (subtotal >= 500 ? 0 : deliveryFee);
    const total = subtotal === 0 ? 0 : subtotal + shippingFee;

  return (
    <div className='cart-total'>
      <h4>Cart Total</h4>
      <p><b>Subtotal</b> <span>{currency}{subtotal}.00</span></p>
      <p><b>Shipping Fee</b> <span>{currency}{shippingFee}.00 </span></p>
      <p><b>Total</b> <b>{currency}{total}.00</b></p>
    </div>
  )
}

export default CartValue