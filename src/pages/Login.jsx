import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const { token, setToken, backendUrl, navigate, getUserCart } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Client-side password validation for Sign Up
    if (currentState === 'Sign Up') {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    // Client-side password validation for Reset Password
    if (currentState === 'Reset Password') {
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast.error("New passwords do not match.");
        return;
      }
    }

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          getUserCart(response.data.token);
          toast.success("Successfully registered account!");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Login') {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          getUserCart(response.data.token);
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Forgot Password') {
        const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Reset Password');
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Reset Password') {
        const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
          email,
          code: verificationCode,
          newPassword
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Login');
          // Reset form fields
          setPassword('');
          setConfirmPassword('');
          setVerificationCode('');
          setNewPassword('');
          setConfirmNewPassword('');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Action failed:", error);
      const msg = error.response?.data?.message || "Action failed. Please try again.";
      toast.error(msg);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='login-form section-padding'>
      <div className="container">
        <div className="main-login-form">
          <h3>{currentState}</h3>

          <div className="login-inputs">
            {/* Sign Up: Name input */}
            {currentState === 'Sign Up' && (
              <div className="box">
                <input 
                  type="text" 
                  placeholder='Enter Your Name' 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
            )}

            {/* All states: Email input */}
            <div className="box">
              <input 
                type="email" 
                placeholder='Enter Your Mail' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={currentState === 'Reset Password'} 
              />
            </div>

            {/* Login & Sign Up: Password input */}
            {(currentState === 'Login' || currentState === 'Sign Up') && (
              <div className="box">
                <input 
                  type="password" 
                  placeholder='Password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            )}

            {/* Sign Up: Confirm Password input */}
            {currentState === 'Sign Up' && (
              <div className="box">
                <input 
                  type="password" 
                  placeholder='Confirm Password' 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
            )}

            {/* Reset Password: Verification and New Password inputs */}
            {currentState === 'Reset Password' && (
              <>
                <div className="box">
                  <input 
                    type="text" 
                    placeholder='6-Digit Verification Code' 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value)} 
                    required 
                  />
                </div>
                <div className="box">
                  <input 
                    type="password" 
                    placeholder='New Password' 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                  />
                </div>
                <div className="box">
                  <input 
                    type="password" 
                    placeholder='Confirm New Password' 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    required 
                  />
                </div>
              </>
            )}

            {/* Navigation options */}
            <div className="login-other">
              {currentState === 'Login' && (
                <>
                  <p onClick={() => setCurrentState('Forgot Password')}>Forgot Password?</p>
                  <p onClick={() => setCurrentState('Sign Up')}>Create an account</p>
                </>
              )}
              {currentState === 'Sign Up' && (
                <>
                  <span></span>
                  <p onClick={() => setCurrentState('Login')}>Login Here</p>
                </>
              )}
              {currentState === 'Forgot Password' && (
                <>
                  <span></span>
                  <p onClick={() => setCurrentState('Login')}>Back to Login</p>
                </>
              )}
              {currentState === 'Reset Password' && (
                <>
                  <p onClick={() => setCurrentState('Forgot Password')}>Resend Code</p>
                  <p onClick={() => setCurrentState('Login')}>Back to Login</p>
                </>
              )}
            </div>

            <button className='primary-btn'>
              {currentState === 'Login' && 'Sign In'}
              {currentState === 'Sign Up' && 'Sign Up'}
              {currentState === 'Forgot Password' && 'Send Code'}
              {currentState === 'Reset Password' && 'Reset Password'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Login