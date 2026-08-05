// Formatting utilities for SK Powertech ERP

// Format number to INR Currency (Indian Rupees)
export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Format ISO date string to a readable format
export const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-IN', options);
};

// Get Month and Year string (e.g., "July 2026")
export const getMonthYearString = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

// Calculate warranty expiry date
export const calculateExpiryDate = (startDateStr, durationMonths) => {
  if (!startDateStr || !durationMonths) return "";
  const date = new Date(startDateStr);
  date.setMonth(date.getMonth() + parseInt(durationMonths));
  return date.toISOString().split("T")[0];
};

// Calculate days remaining or expired
export const getDaysDifference = (targetDateStr) => {
  if (!targetDateStr) return 0;
  const targetDate = new Date(targetDateStr);
  const today = new Date(); // Current today's date
  const diffTime = targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if a date is within a certain range of days (e.g. within next 30 days)
export const isExpiringSoon = (expiryDateStr, daysThreshold = 30) => {
  const diff = getDaysDifference(expiryDateStr);
  return diff >= 0 && diff <= daysThreshold;
};

// Check if a date has already passed
export const isExpired = (expiryDateStr) => {
  return getDaysDifference(expiryDateStr) < 0;
};

// Convert data list to CSV string and download it
export const exportToCSV = (filename, headers, data, mapFunction) => {
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const item of data) {
    const values = mapFunction(item);
    const escapedValues = values.map(value => {
      const stringValue = String(value === null || value === undefined ? '' : value);
      // Escape quotes and wrap in quotes if contains commas or quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(escapedValues.join(','));
  }
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate automated system warnings
export const generateSystemAlerts = (products, sales, tickets) => {
  const alerts = [];

  // 1. Low stock & Out of stock alerts
  products.forEach(p => {
    if (p.stock === 0) {
      alerts.push({
        id: `alert-stock-out-${p.id}`,
        type: 'danger',
        category: 'Inventory',
        title: 'Product Out of Stock!',
        message: `${p.name} (${p.brand}) is completely out of stock.`,
        linkTab: 'dashboard'
      });
    } else if (p.stock <= p.lowStockThreshold) {
      alerts.push({
        id: `alert-stock-low-${p.id}`,
        type: 'warning',
        category: 'Inventory',
        title: 'Low Stock Warning',
        message: `${p.name} is running low. Current stock: ${p.stock} (Threshold: ${p.lowStockThreshold}).`,
        linkTab: 'dashboard'
      });
    }
  });

  return alerts;
};
