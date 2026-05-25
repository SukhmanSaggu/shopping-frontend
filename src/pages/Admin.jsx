import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  BsGrid, BsPlusCircle, BsBagCheck, BsXCircle, 
  BsBoxArrowRight, BsCloudUpload, BsX, BsCashCoin, 
  BsCartFill, BsCheckCircleFill, BsSearch, BsArrowRightShort, BsEye
} from 'react-icons/bs';

const Admin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [token, setToken] = useState(localStorage.getItem('adminToken') || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Panel Tabs
  const [activeTab, setActiveTab] = useState("dashboard");

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Analytics Month/Year State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Add Product Form State
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("Men");
  const [productSubCategory, setProductSubCategory] = useState("Topwear");
  const [productSizes, setProductSizes] = useState([]);
  const [productBestseller, setProductBestseller] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // File Upload states & previews
  const [images, setImages] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);

  // Size list options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  // Subcategory options mapped to categories
  const subCategoryMap = {
    "Men": ["Topwear", "Bottomwear", "Winterwear"],
    "Women": ["Topwear", "Bottomwear", "Winterwear"],
    "Kids": ["Topwear", "Bottomwear", "Winterwear"],
    "Accessories": ["Watches", "Shoes", "Earrings"]
  };

  // Adjust subcategory automatically when category changes
  useEffect(() => {
    if (subCategoryMap[productCategory]) {
      setProductSubCategory(subCategoryMap[productCategory][0]);
    }
  }, [productCategory]);

  // Load orders from backend
  const fetchAllOrders = async (adminToken) => {
    if (!adminToken) return;
    setOrdersLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, {
        headers: { token: adminToken }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch admin orders error:", error);
      toast.error("Error connecting to server. Please check if backend is running.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllOrders(token);
    }
  }, [token]);

  // Handle Admin Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });
      if (response.data.success) {
        const receivedToken = response.data.token;
        setToken(receivedToken);
        localStorage.setItem('adminToken', receivedToken);
        toast.success("Successfully logged in as Administrator");
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken("");
    setActiveTab("dashboard");
    toast.success("Successfully logged out from Administrator session");
  };

  // Size toggler
  const toggleSize = (size) => {
    setProductSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Image file handler
  const handleImageChange = (index, file) => {
    if (!file) return;
    
    // Check if file is image
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(updatedPreviews);
  };

  // Remove selected image slot
  const removeImageSlot = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    updatedPreviews[index] = null;
    setImagePreviews(updatedPreviews);
  };

  // Handle Add Product submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName || !productDesc || !productPrice) {
      toast.error("Product name, description, and price are required");
      return;
    }

    const validImages = images.filter(img => img !== null);
    if (validImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', productDesc);
      formData.append('price', productPrice);
      formData.append('category', productCategory);
      formData.append('subCategory', productSubCategory);
      formData.append('sizes', JSON.stringify(productSizes));
      formData.append('bestseller', String(productBestseller));

      // Append image files
      images.forEach((img, idx) => {
        if (img) {
          formData.append(`image${idx + 1}`, img);
        }
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { 
          token,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Product added successfully!");
        
        // Reset states
        setProductName("");
        setProductDesc("");
        setProductPrice("");
        setProductSizes([]);
        setProductBestseller(false);
        setImages([null, null, null, null]);
        
        // Revoke previews to save memory
        imagePreviews.forEach(preview => {
          if (preview) URL.revokeObjectURL(preview);
        });
        setImagePreviews([null, null, null, null]);
      } else {
        toast.error(response.data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product submit error:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setFormLoading(false);
    }
  };

  // Update order status on backend
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, {
        orderId,
        status: newStatus
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Locally update status
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update order status");
    }
  };

  // Helper date parsing
  const getMonthName = (monthIdx) => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIdx];
  };

  // Analytics calculations
  const filteredAnalyticsOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear;
  });

  const activeAnalyticsOrders = filteredAnalyticsOrders.filter(order => order.status !== "Cancelled");
  const cancelledAnalyticsOrders = filteredAnalyticsOrders.filter(order => order.status === "Cancelled");

  // Sum total sales of successful orders in the selected month
  const monthlyTotalRevenue = activeAnalyticsOrders.reduce((sum, order) => sum + order.amount, 0);
  const averageTicketSize = activeAnalyticsOrders.length > 0 
    ? Math.round(monthlyTotalRevenue / activeAnalyticsOrders.length) 
    : 0;

  const cancellationRate = filteredAnalyticsOrders.length > 0
    ? ((cancelledAnalyticsOrders.length / filteredAnalyticsOrders.length) * 100).toFixed(1)
    : "0.0";

  // Filter orders lists for Orders Tab based on Search and Status Filter
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    // Address search and items search
    const cleanQuery = searchQuery.toLowerCase().trim();
    if (!cleanQuery) return matchesStatus;

    const matchesId = order._id.toLowerCase().includes(cleanQuery);
    const matchesName = `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.toLowerCase().includes(cleanQuery);
    const matchesEmail = (order.address?.email || '').toLowerCase().includes(cleanQuery);
    const matchesCity = (order.address?.city || '').toLowerCase().includes(cleanQuery);
    const matchesProduct = order.items.some(item => item.name.toLowerCase().includes(cleanQuery));

    return matchesStatus && (matchesId || matchesName || matchesEmail || matchesCity || matchesProduct);
  });

  // Pagination details
  const ordersPerPage = 16;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Cancelled Orders specifically
  const cancelledOrdersList = orders.filter(order => order.status === "Cancelled");

  // Generate Year range for analytics
  const yearsRange = [];
  const currentYr = new Date().getFullYear();
  for (let y = currentYr - 3; y <= currentYr + 1; y++) {
    yearsRange.push(y);
  }

  // Render Login page if not authenticated
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 font-sans select-none">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
          
          {/* Accent Gradients */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-200/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
              SAGGU<span className="text-indigo-600 font-black font-serif">.</span> ADMIN
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Administrative Control Workspace
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5 relative">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saggu.com"
                className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Security Password
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-800"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-850 text-white py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Authorize Session
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Admin Workspace once authenticated
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* LEFT SIDEBAR PANEL */}
      <aside className="w-full md:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between p-6">
        <div>
          {/* Brand Header */}
          <div className="mb-8 pb-6 border-b border-slate-800">
            <h2 className="text-xl font-black tracking-wider flex items-center gap-2">
              SAGGU<span className="text-indigo-400 font-serif">.</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded-full tracking-normal">
                ADMIN
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium truncate">
              Signed in: Admin Active Session
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: "dashboard", label: "Dashboard", icon: <BsGrid className="w-4.5 h-4.5" /> },
              { id: "addProduct", label: "Add Product", icon: <BsPlusCircle className="w-4.5 h-4.5" /> },
              { id: "orders", label: "Order Manager", icon: <BsBagCheck className="w-4.5 h-4.5" /> },
              { id: "cancellations", label: "Cancellations", icon: <BsXCircle className="w-4.5 h-4.5" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer buttons */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <button
            onClick={() => window.open('/', '_blank')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors cursor-pointer"
          >
            Visit Live Store
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
          >
            <BsBoxArrowRight className="w-3.5 h-3.5" />
            Logout Workspace
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        
        {/* TAB HEADER TITLE */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 capitalize font-sans">
              {activeTab === "addProduct" ? "Add New Item" : activeTab === "orders" ? "Order Manager" : activeTab}
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {activeTab === "dashboard" && "Real-time revenue monitoring and analytics metrics dashboard."}
              {activeTab === "addProduct" && "Register new items into collection catalog database."}
              {activeTab === "orders" && "Track customer order details and modify physical delivery status."}
              {activeTab === "cancellations" && "Review customer cancelled transactions and cancellation explanations."}
            </p>
          </div>
          
          {/* Quick Refresh Widget */}
          {activeTab !== "addProduct" && (
            <button
              onClick={() => fetchAllOrders(token)}
              disabled={ordersLoading}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              {ordersLoading ? "Syncing..." : "Refresh Data"}
            </button>
          )}
        </header>

        {/* -------------------- TAB CONTENT 1: DASHBOARD & ANALYTICS -------------------- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            
            {/* MONTH FILTER PANEL */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Month-on-Month Business Analytics</h3>
                <p className="text-xs text-gray-400 mt-0.5">Filter sales and aggregate order volumes.</p>
              </div>

              <div className="flex gap-2">
                {/* Month Dropdown */}
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-[#FAF9F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Array.from({ length: 12 }).map((_, mIdx) => (
                    <option key={mIdx} value={mIdx}>{getMonthName(mIdx)}</option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-[#FAF9F6] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {yearsRange.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* METRICS CARD GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* CARD 1: Total Sales */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BsCashCoin className="w-16 h-16 text-emerald-600" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  Monthly Revenue
                </span>
                <p className="text-3xl font-black text-slate-800 mt-3">
                  ₹{monthlyTotalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                  Aggregated from paid active orders in {getMonthName(selectedMonth)}.
                </p>
              </div>

              {/* CARD 2: Active Orders */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BsCartFill className="w-16 h-16 text-indigo-600" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                  Sales Volume
                </span>
                <p className="text-3xl font-black text-slate-800 mt-3">
                  {activeAnalyticsOrders.length}
                </p>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                  Completed & active transactions processed.
                </p>
              </div>

              {/* CARD 3: Cancelled Orders */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BsXCircle className="w-16 h-16 text-rose-600" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                  Cancelled Orders
                </span>
                <p className="text-3xl font-black text-slate-800 mt-3">
                  {cancelledAnalyticsOrders.length}
                </p>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                  Lost orders this month with cancellation logs.
                </p>
              </div>

              {/* CARD 4: Ticket Size / Cancellation Rate */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <BsCheckCircleFill className="w-16 h-16 text-slate-600" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
                  Cancellation Rate
                </span>
                <p className="text-3xl font-black text-slate-800 mt-3">
                  {cancellationRate}%
                </p>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                  Avg Ticket Size: <b>₹{averageTicketSize}</b> per customer order.
                </p>
              </div>

            </div>

            {/* MONTHLY REVENUE CONTRIBUTOR LIST */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Monthly Revenue Stream</h3>
                  <p className="text-xs text-gray-400 mt-0.5">List of non-cancelled orders completed or active in {getMonthName(selectedMonth)} {selectedYear}.</p>
                </div>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold">
                  Total {activeAnalyticsOrders.length} Orders
                </span>
              </div>

              {ordersLoading ? (
                <div className="py-10 text-center text-gray-400 text-sm font-medium">
                  Loading catalog database transactions...
                </div>
              ) : activeAnalyticsOrders.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm font-medium border-2 border-dashed border-gray-100 rounded-2xl">
                  No billing transactions logged for this month.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead>
                      <tr className="border-b border-gray-150 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Placement Date</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Shipping Status</th>
                        <th className="pb-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeAnalyticsOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-[#FAF9F6] transition-colors">
                          <td className="py-3.5 font-mono text-slate-400">#{order._id.slice(-8)}</td>
                          <td className="py-3.5 text-slate-800">
                            {order.address?.firstName} {order.address?.lastName}
                          </td>
                          <td className="py-3.5 text-gray-400 font-medium">
                            {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${order.payment ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                              {order.paymentMethod} ({order.payment ? "Paid" : "Pending"})
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className="text-slate-800 font-bold">{order.status}</span>
                          </td>
                          <td className="py-3.5 text-right font-black text-slate-850">
                            ₹{order.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT 2: ADD PRODUCT FORM -------------------- */}
        {activeTab === "addProduct" && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs max-w-4xl">
            
            <form onSubmit={handleAddProductSubmit} className="space-y-6">
              
              {/* IMAGE UPLOAD SLOT PANEL */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Upload Product Catalog Images (Up to 4 slots)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-[#FAF9F6] overflow-hidden group hover:border-indigo-400 transition-colors">
                      {imagePreviews[idx] ? (
                        <>
                          <img 
                            src={imagePreviews[idx]} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageSlot(idx)}
                            className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                          >
                            <BsX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer select-none">
                          <BsCloudUpload className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="text-[10px] text-gray-400 font-bold mt-2">Slot {idx + 1}</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageChange(idx, e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PRODUCT BASIC INFORMATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Product Title / Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Premium Classic Watch"
                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Catalog Sale Price (₹)
                  </label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="1299"
                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Detailed Product Description
                </label>
                <textarea 
                  required
                  rows="4"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Elaborate details including build materials, styling guidelines, and functional components..."
                  className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                ></textarea>
              </div>

              {/* CATEGORIES & SUBCATEGORIES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Main Category
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Sub-Category
                  </label>
                  <select
                    value={productSubCategory}
                    onChange={(e) => setProductSubCategory(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                  >
                    {subCategoryMap[productCategory]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRODUCT SIZES PILL SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {sizeOptions.map(sz => {
                    const isSelected = productSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                            : "bg-[#FAF9F6] text-slate-600 border-gray-200 hover:border-slate-400"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BESTSELLER TOGGLE */}
              <div className="flex items-center gap-3 bg-[#FAF9F6] p-4 rounded-xl border border-gray-150 w-fit select-none">
                <input 
                  type="checkbox" 
                  id="bestseller-toggle"
                  checked={productBestseller}
                  onChange={(e) => setProductBestseller(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="bestseller-toggle" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Mark as Bestselling Product (Promo Feature)
                </label>
              </div>

              {/* FORM SUBMISSION BUTTON */}
              <button
                type="submit"
                disabled={formLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold tracking-wide text-xs uppercase px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/15 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading Product Details...
                  </>
                ) : (
                  "Create Database Product"
                )}
              </button>

            </form>

          </div>
        )}

        {/* -------------------- TAB CONTENT 3: ORDER MANAGER -------------------- */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            
            {/* SEARCH & FILTERS CONTROLS */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Dynamic search */}
              <div className="relative w-full md:max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <BsSearch className="w-3.5 h-3.5" />
                </span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Order ID, Customer Name, Email or City..."
                  className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {["All", "Order Placed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map(flt => (
                  <button
                    key={flt}
                    onClick={() => setStatusFilter(flt)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      statusFilter === flt 
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                        : "bg-white border-gray-200 text-slate-650 hover:bg-gray-50"
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>

            </div>

            {/* ORDERS CATALOG GRID */}
            {ordersLoading ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center text-gray-400 text-sm font-semibold">
                Retrieving active customer order records...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white border border-gray-100 border-dashed border-2 rounded-3xl p-12 text-center text-gray-400 text-sm font-medium">
                No orders match your active query.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentOrders.map((order) => (
                    <div 
                      key={order._id} 
                      className={`bg-white border border-gray-100 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between min-h-[385px] border-t-4 ${
                        order.status === "Delivered" ? "border-t-green-500" :
                        order.status === "Cancelled" ? "border-t-red-500" :
                        order.status === "Shipped" ? "border-t-blue-500" :
                        order.status === "Out for Delivery" ? "border-t-orange-500" :
                        "border-t-indigo-500"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div>
                          <span className="font-mono text-[10px] font-extrabold text-slate-500 bg-[#FAF9F6] border border-gray-200 px-1.5 py-0.5 rounded-lg select-all">
                            #{order._id.slice(-8)}
                          </span>
                          <p className="text-[9px] text-gray-400 font-bold mt-1.5">
                            {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`text-[9px] font-black rounded-lg px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 border cursor-pointer ${
                            order.status === "Delivered" ? "bg-green-50 text-green-600 border-green-200" :
                            order.status === "Cancelled" ? "bg-red-50 text-red-650 border border-red-200" :
                            order.status === "Shipped" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                            order.status === "Out for Delivery" ? "bg-orange-50 text-orange-650 border border-orange-200" :
                            "bg-gray-100 text-slate-700 border border-gray-200"
                          }`}
                        >
                          <option value="Order Placed">Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Items List Inside Card (compact thumbnails) */}
                      <div className="flex-1 my-3 overflow-y-auto max-h-36 pr-1 space-y-2.5">
                        {order.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex gap-2 items-center">
                            <img 
                              src={item.image[0].startsWith('/') ? `${backendUrl}${item.image[0]}` : item.image[0]} 
                              alt="" 
                              style={{ width: '48px', height: '48px', minWidth: '48px', objectFit: 'cover' }}
                              className="rounded-lg border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black text-slate-800 truncate" title={item.name}>
                                {item.name}
                              </p>
                              <p className="text-[8px] text-gray-400 font-extrabold mt-0.5">
                                Size: {item.size || 'N/A'} • Qty: {item.quantity} • ₹{item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer Summary */}
                      <div className="pt-3 border-t border-gray-100 mt-auto">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] uppercase tracking-wider font-black text-indigo-650 bg-indigo-50 px-1.5 py-0.5 rounded">
                            {order.paymentMethod}
                          </span>
                          <span className="text-xs font-black text-slate-850">
                            ₹{order.amount}
                          </span>
                        </div>

                        <div className="text-[9px] text-slate-500 truncate mb-3" title={`${order.address?.firstName} ${order.address?.lastName}, ${order.address?.city}`}>
                          To: <b>{order.address?.firstName} {order.address?.lastName}</b>, {order.address?.city}
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="w-full flex items-center justify-center gap-1 py-1.5 bg-slate-900 hover:bg-indigo-650 text-white text-[9px] font-black rounded-lg transition-colors cursor-pointer"
                        >
                          <BsEye className="w-3 h-3" />
                          View Details
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Client side Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 pt-6">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer select-none"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 text-xs font-black rounded-xl border transition-all cursor-pointer select-none ${
                            currentPage === pageNum 
                              ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                              : "bg-white border-gray-200 text-slate-650 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all cursor-pointer select-none"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* -------------------- TAB CONTENT 4: CANCELLATIONS REVIEW -------------------- */}
        {activeTab === "cancellations" && (
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-800">Cancelled Transactions</h3>
                <p className="text-xs text-gray-400 mt-0.5">Analyze cancellation logs and customer testimonies.</p>
              </div>
              <span className="text-xs bg-red-50 border border-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                Total {cancelledOrdersList.length} Cancelled
              </span>
            </div>

            {ordersLoading ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center text-gray-400 text-sm font-semibold">
                Syncing cancellation records...
              </div>
            ) : cancelledOrdersList.length === 0 ? (
              <div className="bg-white border border-gray-100 border-dashed border-2 rounded-3xl p-12 text-center text-gray-400 text-sm font-medium">
                No cancelled orders found in the database.
              </div>
            ) : (
              <div className="space-y-6">
                {cancelledOrdersList.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs border-l-4 border-l-red-500 relative">
                    
                    {/* Card Header info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-slate-500 bg-[#FAF9F6] border border-gray-200 px-2 py-0.5 rounded-lg">
                            Order ID: #{order._id}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            Placed: {new Date(order.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[10px] text-red-600 font-bold uppercase mt-1">
                          Payment Loss: ₹{order.amount} ({order.paymentMethod})
                        </p>
                      </div>
                      
                      <span className="text-xs font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-150">
                        {order.status}
                      </span>
                    </div>

                    {/* Cancellation Reason Alert banner */}
                    <div className="bg-red-50/70 border border-red-100 rounded-2xl p-4.5 text-xs font-semibold my-4.5">
                      <p className="text-red-800 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                        Cancellation Explanation Given by Customer:
                      </p>
                      <p className="text-red-700 italic font-bold text-sm mt-2 pl-4 border-l-2 border-red-300">
                        &ldquo;{order.cancellationReason || "No explanation provided."}&rdquo;
                      </p>
                    </div>

                    {/* Detailed info grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                      {/* Column 1: Items */}
                      <div className="lg:col-span-2 space-y-2.5">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Cancelled Items List</p>
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <img 
                                src={item.image[0].startsWith('/') ? `${backendUrl}${item.image[0]}` : item.image[0]} 
                                alt="" 
                                className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold">
                                  Size: {item.size} — Qty: {item.quantity} — Unit: ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: Client */}
                      <div className="bg-[#FAF9F6] p-4 rounded-xl border border-gray-150 text-xs">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Customer Profile</p>
                        <p className="font-extrabold text-slate-800">
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <p className="text-slate-500 mt-1 leading-tight">
                          {order.address?.street}, {order.address?.city}<br />
                          {order.address?.state} - {order.address?.zipcode}
                        </p>
                        <p className="text-[10px] text-slate-450 mt-2">
                          <b>Tel: </b>{order.address?.phone}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ELEGANT MODAL OVERLAY FOR FULL ORDER INVOICE DETAILS */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-scale-up max-h-[90vh] flex flex-col">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full p-2.5 transition-colors cursor-pointer z-10"
              >
                <BsX className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-6 relative">
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase">
                  Order Invoice Details
                </span>
                <h2 className="text-lg font-black tracking-mono mt-1 font-mono">
                  #{selectedOrder._id}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <p>Placed: {new Date(selectedOrder.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  <p>•</p>
                  <p className="uppercase text-indigo-400 font-extrabold">Payment: {selectedOrder.paymentMethod} ({selectedOrder.payment ? "Paid" : "Pending"})</p>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Order Status Controller */}
                <div className="bg-[#FAF9F6] border border-gray-150 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Update Order Status</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Change shipping progress logs for this customer package.</p>
                  </div>
                  
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      handleStatusUpdate(selectedOrder._id, e.target.value);
                      // Also update the selectedOrder state locally
                      setSelectedOrder(prev => ({ ...prev, status: e.target.value }));
                    }}
                    className={`text-xs font-extrabold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                      selectedOrder.status === "Delivered" ? "bg-green-50 text-green-600 border border-green-250" :
                      selectedOrder.status === "Cancelled" ? "bg-red-50 text-red-600 border border-red-250" :
                      selectedOrder.status === "Shipped" ? "bg-blue-50 text-blue-600 border border-blue-250" :
                      selectedOrder.status === "Out for Delivery" ? "bg-orange-50 text-orange-600 border border-orange-255" :
                      "bg-gray-100 text-slate-700 border border-gray-250"
                    }`}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Grid: Items details & Customer details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Items Breakdown list */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Ordered Items ({selectedOrder.items.length})</h3>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-[#FAF9F6] border border-gray-150 p-3 rounded-2xl">
                          <img 
                            src={item.image[0].startsWith('/') ? `${backendUrl}${item.image[0]}` : item.image[0]} 
                            alt="" 
                            style={{ width: '48px', height: '48px', minWidth: '48px', objectFit: 'cover' }}
                            className="rounded-xl border border-gray-200"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-slate-800 truncate" title={item.name}>
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-semibold mt-1">
                              Size: <span className="text-slate-750 font-extrabold">{item.size || 'N/A'}</span> • Qty: <span className="text-slate-750 font-extrabold">{item.quantity}</span>
                            </p>
                            <p className="text-[10px] text-slate-750 font-extrabold mt-0.5">
                              Price: ₹{item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Paid banner */}
                    <div className="bg-slate-100 p-4 rounded-2xl flex justify-between items-center text-slate-850">
                      <span className="text-xs font-bold">Total Paid Invoices</span>
                      <span className="text-sm font-black">₹{selectedOrder.amount}</span>
                    </div>
                  </div>

                  {/* Customer coordinates */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Shipping Details</h3>
                    <div className="bg-[#FAF9F6] border border-gray-150 p-4.5 rounded-2xl text-xs space-y-3.5">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Customer Name</p>
                        <p className="font-extrabold text-slate-850 text-sm mt-0.5">
                          {selectedOrder.address?.firstName} {selectedOrder.address?.lastName}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400">Delivery Address</p>
                        <p className="text-slate-700 mt-1 leading-relaxed">
                          {selectedOrder.address?.street}<br />
                          {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.zipcode}<br />
                          <span className="font-extrabold text-slate-600">{selectedOrder.address?.country}</span>
                        </p>
                      </div>
                      
                      <div className="pt-3.5 border-t border-gray-200 space-y-1.5">
                        <p className="text-[10px] text-slate-400"><b>Email: </b><span className="text-slate-650 font-bold">{selectedOrder.address?.email}</span></p>
                        <p className="text-[10px] text-slate-400"><b>Phone: </b><span className="text-slate-650 font-bold">{selectedOrder.address?.phone}</span></p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Cancellation reason banner if cancelled */}
                {selectedOrder.status === "Cancelled" && (
                  <div className="bg-red-50 border border-red-100 text-red-750 rounded-2xl p-4.5 text-xs font-semibold flex items-start gap-2.5">
                    <BsXCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-800">Order Cancellation Record Logged</p>
                      <p className="text-red-650 mt-1 font-medium italic">
                        &ldquo;{selectedOrder.cancellationReason || "No cancellation explanation registered by user."}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="bg-[#FAF9F6] border-t border-gray-150 p-4.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Close Invoice Details
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
