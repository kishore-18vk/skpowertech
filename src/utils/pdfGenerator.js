import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadPurchasePDF = (purchases, summaryData = {}) => {
  const doc = new jsPDF();

  // Header Banner (Amber theme matching SK Powertech ERP)
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('S.K. POWER TECH', 14, 15);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Stock Inward & Purchase Ledger Statement', 14, 22);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  doc.text(`Generated: ${todayStr}`, 150, 15);

  // Executive Summary Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Purchase Summary', 14, 40);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  
  const totalOrders = purchases.length;
  const totalUnits = purchases.reduce((sum, p) => {
    if (p.items && p.items.length > 0) {
      return sum + p.items.reduce((iSum, item) => iSum + (parseInt(item.quantity) || 0), 0);
    }
    return sum + (parseInt(p.quantity) || 0);
  }, 0);
  const totalAmount = purchases.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0);

  doc.text(`Total Purchase Orders: ${totalOrders}`, 14, 48);
  doc.text(`Total Stock Restocked: +${totalUnits} units`, 75, 48);
  doc.text(`Total Investment: Rs. ${totalAmount.toLocaleString('en-IN')}`, 145, 48);

  // Table Data Mapping
  const tableRows = purchases.map((p, index) => {
    const itemSummary = p.items && p.items.length > 0 
      ? p.items.map(i => `${i.productName} (+${i.quantity})`).join('\n')
      : `${p.productName || 'Equipment Item'} (+${p.quantity || 1})`;

    const unitsCount = p.totalUnits || (p.items ? p.items.reduce((acc, i) => acc + (parseInt(i.quantity) || 0), 0) : p.quantity || 1);

    return [
      index + 1,
      p.invoiceNo || 'PUR-001',
      p.date || '',
      `${p.supplierName || 'Supplier'}${p.supplierPhone ? '\nPh: ' + p.supplierPhone : ''}`,
      itemSummary,
      `+${unitsCount} units`,
      p.totalAmount > 0 ? `Rs. ${p.totalAmount.toLocaleString('en-IN')}` : '-',
      p.paymentStatus || 'Paid'
    ];
  });

  autoTable(doc, {
    startY: 54,
    head: [['#', 'Invoice No', 'Date', 'Supplier Details', 'Inward Stock Items', 'Units', 'Total Amount', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [217, 119, 6],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 25 },
      2: { cellWidth: 22 },
      3: { cellWidth: 35 },
      4: { cellWidth: 50 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 24, halign: 'right' },
      7: { cellWidth: 18, halign: 'center' }
    }
  });

  // Footer Signatures
  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 220;
  if (finalY > 260) {
    doc.addPage();
    finalY = 30;
  }

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared By: Admin Manager', 14, finalY);
  doc.text('Authorized Signatory: S.K. Power Tech', 135, finalY);

  // Save the generated PDF document
  doc.save(`SK_Powertech_Purchase_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const downloadSalesPDF = (sales, monthTitle = 'Monthly') => {
  const doc = new jsPDF();

  // Header Banner (Emerald theme matching SK Powertech Sales Report)
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('S.K. POWER TECH', 14, 15);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Sales & Billing Transaction Statement (${monthTitle})`, 14, 22);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  doc.text(`Generated: ${todayStr}`, 150, 15);

  // Executive Sales Summary Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Statement Totals', 14, 40);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  
  const totalSold = sales.reduce((sum, s) => sum + (parseInt(s.quantity) || 1), 0);
  const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.totalAmount) || 0), 0);
  const totalPaid = sales.reduce((sum, s) => sum + (parseFloat(s.amountPaid) || 0), 0);
  const outstandingDue = sales.reduce((sum, s) => sum + (parseFloat(s.remainingDue) || 0), 0);

  doc.text(`Total Revenue: Rs. ${totalRevenue.toLocaleString('en-IN')}`, 14, 48);
  doc.text(`Units Shipped: ${totalSold} units`, 85, 48);
  doc.text(`Settled Paid: Rs. ${totalPaid.toLocaleString('en-IN')}`, 135, 48);
  if (outstandingDue > 0) {
    doc.setTextColor(225, 29, 72);
    doc.text(`Outstanding Due: Rs. ${outstandingDue.toLocaleString('en-IN')}`, 14, 54);
    doc.setTextColor(30, 41, 59);
  }

  // Table Data Mapping
  const tableRows = sales.map((s, index) => {
    return [
      index + 1,
      s.date || '',
      `${s.customerName || 'Customer'}${s.customerPhone ? '\nPh: ' + s.customerPhone : ''}`,
      `${s.category || 'General'}${s.serialNumber ? '\nSr. No: ' + s.serialNumber : ''}`,
      `${s.quantity || 1} unit(s)`,
      `Rs. ${(parseFloat(s.totalAmount) || 0).toLocaleString('en-IN')}`,
      `Rs. ${(parseFloat(s.amountPaid) || 0).toLocaleString('en-IN')}`,
      s.remainingDue > 0 ? `Rs. ${(parseFloat(s.remainingDue) || 0).toLocaleString('en-IN')}` : '0.00'
    ];
  });

  autoTable(doc, {
    startY: outstandingDue > 0 ? 60 : 54,
    head: [['#', 'Date', 'Customer Details', 'Category', 'Qty', 'Total Invoice', 'Amount Paid', 'Remaining Due']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 22 },
      2: { cellWidth: 42 },
      3: { cellWidth: 32 },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 24, halign: 'right' },
      6: { cellWidth: 24, halign: 'right' },
      7: { cellWidth: 23, halign: 'right' }
    }
  });

  // Footer Signatures
  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 220;
  if (finalY > 260) {
    doc.addPage();
    finalY = 30;
  }

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared By: Admin Staff', 14, finalY);
  doc.text('Authorized Signatory: Suresh Kumar (CEO), S.K. Power Tech', 110, finalY);

  doc.save(`SK_Powertech_Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
