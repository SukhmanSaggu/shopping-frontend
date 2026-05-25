import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

function ShopContextProvider({ children }) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [currency, setCurrency] = useState("₹");
    const [deliveryFee, setDeliveryFee] = useState(10);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");

    const navigate = useNavigate();

    // Fetch Products Catalog from Backend
    const fetchProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                // Prepend backend URL for relative images served locally
                const formatted = response.data.products.map(p => ({
                    ...p,
                    image: p.image.map(img => img.startsWith('/') ? backendUrl + img : img)
                }));
                setProducts(formatted);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Fetch products failed:", error);
            toast.error("Failed to load catalog from backend. Operating in offline demo mode.");
        }
    };

    // Sync Cart Data from Backend
    const getUserCart = async (userToken) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: userToken } });
            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error("Get user cart failed:", error);
        }
    };

    const addToCart = async (itemId, itemSize) => {
        if (!itemSize) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][itemSize]) {
                cartData[itemId][itemSize] += 1;
            } else {
                cartData[itemId][itemSize] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][itemSize] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {
                const response = await axios.post(`${backendUrl}/api/cart/add`, { itemId, itemSize }, { headers: { token } });
                if (response.data.success) {
                    toast.success('Item added');
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Add to cart failed:", error);
                toast.error("Failed to sync cart item with server");
            }
        } else {
            toast.success('Item added to guest cart');
        }
    }

    const updateCart = async(itemId, itemSize, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity <= 0) {
            if (cartData[itemId]) {
                delete cartData[itemId][itemSize];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {
            if (!cartData[itemId]) cartData[itemId] = {};
            cartData[itemId][itemSize] = quantity;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, itemSize, quantity }, { headers: { token } });
            } catch (error) {
                console.error("Update cart failed:", error);
                toast.error("Failed to update quantity on server");
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;

        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {}
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            
            for (const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {}
            }
        }
        return totalAmount;
    }

    // Load products on mount
    useEffect(() => {
        fetchProductsData();
    }, []);

    // Load token and sync cart from localstorage on start
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            getUserCart(storedToken);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setToken("");
        setCartItems({});
        navigate("/login");
        toast.success("Successfully logged out");
    };

    const value = {
        products, currency, setCurrency, deliveryFee, setDeliveryFee, 
        search, setSearch, showSearch, setShowSearch, cartItems, setCartItems,
        addToCart, getCartCount, updateCart, getCartAmount, navigate,
        backendUrl, token, setToken, logout, getUserCart
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
