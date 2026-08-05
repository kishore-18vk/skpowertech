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
      const created = await productService.createProduct(productData);
      if (created) {
        setProducts(prev => {
          const filtered = prev.filter(p => p.id !== created.id);
          return [created, ...filtered];
        });
      }
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

  const loadDemoData = async () => {
    localStorage.removeItem('sk_products');
    const freshData = await productService.getAllProducts();
    setProducts(freshData);
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
      return { success: true };
    } catch (err) {
      console.error("Failed to delete sale record:", err);
      return { success: false, error: err.message };
    }
  };

  const clearAllSales = async () => {
    try {
      await salesService.clearAllSales();
      setSales([]);
      return { success: true };
    } catch (err) {
      console.error("Failed to clear all sales:", err);
      return { success: false, error: err.message };
    }
  };

  // Safe fallback mocks maintaining support logic for non-migrated layouts
  const clearProducts = () => console.warn("Operation restricted inside active production database configuration context.");
  const factoryReset = () => console.warn("Reset operations restricted within secure relational environments.");

  // Expense Management State
  const defaultExpenses = [
    { id: 'exp-1', date: '2026-08-01', category: 'Office Rent', subCategory: 'Mukkonam', title: 'Office Rent - Mukkonam', amount: 0, notes: 'Monthly rent for Mukkonam office' },
    { id: 'exp-2', date: '2026-08-01', category: 'Office Rent', subCategory: 'Udumalai', title: 'Office Rent - Udumalai', amount: 0, notes: 'Monthly rent for Udumalai branch' },
    { id: 'exp-3', date: '2026-08-01', category: 'Office Rent', subCategory: 'Tirupur', title: 'Office Rent - Tirupur', amount: 0, notes: 'Monthly rent for Tirupur branch' },
    { id: 'exp-4', date: '2026-08-02', category: 'Fuel', subCategory: 'CNG', title: 'Vehicle CNG Filling', amount: 0, notes: 'Transport vehicle fuel' },
    { id: 'exp-5', date: '2026-08-02', category: 'Fuel', subCategory: 'Petrol', title: 'Service Bike Petrol', amount: 0, notes: 'Field staff bike fuel' },
    { id: 'exp-6', date: '2026-08-03', category: 'Food', subCategory: 'Daily Food', title: 'Staff Lunch & Tea', amount: 0, notes: 'Daily refreshments' },
    { id: 'exp-7', date: '2026-08-03', category: 'Stationery', subCategory: 'Office Stationery', title: 'Stationery & Printing', amount: 0, notes: 'Paper, pens, bill books' },
    { id: 'exp-8', date: '2026-08-04', category: 'Salary', subCategory: 'Staff Salary', title: 'Staff Monthly Salary', amount: 0, notes: 'Technician and sales staff salaries' },
    { id: 'exp-9', date: '2026-08-04', category: 'Vehicle & Machine Service', subCategory: 'Eco Service', title: 'Eco Vehicle Service', amount: 0, notes: 'Vehicle maintenance service' },
    { id: 'exp-10', date: '2026-08-04', category: 'Vehicle & Machine Service', subCategory: 'Unicorn Service', title: 'Unicorn Service', amount: 0, notes: 'Machine / bike service' },
    { id: 'exp-11', date: '2026-08-04', category: 'Vehicle & Machine Service', subCategory: 'Ather Service', title: 'Ather EV Service', amount: 0, notes: 'EV scooter service' },
    { id: 'exp-12', date: '2026-08-05', category: 'EB Bill', subCategory: 'Total 3 Office', title: 'EB Bill (Total 3 Office)', amount: 0, notes: 'Electricity bill for 3 office spaces' },
    { id: 'exp-13', date: '2026-08-05', category: 'Transport & Logistics', subCategory: 'Transport', title: 'Goods Freight Transport', amount: 0, notes: 'Solar & Purifier logistics' },
    { id: 'exp-14', date: '2026-08-05', category: 'Transport & Logistics', subCategory: 'Courier', title: 'Parcel Courier Charges', amount: 0, notes: 'Spare parts courier' },
    { id: 'exp-15', date: '2026-08-05', category: 'Transport & Logistics', subCategory: 'Bus Courier', title: 'Bus Courier Freight', amount: 0, notes: 'Urgent bus courier dispatch' },
  ];

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('sk_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local expenses:", e);
      }
    }
    return defaultExpenses;
  });

  useEffect(() => {
    localStorage.setItem('sk_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      date: expenseData.date || new Date().toISOString().substring(0, 10),
      category: expenseData.category || 'General',
      subCategory: expenseData.subCategory || '',
      title: expenseData.title || expenseData.category,
      amount: parseFloat(expenseData.amount) || 0,
      notes: expenseData.notes || '',
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [newExp, ...prev]);
    return newExp;
  };

  const updateExpense = (id, updatedData) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updatedData } : e));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const clearAllExpenses = () => {
    setExpenses([]);
    localStorage.removeItem('sk_expenses');
  };

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
      expenses,
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
      clearAllSales,
      addExpense,
      updateExpense,
      deleteExpense,
      clearAllExpenses,
      loadDemoData,
      factoryReset
    }}>
      {children}
    </AppContext.Provider>
  );
};
