import React, { createContext, useState, useEffect } from 'react';
import { initialProducts, initialSales, initialDealers, initialTickets, initialLogs } from '../utils/dummyData';
import { generateSystemAlerts, calculateExpiryDate } from '../utils/helpers';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial state from local storage or fall back to empty arrays / initial data
  const [products, setProducts] = useState(() => {
    const hasMigrated = localStorage.getItem('sk_products_migrated_v2');
    if (!hasMigrated) {
      localStorage.setItem('sk_products_migrated_v2', 'true');
      return initialProducts;
    }

    const saved = localStorage.getItem('sk_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing sk_products local storage", e);
      }
    }
    return initialProducts;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('sk_sales');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing sk_sales local storage", e);
      }
    }
    return [];
  });

  const [dealers, setDealers] = useState(() => {
    const saved = localStorage.getItem('sk_dealers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing sk_dealers local storage", e);
      }
    }
    return initialDealers;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('sk_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('sk_logs');
    return saved ? JSON.parse(saved) : [];
  });


  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('sk_active_tab');
    return saved ? saved : 'dashboard';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('sk_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('sk_auth');
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
  });

  // Seed default credentials in local storage if not already there
  useEffect(() => {
    if (!localStorage.getItem('sk_admin_credentials')) {
      localStorage.setItem('sk_admin_credentials', JSON.stringify({
        username: 'admin',
        password: 'admin123'
      }));
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sk_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('sk_dealers', JSON.stringify(dealers));
  }, [dealers]);

  useEffect(() => {
    localStorage.setItem('sk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('sk_logs', JSON.stringify(logs));
  }, [logs]);

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

  useEffect(() => {
    localStorage.setItem('sk_auth', JSON.stringify(auth));
  }, [auth]);

  const login = (username, password) => {
    const storedCreds = JSON.parse(localStorage.getItem('sk_admin_credentials') || '{"username":"admin","password":"admin123"}');
    if (username === storedCreds.username && password === storedCreds.password) {
      const authState = { isAuthenticated: true, user: { username } };
      setAuth(authState);
      addLog("User Login", `User ${username} logged in successfully.`);
      return { success: true };
    } else {
      return { success: false, error: "Invalid username or password" };
    }
  };

  const logout = () => {
    const authState = { isAuthenticated: false, user: null };
    setAuth(authState);
    addLog("User Logout", "Administrator logged out.");
  };

  // Log action helper
  const addLog = (action, details) => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Product CRUD
  const addProduct = (productData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...productData,
      stock: parseInt(productData.stock) || 0,
      purchasePrice: parseFloat(productData.purchasePrice) || 0,
      sellingPrice: parseFloat(productData.sellingPrice) || 0,
      lowStockThreshold: parseInt(productData.lowStockThreshold) || 3
    };
    setProducts(prev => [newProduct, ...prev]);
    addLog("Product Added", `${newProduct.name} (${newProduct.model}) was added to inventory.`);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = {
          ...p,
          ...updatedData,
          stock: parseInt(updatedData.stock) || 0,
          purchasePrice: parseFloat(updatedData.purchasePrice) || 0,
          sellingPrice: parseFloat(updatedData.sellingPrice) || 0,
          lowStockThreshold: parseInt(updatedData.lowStockThreshold) || 3
        };
        addLog("Product Updated", `${updated.name} details were updated.`);
        return updated;
      }
      return p;
    }));
  };

  const deleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (product) {
      addLog("Product Deleted", `${product.name} was removed from the system.`);
    }
  };

  const clearProducts = () => {
    setProducts([]);
    addLog("Database Reset", "All products were cleared from the inventory.");
  };

  // Sales Entry with stock reduction, profit calculations, and service tickets
  const addSale = (saleData) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product) return { success: false, error: "Product not found." };
    if (product.stock < saleData.quantity) {
      return { success: false, error: `Insufficient stock. Available: ${product.stock}` };
    }

    // Auto-calculate profit, total amount, and warranty
    const qty = parseInt(saleData.quantity);
    const totalAmount = saleData.totalAmount ? parseFloat(saleData.totalAmount) : (parseFloat(saleData.sellingPrice) || product.sellingPrice) * qty;
    const sPrice = totalAmount / qty;
    const pPrice = product.purchasePrice;
    const profitAmount = totalAmount - (pPrice * qty);

    const amountPaid = saleData.amountPaid !== undefined ? parseFloat(saleData.amountPaid) : (saleData.paymentStatus === 'Paid' ? totalAmount : 0);
    const dueAmount = saleData.dueAmount !== undefined ? parseFloat(saleData.dueAmount) : (totalAmount - amountPaid);

    // Define warranty parameters based on category
    let warrantyDuration = 0; // default to 0 (no warranty)
    if (product.category === 'UPS') {
      warrantyDuration = 24; // 2 years
    } else if (product.category === 'Water Purifier') {
      warrantyDuration = 12; // 12 months
    }

    const warrantyExpiry = warrantyDuration > 0 ? calculateExpiryDate(saleData.date, warrantyDuration) : "";

    const newSale = {
      id: `sale-${Date.now()}`,
      ...saleData,
      productName: product.name,
      category: product.category,
      quantity: qty,
      sellingPrice: sPrice,
      purchasePrice: pPrice,
      totalAmount,
      profitAmount,
      amountPaid,
      dueAmount,
      warrantyDuration,
      warrantyExpiry,
      installationStatus: product.category === 'Solar Water Heater' ? 'Scheduled' : 'Completed',
      installationDate: saleData.installationDate || saleData.date
    };

    // 1. Deduct Stock
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return { ...p, stock: p.stock - qty };
      }
      return p;
    }));

    // 2. Add Sale
    setSales(prev => [newSale, ...prev]);

    // 3. Log sales transaction
    addLog("Sale Recorded", `Sold ${qty}x ${product.name} to ${saleData.customerName} for ${totalAmount}.`);

    // 4. If Solar Water Heater, automatically create an installation ticket
    if (product.category === 'Solar Water Heater') {
      const newTicket = {
        id: `tkt-${Date.now()}`,
        customerName: saleData.customerName,
        customerPhone: saleData.customerPhone,
        type: 'Installation',
        productName: product.name,
        description: 'New solar water heater installation. Needs support frame mounting and pipeline connections.',
        technician: 'Dinesh Gowda (Solar Structural Lead)',
        status: 'Pending',
        scheduledDate: saleData.installationDate || saleData.date,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTickets(prev => [newTicket, ...prev]);
      addLog("Installation Scheduled", `Automatic ticket created for ${saleData.customerName}'s Solar Heater.`);
    }

    // 5. If Water Purifier, automatically schedule a maintenance checklist item (6-month checkup)
    if (product.category === 'Water Purifier') {
      const maintDate = calculateExpiryDate(saleData.date, 6);
      const newTicket = {
        id: `tkt-${Date.now() + 1}`,
        customerName: saleData.customerName,
        customerPhone: saleData.customerPhone,
        type: 'Maintenance',
        productName: product.name,
        description: '6-Month Routine service and sediment/activated carbon filter inspection.',
        technician: 'Suresh Babu (Water Purifier Specialist)',
        status: 'Pending',
        scheduledDate: maintDate,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTickets(prev => [newTicket, ...prev]);
    }

    return { success: true };
  };

  const updateSalePaymentStatus = (id, status) => {
    setSales(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, paymentStatus: status };
        addLog("Payment Status Updated", `${s.customerName}'s invoice status set to ${status}.`);
        return updated;
      }
      return s;
    }));
  };

  // Dealer CRUD
  const addDealer = (dealerData) => {
    const newDealer = {
      id: `dealer-${Date.now()}`,
      name: dealerData.name,
      phone: dealerData.phone,
      commissionRate: parseFloat(dealerData.commissionRate) || 0,
      active: true
    };
    setDealers(prev => [...prev, newDealer]);
    addLog("Dealer Registered", `Sales agent ${newDealer.name} registered.`);
  };

  const updateDealer = (id, updatedData) => {
    setDealers(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          ...updatedData,
          commissionRate: parseFloat(updatedData.commissionRate) || 0
        };
      }
      return d;
    }));
    addLog("Dealer Updated", `Sales agent details modified.`);
  };

  // Tickets CRUD
  const addTicket = (ticketData) => {
    const newTicket = {
      id: `tkt-${Date.now()}`,
      ...ticketData,
      status: ticketData.status || 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTickets(prev => [newTicket, ...prev]);
    addLog("Ticket Opened", `New ${newTicket.type} ticket opened for ${newTicket.customerName}.`);
  };

  const updateTicket = (id, updatedData) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updatedData };
        addLog("Ticket Updated", `Ticket #${id.substring(4)} status/tech updated.`);
        return updated;
      }
      return t;
    }));
  };

  // System settings functions
  const loadDemoData = () => {
    setProducts(initialProducts);
    setSales(initialSales);
    setDealers(initialDealers);
    setTickets(initialTickets);
    setLogs(initialLogs);
    addLog("Database Reset", "Seeded the ERP database with clean demo records.");
  };

  const factoryReset = () => {
    setProducts([]);
    setSales([]);
    setDealers([]);
    setTickets([]);
    setLogs([]);
    addLog("Database Cleared", "Cleared all data from the local storage database.");
  };

  const restoreData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.products) setProducts(data.products);
      if (data.sales) setSales(data.sales);
      if (data.dealers) setDealers(data.dealers);
      if (data.tickets) setTickets(data.tickets);
      if (data.logs) setLogs(data.logs);
      addLog("Database Restored", "Successfully restored data from JSON backup.");
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Get active system warnings
  const alerts = generateSystemAlerts(products, sales, tickets);

  return (
    <AppContext.Provider value={{
      products,
      sales,
      dealers,
      tickets,
      logs,
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
      addDealer,
      updateDealer,
      addTicket,
      updateTicket,
      loadDemoData,
      factoryReset,
      restoreData,
      addLog
    }}>
      {children}
    </AppContext.Provider>
  );
};
