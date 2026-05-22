import React from 'react'

const NewsLatter = () => {

  const submitHandler = (e) => {
    e.preventDafault();
  }
  return (
    <div className='newlatter'>
         <div className="container">
            <div className="main-newlatter text-center">
                <h4>Subscribe now & get 20% off</h4>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>

                <div className="subscribe-box"> 
                    <form onSubmit={submitHandler}>
                        <input type="email" placeholder='Enter Your Email' />
                        <input type="submit" value="Subscribe" />
                    </form>
                </div>
            </div>
         </div>
    </div>
  )
}

export default NewsLatter