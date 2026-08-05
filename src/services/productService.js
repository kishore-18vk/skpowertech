import { supabase } from '../supabase';
import { initialProducts } from '../utils/dummyData';

export const productService = {
  // 1. Retrieve all products from the catalog
  async getAllProducts() {
    let dbProducts = [];
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        dbProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          model: p.model,
          category: p.category,
          stock: parseInt(p.stock) || 0,
          purchasePrice: parseFloat(p.purchase_price) || 0,
          sellingPrice: parseFloat(p.selling_price) || 0,
          lowStockThreshold: parseInt(p.low_stock_threshold) || 3,
          image: p.image || ''
        }));
      }
    } catch (e) {
      console.warn("Supabase products fetch failed, using local fallback:", e);
    }

    const saved = localStorage.getItem('sk_products');
    let localProducts = saved ? JSON.parse(saved) : [];

    if (dbProducts.length > 0) {
      localStorage.setItem('sk_products', JSON.stringify(dbProducts));
      return dbProducts;
    }

    if (localProducts.length > 0) {
      return localProducts;
    }

    localStorage.setItem('sk_products', JSON.stringify(initialProducts));
    return initialProducts;
  },

  // 2. Add a new product to the catalog
  async createProduct(productData) {
    let createdProduct = null;
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          brand: productData.brand,
          model: productData.model,
          category: productData.category,
          stock: parseInt(productData.stock) || 0,
          purchase_price: parseFloat(productData.purchasePrice) || 0,
          selling_price: parseFloat(productData.sellingPrice) || 0,
          low_stock_threshold: parseInt(productData.lowStockThreshold) || 3,
          image: productData.image || ''
        }])
        .select();

      if (!error && data && data[0]) {
        const p = data[0];
        createdProduct = {
          id: p.id,
          name: p.name,
          brand: p.brand,
          model: p.model,
          category: p.category,
          stock: parseInt(p.stock) || 0,
          purchasePrice: parseFloat(p.purchase_price) || 0,
          sellingPrice: parseFloat(p.selling_price) || 0,
          lowStockThreshold: parseInt(p.low_stock_threshold) || 3,
          image: p.image || ''
        };
      } else if (error) {
        console.warn("Supabase createProduct returned error, using local fallback:", error);
      }
    } catch (e) {
      console.warn("Supabase createProduct failed, saving locally:", e);
    }

    if (!createdProduct) {
      createdProduct = {
        id: 'p_' + Date.now(),
        ...productData,
        stock: parseInt(productData.stock) || 0,
        purchasePrice: parseFloat(productData.purchasePrice) || 0,
        sellingPrice: parseFloat(productData.sellingPrice) || 0,
        lowStockThreshold: parseInt(productData.lowStockThreshold) || 3,
      };
    }

    // Always save/update in localStorage so local state is consistent
    const saved = localStorage.getItem('sk_products');
    let productsList = saved ? JSON.parse(saved) : [...initialProducts];
    if (!productsList.some(p => p.id === createdProduct.id)) {
      productsList.push(createdProduct);
      localStorage.setItem('sk_products', JSON.stringify(productsList));
    }

    return createdProduct;
  },

  // 3. Update an existing product
  async updateProduct(id, updatedData) {
    try {
      const payload = {};
      if (updatedData.name !== undefined) payload.name = updatedData.name;
      if (updatedData.brand !== undefined) payload.brand = updatedData.brand;
      if (updatedData.model !== undefined) payload.model = updatedData.model;
      if (updatedData.category !== undefined) payload.category = updatedData.category;
      if (updatedData.stock !== undefined) payload.stock = parseInt(updatedData.stock) || 0;
      if (updatedData.purchasePrice !== undefined) payload.purchase_price = parseFloat(updatedData.purchasePrice) || 0;
      if (updatedData.sellingPrice !== undefined) payload.selling_price = parseFloat(updatedData.sellingPrice) || 0;
      if (updatedData.lowStockThreshold !== undefined) payload.low_stock_threshold = parseInt(updatedData.lowStockThreshold) || 3;
      if (updatedData.image !== undefined) payload.image = updatedData.image || '';

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select();

      if (!error && data && data[0]) {
        // Sync local storage as well
        const saved = localStorage.getItem('sk_products');
        let productsList = saved ? JSON.parse(saved) : [];
        const index = productsList.findIndex(p => p.id === id);
        if (index !== -1) {
          productsList[index] = { ...productsList[index], ...updatedData };
          localStorage.setItem('sk_products', JSON.stringify(productsList));
        }
        return data[0];
      }
    } catch (e) {
      console.warn("Supabase updateProduct failed, saving locally:", e);
    }

    const saved = localStorage.getItem('sk_products');
    let productsList = saved ? JSON.parse(saved) : [...initialProducts];
    const index = productsList.findIndex(p => p.id === id);
    if (index !== -1) {
      productsList[index] = { ...productsList[index], ...updatedData };
      localStorage.setItem('sk_products', JSON.stringify(productsList));
      return productsList[index];
    }
    return null;
  },

  // 4. Delete a product
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
    } catch (e) {
      console.warn("Supabase deleteProduct failed, deleting locally:", e);
    }

    const saved = localStorage.getItem('sk_products');
    let productsList = saved ? JSON.parse(saved) : [...initialProducts];
    const filteredList = productsList.filter(p => p.id !== id);
    localStorage.setItem('sk_products', JSON.stringify(filteredList));
    return true;
  }
};


