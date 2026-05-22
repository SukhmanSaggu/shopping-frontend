import React, { useContext, useEffect, useState, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'
import SectionTitle from '../components/SectionTitle';
import axios from 'axios';
import { toast } from 'react-toastify';

// Self-contained coordinate resolver dictionary
const CITY_COORDINATES = {
  mumbai: [19.0760, 72.8777],
  delhi: [28.7041, 77.1025],
  "new delhi": [28.6139, 77.2090],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  hyderabad: [17.3850, 78.4867],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  lucknow: [26.8467, 80.9462],
  surat: [21.1702, 72.8311],
  indore: [22.7196, 75.8577],
  patna: [25.5941, 85.1376],
  bhopal: [23.2599, 77.4126],
  ludhiana: [30.9010, 75.8573],
  agra: [27.1767, 78.0081],
  vadodara: [22.3072, 73.1812],
  coimbatore: [11.0168, 76.9558],
  kochi: [9.9312, 76.2673],
  chandigarh: [30.7333, 76.7794],
  amritsar: [31.6340, 74.8723],
  guwahati: [26.1445, 91.7362],
  dehradun: [30.3165, 78.0322],
  shimla: [31.1048, 77.1734],
  srinagar: [34.0837, 74.7973],
  panaji: [15.4909, 73.8278],
  goa: [15.2993, 74.1240],
  london: [51.5074, -0.1278],
  "new york": [40.7128, -74.0060],
  tokyo: [35.6762, 139.6503],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093],
  dubai: [25.2048, 55.2708]
};

const getCoordinates = (cityStr = "", countryStr = "") => {
  const cleanCity = cityStr.trim().toLowerCase();
  if (CITY_COORDINATES[cleanCity]) {
    return CITY_COORDINATES[cleanCity];
  }
  
  // Deterministic fallback generator near Central India to ensure consistent paths
  let hash = 0;
  for (let i = 0; i < cleanCity.length; i++) {
    hash = cleanCity.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const lat = 20.5937 + (hash % 100) / 25; // 16.5 to 24.5
  const lng = 78.9629 + ((hash >> 8) % 100) / 20; // 73.9 to 83.9
  return [lat, lng];
};

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  
  // Cancellation form states
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancellationSelect, setCancellationSelect] = useState("Changed my mind / Ordered by mistake");
  const [customReason, setCustomReason] = useState("");

  const mapRef = useRef(null);

  // Auto-verify PayPal checkout redirects
  useEffect(() => {
    const success = searchParams.get('success');
    const paymentMethod = searchParams.get('paymentMethod');
    const orderId = searchParams.get('orderId');

    if (success === 'true' && orderId) {
      if (paymentMethod === 'paypal' && token) {
        const verifyPayment = async () => {
          try {
            const response = await axios.post(`${backendUrl}/api/order/verify-paypal`, { orderId }, { headers: { token } });
            if (response.data.success) {
              toast.success("PayPal Payment Verified Successfully!");
              window.history.replaceState({}, document.title, window.location.pathname);
              setSearchParams(new URLSearchParams());
              loadOrderData();
            } else {
              toast.error(response.data.message || "Failed to verify PayPal payment.");
            }
          } catch (error) {
            console.error("PayPal verification error:", error);
            toast.error("PayPal payment verification failed.");
          }
        };
        verifyPayment();
      } else {
        // Stripe/Razorpay simulation success
        toast.success(`${paymentMethod ? paymentMethod.toUpperCase() : 'Stripe/Razorpay'} simulation payment completed!`);
        window.history.replaceState({}, document.title, window.location.pathname);
        setSearchParams(new URLSearchParams());
        loadOrderData();
      }
    }
  }, [searchParams, token]);

  // Dynamic injection of Leaflet CDN
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Map route plotting and rendering
  useEffect(() => {
    if (!trackingOrder || !mapLoaded) return;

    const timer = setTimeout(() => {
      const container = document.getElementById("tracking-map");
      if (!container) return;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const origin = [19.0760, 72.8777]; // Mumbai Hub
      const destination = getCoordinates(trackingOrder.address?.city, trackingOrder.address?.country);
      
      const status = trackingOrder.status || 'Order Placed';
      let progress = 0.1;
      if (status === 'Order Placed') progress = 0.1;
      else if (status === 'Shipped') progress = 0.45;
      else if (status === 'Out for Delivery') progress = 0.75;
      else if (status === 'Delivered') progress = 1.0;

      const currentLat = origin[0] + (destination[0] - origin[0]) * progress;
      const currentLng = origin[1] + (destination[1] - origin[1]) * progress;
      const truckLocation = [currentLat, currentLng];

      const map = window.L.map("tracking-map").setView(origin, 5);
      mapRef.current = map;

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18
      }).addTo(map);

      const createCustomIcon = (color, svgHtml) => {
        return window.L.divIcon({
          html: `<div style="background-color: ${color}; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; color: white; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">${svgHtml}</div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
      };

      const warehouseIcon = createCustomIcon('#4F46E5', `<svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`);
      const destinationIcon = createCustomIcon('#EF4444', `<svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`);
      const truckIcon = createCustomIcon('#F59E0B', `<svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>`);

      window.L.marker(origin, { icon: warehouseIcon }).addTo(map)
        .bindPopup(`<b>Mumbai Hub</b><br>Origin Warehouse`)
        .openPopup();

      window.L.marker(destination, { icon: destinationIcon }).addTo(map)
        .bindPopup(`<b>Delivery Address</b><br>${trackingOrder.address?.city || 'Destination'}`);

      if (progress > 0 && progress < 1) {
        window.L.marker(truckLocation, { icon: truckIcon }).addTo(map)
          .bindPopup(`<b>Shipment Status: ${status}</b><br>${Math.round(progress * 100)}% on the way`)
          .openPopup();
      }

      const routePoints = [origin, destination];
      window.L.polyline(routePoints, {
        color: '#6366F1',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 10',
        lineCap: 'round'
      }).addTo(map);

      const bounds = window.L.latLngBounds(routePoints);
      map.fitBounds(bounds, { padding: [50, 50] });

    }, 200);

    return () => clearTimeout(timer);
  }, [trackingOrder, mapLoaded]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        setOrderData([]);
        return;
      }
      
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            // Append parent order status, payment status, address, order id, date and cancellation reason to each item
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['address'] = order.address;
            item['orderId'] = order._id;
            item['cancellationReason'] = order.cancellationReason;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to fetch orders from backend");
    }
  };

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;
    
    let reason = cancellationSelect;
    if (cancellationSelect === "Other (please specify below)") {
      if (!customReason.trim()) {
        toast.error("Please specify your reason for cancellation.");
        return;
      }
      reason = customReason;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/order/cancel`, { 
        orderId: cancellingOrder.orderId, 
        reason 
      }, { headers: { token } });

      if (response.data.success) {
        toast.success("Order cancelled successfully!");
        setCancellingOrder(null);
        setCustomReason("");
        loadOrderData();
      } else {
        toast.error(response.data.message || "Failed to cancel order.");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='my-orders section-padding'>
      <div className="container">
        <SectionTitle SectionTitle1={'My'} SectionTitle2={'Orders'} />
        <div className="main-my-order">
          {
            orderData.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              orderData.map((item, index) => (
                <div className="items" key={index}>
                  <div className="product-details">
                    <img src={item.image[0]} alt="img" />
                    <div className="details">
                      <p><b>{item.name}</b></p>
                      <p className='flex gap-5'>
                        <span><b>{currency}{item.price}</b></span>
                        <span>Quantity: {item.quantity}</span>
                        <span>Size: {item.size}</span>
                      </p>
                      <p><b>Date: </b> {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p><b>Payment: </b> <span className="text-xs uppercase px-2 py-0.5 rounded bg-gray-100">{item.paymentMethod} ({item.payment ? "Paid" : "Pending"})</span></p>
                      {item.status === 'Cancelled' && (
                        <p className="text-xs text-red-600 mt-2 font-semibold bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 inline-block">
                          <b>Cancellation Reason: </b> {item.cancellationReason || "No reason specified"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1.5">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : item.status === 'Shipped' ? 'bg-blue-500' : item.status === 'Out for Delivery' ? 'bg-orange-500' : item.status === 'Cancelled' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                      <b>{item.status}</b>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                    {item.status !== 'Cancelled' && (
                      <button onClick={() => setTrackingOrder(item)} className='border py-2 px-3 hover:bg-gray-50 transition-colors font-medium rounded-lg text-sm shadow-sm'>
                        Track Order
                      </button>
                    )}
                    {item.status !== 'Cancelled' && item.status !== 'Delivered' && item.status !== 'Shipped' && item.status !== 'Out for Delivery' && (
                      <button onClick={() => setCancellingOrder(item)} className='border border-red-200 text-red-600 py-2 px-3 hover:bg-red-50 transition-colors font-medium rounded-lg text-sm shadow-sm'>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>

      {/* Dynamic cancellation reason modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full border border-gray-100 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  Cancel Order
                </span>
                <h3 className="text-xl font-bold mt-2 text-zinc-800">Confirm Cancellation</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Order ID: #{cancellingOrder.orderId ? cancellingOrder.orderId.slice(-8) : "N/A"}
                </p>
              </div>
              <button 
                onClick={() => {
                  setCancellingOrder(null);
                  setCustomReason("");
                }} 
                className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-full border border-gray-100 shadow-sm transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Warning Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex gap-2.5 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>This action is permanent and cannot be undone. Any paid amount will be refunded to your original payment method.</p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Reason for Cancellation
                </label>
                <select 
                  value={cancellationSelect}
                  onChange={(e) => setCancellationSelect(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Changed my mind / Ordered by mistake">Changed my mind / Ordered by mistake</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Delivery time is too long">Delivery time is too long</option>
                  <option value="Incorrect shipping address details">Incorrect shipping address details</option>
                  <option value="Other (please specify below)">Other (please specify below)</option>
                </select>
              </div>

              {cancellationSelect === "Other (please specify below)" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Please Specify
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Tell us why you would like to cancel this order..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  ></textarea>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setCancellingOrder(null);
                    setCustomReason("");
                  }}
                  className="flex-1 border py-3 px-4 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-red-200"
                >
                  Cancel Order
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic interactive Leaflet Map Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full flex flex-col md:flex-row h-[90vh] md:h-[75vh] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Side Control Drawer */}
            <div className="w-full md:w-[350px] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      Shipment Tracker
                    </span>
                    <h3 className="text-xl font-bold mt-2 text-zinc-800">Live Delivery Map</h3>
                    <p className="text-xs text-gray-500 mt-1">ID: #{trackingOrder.orderId ? trackingOrder.orderId.slice(-8) : "N/A"}</p>
                  </div>
                  <button 
                    onClick={() => setTrackingOrder(null)} 
                    className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-1.5 rounded-full border border-gray-100 shadow-sm transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Product Details Mini Card */}
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs flex items-center gap-3 mb-6">
                  <img src={trackingOrder.image[0]} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{trackingOrder.name}</p>
                    <p className="text-[11px] text-gray-500">Size: {trackingOrder.size} | Qty: {trackingOrder.quantity}</p>
                  </div>
                </div>

                {/* Delivery Address Details */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Delivery Address</h4>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p className="font-bold text-gray-700">{trackingOrder.address?.firstName} {trackingOrder.address?.lastName}</p>
                    <p>{trackingOrder.address?.street}</p>
                    <p>{trackingOrder.address?.city}, {trackingOrder.address?.state} - {trackingOrder.address?.zipcode}</p>
                    <p className="font-semibold text-gray-500">{trackingOrder.address?.country}</p>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Shipping Status</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Order Placed', desc: 'Seller accepted and packaged order', active: true },
                      { label: 'Shipped', desc: 'In transit from Mumbai Hub', active: trackingOrder.status === 'Shipped' || trackingOrder.status === 'Out for Delivery' || trackingOrder.status === 'Delivered' },
                      { label: 'Out for Delivery', desc: 'Nearest local facility dispatch', active: trackingOrder.status === 'Out for Delivery' || trackingOrder.status === 'Delivered' },
                      { label: 'Delivered', desc: 'Securely delivered to address', active: trackingOrder.status === 'Delivered' }
                    ].map((step, idx, arr) => {
                      const isCompleted = step.active;
                      const isLast = idx === arr.length - 1;
                      return (
                        <div key={idx} className="flex gap-3 relative">
                          {!isLast && (
                            <span className={`absolute left-2.5 top-5 w-[1px] h-6 bg-gray-200 ${isCompleted && arr[idx+1].active ? 'bg-indigo-500' : ''}`} />
                          )}
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white text-[9px] font-bold ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                            {isCompleted && "✓"}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer info */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <p className="text-gray-400">Carrier Partner</p>
                  <p className="font-bold text-gray-700">Delhivery Express</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Est. Arrival</p>
                  <p className="font-bold text-green-600">3-5 Business Days</p>
                </div>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 relative bg-gray-100 min-h-[300px] md:min-h-0">
              {!mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-sm font-medium">Initializing Map Engine...</p>
                </div>
              )}
              <div id="tracking-map" className="w-full h-full text-zinc-800"></div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Orders;