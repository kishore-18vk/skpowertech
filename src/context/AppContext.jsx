import React, { createContext, useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { salesService } from '../services/salesService';
import { authService } from '../services/authService';
import { generateSystemAlerts } from '../utils/helpers';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keep these layout states exactly as they were
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('sk_active_tab');
    return saved ? saved : 'dashboard';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('sk_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });

  // 1. Initial application startup load
  useEffect(() => {
    async function initializeApp() {
      try {
        setLoading(true);
        
        // Restore active user session if valid
        const initialSession = await authService.getCurrentSession();
        if (initialSession) {
          setAuth(initialSession);
        }

        // Fetch database data
        const dbProducts = await productService.getAllProducts();
        const dbSales = await salesService.getAllSales();
        
        setProducts(dbProducts);
        setSales(dbSales);
      } catch (err) {
        console.error("Database connection initialization failure:", err);
      } finally {
        setLoading(false);
      }
    }
    initializeApp();
  }, []);

  // 2. Tab & Theme Synced local storage routines
  useEffect(() => {
    localStorage.setItem('sk_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('sk_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 3. Authenticated actions mapped to custom Supabase parameters
  const login = async (usernameOrEmail, password) => {
    // If the input doesn't contain an '@', append a default domain automatically for convenience
    const targetEmail = usernameOrEmail.includes('@') 
      ? usernameOrEmail 
      : `${usernameOrEmail}@skpowertech.com`;

    const result = await authService.login(targetEmail, password);
    if (result.success) {
      setAuth({ isAuthenticated: true, user: result.user });
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const logout = async () => {
    await authService.logout();
    setAuth({ isAuthenticated: false, user: null });
  };

  // 4. Product Catalog Database updates
  const addProduct = async (productData) => {
    try {
      await productService.createProduct(productData);
      // Refresh local array directly from source database table 
      const freshData = await productService.getAllProducts();
      setProducts(freshData);
    } catch (err) {
      console.error("Failed to add catalog item row:", err);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      await productService.updateProduct(id, updatedData);
      const freshData = await productService.getAllProducts();
      setProducts(freshData);
    } catch (err) {
      console.error("Failed to adjust inventory items columns:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      const freshData = await productService.getAllProducts();
      setProducts(freshData);
    } catch (err) {
      console.error("Failed to eliminate selected component entry:", err);
    }
  };

  // 5. Transaction Database entries
  const addSale = async (saleData) => {
    const activeProduct = products.find(p => p.id === saleData.productId);
    if (!activeProduct) return { success: false, error: "Product not located inside current tracking indexes." };
    if (activeProduct.stock < parseInt(saleData.quantity)) {
      return { success: false, error: `Insufficient stock boundaries. Maximum available limit: ${activeProduct.stock}` };
    }

    try {
      const checkoutResult = await salesService.createSale(saleData, activeProduct);
      
      // Pull fresh data post-transaction to accurately reflect adjusted inventory items
      const freshProducts = await productService.getAllProducts();
      const freshSales = await salesService.getAllSales();
      
      setProducts(freshProducts);
      setSales(freshSales);
      
      return checkoutResult;
    } catch (err) {
      console.error("Failed handling database order write validation routines:", err);
      return { success: false, error: err.message || "Database transaction pipeline failure." };
    }
  };

  const updateSalePaymentStatus = async (id, status) => {
    try {
      await salesService.updatePaymentStatus(id, status);
      const freshSales = await salesService.getAllSales();
      setSales(freshSales);
    } catch (err) {
      console.error("Failed adjusting payment status balance records:", err);
    }
  };

  const deleteSale = async (id, productId, quantity) => {
    try {
      await salesService.deleteSale(id, productId, quantity);
      const freshProducts = await productService.getAllProducts();
      const freshSales = await salesService.getAllSales();
      setProducts(freshProducts);
      setSales(freshSales);
    } catch (err) {
      console.error("Failed to delete sale record:", err);
    }
  };

  // Safe fallback mocks maintaining support logic for non-migrated layouts
  const clearProducts = () => console.warn("Operation restricted inside active production database configuration context.");
  const loadDemoData = () => console.warn("Operation disabled inside active production backend configuration mode.");
  const factoryReset = () => console.warn("Reset operations restricted within secure relational environments.");

  // Keep analytical alert engines computing identically to standard specifications
  const alerts = generateSystemAlerts(products, sales, []);

  // Block rendering until initial database requests settle to prevent UI layout jumps
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      products,
      sales,
      dealers: [], // preserves empty layouts gracefully
      tickets: [], 
      logs: [],
      alerts,
      activeTab,
      setActiveTab,
      darkMode,
      setDarkMode,
      auth,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      clearProducts,
      addSale,
      updateSalePaymentStatus,
      deleteSale,
      loadDemoData,
      factoryReset
    }}>
      {children}
    </AppContext.Provider>
  );
};
