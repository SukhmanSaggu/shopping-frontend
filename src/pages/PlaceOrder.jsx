import React, { useContext, useState } from 'react'
import SectionTitle from '../components/SectionTitle'
import CartValue from '../components/CartValue'
import { assets } from '../assets/Images/import-images'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, deliveryFee, products } = useContext(ShopContext);

  const [method, setMethod] = useState('cod');
  
  // Shipping form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!token) {
      toast.warning("Please sign in to place an order.");
      navigate("/login");
      return;
    }

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      const subtotal = getCartAmount();
      const shippingFee = subtotal >= 500 ? 0 : deliveryFee;
      const totalAmount = subtotal + shippingFee;

      const orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount
      };

      switch (method) {
        // Cash on Delivery
        case 'cod': {
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
          if (response.data.success) {
            setCartItems({});
            toast.success("Order Placed Successfully!");
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        // Stripe Payment Link (Real or Simulated)
        case 'stripe': {
          const response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
          if (response.data.success) {
            const { session_url } = response.data;
            window.location.replace(session_url);
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        // Razorpay Payment Link (Real or Simulated)
        case 'razorpay': {
          const response = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });
          if (response.data.success) {
            const { success_url } = response.data;
            window.location.replace(success_url);
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        // PayPal Payment Link (Sandbox)
        case 'paypal': {
          const response = await axios.post(`${backendUrl}/api/order/paypal`, orderData, { headers: { token } });
          if (response.data.success) {
            const { approve_url } = response.data;
            window.location.replace(approve_url);
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        default:
          break;
      }

    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error(error.response?.data?.message || "Something went wrong while placing order.");
    }
  };

  return (
    <div className='order-place section-padding'>
      <div className="container">
        <SectionTitle SectionTitle1={'Delivery'} SectionTitle2={'Information'} />

        <div className="main-order-place">
          <div className="form-box">
            <form onSubmit={onSubmitHandler} id="order-form">
              <div className="group-box">
                <div className="box">
                  <input required name="firstName" onChange={onChangeHandler} value={formData.firstName} type="text" placeholder='First Name' />
                </div>
                <div className="box">
                  <input required name="lastName" onChange={onChangeHandler} value={formData.lastName} type="text" placeholder='Last Name' />
                </div>
              </div>
              <div className="box">
                <input required name="phone" onChange={onChangeHandler} value={formData.phone} type="tel" placeholder='Enter Your Phone No.' />
              </div>
              <div className="box">
                <input required name="email" onChange={onChangeHandler} value={formData.email} type="email" placeholder='Enter Your email' />
              </div>
              <div className="box">
                <input required name="street" onChange={onChangeHandler} value={formData.street} type="text" placeholder='Street' />
              </div>

              <div className="group-box">
                <div className="box">
                  <input required name="city" onChange={onChangeHandler} value={formData.city} type="text" placeholder='City' />
                </div>
                <div className="box">
                  <input required name="state" onChange={onChangeHandler} value={formData.state} type="text" placeholder='State' />
                </div>
              </div>

              <div className="group-box">
                <div className="box">
                  <input required name="zipcode" onChange={onChangeHandler} value={formData.zipcode} type="number" placeholder='Zip Code' />
                </div>
                <div className="box">
                  <input required name="country" onChange={onChangeHandler} value={formData.country} type="text" placeholder='Country' />
                </div>
              </div>

            </form>
          </div>
          <div className="payment-details">
            <CartValue />

            <div className="payment-method">
              <h4>Payment Method</h4>

              <div className="multi-payments">
                <div onClick={() => setMethod('stripe')} className={`box cursor-pointer border p-2 flex items-center gap-2 ${method === 'stripe' ? 'border-green-500' : ''}`}>
                  <label className="flex items-center gap-2 cursor-pointer w-full">
                    <input type="radio" checked={method === 'stripe'} onChange={() => setMethod('stripe')} name='payment' />
                    <img src={assets.stripe_logo} alt="" style={{ height: '20px' }} />
                  </label>
                </div>
                <div onClick={() => setMethod('razorpay')} className={`box cursor-pointer border p-2 flex items-center gap-2 ${method === 'razorpay' ? 'border-green-500' : ''}`}>
                  <label className="flex items-center gap-2 cursor-pointer w-full">
                    <input type="radio" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} name='payment' />
                    <img src={assets.razorpay_logo} alt="" style={{ height: '20px' }} />
                  </label>
                </div>
                <div onClick={() => setMethod('paypal')} className={`box cursor-pointer border p-2 flex items-center gap-2 ${method === 'paypal' ? 'border-green-500' : ''}`}>
                  <label className="flex items-center gap-2 cursor-pointer w-full text-sm font-medium">
                    <input type="radio" checked={method === 'paypal'} onChange={() => setMethod('paypal')} name='payment' />
                    <span className="flex items-center gap-1 font-bold">
                      <span className="text-[#003087]">Pay</span><span className="text-[#0079C1]">Pal</span>
                      <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-200 ml-1">Sandbox</span>
                    </span>
                  </label>
                </div>
                <div onClick={() => setMethod('cod')} className={`box cursor-pointer border p-2 flex items-center gap-2 ${method === 'cod' ? 'border-green-500' : ''}`}>
                  <label className="flex items-center gap-2 cursor-pointer w-full text-sm font-medium">
                    <input type="radio" checked={method === 'cod'} onChange={() => setMethod('cod')} name='payment' />
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" form="order-form" className='primary-btn'>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder