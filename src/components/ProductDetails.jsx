import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/Images/import-images';
import RelatedProducts from './RelatedProducts';
import { ShopContext } from '../context/ShopContext';

const ProductDetails = () => {

  const { product_id } = useParams();
  const { products, currency,addToCart, cartItems } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState('')

  const [pimage, setImage] = useState()

  const fatchProductData = async () => {
    products.find((items) => {
      // console.log(items._id);

      if (items._id === product_id) {
        setProductData(items);
        setImage(items.image[0])
      }
    })
  }

  useEffect(() => {
    fatchProductData()
  }, [product_id])

  return productData ? (
    <div className='product-details section-padding'>
      <div className="container">
        <div className="main-product-details">
          <div className="img-box">
            <div className="multipal-img">
              {/* {console.log(productData)} */}
              {
                productData?.image.map((items, index) => (
                  <img onClick={() => setImage(items)} src={items} key={index} className={`${pimage === items ? 'border' : 'border-none'} cursor-pointer`} />
                ))
              }
            </div>
            <div className="single-img">
              <img src={pimage} alt="" />
            </div>
          </div>
          <div className="content-box">
            <h1>{productData.name}</h1>

            <div className="star-icon">
              <img src={assets.star_icon} alt="icon" />
              <img src={assets.star_icon} alt="icon" />
              <img src={assets.star_icon} alt="icon" />
              <img src={assets.star_icon} alt="icon" />
              <img src={assets.star_dull_icon} alt="icon" />
              <span>(222)</span>
            </div>

            <div className="product-price">
              {currency}{productData.price}
            </div>

            <p className='product-description'>{productData.description}</p>

            <div className="product-size">
              <h4>Select Size</h4>

              <div className="sizes">
                {
                  productData.sizes.map((item, index) => (
                    <button onClick={() => setSize(item)} className={`${item === size ? 'border' : ''}`} key={index}>{item}</button>
                  ))
                }
              </div>
            </div>

            <button onClick={()=>addToCart(productData._id, size)} className='cart-btn'>Add To Cart</button>
            <div className="product-feature">
              <p>100% Original Product.</p>
              <p>Cash on delivery is available on this product</p>
              <p>Easy return and exchange policy with in 7 days</p>
            </div>
          </div>
        </div>

        {/* despripiton & Review */}

        <div className="description-box">
          <div className="description-review">
            <button>Description</button>
            <button>Review (122)</button>
          </div>
          <div className="d-r-content-box">
            <div className="description-content-box">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus vitae laudantium numquam nulla similique debitis accusantium harum, voluptatum blanditiis iure?</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure iste et ut dolore cumque dolorem, debitis, aliquid facilis fugit alias necessitatibus! Est vitae nisi, commodi ducimus unde officiis, inventore quod nam odio iure voluptatem, autem facere quasi velit. Corporis atque blanditiis beatae ipsam rem perferendis eos quis neque tempora cum?</p>
            </div>
          </div>
        </div>


        {/* Related */}

                <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>

      </div>
    </div>
  ) : <div className='opacity-0'></div>
}

export default ProductDetails