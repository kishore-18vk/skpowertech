export const initialProducts = [
  // Solar Water Heater (Target Stock: 25)
  { id: 'p1', name: 'V-Guard Tru Hot 100 Ltr', brand: 'V-Guard', model: 'Tru Hot 100 Ltr', category: 'Solar Water Heater', stock: 8, purchasePrice: 15000, sellingPrice: 18500, lowStockThreshold: 3 },
  { id: 'p2', name: 'V-Guard Tru Hot 150 Ltr', brand: 'V-Guard', model: 'Tru Hot 150 Ltr', category: 'Solar Water Heater', stock: 5, purchasePrice: 20000, sellingPrice: 24500, lowStockThreshold: 3 },
  { id: 'p3', name: 'V-Guard Tru Hot 200 Ltr', brand: 'V-Guard', model: 'Tru Hot 200 Ltr', category: 'Solar Water Heater', stock: 0, purchasePrice: 24000, sellingPrice: 28550, lowStockThreshold: 3 },
  { id: 'p8', name: 'Sudharshan Solar 100 Ltr', brand: 'Sudharshan', model: '100 Ltr', category: 'Solar Water Heater', stock: 5, purchasePrice: 14000, sellingPrice: 17500, lowStockThreshold: 3 },
  { id: 'p9', name: 'Sudharshan Solar 150 Ltr', brand: 'Sudharshan', model: '150 Ltr', category: 'Solar Water Heater', stock: 0, purchasePrice: 18500, sellingPrice: 22000, lowStockThreshold: 3 },
  { id: 'p12', name: 'Ozone Solar 100 Ltr', brand: 'Ozone', model: '100 Ltr', category: 'Solar Water Heater', stock: 4, purchasePrice: 13500, sellingPrice: 16800, lowStockThreshold: 3 },
  { id: 'p15', name: 'Supreme Solar 100 Ltr', brand: 'Supreme', model: '100 Ltr', category: 'Solar Water Heater', stock: 3, purchasePrice: 14000, sellingPrice: 17000, lowStockThreshold: 3 },
  { id: 'p18', name: 'V-Guard Backup Heater', brand: 'V-Guard', model: 'Backup Heater', category: 'Solar Water Heater', stock: 0, purchasePrice: 1500, sellingPrice: 2200, lowStockThreshold: 3 },

  // Water Purifier (Target Stock: 40)
  { id: 'p22', name: 'Auro Water Purifier RO', brand: 'Auro', model: 'RO Standard', category: 'Water Purifier', stock: 25, purchasePrice: 4000, sellingPrice: 6500, lowStockThreshold: 5 },
  { id: 'p23', name: 'Kent Grand Plus RO', brand: 'Kent', model: 'Grand Plus', category: 'Water Purifier', stock: 15, purchasePrice: 12000, sellingPrice: 15500, lowStockThreshold: 3 },

  // UPS Inverter (Target Stock: 15)
  { id: 'p20', name: 'Luminous Eco Volt UPS', brand: 'Luminous', model: 'Eco Volt 850', category: 'UPS Inverter', stock: 10, purchasePrice: 3500, sellingPrice: 5000, lowStockThreshold: 3 },
  { id: 'p24', name: 'Microtek Super Power UPS', brand: 'Microtek', model: 'Super Power 900', category: 'UPS Inverter', stock: 5, purchasePrice: 3800, sellingPrice: 5400, lowStockThreshold: 2 },

  // Batteries (Target Stock: 30)
  { id: 'p21', name: 'Exide Invapro Battery', brand: 'Exide', model: 'Invapro 150Ah', category: 'Batteries', stock: 20, purchasePrice: 8000, sellingPrice: 11000, lowStockThreshold: 4 },
  { id: 'p25', name: 'Amaron Current Battery', brand: 'Amaron', model: 'Current 120Ah', category: 'Batteries', stock: 10, purchasePrice: 7000, sellingPrice: 9500, lowStockThreshold: 3 }
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
  // January 2026 (Target: ₹50,000)
  { id: 's1', customerName: 'Harish Gowda', customerPhone: '9888877771', customerAddress: 'Jayanagar, Bangalore', productName: 'V-Guard Tru Hot 100 Ltr', category: 'Solar Water Heater', quantity: 1, sellingPrice: 18500, purchasePrice: 15000, totalAmount: 18500, profitAmount: 3500, date: '2026-01-10', paymentStatus: 'Paid' },
  { id: 's2', customerName: 'Naveen Kumar', customerPhone: '9888877772', customerAddress: 'Indiranagar, Bangalore', productName: 'Auro Water Purifier RO', category: 'Water Purifier', quantity: 2, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 13000, profitAmount: 5000, date: '2026-01-15', paymentStatus: 'Paid' },
  { id: 's3', customerName: 'Suresh Bhat', customerPhone: '9888877773', customerAddress: 'Malleshwaram, Bangalore', productName: 'Luminous Eco Volt UPS', category: 'UPS Inverter', quantity: 1, sellingPrice: 5000, purchasePrice: 3500, totalAmount: 5000, profitAmount: 1500, date: '2026-01-20', paymentStatus: 'Paid' },
  { id: 's4', customerName: 'Mamata Rao', customerPhone: '9888877774', customerAddress: 'Rajajinagar, Bangalore', productName: 'Exide Invapro Battery', category: 'Batteries', quantity: 1, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 11000, profitAmount: 3000, date: '2026-01-28', paymentStatus: 'Paid' },
  { id: 's5', customerName: 'Devappa M', customerPhone: '9888877775', customerAddress: 'Koramangala, Bangalore', productName: 'Microtek Super Power UPS', category: 'UPS Inverter', quantity: 0.5, sellingPrice: 5000, purchasePrice: 3800, totalAmount: 2500, profitAmount: 600, date: '2026-01-30', paymentStatus: 'Paid' }, // adjustments to fit ₹50k

  // February 2026 (Target: ₹75,000)
  { id: 's6', customerName: 'Vinod Hegde', customerPhone: '9888877776', customerAddress: 'Whitefield, Bangalore', productName: 'V-Guard Tru Hot 150 Ltr', category: 'Solar Water Heater', quantity: 1, sellingPrice: 24500, purchasePrice: 20000, totalAmount: 24500, profitAmount: 4500, date: '2026-02-05', paymentStatus: 'Paid' },
  { id: 's7', customerName: 'Pushpa K', customerPhone: '9888877777', customerAddress: 'Hebbal, Bangalore', productName: 'Sudharshan Solar 100 Ltr', category: 'Solar Water Heater', quantity: 1, sellingPrice: 17500, purchasePrice: 14000, totalAmount: 17500, profitAmount: 3500, date: '2026-02-12', paymentStatus: 'Paid' },
  { id: 's8', customerName: 'Rajesh Nair', customerPhone: '9888877778', customerAddress: 'BTM Layout, Bangalore', productName: 'Exide Invapro Battery', category: 'Batteries', quantity: 2, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 22000, profitAmount: 6000, date: '2026-02-18', paymentStatus: 'Paid' },
  { id: 's9', customerName: 'Chitra M', customerPhone: '9888877779', customerAddress: 'HSR Layout, Bangalore', productName: 'Auro Water Purifier RO', category: 'Water Purifier', quantity: 1, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 6500, profitAmount: 2500, date: '2026-02-22', paymentStatus: 'Paid' },
  { id: 's10', customerName: 'Girish A', customerPhone: '9888877780', customerAddress: 'Electronic City, Bangalore', productName: 'Luminous Eco Volt UPS', category: 'UPS Inverter', quantity: 1, sellingPrice: 4500, purchasePrice: 3500, totalAmount: 4500, profitAmount: 1000, date: '2026-02-25', paymentStatus: 'Paid' },

  // March 2026 (Target: ₹1,20,000)
  { id: 's11', customerName: 'Pradeep J', customerPhone: '9888877781', customerAddress: 'Sadashivanagar, Bangalore', productName: 'V-Guard Tru Hot 200 Ltr', category: 'Solar Water Heater', quantity: 2, sellingPrice: 28550, purchasePrice: 24000, totalAmount: 57100, profitAmount: 9100, date: '2026-03-05', paymentStatus: 'Paid' },
  { id: 's12', customerName: 'Sneha Latha', customerPhone: '9888877782', customerAddress: 'Banashankari, Bangalore', productName: 'Kent Grand Plus RO', category: 'Water Purifier', quantity: 2, sellingPrice: 15500, purchasePrice: 12000, totalAmount: 31000, profitAmount: 7000, date: '2026-03-12', paymentStatus: 'Paid' },
  { id: 's13', customerName: 'Manjunath Swamy', customerPhone: '9888877783', customerAddress: 'Basaveshwaranagar, Bangalore', productName: 'Exide Invapro Battery', category: 'Batteries', quantity: 2, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 22000, profitAmount: 6000, date: '2026-03-18', paymentStatus: 'Paid' },
  { id: 's14', customerName: 'Asha Kiran', customerPhone: '9888877784', customerAddress: 'Yelahanka, Bangalore', productName: 'Luminous Eco Volt UPS', category: 'UPS Inverter', quantity: 2, sellingPrice: 4950, purchasePrice: 3500, totalAmount: 9900, profitAmount: 2900, date: '2026-03-25', paymentStatus: 'Paid' },

  // April 2026
  { id: 's15', customerName: 'Karthik Rao', customerPhone: '9888877785', customerAddress: 'Kengeri, Bangalore', productName: 'Supreme Solar 100 Ltr', category: 'Solar Water Heater', quantity: 3, sellingPrice: 17000, purchasePrice: 14000, totalAmount: 51000, profitAmount: 9000, date: '2026-04-10', paymentStatus: 'Paid' },
  { id: 's16', customerName: 'Meenakshi Sundaram', customerPhone: '9888877786', customerAddress: 'Vijayanagar, Bangalore', productName: 'Kent Grand Plus RO', category: 'Water Purifier', quantity: 3, sellingPrice: 15500, purchasePrice: 12000, totalAmount: 46500, profitAmount: 10500, date: '2026-04-15', paymentStatus: 'Paid' },
  { id: 's17', customerName: 'Shashank S', customerPhone: '9888877787', customerAddress: 'Yeshwanthpur, Bangalore', productName: 'Amaron Current Battery', category: 'Batteries', quantity: 3, sellingPrice: 9500, purchasePrice: 7000, totalAmount: 28500, profitAmount: 7500, date: '2026-04-20', paymentStatus: 'Paid' },
  { id: 's18', customerName: 'Padma Prasad', customerPhone: '9888877788', customerAddress: 'Peenya, Bangalore', productName: 'Microtek Super Power UPS', category: 'UPS Inverter', quantity: 3, sellingPrice: 5400, purchasePrice: 3800, totalAmount: 16200, profitAmount: 4800, date: '2026-04-25', paymentStatus: 'Paid' },

  // May 2026
  { id: 's19', customerName: 'Raghu Ram', customerPhone: '9888877789', customerAddress: 'Kammanahalli, Bangalore', productName: 'Sudharshan Solar 150 Ltr', category: 'Solar Water Heater', quantity: 3, sellingPrice: 22000, purchasePrice: 18500, totalAmount: 66000, profitAmount: 10500, date: '2026-05-08', paymentStatus: 'Paid' },
  { id: 's20', customerName: 'Savitha P', customerPhone: '9888877790', customerAddress: 'Ganga Nagar, Bangalore', productName: 'Kent Grand Plus RO', category: 'Water Purifier', quantity: 4, sellingPrice: 15500, purchasePrice: 12000, totalAmount: 62000, profitAmount: 14000, date: '2026-05-15', paymentStatus: 'Paid' },
  { id: 's21', customerName: 'Lakshman Prasad', customerPhone: '9888877791', customerAddress: 'RT Nagar, Bangalore', productName: 'Exide Invapro Battery', category: 'Batteries', quantity: 2, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 22000, profitAmount: 6000, date: '2026-05-22', paymentStatus: 'Paid' },
  { id: 's22', customerName: 'Vandana S', customerPhone: '9888877792', customerAddress: 'Vidyaranyapura, Bangalore', productName: 'Luminous Eco Volt UPS', category: 'UPS Inverter', quantity: 3, sellingPrice: 5000, purchasePrice: 3500, totalAmount: 15000, profitAmount: 4500, date: '2026-05-28', paymentStatus: 'Paid' },

  // June 2026
  { id: 's23', customerName: 'Nagesh M', customerPhone: '9888877793', customerAddress: 'Mathikere, Bangalore', productName: 'Ozone Solar 100 Ltr', category: 'Solar Water Heater', quantity: 4, sellingPrice: 16800, purchasePrice: 13500, totalAmount: 67200, profitAmount: 13200, date: '2026-06-05', paymentStatus: 'Paid' },
  { id: 's24', customerName: 'Divya Gowda', customerPhone: '9888877794', customerAddress: 'Chandra Layout, Bangalore', productName: 'Auro Water Purifier RO', category: 'Water Purifier', quantity: 10, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 65000, profitAmount: 25000, date: '2026-06-12', paymentStatus: 'Paid' },
  { id: 's25', customerName: 'Ananth Hegde', customerPhone: '9888877795', customerAddress: 'Nagarbhavi, Bangalore', productName: 'Exide Invapro Battery', category: 'Batteries', quantity: 4, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 44000, profitAmount: 12000, date: '2026-06-18', paymentStatus: 'Paid' },
  { id: 's26', customerName: 'Kokila V', customerPhone: '9888877796', customerAddress: 'Ulsoor, Bangalore', productName: 'Microtek Super Power UPS', category: 'UPS Inverter', quantity: 3, sellingPrice: 5400, purchasePrice: 3800, totalAmount: 16200, profitAmount: 4800, date: '2026-06-25', paymentStatus: 'Paid' },

  // July 2026 (Operational period, system target date is 2026-07-11)
  { id: 's27', customerName: 'Ramesh Kumar', customerPhone: '9876543210', customerAddress: 'JP Nagar, Bangalore', productName: 'V-Guard Tru Hot 100 Ltr', category: 'Solar Water Heater', quantity: 1, sellingPrice: 18500, purchasePrice: 15000, totalAmount: 18500, profitAmount: 3500, date: '2026-07-11', paymentStatus: 'Paid' }, // SOLD TODAY
  { id: 's28', customerName: 'Vijay M', customerPhone: '9888877797', customerAddress: 'Wilson Garden, Bangalore', productName: 'Auro Water Purifier RO', category: 'Water Purifier', quantity: 2, sellingPrice: 6500, purchasePrice: 4000, totalAmount: 13000, profitAmount: 5000, date: '2026-07-08', paymentStatus: 'Paid' },
  { id: 's29', customerName: 'Sunita Devi', customerPhone: '9888877798', customerAddress: 'Frazer Town, Bangalore', productName: 'Luminous Eco Volt UPS', category: 'UPS Inverter', quantity: 1, sellingPrice: 5000, purchasePrice: 3500, totalAmount: 5000, profitAmount: 1500, date: '2026-07-05', paymentStatus: 'Paid' },
  { id: 's30', customerName: 'Anand Rao', customerPhone: '9888877799', customerAddress: 'Shanthi Nagar, Bangalore', productName: 'Exide Invapro Battery', category: 'Batteries', quantity: 1, sellingPrice: 11000, purchasePrice: 8000, totalAmount: 11000, profitAmount: 3000, date: '2026-07-02', paymentStatus: 'Paid' }
];

export const initialTickets = [
  {
    id: "tkt-1",
    customerName: "Ramesh Kumar",
    customerPhone: "9876543210",
    type: "Installation",
    productName: "V-Guard Tru Hot 100 Ltr",
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
