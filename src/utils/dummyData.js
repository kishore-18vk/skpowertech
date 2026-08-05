export const initialProducts = [
  // Solar Water Heaters
  { id: 'p1', name: 'Sudarson / SNR 200 Ltr', brand: 'Sudarson/SNR', model: '200 Ltr', category: 'Solar Water Heater', stock: 4, purchasePrice: 22000, sellingPrice: 26000, lowStockThreshold: 3 },
  { id: 'p2', name: 'Sudarson / SNR 150 Ltr', brand: 'Sudarson/SNR', model: '150 Ltr', category: 'Solar Water Heater', stock: 10, purchasePrice: 18500, sellingPrice: 22000, lowStockThreshold: 3 },
  { id: 'p3', name: 'Sudarson / SNR 100 Ltr', brand: 'Sudarson/SNR', model: '100 Ltr', category: 'Solar Water Heater', stock: 6, purchasePrice: 14000, sellingPrice: 17500, lowStockThreshold: 3 },
  { id: 'p4', name: 'V-Guard 100 L Pro', brand: 'V-Guard', model: '100 L Pro', category: 'Solar Water Heater', stock: 3, purchasePrice: 15000, sellingPrice: 18500, lowStockThreshold: 3 },
  { id: 'p5', name: 'V-Guard 100 L Pro (Udumalai Shop)', brand: 'V-Guard', model: '100 L Pro (Udumalai)', category: 'Solar Water Heater', stock: 1, purchasePrice: 15000, sellingPrice: 18500, lowStockThreshold: 1 },
  { id: 'p6', name: 'V-Guard 100 L DAF', brand: 'V-Guard', model: '100 L DAF', category: 'Solar Water Heater', stock: 1, purchasePrice: 16000, sellingPrice: 19500, lowStockThreshold: 3 },
  { id: 'p7', name: 'V-Guard 150 L Pro', brand: 'V-Guard', model: '150 L Pro', category: 'Solar Water Heater', stock: 2, purchasePrice: 20000, sellingPrice: 24500, lowStockThreshold: 3 },
  { id: 'p8', name: 'V-Guard 150 L DAF', brand: 'V-Guard', model: '150 L DAF', category: 'Solar Water Heater', stock: 2, purchasePrice: 21000, sellingPrice: 25500, lowStockThreshold: 3 },
  { id: 'p9', name: 'V-Guard 200 L Pro', brand: 'V-Guard', model: '200 L Pro', category: 'Solar Water Heater', stock: 3, purchasePrice: 24000, sellingPrice: 28550, lowStockThreshold: 3 },
  { id: 'p10', name: 'V-Guard TRV Hot 200 Pro', brand: 'V-Guard', model: 'TRV Hot 200 Pro', category: 'Solar Water Heater', stock: 1, purchasePrice: 25000, sellingPrice: 29500, lowStockThreshold: 3 },
  { id: 'p11', name: 'V-Guard DAF 200', brand: 'V-Guard', model: 'DAF 200', category: 'Solar Water Heater', stock: 1, purchasePrice: 24500, sellingPrice: 29000, lowStockThreshold: 3 },
  { id: 'p12', name: 'V-Guard 200 PRV', brand: 'V-Guard', model: '200 PRV', category: 'Solar Water Heater', stock: 1, purchasePrice: 25500, sellingPrice: 30000, lowStockThreshold: 3 },
  { id: 'p13', name: 'V-Guard 150 TRV Hot', brand: 'V-Guard', model: '150 TRV Hot', category: 'Solar Water Heater', stock: 1, purchasePrice: 20500, sellingPrice: 25000, lowStockThreshold: 3 },

  // Water Purifiers
  { id: 'p14', name: 'Auro 9 L Pure Flo', brand: 'Auro', model: '9 L Pure Flo', category: 'Water Purifier', stock: 2, purchasePrice: 4000, sellingPrice: 6500, lowStockThreshold: 3 },
  { id: 'p15', name: 'Auro 10 L Aqua 2090', brand: 'Auro', model: '10 L Aqua 2090', category: 'Water Purifier', stock: 2, purchasePrice: 4500, sellingPrice: 7200, lowStockThreshold: 3 },

  // UPS Inverters
  { id: 'p16', name: 'V-Guard JAADOO 1150', brand: 'V-Guard', model: 'JAADOO 1150', category: 'UPS Inverter', stock: 1, purchasePrice: 4000, sellingPrice: 5500, lowStockThreshold: 3 },
  { id: 'p17', name: 'V-Guard Prime 1050', brand: 'V-Guard', model: 'Prime 1050', category: 'UPS Inverter', stock: 1, purchasePrice: 4000, sellingPrice: 5500, lowStockThreshold: 3 },
  { id: 'p18', name: 'V-Guard Prime 800', brand: 'V-Guard', model: 'Prime 800', category: 'UPS Inverter', stock: 1, purchasePrice: 3500, sellingPrice: 4800, lowStockThreshold: 3 },
  { id: 'p19', name: 'V-Guard Prime 1250', brand: 'V-Guard', model: 'Prime 1250', category: 'UPS Inverter', stock: 5, purchasePrice: 4200, sellingPrice: 5800, lowStockThreshold: 3 },
  { id: 'p20', name: 'V-Guard Prime 1250 mili', brand: 'V-Guard', model: 'Prime 1250 mili', category: 'UPS Inverter', stock: 7, purchasePrice: 4000, sellingPrice: 5500, lowStockThreshold: 3 },
  { id: 'p21', name: 'V-Guard Prime 1000 mili', brand: 'V-Guard', model: 'Prime 1000 mili', category: 'UPS Inverter', stock: 5, purchasePrice: 3800, sellingPrice: 5200, lowStockThreshold: 3 },
  { id: 'p22', name: 'V-Guard Prime 2250', brand: 'V-Guard', model: 'Prime 2250', category: 'UPS Inverter', stock: 3, purchasePrice: 7500, sellingPrice: 9800, lowStockThreshold: 3 },
  { id: 'p29_1', name: 'V-Guard Prime 1550 mili', brand: 'V-Guard', model: 'Prime 1550 mili', category: 'UPS Inverter', stock: 4, purchasePrice: 5000, sellingPrice: 6800, lowStockThreshold: 3 },
  { id: 'p29_2', name: 'V-Guard MPPT 1750', brand: 'V-Guard', model: 'MPPT 1750', category: 'UPS Inverter', stock: 1, purchasePrice: 6000, sellingPrice: 8200, lowStockThreshold: 3 },
  { id: 'p29_3', name: 'Okaya UPS 1400', brand: 'Okaya', model: 'UPS 1400', category: 'UPS Inverter', stock: 1, purchasePrice: 4500, sellingPrice: 6200, lowStockThreshold: 3 },
  { id: 'p29_4', name: 'Amaze 1075', brand: 'Amaze', model: '1075', category: 'UPS Inverter', stock: 1, purchasePrice: 4200, sellingPrice: 5800, lowStockThreshold: 3 },

  // Batteries
  { id: 'p23', name: 'Okaya Battery', brand: 'Okaya', model: 'Standard', category: 'Batteries', stock: 3, purchasePrice: 7500, sellingPrice: 10000, lowStockThreshold: 3 },
  { id: 'p24', name: 'Amaron Battery', brand: 'Amaron', model: 'Standard', category: 'Batteries', stock: 4, purchasePrice: 7000, sellingPrice: 9500, lowStockThreshold: 3 },
  { id: 'p25', name: 'V-Guard Battery', brand: 'V-Guard', model: 'Standard', category: 'Batteries', stock: 1, purchasePrice: 8000, sellingPrice: 11000, lowStockThreshold: 3 },
  { id: 'p26', name: 'Amaze Battery', brand: 'Amaze', model: 'Standard', category: 'Batteries', stock: 2, purchasePrice: 6500, sellingPrice: 9000, lowStockThreshold: 3 },
  { id: 'p27', name: 'Amaze Battery (Additional)', brand: 'Amaze', model: 'Additional', category: 'Batteries', stock: 1, purchasePrice: 6500, sellingPrice: 9000, lowStockThreshold: 3 },
  { id: 'p28', name: 'Okaya Battery (Additional)', brand: 'Okaya', model: 'Additional', category: 'Batteries', stock: 1, purchasePrice: 7500, sellingPrice: 10000, lowStockThreshold: 3 },

  // Electric Heaters
  { id: 'p29', name: 'Electric Heater L10', brand: 'Electric', model: 'L10', category: 'Electric Heater', stock: 2, purchasePrice: 4500, sellingPrice: 6000, lowStockThreshold: 3 },
  { id: 'p30', name: 'Electric Heater L15', brand: 'Electric', model: 'L15', category: 'Electric Heater', stock: 2, purchasePrice: 5000, sellingPrice: 6800, lowStockThreshold: 3 },
  { id: 'p31', name: 'Electric Heater L2', brand: 'Electric', model: 'L2', category: 'Electric Heater', stock: 1, purchasePrice: 2000, sellingPrice: 2800, lowStockThreshold: 3 },

  // Spare Parts
  { id: 'p32', name: 'Sediment Filter', brand: 'Generic', model: 'Sediment Filter', category: 'Spare Parts', stock: 4, purchasePrice: 150, sellingPrice: 350, lowStockThreshold: 3 },
  { id: 'p33', name: 'Pre Carbon', brand: 'Generic', model: 'Pre Carbon', category: 'Spare Parts', stock: 5, purchasePrice: 200, sellingPrice: 450, lowStockThreshold: 3 },
  { id: 'p34', name: 'Cover', brand: 'Generic', model: 'Cover', category: 'Spare Parts', stock: 3, purchasePrice: 300, sellingPrice: 600, lowStockThreshold: 3 },
  { id: 'p35', name: 'Membrane', brand: 'Generic', model: 'Membrane', category: 'Spare Parts', stock: 12, purchasePrice: 600, sellingPrice: 1200, lowStockThreshold: 3 },
  { id: 'p36', name: 'Sensor', brand: 'Generic', model: 'Sensor', category: 'Spare Parts', stock: 8, purchasePrice: 100, sellingPrice: 250, lowStockThreshold: 3 },
  { id: 'p37', name: 'Tap', brand: 'Generic', model: 'Tap', category: 'Spare Parts', stock: 10, purchasePrice: 80, sellingPrice: 200, lowStockThreshold: 3 },
  { id: 'p38', name: 'Flow Control (Boxes)', brand: 'Generic', model: 'Flow Control', category: 'Spare Parts', stock: 2, purchasePrice: 200, sellingPrice: 450, lowStockThreshold: 3 }
];

export const initialDealers = [
  {
    id: "dealer-1",
    name: "Anil Kumar (Sales Manager)",
    phone: "9887766554",
    commissionRate: 5.0, // 5%
    active: true
  },
  {
    id: "dealer-2",
    name: "Priya Sharma (Senior Executive)",
    phone: "9776655443",
    commissionRate: 6.0, // 6%
    active: true
  },
  {
    id: "dealer-3",
    name: "Rajesh Patel (Field Agent)",
    phone: "9665544332",
    commissionRate: 4.5, // 4.5%
    active: true
  }
];

export const initialSales = [
  // January 2026
  { id: 's1', customerName: 'Harish Gowda', customerPhone: '9888877771', customerAddress: 'Jayanagar, Bangalore', productName: 'V-Guard 100 L Pro', category: 'Solar Water Heater', quantity: 1, sellingPrice: 18500, purchasePrice: 15000, totalAmount: 18500, profitAmount: 3500, date: '2026-01-10', paymentStatus: 'Paid' },
  { id: 's2', customerName: 'Naveen Kumar', customerPhone: '9888877772', customerAddress: 'Indiranagar, Bangalore', productName: 'Auro 9 L Pure Flo', category: 'Water Purifier', quantity: 2, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 13000, profitAmount: 5000, date: '2026-01-15', paymentStatus: 'Paid' },
  { id: 's3', customerName: 'Suresh Bhat', customerPhone: '9888877773', customerAddress: 'Malleshwaram, Bangalore', productName: 'V-Guard Prime 1250 Mini', category: 'UPS Inverter', quantity: 1, sellingPrice: 5000, purchasePrice: 3500, totalAmount: 5000, profitAmount: 1500, date: '2026-01-20', paymentStatus: 'Paid' },
  { id: 's4', customerName: 'Mamata Rao', customerPhone: '9888877774', customerAddress: 'Rajajinagar, Bangalore', productName: 'Okaya Battery', category: 'Batteries', quantity: 1, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 11000, profitAmount: 3000, date: '2026-01-28', paymentStatus: 'Paid' },
  { id: 's5', customerName: 'Devappa M', customerPhone: '9888877775', customerAddress: 'Koramangala, Bangalore', productName: 'V-Guard 900', category: 'UPS Inverter', quantity: 0.5, sellingPrice: 5000, purchasePrice: 3800, totalAmount: 2500, profitAmount: 600, date: '2026-01-30', paymentStatus: 'Paid' },

  // February 2026
  { id: 's6', customerName: 'Vinod Hegde', customerPhone: '9888877776', customerAddress: 'Whitefield, Bangalore', productName: 'V-Guard 150 L Pro', category: 'Solar Water Heater', quantity: 1, sellingPrice: 24500, purchasePrice: 20000, totalAmount: 24500, profitAmount: 4500, date: '2026-02-05', paymentStatus: 'Paid' },
  { id: 's7', customerName: 'Pushpa K', customerPhone: '9888877777', customerAddress: 'Hebbal, Bangalore', productName: 'Sudarson / SNR 100 Ltr', category: 'Solar Water Heater', quantity: 1, sellingPrice: 17500, purchasePrice: 14000, totalAmount: 17500, profitAmount: 3500, date: '2026-02-12', paymentStatus: 'Paid' },
  { id: 's8', customerName: 'Rajesh Nair', customerPhone: '9888877778', customerAddress: 'BTM Layout, Bangalore', productName: 'Okaya Battery', category: 'Batteries', quantity: 2, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 22000, profitAmount: 6000, date: '2026-02-18', paymentStatus: 'Paid' },
  { id: 's9', customerName: 'Chitra M', customerPhone: '9888877779', customerAddress: 'HSR Layout, Bangalore', productName: 'Auro 9 L Pure Flo', category: 'Water Purifier', quantity: 1, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 6500, profitAmount: 2500, date: '2026-02-22', paymentStatus: 'Paid' },
  { id: 's10', customerName: 'Girish A', customerPhone: '9888877780', customerAddress: 'Electronic City, Bangalore', productName: 'V-Guard Prime 1250 Mini', category: 'UPS Inverter', quantity: 1, sellingPrice: 4500, purchasePrice: 3500, totalAmount: 4500, profitAmount: 1000, date: '2026-02-25', paymentStatus: 'Paid' },

  // March 2026
  { id: 's11', customerName: 'Pradeep J', customerPhone: '9888877781', customerAddress: 'Sadashivanagar, Bangalore', productName: 'V-Guard 200 L Pro', category: 'Solar Water Heater', quantity: 2, sellingPrice: 28550, purchasePrice: 24000, totalAmount: 57100, profitAmount: 9100, date: '2026-03-05', paymentStatus: 'Paid' },
  { id: 's12', customerName: 'Sneha Latha', customerPhone: '9888877782', customerAddress: 'Banashankari, Bangalore', productName: 'Auro 10 L Aqua 2090', category: 'Water Purifier', quantity: 2, sellingPrice: 15500, purchasePrice: 12000, totalAmount: 31000, profitAmount: 7000, date: '2026-03-12', paymentStatus: 'Paid' },
  { id: 's13', customerName: 'Manjunath Swamy', customerPhone: '9888877783', customerAddress: 'Basaveshwaranagar, Bangalore', productName: 'Okaya Battery', category: 'Batteries', quantity: 2, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 22000, profitAmount: 6000, date: '2026-03-18', paymentStatus: 'Paid' },
  { id: 's14', customerName: 'Asha Kiran', customerPhone: '9888877784', customerAddress: 'Yelahanka, Bangalore', productName: 'V-Guard Prime 1250 Mini', category: 'UPS Inverter', quantity: 2, sellingPrice: 4950, purchasePrice: 3500, totalAmount: 9900, profitAmount: 2900, date: '2026-03-25', paymentStatus: 'Paid' },

  // April 2026
  { id: 's15', customerName: 'Karthik Rao', customerPhone: '9888877785', customerAddress: 'Kengeri, Bangalore', productName: 'Sudarson / SNR 100 Ltr', category: 'Solar Water Heater', quantity: 3, sellingPrice: 17000, purchasePrice: 14000, totalAmount: 51000, profitAmount: 9000, date: '2026-04-10', paymentStatus: 'Paid' },
  { id: 's16', customerName: 'Meenakshi Sundaram', customerPhone: '9888877786', customerAddress: 'Vijayanagar, Bangalore', productName: 'Auro 10 L Aqua 2090', category: 'Water Purifier', quantity: 3, sellingPrice: 15500, purchasePrice: 12000, totalAmount: 46500, profitAmount: 10500, date: '2026-04-15', paymentStatus: 'Paid' },
  { id: 's17', customerName: 'Shashank S', customerPhone: '9888877787', customerAddress: 'Yeshwanthpur, Bangalore', productName: 'Amaron Battery', category: 'Batteries', quantity: 3, sellingPrice: 9500, purchasePrice: 7000, totalAmount: 28500, profitAmount: 7500, date: '2026-04-20', paymentStatus: 'Paid' },
  { id: 's18', customerName: 'Padma Prasad', customerPhone: '9888877788', customerAddress: 'Peenya, Bangalore', productName: 'V-Guard 900', category: 'UPS Inverter', quantity: 3, sellingPrice: 5400, purchasePrice: 3800, totalAmount: 16200, profitAmount: 4800, date: '2026-04-25', paymentStatus: 'Paid' },

  // May 2026
  { id: 's19', customerName: 'Raghu Ram', customerPhone: '9888877789', customerAddress: 'Kammanahalli, Bangalore', productName: 'Sudarson / SNR 150 Ltr', category: 'Solar Water Heater', quantity: 3, sellingPrice: 22000, purchasePrice: 18500, totalAmount: 66000, profitAmount: 10500, date: '2026-05-08', paymentStatus: 'Paid' },
  { id: 's20', customerName: 'Savitha P', customerPhone: '9888877790', customerAddress: 'Ganga Nagar, Bangalore', productName: 'Auro 10 L Aqua 2090', category: 'Water Purifier', quantity: 4, sellingPrice: 15500, purchasePrice: 12000, totalAmount: 62000, profitAmount: 14000, date: '2026-05-15', paymentStatus: 'Paid' },
  { id: 's21', customerName: 'Lakshman Prasad', customerPhone: '9888877791', customerAddress: 'RT Nagar, Bangalore', productName: 'Exide Invapro Battery', category: 'Batteries', quantity: 2, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 22000, profitAmount: 6000, date: '2026-05-22', paymentStatus: 'Paid' },
  { id: 's22', customerName: 'Vandana S', customerPhone: '9888877792', customerAddress: 'Vidyaranyapura, Bangalore', productName: 'V-Guard Prime 1250 Mini', category: 'UPS Inverter', quantity: 3, sellingPrice: 5000, purchasePrice: 3500, totalAmount: 15000, profitAmount: 4500, date: '2026-05-28', paymentStatus: 'Paid' },

  // June 2026
  { id: 's23', customerName: 'Nagesh M', customerPhone: '9888877793', customerAddress: 'Mathikere, Bangalore', productName: 'Sudarson / SNR 100 Ltr', category: 'Solar Water Heater', quantity: 4, sellingPrice: 16800, purchasePrice: 13500, totalAmount: 67200, profitAmount: 13200, date: '2026-06-05', paymentStatus: 'Paid' },
  { id: 's24', customerName: 'Divya Gowda', customerPhone: '9888877794', customerAddress: 'Chandra Layout, Bangalore', productName: 'Auro 9 L Pure Flo', category: 'Water Purifier', quantity: 10, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 65000, profitAmount: 25000, date: '2026-06-12', paymentStatus: 'Paid' },
  { id: 's25', customerName: 'Ananth Hegde', customerPhone: '9888877795', customerAddress: 'Nagarbhavi, Bangalore', productName: 'Okaya Battery', category: 'Batteries', quantity: 4, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 44000, profitAmount: 12000, date: '2026-06-18', paymentStatus: 'Paid' },
  { id: 's26', customerName: 'Kokila V', customerPhone: '9888877796', customerAddress: 'Ulsoor, Bangalore', productName: 'V-Guard 900', category: 'UPS Inverter', quantity: 3, sellingPrice: 5400, purchasePrice: 3800, totalAmount: 16200, profitAmount: 4800, date: '2026-06-25', paymentStatus: 'Paid' },

  // July 2026
  { id: 's27', customerName: 'Ramesh Kumar', customerPhone: '9876543210', customerAddress: 'JP Nagar, Bangalore', productName: 'V-Guard 100 L Pro', category: 'Solar Water Heater', quantity: 1, sellingPrice: 18500, purchasePrice: 15000, totalAmount: 18500, profitAmount: 3500, date: '2026-07-11', paymentStatus: 'Paid' },
  { id: 's28', customerName: 'Vijay M', customerPhone: '9888877797', customerAddress: 'Wilson Garden, Bangalore', productName: 'Auro 9 L Pure Flo', category: 'Water Purifier', quantity: 2, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 13000, profitAmount: 5000, date: '2026-07-08', paymentStatus: 'Paid' },
  { id: 's29', customerName: 'Sunita Devi', customerPhone: '9888877798', customerAddress: 'Frazer Town, Bangalore', productName: 'V-Guard Prime 1250 Mini', category: 'UPS Inverter', quantity: 1, sellingPrice: 5000, purchasePrice: 3500, totalAmount: 5000, profitAmount: 1500, date: '2026-07-05', paymentStatus: 'Paid' },
  { id: 's30', customerName: 'Anand Rao', customerPhone: '9888877799', customerAddress: 'Shanthi Nagar, Bangalore', productName: 'Okaya Battery', category: 'Batteries', quantity: 1, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 11000, profitAmount: 3000, date: '2026-07-02', paymentStatus: 'Paid' }
];

export const initialTickets = [
  {
    id: "tkt-1",
    customerName: "Ramesh Kumar",
    customerPhone: "9876543210",
    type: "Installation",
    productName: "V-Guard 100 L Pro",
    description: "New solar water heater installation. Needs support frame mounting and pipeline connections.",
    technician: "Dinesh Gowda (Solar Structural Lead)",
    status: "Pending",
    scheduledDate: "2026-07-12",
    createdAt: "2026-07-11"
  }
];

export const initialLogs = [
  {
    id: "log-1",
    action: "System Initialized",
    details: "SK Powertech ERP database seeded with clean demo records.",
    timestamp: "2026-07-11T12:00:00Z"
  }
];
