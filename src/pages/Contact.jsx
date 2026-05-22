import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/Images/import-images';
import SectionTitle from '../components/SectionTitle';

const Contact = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! Welcome to SAGGU Support. How can we help you today?',
      options: [
        'Order Status Inquiry',
        'Returns & Exchanges',
        'Product Customization',
        'Talk to support manager'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOptionClick = (option) => {
    // Add user message
    const newMessages = [...messages, { sender: 'user', text: option }];
    setMessages(newMessages);
    setIsTyping(true);

    // Dynamic Bot response based on selection
    setTimeout(() => {
      setIsTyping(false);
      let botResponse = {};

      if (option === 'Order Status Inquiry') {
        botResponse = {
          sender: 'bot',
          text: 'I would be happy to help with that! Could you please select if you have your 6-digit Order ID ready?',
          options: ['Yes, I have it', "No, I don't have it"]
        };
      } else if (option === 'Yes, I have it' || option === "No, I don't have it") {
        botResponse = {
          sender: 'bot',
          text: 'Understood. To safeguard your account privacy and check your order history instantly, let me connect you directly with our Customer Support Head. You can call or message us directly at +91 842745342!'
        };
      } else if (option === 'Returns & Exchanges') {
        botResponse = {
          sender: 'bot',
          text: 'We offer a fully seamless 7-day exchange and return policy. Did you purchase the item within the last 7 days?',
          options: ['Yes, within 7 days', 'No, it has been longer']
        };
      } else if (option === 'Yes, within 7 days' || option === 'No, it has been longer') {
        botResponse = {
          sender: 'bot',
          text: 'Thank you for confirming! To initiate your instant return or exchange pickup, please contact our logistics head directly on +91 842745342 or email your order receipt to sukhmansaggu4030@gmail.com.'
        };
      } else if (option === 'Product Customization') {
        botResponse = {
          sender: 'bot',
          text: 'We love designing custom garments and tailored options for our clients! What details would you like to customize?',
          options: ['Tailoring & Sizing', 'Custom Fabric/Embroidery']
        };
      } else if (option === 'Tailoring & Sizing' || option === 'Custom Fabric/Embroidery') {
        botResponse = {
          sender: 'bot',
          text: "Exciting choice! Our in-house designers are ready to bring your ideas to life. Please call us directly at +91 842745342 to align on sizing, fabrics, and design sketches."
        };
      } else if (option === 'Talk to support manager') {
        botResponse = {
          sender: 'bot',
          text: 'Connecting you to our head representative at our Batala office...'
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: "Connected! You can reach our head manager, Sukhman Saggu, directly at +91 842745342 for swift, personalized assistance. We are online and happy to help!"
            }
          ]);
        }, 1200);
        return;
      }

      if (botResponse.text) {
        setMessages((prev) => [...prev, botResponse]);
      }
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thank you for your query! To get an immediate answer from our head support team, please reach out to us directly at +91 842745342. We are online and ready to assist you!'
        }
      ]);
    }, 1000);
  };

  return (
    <main className="contact-page-section section-padding">
      <div className="container">
        <SectionTitle SectionTitle1={'Contact'} SectionTitle2={'Us'} />

        <div className="contact-grid">
          {/* Left Column: Office Details */}
          <div className="contact-details-panel">
            <div className="contact-img-box">
              <img src={assets.contact_img} alt="Elegant retail store design" />
            </div>
            <div className="contact-info-cards">
              <h3>Get In Touch</h3>
              
              <div className="info-card">
                <div className="card-icon">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="card-content">
                  <h4>Our Location</h4>
                  <p>Kahnuwan Road, Batala, Punjab, India</p>
                </div>
              </div>

              <div className="info-card">
                <div className="card-icon">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="card-content">
                  <h4>Phone Support</h4>
                  <p><a href="tel:842745342">+91 842745342</a></p>
                </div>
              </div>

              <div className="info-card">
                <div className="card-icon">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="card-content">
                  <h4>Email Support</h4>
                  <p><a href="mailto:sukhmansaggu4030@gmail.com">sukhmansaggu4030@gmail.com</a></p>
                </div>
              </div>

              <div className="info-card">
                <div className="card-icon">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="card-content">
                  <h4>Office Hours</h4>
                  <p>Mon - Sat: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fake Interactive Chat Box */}
          <div className="support-chat-panel">
            <div className="chat-box-container">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="agent-avatar">
                  S
                </div>
                <div className="agent-status-info">
                  <h4>SAGGU Live Assistant</h4>
                  <p><span className="status-dot"></span> Active Support Manager</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="chat-messages-body">
                {messages.map((msg, index) => (
                  <div key={index} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                    {msg.sender === 'bot' && (
                      <div className="message-avatar">S</div>
                    )}
                    <div className="message-bubble-wrapper">
                      <div className="message-bubble">
                        <p>{msg.text}</p>
                      </div>
                      
                      {/* Render quick options if available */}
                      {msg.options && msg.options.length > 0 && (
                        <div className="quick-options-list">
                          {msg.options.map((opt, optIdx) => (
                            <button 
                              key={optIdx} 
                              onClick={() => handleOptionClick(opt)}
                              className="option-chip"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pulsing Typing Indicator */}
                {isTyping && (
                  <div className="message-row bot-row">
                    <div className="message-avatar">S</div>
                    <div className="message-bubble typing-bubble">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your message here..."
                  disabled={isTyping}
                />
                <button type="submit" className="chat-send-btn" disabled={isTyping}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;