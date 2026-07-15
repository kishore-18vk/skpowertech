import { supabase } from '../supabase';
import { initialSales, initialProducts } from '../utils/dummyData';

export const salesService = {
  // 1. Fetch sales history records mapped to the frontend data shape
  async getAllSales() {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            product_id,
            quantity,
            unit_price,
            purchase_price,
            profit
          )
        `)
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(s => {
          // Pull items from line array or fallback gracefully
          const baseItem = s.sale_items && s.sale_items[0] ? s.sale_items[0] : {};
          
          return {
            id: s.id,
            customerName: s.customer_name,
            customerPhone: s.customer_phone,
            customerEmail: s.customer_email,
            customerAddress: s.customer_address,
            customerGstin: s.customer_gstin,
            paymentMethod: s.payment_method,
            paymentStatus: s.payment_status,
            amountPaid: parseFloat(s.amount_paid) || 0,
            dueAmount: parseFloat(s.due_amount) || 0,
            totalAmount: parseFloat(s.total_amount) || 0,
            installationDate: s.installation_date,
            date: s.date ? s.date.substring(0, 10) : new Date().toISOString().substring(0, 10), // ensures consistency with original "YYYY-MM-DD" local format matching reports filter
            productId: baseItem.product_id || '',
            quantity: parseInt(baseItem.quantity) || 0,
            sellingPrice: parseFloat(baseItem.unit_price) || 0,
            purchasePrice: parseFloat(baseItem.purchase_price) || 0,
            profitAmount: parseFloat(baseItem.profit) || 0
          };
        });
      }
    } catch (e) {
      console.warn("Supabase sales fetch failed, using local fallback:", e);
    }

    const saved = localStorage.getItem('sk_sales');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialSales;
  },

  // 2. Perform checkout transactions
  async createSale(saleData, currentProduct) {
    const qty = parseInt(saleData.quantity);
    const totalAmount = parseFloat(saleData.totalAmount);
    const amountPaid = parseFloat(saleData.amountPaid);
    const dueAmount = parseFloat(saleData.dueAmount);
    
    const unitPrice = totalAmount / qty;
    const purchasePrice = currentProduct.purchasePrice;
    const profitAmount = totalAmount - (purchasePrice * qty);

    try {
      // Step A: Insert master transaction invoice entry row record
      const { data: saleRow, error: saleError } = await supabase
        .from('sales')
        .insert([{
          customer_name: saleData.customerName,
          customer_phone: saleData.customerPhone,
          customer_email: saleData.customerEmail,
          customer_address: saleData.customerAddress,
          customer_gstin: saleData.customerGstin,
          payment_method: saleData.paymentMethod,
          payment_status: saleData.paymentStatus,
          amount_paid: amountPaid,
          due_amount: dueAmount,
          total_amount: totalAmount,
          installation_date: saleData.installationDate || saleData.date,
          date: new Date(saleData.date).toISOString()
        }])
        .select();

      if (!saleError && saleRow && saleRow[0]) {
        const newSaleId = saleRow[0].id;

        // Step B: Write explicit item item-line entry matching structural design
        const { error: itemError } = await supabase
          .from('sale_items')
          .insert([{
            sale_id: newSaleId,
            product_id: saleData.productId,
            quantity: qty,
            unit_price: unitPrice,
            purchase_price: purchasePrice,
            profit: profitAmount
          }]);

        if (!itemError) {
          // Step C: Reduce target inventory metrics matching structural checkout decrement flows
          const updatedStock = currentProduct.stock - qty;
          const { error: stockError } = await supabase
            .from('products')
            .update({ stock: updatedStock })
            .eq('id', saleData.productId);

          if (!stockError) {
            return { success: true };
          }
        }
      }
    } catch (e) {
      console.warn("Supabase createSale failed, saving locally:", e);
    }

    // Local Fallback save
    const savedSales = localStorage.getItem('sk_sales');
    let salesList = savedSales ? JSON.parse(savedSales) : [...initialSales];
    const newSale = {
      id: 's_' + Date.now(),
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      customerEmail: saleData.customerEmail,
      customerAddress: saleData.customerAddress,
      customerGstin: saleData.customerGstin,
      paymentMethod: saleData.paymentMethod,
      paymentStatus: saleData.paymentStatus,
      amountPaid,
      dueAmount,
      totalAmount,
      installationDate: saleData.installationDate || saleData.date,
      date: saleData.date,
      productId: saleData.productId,
      quantity: qty,
      sellingPrice: unitPrice,
      purchasePrice,
      profitAmount
    };
    salesList.unshift(newSale);
    localStorage.setItem('sk_sales', JSON.stringify(salesList));

    // Also decrement local product stock
    const savedProducts = localStorage.getItem('sk_products');
    let productsList = savedProducts ? JSON.parse(savedProducts) : [...initialProducts];
    const pIndex = productsList.findIndex(p => p.id === saleData.productId);
    if (pIndex !== -1) {
      productsList[pIndex].stock = Math.max(0, productsList[pIndex].stock - qty);
      localStorage.setItem('sk_products', JSON.stringify(productsList));
    }

    return { success: true };
  },

  // 3. Quick patch utility updates for unpaid invoices or dynamic balance adjustments
  async updatePaymentStatus(id, newStatus) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({ payment_status: newStatus })
        .eq('id', id)
        .select();

      if (!error && data && data[0]) return data[0];
    } catch (e) {
      console.warn("Supabase updatePaymentStatus failed, updating locally:", e);
    }

    const savedSales = localStorage.getItem('sk_sales');
    let salesList = savedSales ? JSON.parse(savedSales) : [...initialSales];
    const index = salesList.findIndex(s => s.id === id);
    if (index !== -1) {
      salesList[index].paymentStatus = newStatus;
      if (newStatus === 'Paid') {
        salesList[index].amountPaid = salesList[index].totalAmount;
        salesList[index].dueAmount = 0;
      }
      localStorage.setItem('sk_sales', JSON.stringify(salesList));
      return salesList[index];
    }
    return null;
  }
};
